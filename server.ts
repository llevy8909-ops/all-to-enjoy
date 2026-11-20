import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

app.use((err: any, _req: Request, res: Response, next: express.NextFunction) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request payload.' });
  }
  return next(err);
});

// Initialize Gemini SDK with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// In-memory LRU cache for AI-generated symptom monographs (avoids duplicate Gemini calls)
const symptomLookupCache = new Map<string, any>();
const MAX_SYMPTOM_CACHE = 500;

function setSymptomCache(key: string, value: any) {
  if (symptomLookupCache.size >= MAX_SYMPTOM_CACHE) {
    const oldestKey = symptomLookupCache.keys().next().value;
    if (oldestKey) symptomLookupCache.delete(oldestKey);
  }
  symptomLookupCache.set(key, value);
}

const VALID_TRIAGE_LEVELS = new Set(['COMMON', 'MODERATE', 'URGENT', 'EMERGENCY']);
const VALID_CATEGORIES = new Set([
  'head_neurological',
  'respiratory',
  'digestive',
  'cardiovascular',
  'musculoskeletal',
  'skin_dermatology',
  'eyes_ears_throat',
  'mental_sleep',
  'emergency_firstaid',
  'pediatric_allergy',
  'endocrine_metabolic',
  'urology_renal',
  'infectious_disease',
  'dental_oral',
  'womens_mens_health',
]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`DEADLINE_EXCEEDED: ${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function isTransientGeminiError(err: any): boolean {
  const msg = String(err?.message || err || '');
  return (
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('DEADLINE_EXCEEDED') ||
    msg.includes('timed out') ||
    msg.includes('fetch failed')
  );
}

async function callGeminiWithFailover(
  promptOrContents: any,
  systemInstruction: string,
  responseSchema: any
) {
  if (!ai) {
    throw new Error('Gemini API key is not configured.');
  }

  const attempts: Array<{ model: string; timeoutMs: number }> = [
    { model: 'gemini-4-hydrogen', timeoutMs: 8500 },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 5500 },
  ];
  let lastError: any = null;

  for (let i = 0; i < attempts.length; i++) {
    const { model: modelName, timeoutMs } = attempts[i];
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: modelName,
          contents: promptOrContents,
          config: {
            systemInstruction,
            thinkingConfig: {
              thinkingLevel:
                modelName === 'gemini-4-hydrogen'
                  ? ThinkingLevel.LOW
                  : ThinkingLevel.MINIMAL,
            },
            responseMimeType: 'application/json',
            responseSchema,
          },
        }),
        timeoutMs,
        modelName
      );

      const rawText = (response.text ?? '{}').trim();
      return JSON.parse(rawText);
    } catch (err: any) {
      lastError = err;
      if (!isTransientGeminiError(err)) {
        throw err;
      }
      if (i < attempts.length - 1) {
        await sleep(250 + i * 200);
      }
    }
  }

  throw lastError || new Error('Gemini request failed after failover.');
}

const assessmentSchema = {
  type: Type.OBJECT,
  properties: {
    triageLevel: {
      type: Type.STRING,
      description: 'Exactly one of: COMMON, MODERATE, URGENT, EMERGENCY',
    },
    summary: { type: Type.STRING },
    confidenceNote: { type: Type.STRING },
    patientSafetyAlerts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    possibleCauses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          probability: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['condition', 'probability', 'description'],
      },
    },
    howToHandleIt: {
      type: Type.OBJECT,
      properties: {
        immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        hourlyCare: { type: Type.ARRAY, items: { type: Type.STRING } },
        dailyTimeline: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['immediateSteps', 'hourlyCare', 'dailyTimeline'],
    },
    naturalRemedies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          mechanism: { type: Type.STRING },
          preparation: { type: Type.STRING },
          dosage: { type: Type.STRING },
          precautions: { type: Type.STRING },
        },
        required: ['name', 'type', 'mechanism', 'preparation', 'dosage', 'precautions'],
      },
    },
    pharmaceuticalMedicines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          activeIngredient: { type: Type.STRING },
          brandNames: { type: Type.STRING },
          drugClass: { type: Type.STRING },
          typicalDose: { type: Type.STRING },
          mechanism: { type: Type.STRING },
          warnings: { type: Type.STRING },
          prescriptionRequired: { type: Type.BOOLEAN },
        },
        required: [
          'activeIngredient',
          'brandNames',
          'drugClass',
          'typicalDose',
          'mechanism',
          'warnings',
          'prescriptionRequired',
        ],
      },
    },
    drugHerbInteractions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    emergencyRedFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    recommendedFacility: { type: Type.STRING },
  },
  required: [
    'triageLevel',
    'summary',
    'patientSafetyAlerts',
    'possibleCauses',
    'howToHandleIt',
    'naturalRemedies',
    'pharmaceuticalMedicines',
    'drugHerbInteractions',
    'emergencyRedFlags',
    'recommendedFacility',
  ],
};

function normalizeAssessmentPayload(raw: any, primarySymptom: string) {
  const triage = VALID_TRIAGE_LEVELS.has(raw?.triageLevel) ? raw.triageLevel : 'MODERATE';
  const defaultFacility =
    triage === 'EMERGENCY'
      ? '24/7 Emergency Hospital'
      : triage === 'URGENT'
      ? 'Urgent Care Center'
      : triage === 'MODERATE'
      ? 'Walk-in Medical Clinic'
      : 'Pharmacy';

  return {
    triageLevel: triage,
    summary:
      typeof raw?.summary === 'string' && raw.summary.trim()
        ? raw.summary.trim()
        : `Clinical triage guidance for ${primarySymptom}.`,
    confidenceNote:
      typeof raw?.confidenceNote === 'string' && raw.confidenceNote.trim()
        ? raw.confidenceNote.trim()
        : undefined,
    patientSafetyAlerts: Array.isArray(raw?.patientSafetyAlerts)
      ? raw.patientSafetyAlerts.map(String).filter(Boolean)
      : [],
    possibleCauses: Array.isArray(raw?.possibleCauses)
      ? raw.possibleCauses.map((c: any) => ({
          condition: String(c?.condition || 'Primary clinical evaluation needed'),
          probability: String(c?.probability || 'Moderate'),
          description: String(c?.description || ''),
        }))
      : [],
    howToHandleIt: {
      immediateSteps: Array.isArray(raw?.howToHandleIt?.immediateSteps)
        ? raw.howToHandleIt.immediateSteps.map(String)
        : ['Rest calmly and monitor vital signs or progression.'],
      hourlyCare: Array.isArray(raw?.howToHandleIt?.hourlyCare)
        ? raw.howToHandleIt.hourlyCare.map(String)
        : ['Stay hydrated and avoid aggravating triggers.'],
      dailyTimeline: Array.isArray(raw?.howToHandleIt?.dailyTimeline)
        ? raw.howToHandleIt.dailyTimeline.map(String)
        : ['Reassess within 24–48 hours and see a doctor if persistent or worsening.'],
    },
    naturalRemedies: Array.isArray(raw?.naturalRemedies)
      ? raw.naturalRemedies.map((r: any) => ({
          name: String(r?.name || 'Supportive Hydration & Rest'),
          type: String(r?.type || 'Botanical / Supportive Care'),
          mechanism: String(r?.mechanism || ''),
          preparation: String(r?.preparation || ''),
          dosage: String(r?.dosage || 'Follow standard label guidance'),
          precautions: String(r?.precautions || 'Verify allergies before use.'),
        }))
      : [],
    pharmaceuticalMedicines: Array.isArray(raw?.pharmaceuticalMedicines)
      ? raw.pharmaceuticalMedicines.map((m: any) => ({
          activeIngredient: String(m?.activeIngredient || 'Consult Pharmacist'),
          brandNames: String(m?.brandNames || 'Generic equivalents'),
          drugClass: String(m?.drugClass || 'Symptomatic Therapy'),
          typicalDose: String(m?.typicalDose || 'Verify weight/age dosing on label'),
          mechanism: String(m?.mechanism || ''),
          warnings: String(m?.warnings || 'Check allergies and liver/kidney status.'),
          prescriptionRequired: Boolean(m?.prescriptionRequired),
        }))
      : [],
    drugHerbInteractions: Array.isArray(raw?.drugHerbInteractions)
      ? raw.drugHerbInteractions.map(String)
      : ['Review all active supplements and prescriptions with a licensed pharmacist.'],
    emergencyRedFlags: Array.isArray(raw?.emergencyRedFlags)
      ? raw.emergencyRedFlags.map(String)
      : ['Difficulty breathing, chest pain, confusion, fainting, or rapidly worsening pain.'],
    recommendedFacility:
      typeof raw?.recommendedFacility === 'string' && raw.recommendedFacility.trim()
        ? raw.recommendedFacility.trim()
        : defaultFacility,
  };
}

// Fast LRU cache for multi-turn symptom assessments
const assessmentCache = new Map<string, any>();
function setAssessmentCache(key: string, value: any) {
  if (assessmentCache.size >= 200) {
    const oldestKey = assessmentCache.keys().next().value;
    if (oldestKey) assessmentCache.delete(oldestKey);
  }
  assessmentCache.set(key, value);
}

// AI Symptom Assessment Route (Supports 2-Stage Multi-Turn Clarifying Interview + Allergy/Drug Safety Audit)
app.post('/api/assess-symptoms', async (req: Request, res: Response) => {
  try {
    const {
      stage = 'assess',
      primarySymptom,
      additionalSymptoms = [],
      duration = '',
      severity = 5,
      ageGroup = 'Adult (18-64 years)',
      gender = 'Not specified',
      allergies = '',
      currentMedications = '',
      clarifyingAnswers = [],
    } = req.body;

    if (!primarySymptom || !String(primarySymptom).trim()) {
      return res.status(400).json({ error: 'Primary symptom is required' });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Gemini API key not configured; using offline clinical rules engine.',
      });
    }

    const additionalStr = Array.isArray(additionalSymptoms)
      ? additionalSymptoms.join(', ')
      : String(additionalSymptoms || '');

    // Stage 1: Smart Multi-Turn Clinical Clarifying Interview
    if (stage === 'clarify') {
      const clarifyPrompt = `Patient Intake Profile:
- Primary Symptom: ${String(primarySymptom).trim()}
- Additional Symptoms: ${additionalStr || 'None reported'}
- Duration: ${duration || 'Unspecified'}
- Severity (1-10): ${Number(severity) || 5}
- Age Group: ${ageGroup}
- Biological Sex / Pregnancy Status: ${gender}
- Known Drug Allergies: ${allergies || 'None reported'}
- Current Medications: ${currentMedications || 'None reported'}

Task:
Evaluate if 2 to 3 targeted follow-up clinical questions would significantly sharpen the triage accuracy and treatment safety before giving a final protocol.
- CRITICAL SAFETY RULE: If the input clearly describes an immediate life-threatening emergency (e.g., crushing chest pain + sweating/arm radiation, FAST stroke symptoms, throat swelling anaphylaxis, active overdose, coughing blood, testicular torsion), set "needsClarification" to false and provide the immediate EMERGENCY guidance in "preliminaryImpression" so the client immediately proceeds to Emergency assessment without delay.
- Otherwise set "needsClarification" to true, provide a concise 1-sentence "preliminaryImpression" of what you are ruling in/out, and provide 2 or 3 focused clinical clarifying questions (each with 3-4 quick-tap answer options + 1-sentence "whyItMatters"). Never ask things the user already specified.`;

      const clarifySchema = {
        type: Type.OBJECT,
        properties: {
          needsClarification: { type: Type.BOOLEAN },
          preliminaryImpression: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                whyItMatters: { type: Type.STRING },
              },
              required: ['id', 'question', 'options', 'whyItMatters'],
            },
          },
        },
        required: ['needsClarification', 'preliminaryImpression', 'questions'],
      };

      const clarifyRaw = await callGeminiWithFailover(
        clarifyPrompt,
        'You are a fast, sharp ER & primary care triage clinician conducting a brief pre-diagnosis intake interview. Output concise, clinically high-yield questions.',
        clarifySchema
      );

      if (clarifyRaw && clarifyRaw.needsClarification === false) {
        // Proceed immediately to full assessment when urgent/unambiguous
        const directPrompt = `IMMEDIATE TRIAGE EVALUATION NEEDED:
- Primary Symptom: ${String(primarySymptom).trim()}
- Additional Symptoms: ${additionalStr || 'None reported'}
- Duration: ${duration || 'Unspecified'}
- Severity (1-10): ${Number(severity) || 5}
- Age Group: ${ageGroup}
- Biological Sex / Pregnancy: ${gender}
- Allergies: ${allergies || 'None reported'}
- Current Medications: ${currentMedications || 'None reported'}`;

        const directAssessment = await callGeminiWithFailover(
          directPrompt,
          'You are an experienced clinical pharmacist and emergency triage physician. Return strictly accurate, safety-first structured JSON matching the requested schema.',
          assessmentSchema
        );

        return res.json({
          needsClarification: false,
          preliminaryImpression: String(clarifyRaw.preliminaryImpression || ''),
          questions: [],
          assessment: normalizeAssessmentPayload(directAssessment, String(primarySymptom)),
        });
      }

      return res.json({
        needsClarification: true,
        preliminaryImpression: String(
          clarifyRaw?.preliminaryImpression ||
            `Gathering 2–3 key clinical details about "${String(primarySymptom).trim()}" to sharpen triage & medication safety.`
        ),
        questions: Array.isArray(clarifyRaw?.questions) ? clarifyRaw.questions.slice(0, 3) : [],
      });
    }

    // Stage 2: Full Personalized Triage + Allergy & Medication Safety Audit
    const qaPairs = Array.isArray(clarifyingAnswers)
      ? clarifyingAnswers
          .filter((q: any) => q && q.answer && String(q.answer).trim())
          .map((q: any) => `- Q: ${String(q.question || '')} -> A: ${String(q.answer)}`)
          .join('\n')
      : '';

    const cacheKey = JSON.stringify({
      p: String(primarySymptom).trim().toLowerCase(),
      a: additionalStr.toLowerCase(),
      d: duration,
      s: Number(severity) || 5,
      age: ageGroup,
      g: gender,
      al: String(allergies || '').trim().toLowerCase(),
      med: String(currentMedications || '').trim().toLowerCase(),
      qa: qaPairs.toLowerCase(),
    });

    if (assessmentCache.has(cacheKey)) {
      return res.json(assessmentCache.get(cacheKey));
    }

    const prompt = `Patient Intake Profile:
- Primary Symptom: ${String(primarySymptom).trim()}
- Additional Symptoms: ${additionalStr || 'None reported'}
- Duration: ${duration || 'Unspecified'}
- Severity (1-10): ${Number(severity) || 5}
- Age Group: ${ageGroup}
- Biological Sex / Pregnancy Status: ${gender}
- Known Drug Allergies: ${allergies || 'None reported'}
- Current Medications: ${currentMedications || 'None reported'}
${qaPairs ? `\nFollow-Up Interview Answers:\n${qaPairs}\n` : ''}
Instructions:
1. Triage accurately: EMERGENCY (airway/breathing distress, crushing chest pain, FAST stroke deficits, anaphylaxis, active suicidal/overdose crisis, massive bleeding, testicular/ovarian torsion, altered mental status), URGENT (acute abdomen, high fever + stiff neck, severe trauma/fracture, deep laceration, acute asthma flare, kidney stone, UTI with flank pain/fever), MODERATE (persistent >1 week, moderate pain needing diagnostics/prescription), or COMMON (mild self-limiting symptoms).
2. EXPLICIT ALLERGY & MEDICATION SAFETY ("patientSafetyAlerts" + "drugHerbInteractions"): Check every allergy and current medication carefully against standard remedies. If the patient reports NSAID/Aspirin allergy, Penicillin/Sulfa allergy, Blood Thinners (Warfarin/Eliquis), SSRIs, MAOIs, Metformin, ACE inhibitors, Pregnancy ("Female (Pregnant)"), or Infant/Child age, explicitly warn what MUST be avoided in "patientSafetyAlerts" AND exclude unsafe drugs from "pharmaceuticalMedicines". If none reported, still include a clear active-ingredient verification note.
3. Add a brief "confidenceNote" explaining how the follow-up answers (or reported red flags) shaped this triage level.
4. If triageLevel is EMERGENCY, put immediate 911/ER/first-aid priorities first in "howToHandleIt.immediateSteps" and note "Do not delay hospital care for home remedies."
5. Otherwise provide practical, distinct Natural & Herbal Remedies AND safe Pharmaceutical Medicines matching the patient's allergy/medication profile.`;

    const raw = await callGeminiWithFailover(
      prompt,
      'You are an experienced clinical pharmacist and emergency triage physician. Return strictly accurate, safety-first structured JSON matching the requested schema.',
      assessmentSchema
    );

    const normalized = normalizeAssessmentPayload(raw, String(primarySymptom));
    setAssessmentCache(cacheKey, normalized);
    return res.json(normalized);
  } catch (error: any) {
    const transient = isTransientGeminiError(error);
    console.warn('[SymptomScout]', transient ? 'Upstream AI busy; signaling offline protocol' : error?.message || error);
    if (transient) {
      return res.status(200).json({
        fallback: true,
        message: 'AI clinical model is temporarily busy; using verified offline protocol.',
      });
    }
    return res.status(500).json({
      error: 'Failed to assess symptoms with AI',
    });
  }
});

// Universal Global Symptom & Condition Lookup Route (Covers any rare/worldwide condition on demand)
app.post('/api/symptom-lookup', async (req: Request, res: Response) => {
  try {
    const rawQuery = String(req.body?.query || '').trim();
    const categoryHint = String(req.body?.category || '').trim();

    if (!rawQuery || rawQuery.length < 2) {
      return res.status(400).json({ error: 'A valid symptom or condition query is required.' });
    }

    const cacheKey = rawQuery.toLowerCase().replace(/\s+/g, ' ');
    if (symptomLookupCache.has(cacheKey)) {
      return res.json({ entry: symptomLookupCache.get(cacheKey), cached: true });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Live AI encyclopedia lookup requires GEMINI_API_KEY configuration.',
      });
    }

    const prompt = `Generate a complete clinical pharmacology monograph for the symptom, condition, or remedy query: "${rawQuery}"${
      categoryHint && categoryHint !== 'all' ? ` (specialty context: ${categoryHint})` : ''
    }.
If the user entered a specific herb or medicine name, map the monograph to the primary medical symptom or condition it treats and highlight that medicine/herb alongside peer alternatives.
Ensure accurate triage tier (COMMON, MODERATE, URGENT, or EMERGENCY), ICD-10 style code if applicable, 3-phase "howToHandleIt" action timeline, evidence-based natural remedies, pharmaceutical/OTC drugs (with standard doses & prescriptionRequired boolean), and clear red flags. For EMERGENCY conditions, set skipHomeRemedies=true and recommendedFacilityType="hospital".`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
        icdCode: { type: Type.STRING },
        category: {
          type: Type.STRING,
          description:
            'One of: head_neurological, respiratory, digestive, cardiovascular, musculoskeletal, skin_dermatology, eyes_ears_throat, mental_sleep, emergency_firstaid, pediatric_allergy, endocrine_metabolic, urology_renal, infectious_disease, dental_oral, womens_mens_health',
        },
        triage: {
          type: Type.STRING,
          description: 'One of: COMMON, MODERATE, URGENT, EMERGENCY',
        },
        urgencySummary: { type: Type.STRING },
        overview: { type: Type.STRING },
        commonCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
        howToHandleIt: {
          type: Type.OBJECT,
          properties: {
            immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            hourlyCare: { type: Type.ARRAY, items: { type: Type.STRING } },
            dailyTimeline: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['immediateSteps', 'hourlyCare', 'dailyTimeline'],
        },
        naturalRemedies: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              mechanism: { type: Type.STRING },
              preparation: { type: Type.STRING },
              dosage: { type: Type.STRING },
              precautions: { type: Type.STRING },
            },
            required: ['name', 'type', 'mechanism', 'preparation', 'dosage', 'precautions'],
          },
        },
        pharmaceuticalMedicines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              activeIngredient: { type: Type.STRING },
              brandNames: { type: Type.STRING },
              drugClass: { type: Type.STRING },
              typicalDose: { type: Type.STRING },
              mechanism: { type: Type.STRING },
              warnings: { type: Type.STRING },
              prescriptionRequired: { type: Type.BOOLEAN },
            },
            required: [
              'activeIngredient',
              'brandNames',
              'drugClass',
              'typicalDose',
              'mechanism',
              'warnings',
              'prescriptionRequired',
            ],
          },
        },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        skipHomeRemedies: { type: Type.BOOLEAN },
        recommendedFacilityType: {
          type: Type.STRING,
          description: 'One of: pharmacy, clinic, urgent_care, hospital',
        },
      },
      required: [
        'name',
        'category',
        'triage',
        'urgencySummary',
        'overview',
        'commonCauses',
        'howToHandleIt',
        'naturalRemedies',
        'pharmaceuticalMedicines',
        'redFlags',
        'recommendedFacilityType',
      ],
    };

    const raw = await callGeminiWithFailover(
      prompt,
      'You are an international clinical pharmacopeia editor creating structured, safe medical reference monographs for GoPharma.',
      schema
    );

    const triage = VALID_TRIAGE_LEVELS.has(raw?.triage) ? raw.triage : 'MODERATE';
    const category = VALID_CATEGORIES.has(raw?.category) ? raw.category : 'head_neurological';
    const validFacility = ['pharmacy', 'clinic', 'urgent_care', 'hospital'].includes(
      raw?.recommendedFacilityType
    )
      ? raw.recommendedFacilityType
      : triage === 'EMERGENCY'
      ? 'hospital'
      : triage === 'URGENT'
      ? 'urgent_care'
      : triage === 'MODERATE'
      ? 'clinic'
      : 'pharmacy';

    const slug = cacheKey.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const entry = {
      id: `ai-${slug || Date.now()}`,
      name: String(raw?.name || rawQuery),
      aliases: Array.isArray(raw?.aliases) ? raw.aliases.map(String) : [],
      icdCode: raw?.icdCode ? String(raw.icdCode) : undefined,
      isAiGenerated: true,
      category,
      triage,
      urgencySummary: String(raw?.urgencySummary || `${triage}: Clinical overview for ${rawQuery}.`),
      overview: String(raw?.overview || ''),
      commonCauses: Array.isArray(raw?.commonCauses) ? raw.commonCauses.map(String) : [],
      howToHandleIt: {
        immediateSteps: Array.isArray(raw?.howToHandleIt?.immediateSteps)
          ? raw.howToHandleIt.immediateSteps.map(String)
          : ['Monitor vital signs and assess symptom severity.'],
        hourlyCare: Array.isArray(raw?.howToHandleIt?.hourlyCare)
          ? raw.howToHandleIt.hourlyCare.map(String)
          : ['Follow hydration and rest instructions as clinically appropriate.'],
        dailyTimeline: Array.isArray(raw?.howToHandleIt?.dailyTimeline)
          ? raw.howToHandleIt.dailyTimeline.map(String)
          : ['Consult a licensed clinician if symptoms persist beyond 48 hours.'],
      },
      naturalRemedies:
        triage === 'EMERGENCY' || raw?.skipHomeRemedies
          ? []
          : Array.isArray(raw?.naturalRemedies)
          ? raw.naturalRemedies.map((r: any) => ({
              name: String(r?.name || ''),
              type: String(r?.type || 'Botanical Therapy'),
              mechanism: String(r?.mechanism || ''),
              preparation: String(r?.preparation || ''),
              dosage: String(r?.dosage || ''),
              precautions: String(r?.precautions || ''),
            }))
          : [],
      pharmaceuticalMedicines: Array.isArray(raw?.pharmaceuticalMedicines)
        ? raw.pharmaceuticalMedicines.map((m: any) => ({
            activeIngredient: String(m?.activeIngredient || ''),
            brandNames: String(m?.brandNames || ''),
            drugClass: String(m?.drugClass || ''),
            typicalDose: String(m?.typicalDose || ''),
            mechanism: String(m?.mechanism || ''),
            warnings: String(m?.warnings || ''),
            prescriptionRequired: Boolean(m?.prescriptionRequired),
          }))
        : [],
      redFlags: Array.isArray(raw?.redFlags) ? raw.redFlags.map(String) : [],
      skipHomeRemedies: triage === 'EMERGENCY' ? true : Boolean(raw?.skipHomeRemedies),
      recommendedFacilityType: validFacility,
    };

    setSymptomCache(cacheKey, entry);
    return res.json({ entry, cached: false });
  } catch (error: any) {
    const transient = isTransientGeminiError(error);
    console.warn('[SymptomLookup]', transient ? 'Upstream AI busy; returning structured monograph fallback' : error?.message || error);
    if (transient) {
      const rawQuery = String(req.body?.query || 'Clinical Symptom').trim();
      const categoryHint = String(req.body?.category || '').trim();
      const category = VALID_CATEGORIES.has(categoryHint) ? categoryHint : 'head_neurological';
      const slug = rawQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return res.status(200).json({
        fallback: true,
        entry: {
          id: `offline-${slug || Date.now()}`,
          name: rawQuery,
          aliases: [],
          isAiGenerated: false,
          category,
          triage: 'MODERATE',
          urgencySummary: `MODERATE: Standard clinical care overview for ${rawQuery}. Seek urgent evaluation if severe or rapidly worsening.`,
          overview: `${rawQuery} can stem from benign self-limited irritation, infection, inflammation, or underlying medical conditions depending on severity, vital signs, and medical history. Review red-flag symptoms below and consult a licensed clinician or pharmacist before combining treatments.`,
          commonCauses: [
            'Viral, inflammatory, or environmental irritation',
            'Medication side effects or dehydration',
            'Underlying systemic condition requiring clinical exam',
          ],
          howToHandleIt: {
            immediateSteps: [
              'Pause strenuous activity, check temperature/pulse if available, and rest in a comfortable position.',
              'Review your current medications and known allergies before taking any over-the-counter relief.',
            ],
            hourlyCare: [
              'Maintain steady hydration and track whether discomfort is easing, stable, or intensifying.',
              'Avoid alcohol, unverified supplements, or duplicate active ingredients.',
            ],
            dailyTimeline: [
              'If symptoms persist beyond 48 hours, recur, or interfere with sleep or daily function, schedule a clinic evaluation.',
            ],
          },
          naturalRemedies: [
            {
              name: 'Rest, Hydration & Gentle Warm/Cool Compress',
              type: 'Supportive Non-Pharmacologic Care',
              mechanism: 'Supports physiologic recovery and eases localized irritation without drug interactions.',
              preparation: 'Sip water or electrolyte fluids steadily; apply a clean warm or cool compress for 10-15 minutes.',
              dosage: 'As tolerated every 2-4 hours.',
              precautions: 'Stop if warmth worsens swelling or if skin irritation develops.',
            },
          ],
          pharmaceuticalMedicines: [
            {
              activeIngredient: 'Acetaminophen (Paracetamol) — Pharmacist Guidance',
              brandNames: 'Tylenol, Panadol (verify condition appropriateness)',
              drugClass: 'Analgesic / Antipyretic',
              typicalDose: 'Consult a pharmacist or physician for targeted dosing.',
              mechanism: 'Central prostaglandin inhibition for pain or fever modulation.',
              warnings: 'Avoid exceeding 3,000-4,000 mg/day or combining with liver disease or alcohol.',
              prescriptionRequired: false,
            },
          ],
          redFlags: [
            'Sudden severe pain, high fever (>39°C / 102.2°F), difficulty breathing, chest pressure, confusion, or fainting.',
            'Rapidly spreading swelling, inability to keep fluids down, or severe worsening despite rest.',
          ],
          skipHomeRemedies: false,
          recommendedFacilityType: 'clinic',
        },
      });
    }
    return res.status(500).json({
      error: 'Unable to look up clinical monograph right now.',
    });
  }
});

// Hope & Recovery AI Companion Helpers & Routes (Unlimited Conversational Empathy + SSE Streaming)
function detectCrisisText(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('suicid') ||
    lower.includes('kill myself') ||
    lower.includes('end my life') ||
    lower.includes('want to die') ||
    lower.includes('hurt myself') ||
    lower.includes('self harm') ||
    lower.includes('self-harm') ||
    lower.includes('no reason to live') ||
    lower.includes('better off dead')
  );
}

function buildHopeCompanionPayload(body: any) {
  const {
    messages = [],
    focusArea = 'general',
    includeVerse = true,
    usedVerses = [],
    recoveryContext = null,
  } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Conversation messages are required.' };
  }

  const sanitizedHistory = messages
    .slice(-40)
    .filter((m: any) => m && typeof m.content === 'string' && m.content.trim())
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content).trim().slice(0, 6000) }],
    }));

  if (sanitizedHistory.length === 0) {
    return { error: 'At least one non-empty message is required.' };
  }

  const latestUserMsg =
    [...sanitizedHistory].reverse().find((m) => m.role === 'user')?.parts?.[0]?.text || '';
  const userCrisisFlag = detectCrisisText(latestUserMsg);

  const avoidVersesNote =
    Array.isArray(usedVerses) && usedVerses.length > 0
      ? `Do NOT repeat any Bible verse already shared in this chat (${usedVerses.join(', ')}).`
      : '';

  const recoveryNotes: string[] = [];
  if (recoveryContext && typeof recoveryContext === 'object') {
    if (typeof recoveryContext.streakDays === 'number' && recoveryContext.goalLabel) {
      recoveryNotes.push(
        `Recovery Streak: ${recoveryContext.streakDays} day(s) focused on "${String(recoveryContext.goalLabel).slice(0, 80)}".`
      );
    }
    if (recoveryContext.recentMoodLabel) {
      recoveryNotes.push(
        `Recent Log Check-in: Mood="${String(recoveryContext.recentMoodLabel).slice(0, 40)}"${
          typeof recoveryContext.recentCraving === 'number'
            ? `, Craving Intensity=${recoveryContext.recentCraving}/10`
            : ''
        }.`
      );
    }
    if (Array.isArray(recoveryContext.recentTriggers) && recoveryContext.recentTriggers.length > 0) {
      recoveryNotes.push(
        `Recent Noted Triggers: ${recoveryContext.recentTriggers.slice(0, 5).map(String).join(', ')}.`
      );
    }
    if (recoveryContext.latestNote) {
      recoveryNotes.push(
        `Recent Private Journal Note: "${String(recoveryContext.latestNote).slice(0, 240)}".`
      );
    }
  }

  const recoveryContextBlock =
    recoveryNotes.length > 0
      ? `\nPRIVATE RECOVERY VAULT CONTEXT (weave in lightly only when relevant—never read back like a clinical chart):\n- ${recoveryNotes.join('\n- ')}\n`
      : '';

  const baseSystemPrompt = `You are a deeply wise, warm, articulate, open-hearted conversational companion here to console, encourage, reason with, and talk openly to anyone from any walk of life about whatever is on their mind.

CORE CONVERSATIONAL FREEDOM & VOICE:
- Talk with everyone without artificial topic walls or stiff canned scripts. You can sit with someone through heartbreak, loneliness, grief, suicide/dark thoughts, addiction cravings, anxiety, or spiritual wrestling—AND you can equally help them think through family conflicts, career stress, late-night overthinking, purpose, faith questions, philosophy, practical life steps, or casual conversation.
- Match the user's exact energy, depth, and language seamlessly (if they write in Spanish, Arabic, French, Tagalog, Swahili, etc., respond naturally in that language).
- Match length naturally to what serves them: brief and grounded for quick back-and-forth, or deeply thoughtful, rich, and well-structured when they share heavy or complex life situations.
- Sound like an extraordinarily perceptive, honest, compassionate human being—never like a corporate chatbot.
- NEVER use robotic boilerplate such as: "I am really glad you reached out", "You do not have to carry this alone", "Your feelings are valid", "I hear you saying", "As an AI", or repetitive forced positivity ("everything happens for a reason").
- Remember everything discussed earlier in this thread and build forward naturally without repeating yourself.
${recoveryContextBlock}
CARE & SAFETY BOUNDARIES:
1. SUICIDE / SELF-HARM: Never encourage, validate, romanticize, or instruct on suicide or self-harm. If someone expresses suicidal thoughts, self-harm urges, or wanting to end their life, stay steady, warm, and present with what they specifically described, and include brief human support info (call or text 988 in US/Canada, text HOME to 741741, dial 911/112, or findahelpline.com globally). Never lecture or repeat an identical hotline speech every turn if already addressed in the thread.
2. ADDICTION & CRAVINGS: Never shame or preach. Help them navigate the trigger or relapse honestly and practically (riding out the next 15-20 minutes, changing setting, calling a trusted person or SAMHSA 1-800-662-4357, or seeking urgent medical care for dangerous alcohol/benzo withdrawal).`;

  return {
    sanitizedHistory,
    userCrisisFlag,
    focusArea,
    includeVerse: Boolean(includeVerse),
    avoidVersesNote,
    baseSystemPrompt,
  };
}

function extractStreamDirectives(rawText: string, includeVerse: boolean, userCrisisFlag: boolean) {
  let text = rawText;
  let crisisDetected = userCrisisFlag;
  let groundingStep: string | null = null;
  let bibleVerse: { reference: string; text: string } | null = null;

  if (/\[CRISIS\]/i.test(text)) {
    crisisDetected = true;
    text = text.replace(/\[CRISIS\]/gi, '');
  }

  const stepMatch = text.match(/\[STEP:\s*([^\]]+)\]/i);
  if (stepMatch && stepMatch[1]?.trim()) {
    groundingStep = stepMatch[1].trim();
    text = text.replace(stepMatch[0], '');
  }

  const verseMatch = text.match(/\[VERSE:\s*([^|\]]+)\|\s*([^\]]+)\]/i);
  if (verseMatch && verseMatch[1]?.trim() && verseMatch[2]?.trim()) {
    if (includeVerse) {
      bibleVerse = {
        reference: verseMatch[1].trim(),
        text: verseMatch[2].trim().replace(/^["“]|["”]$/g, ''),
      };
    }
    text = text.replace(verseMatch[0], '');
  }

  return {
    cleanText: text.trim(),
    crisisDetected,
    groundingStep,
    bibleVerse,
  };
}

// Streaming SSE Hope Companion Route (Instant word-by-word ChatGPT-style response)
app.post('/api/hope-companion/stream', async (req: Request, res: Response) => {
  const prep = buildHopeCompanionPayload(req.body);
  if ('error' in prep) {
    return res.status(400).json({ error: prep.error });
  }
  if (!ai) {
    return res.status(200).json({ fallback: true });
  }

  const {
    sanitizedHistory,
    userCrisisFlag,
    focusArea,
    includeVerse,
    avoidVersesNote,
    baseSystemPrompt,
  } = prep;

  const streamInstruction = `${baseSystemPrompt}

OUTPUT FORMAT RULES (IMPORTANT):
- Write your natural conversational reply directly as plain, readable prose (use clean paragraph breaks or concise lists only when genuinely helpful). Do NOT wrap your reply in JSON or markdown code blocks.
- OPTIONAL END METADATA TAGS (place ONLY on final lines at the very end if truly relevant, never mid-paragraph):
  1. If the user expressed active suicidal intent, self-harm danger, or severe medical withdrawal, append exactly: [CRISIS]
  2. If one short, concrete practical action genuinely helps right now, append: [STEP: One short practical step tailored to this moment.]
  3. ${
    includeVerse
      ? `When a Bible verse genuinely consoles or illuminates what they shared (or when asked), append ONE accurately quoted public-domain World English Bible (WEB) verse as: [VERSE: Book Chapter:Verse | Exact verse text] (${avoidVersesNote || 'vary widely across Scripture'}).`
      : 'Do NOT include a [VERSE: ...] tag unless the user explicitly asks for Scripture.'
  }
Topic focus: ${focusArea}.`;

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (payload: Record<string, any>) => {
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
  };

  let closed = false;
  req.on('close', () => {
    closed = true;
  });

  const models: Array<{ model: string; level: ThinkingLevel; timeoutMs: number }> = [
    { model: 'gemini-4-hydrogen', level: ThinkingLevel.LOW, timeoutMs: 12000 },
    { model: 'gemini-3.1-flash-lite', level: ThinkingLevel.MINIMAL, timeoutMs: 9000 },
  ];

  let fullRawText = '';

  for (let i = 0; i < models.length; i++) {
    if (closed) break;
    const { model, level, timeoutMs } = models[i];
    let attemptText = '';
    try {
      const streamIter = await withTimeout(
        ai.models.generateContentStream({
          model,
          contents: sanitizedHistory,
          config: {
            systemInstruction: streamInstruction,
            thinkingConfig: { thinkingLevel: level },
          },
        }),
        timeoutMs,
        model
      );

      for await (const chunk of streamIter) {
        if (closed) break;
        const delta = chunk?.text || '';
        if (delta) {
          attemptText += delta;
          fullRawText += delta;
          sendEvent({ type: 'delta', delta });
        }
      }

      if (attemptText.trim().length > 0) {
        const parsed = extractStreamDirectives(fullRawText, includeVerse, userCrisisFlag);
        sendEvent({
          type: 'done',
          reply: parsed.cleanText,
          crisisDetected: parsed.crisisDetected,
          groundingStep: parsed.groundingStep,
          bibleVerse: parsed.bibleVerse,
        });
        res.end();
        return;
      }
    } catch (err: any) {
      // Only fail over if nothing has been streamed to client yet
      if (attemptText.length > 0) {
        const parsed = extractStreamDirectives(fullRawText, includeVerse, userCrisisFlag);
        sendEvent({
          type: 'done',
          reply: parsed.cleanText,
          crisisDetected: parsed.crisisDetected,
          groundingStep: parsed.groundingStep,
          bibleVerse: parsed.bibleVerse,
        });
        res.end();
        return;
      }
      if (!isTransientGeminiError(err) && i === models.length - 1) {
        console.warn('[HopeCompanionStream]', err?.message || err);
      }
    }
  }

  if (!closed) {
    sendEvent({ type: 'fallback' });
    res.end();
  }
});

// JSON Hope Companion Route (Kept as compatibility/fallback endpoint)
app.post('/api/hope-companion', async (req: Request, res: Response) => {
  try {
    const prep = buildHopeCompanionPayload(req.body);
    if ('error' in prep) {
      return res.status(400).json({ error: prep.error });
    }
    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const {
      sanitizedHistory,
      userCrisisFlag,
      focusArea,
      includeVerse,
      avoidVersesNote,
      baseSystemPrompt,
    } = prep;

    const systemInstruction = `${baseSystemPrompt}

STRUCTURED FIELDS:
1. "crisisDetected": True if the user expresses suicidal intent, self-harm urges, acute danger, or severe medical withdrawal.
2. "groundingStep": Optional short, natural, situation-specific 1-sentence practical action if helpful; otherwise null.
3. "bibleVerse": ${
      includeVerse
        ? `Include ONE authentic public-domain World English Bible (WEB) verse when it genuinely comforts or fits what they just shared (or when asked). ${avoidVersesNote}`
        : 'Set to null unless the user explicitly asked for Scripture.'
    }
Topic focus: ${focusArea}.`;

    const hopeSchema = {
      type: Type.OBJECT,
      properties: {
        reply: {
          type: Type.STRING,
          description:
            'Natural, warm, unrestricted, deeply responsive human-like reply tailored specifically to what the user shared.',
        },
        crisisDetected: {
          type: Type.BOOLEAN,
          description:
            'True if the user expresses suicidal thoughts, self-harm intent, acute danger, or severe medical withdrawal.',
        },
        groundingStep: {
          type: Type.STRING,
          nullable: true,
          description:
            'Optional short, tailored practical action for right now if helpful; otherwise null.',
        },
        bibleVerse: {
          type: Type.OBJECT,
          nullable: true,
          description:
            'Optional relevant Bible verse matching what they shared, when includeVerse is on or requested.',
          properties: {
            reference: {
              type: Type.STRING,
              description: 'Exact book, chapter, and verse (e.g., Isaiah 43:2)',
            },
            text: {
              type: Type.STRING,
              description: 'Accurate text of the Bible verse.',
            },
          },
        },
      },
      required: ['reply', 'crisisDetected'],
    };

    const parsed = await callGeminiWithFailover(
      sanitizedHistory,
      systemInstruction,
      hopeSchema
    );

    if (userCrisisFlag && parsed && typeof parsed === 'object') {
      parsed.crisisDetected = true;
    }

    return res.json(parsed);
  } catch (error: any) {
    const transient = isTransientGeminiError(error);
    console.warn('[HopeCompanion]', transient ? 'Upstream AI busy; signaling offline support' : error?.message || error);
    if (transient) {
      return res.status(200).json({
        fallback: true,
        error: 'Live AI companion is momentarily busy.',
      });
    }
    return res.status(500).json({
      error: 'Unable to reach AI companion right now.',
    });
  }
});

// Helper to read provisioned Google Maps API key from environment
function getMapsApiKey(): string {
  return process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
}

// Provide client configuration for Maps JavaScript API loader
app.get('/api/maps/config', (_req: Request, res: Response) => {
  const apiKey = getMapsApiKey();
  res.json({
    configured: Boolean(apiKey),
    apiKey,
  });
});

// Proxy route for Google Places API (New) Nearby & Text Search (avoids CORS - CF1)
app.post('/api/maps/nearby', async (req: Request, res: Response) => {
  const apiKey = getMapsApiKey();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Google Maps API key is not configured on the server.',
    });
  }

  const { lat, lng, radius = 5000, type = 'all' } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Numeric lat and lng are required.' });
  }

  const radiusMeters = Math.min(Math.max(Number(radius) || 5000, 500), 50000);

  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.shortFormattedAddress',
    'places.location',
    'places.types',
    'places.primaryType',
    'places.primaryTypeDisplayName',
    'places.rating',
    'places.userRatingCount',
    'places.nationalPhoneNumber',
    'places.internationalPhoneNumber',
    'places.regularOpeningHours',
    'places.currentOpeningHours',
    'places.businessStatus',
    'places.googleMapsUri',
    'places.googleMapsLinks',
  ].join(',');

  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask,
      'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
    };

    const fetchUrgentCarePlaces = async () => {
      const textRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          textQuery: 'urgent care clinic walk-in emergency medical',
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters,
            },
          },
        }),
      });
      const textData = await textRes.json();
      if (textRes.status === 429 || textData?.error?.status === 'RESOURCE_EXHAUSTED') {
        const quotaErr: any = new Error(
          textData?.error?.message || 'Google Maps Platform quota exceeded.'
        );
        quotaErr.quotaExceeded = true;
        throw quotaErr;
      }
      if (!textRes.ok) {
        throw new Error(textData?.error?.message || 'Places Text Search request failed.');
      }
      return Array.isArray(textData.places)
        ? textData.places.map((p: any) => ({ ...p, _fromUrgentCareSearch: true }))
        : [];
    };

    // Urgent care uses Text Search biased to the circle since there is no dedicated Table A urgent_care type
    if (type === 'urgent_care') {
      const urgentPlaces = await fetchUrgentCarePlaces();
      return res.json({ places: urgentPlaces });
    }

    // Standard Nearby Search (New) using valid Table A health types
    let includedTypes: string[] = [
      'pharmacy',
      'drugstore',
      'medical_clinic',
      'medical_center',
      'doctor',
      'hospital',
      'general_hospital',
    ];
    if (type === 'pharmacy') {
      includedTypes = ['pharmacy', 'drugstore'];
    } else if (type === 'clinic') {
      includedTypes = ['medical_clinic', 'medical_center', 'doctor'];
    } else if (type === 'hospital') {
      includedTypes = ['hospital', 'general_hospital'];
    }

    const fetchNearbyPlaces = async () => {
      const nearbyRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          includedTypes,
          maxResultCount: 20,
          rankPreference: 'DISTANCE',
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters,
            },
          },
        }),
      });

      const nearbyData = await nearbyRes.json();
      if (nearbyRes.status === 429 || nearbyData?.error?.status === 'RESOURCE_EXHAUSTED') {
        const quotaErr: any = new Error(
          nearbyData?.error?.message || 'Google Maps Platform quota exceeded.'
        );
        quotaErr.quotaExceeded = true;
        throw quotaErr;
      }
      if (!nearbyRes.ok) {
        throw new Error(nearbyData?.error?.message || 'Places Nearby Search request failed.');
      }
      return Array.isArray(nearbyData.places) ? nearbyData.places : [];
    };

    // In 'all' mode, fetch standard nearby health types AND dedicated urgent care centers in parallel
    if (type === 'all') {
      const [nearbyResult, urgentResult] = await Promise.allSettled([
        fetchNearbyPlaces(),
        fetchUrgentCarePlaces(),
      ]);

      if (
        (nearbyResult.status === 'rejected' && nearbyResult.reason?.quotaExceeded) ||
        (urgentResult.status === 'rejected' && urgentResult.reason?.quotaExceeded)
      ) {
        return res.status(429).json({
          quotaExceeded: true,
          error: 'Google Maps Platform quota exceeded.',
        });
      }

      const nearbyPlaces = nearbyResult.status === 'fulfilled' ? nearbyResult.value : [];
      const urgentPlaces = urgentResult.status === 'fulfilled' ? urgentResult.value : [];

      if (nearbyResult.status === 'rejected' && urgentResult.status === 'rejected') {
        throw nearbyResult.reason;
      }

      // Merge placing urgent-care matches first so overlapping clinics get tagged properly, deduplicated by place.id
      const byId = new Map<string, any>();
      for (const p of [...urgentPlaces, ...nearbyPlaces]) {
        const key = p.id || `${p.location?.latitude}-${p.location?.longitude}-${p.displayName?.text}`;
        if (!byId.has(key)) {
          byId.set(key, p);
        }
      }
      return res.json({ places: Array.from(byId.values()) });
    }

    const nearbyPlaces = await fetchNearbyPlaces();
    return res.json({ places: nearbyPlaces });
  } catch (err: any) {
    if (err?.quotaExceeded) {
      return res.status(429).json({
        quotaExceeded: true,
        error: err.message || 'Google Maps Platform quota exceeded.',
      });
    }
    console.warn('[MapsNearby]', err?.message || err);
    return res.status(500).json({
      error: 'Unable to fetch nearby healthcare facilities.',
    });
  }
});

// Proxy route for Google Geocoding & Reverse Geocoding API (avoids CORS - CF1)
app.get('/api/maps/geocode', async (req: Request, res: Response) => {
  const apiKey = getMapsApiKey();
  const address = String(req.query.address || '').trim();
  const latParam = req.query.lat !== undefined ? Number(req.query.lat) : NaN;
  const lngParam = req.query.lng !== undefined ? Number(req.query.lng) : NaN;
  const hasCoords = Number.isFinite(latParam) && Number.isFinite(lngParam);

  if (!apiKey) {
    return res.status(503).json({ error: 'Google Maps API key not configured.' });
  }
  if (!address && !hasCoords) {
    return res
      .status(400)
      .json({ error: 'address or numeric lat & lng query parameters are required.' });
  }

  try {
    const queryParam = hasCoords
      ? `latlng=${encodeURIComponent(`${latParam},${lngParam}`)}`
      : `address=${encodeURIComponent(address)}`;

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${queryParam}&key=${encodeURIComponent(
        apiKey
      )}`
    );
    const data = await geoRes.json();

    if (geoRes.status === 429 || data.status === 'OVER_QUERY_LIMIT') {
      return res.status(429).json({
        quotaExceeded: true,
        error: data.error_message || 'Geocoding quota exceeded.',
      });
    }

    if (data.status === 'OK' && data.results?.[0]) {
      const best = data.results[0];
      const components: Array<{ long_name: string; types: string[] }> =
        Array.isArray(best.address_components) ? best.address_components : [];

      const neighborhood =
        components.find((c) => c.types.includes('sublocality_level_1'))?.long_name ||
        components.find((c) => c.types.includes('neighborhood'))?.long_name ||
        components.find((c) => c.types.includes('sublocality'))?.long_name;
      const locality =
        components.find((c) => c.types.includes('locality'))?.long_name ||
        components.find((c) => c.types.includes('administrative_area_level_2'))
          ?.long_name;
      const country = components.find((c) => c.types.includes('country'))?.long_name;

      const shortParts = [neighborhood, locality, country].filter(Boolean);
      const shortLabel =
        shortParts.length > 0
          ? Array.from(new Set(shortParts)).slice(0, 2).join(', ')
          : best.formatted_address;

      return res.json({
        found: true,
        lat: best.geometry.location.lat,
        lng: best.geometry.location.lng,
        formattedAddress: best.formatted_address,
        shortLabel,
      });
    }

    return res.status(200).json({
      found: false,
      shortLabel: null,
      error: hasCoords ? undefined : 'Location not found. Try a city or full address.',
    });
  } catch (err: any) {
    console.warn('[MapsGeocode]', err?.message || err);
    return res.status(500).json({ error: 'Geocoding request failed.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const cloudRunViteWsFixPlugin = {
      name: 'cloudrun-vite-ws-fix',
      transform(code: string, id: string) {
        if (!id.replace(/\\/g, '/').includes('vite/dist/client/client.mjs')) return null;
        let patched = code.replace(
          'const socketHost = `${__HMR_HOSTNAME__ || importMetaUrl.hostname}:${hmrPort || importMetaUrl.port}${__HMR_BASE__}`;',
          'const __effectivePort = hmrPort || importMetaUrl.port; const socketHost = `${__HMR_HOSTNAME__ || importMetaUrl.hostname}${__effectivePort ? ":" + __effectivePort : ""}${__HMR_BASE__}`;'
        );
        patched = patched.replace(
          /console\.error\(`\[vite\] failed to connect to websocket[\s\S]*?`\);/g,
          'console.debug("[vite] websocket skipped/unavailable in preview.");'
        );
        patched = patched.replace(
          /throw e;\s*\}\s*\},\s*async disconnect\(\)/,
          'return;\n\t\t\t}\n\t\t},\n\t\tasync disconnect()'
        );
        if (hmrDisabled) {
          patched = patched.replace(
            'transport.connect(createHMRHandler(handleMessage));',
            '/* HMR WebSocket disabled via DISABLE_HMR */'
          );
        }
        return { code: patched, map: null };
      },
    };

    const vite = await createViteServer({
      plugins: [cloudRunViteWsFixPlugin],
      server: {
        port: PORT,
        middlewareMode: true,
        ws: hmrDisabled ? false : { server: httpServer },
        hmr: hmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`GoPharma server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
