import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Clock,
  Leaf,
  Pill,
  ShieldAlert,
  ArrowRight,
  MapPin,
  RefreshCw,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Info,
  HelpCircle,
  SkipForward,
  Stethoscope,
} from 'lucide-react';
import {
  AssessmentResult,
  ClarifyingAnswer,
  ClarifyingQuestion,
  TriageLevel,
} from '../types/medical';
import { SYMPTOMS_DATA } from '../data/symptoms';
import { GLOBAL_SYMPTOM_ATLAS, AtlasEntry } from '../data/symptoms_atlas';

interface SymptomScoutProps {
  onNavigateToMap: (facilityType: 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital') => void;
  prefillSymptom?: string;
}

type InterviewStage = 'intake' | 'clarifying' | 'result';

const QUICK_EXAMPLES = [
  'Sore throat and mild fever',
  'Sharp pain burning when urinating',
  'Room spinning dizziness when rolling over',
  'Pulsing one-sided migraine headache',
  'Crushing chest pressure and sweating',
];

const COMMON_CHIPS = [
  'Fever / Chills',
  'Nausea / Vomiting',
  'Headache',
  'Dizziness / Vertigo',
  'Fatigue / Weakness',
  'Cough',
  'Sore Throat',
  'Shortness of Breath',
  'Abdominal Cramping',
  'Chest Tightness',
  'Skin Rash / Hives',
  'Muscle Aches',
  'Painful Urination',
  'Blurred Vision',
];

export const SymptomScout: React.FC<SymptomScoutProps> = ({
  onNavigateToMap,
  prefillSymptom = '',
}) => {
  const [primarySymptom, setPrimarySymptom] = useState<string>(prefillSymptom || '');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [customAdditional, setCustomAdditional] = useState<string>('');
  const [duration, setDuration] = useState<string>('1-2 days');
  const [severity, setSeverity] = useState<number>(4);
  const [ageGroup, setAgeGroup] = useState<string>('Adult (18-64 years)');
  const [gender, setGender] = useState<string>('Female');
  const [allergies, setAllergies] = useState<string>('');
  const [currentMedications, setCurrentMedications] = useState<string>('');

  const [stage, setStage] = useState<InterviewStage>('intake');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preliminaryImpression, setPreliminaryImpression] = useState<string>('');
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [usedFallbackEngine, setUsedFallbackEngine] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const clarifyRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefillSymptom && prefillSymptom.trim()) {
      setPrimarySymptom(prefillSymptom);
      setStage('intake');
      setResult(null);
    }
  }, [prefillSymptom]);

  const suggestionPool = useMemo(() => {
    const seen = new Set<string>();
    const items: Array<{ label: string; triage: TriageLevel; aliases: string }> = [];

    for (const s of SYMPTOMS_DATA) {
      const key = s.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        items.push({
          label: s.name,
          triage: s.triage,
          aliases: (s.aliases || []).join(' ').toLowerCase(),
        });
      }
    }
    for (const a of GLOBAL_SYMPTOM_ATLAS) {
      const key = a.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        items.push({
          label: a.name,
          triage: a.triage,
          aliases: a.aliases.toLowerCase(),
        });
      }
    }
    return items;
  }, []);

  const filteredSuggestions = useMemo(() => {
    const q = primarySymptom.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    return suggestionPool
      .filter((item) => {
        const hay = `${item.label.toLowerCase()} ${item.aliases}`;
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 7);
  }, [primarySymptom, suggestionPool]);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const getAllAdditional = () => {
    const list = [...selectedChips];
    if (customAdditional.trim()) list.push(customAdditional.trim());
    return list;
  };

  const handleResetForm = () => {
    setPrimarySymptom('');
    setSelectedChips([]);
    setCustomAdditional('');
    setDuration('1-2 days');
    setSeverity(4);
    setAllergies('');
    setCurrentMedications('');
    setStage('intake');
    setPreliminaryImpression('');
    setClarifyingQuestions([]);
    setAnswersMap({});
    setResult(null);
    setErrorMsg(null);
    setUsedFallbackEngine(false);
    setShowSuggestions(false);
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const text = [
      `GOPHARMA TRIAGE REPORT (${result.triageLevel})`,
      `Symptom: ${primarySymptom}`,
      `Summary: ${result.summary}`,
      result.patientSafetyAlerts?.length
        ? `Allergy & Med Alerts: ${result.patientSafetyAlerts.join(' | ')}`
        : '',
      `Recommended Care: ${result.recommendedFacility}`,
      `Immediate Steps: ${(result.howToHandleIt?.immediateSteps || []).join(' | ')}`,
      `Warning Red Flags: ${(result.emergencyRedFlags || []).join(' | ')}`,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  // Stage 1: Request Targeted Clinical Clarifying Questions (or instant EMERGENCY assessment)
  const handleStartClarify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primarySymptom.trim()) {
      setErrorMsg('Please enter or select your primary symptom.');
      return;
    }

    setErrorMsg(null);
    setUsedFallbackEngine(false);
    setShowSuggestions(false);
    setIsLoading(true);
    setResult(null);
    setAnswersMap({});

    const allAdditional = getAllAdditional();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch('/api/assess-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          stage: 'clarify',
          primarySymptom: primarySymptom.trim(),
          additionalSymptoms: allAdditional,
          duration,
          severity,
          ageGroup,
          gender,
          allergies: allergies.trim(),
          currentMedications: currentMedications.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && !data?.fallback) {
        if (data.needsClarification === false && data.assessment) {
          setResult(data.assessment as AssessmentResult);
          setStage('result');
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
          return;
        }
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setPreliminaryImpression(data.preliminaryImpression || '');
          setClarifyingQuestions(data.questions);
          setStage('clarifying');
          setTimeout(() => {
            clarifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
          return;
        }
      }

      // Offline / No-API Clarifying Flow (still asks 2 smart clinical questions unless immediate emergency)
      const localClarify = buildLocalClarifyingStage(
        primarySymptom.trim(),
        allAdditional,
        severity
      );
      if (!localClarify.needsClarification) {
        setUsedFallbackEngine(true);
        setResult(
          matchLocalSymptom(
            primarySymptom.trim(),
            allAdditional,
            severity,
            duration,
            ageGroup,
            gender,
            allergies,
            currentMedications,
            []
          )
        );
        setStage('result');
      } else {
        setPreliminaryImpression(localClarify.preliminaryImpression);
        setClarifyingQuestions(localClarify.questions);
        setStage('clarifying');
        setTimeout(() => {
          clarifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    } catch {
      const localClarify = buildLocalClarifyingStage(
        primarySymptom.trim(),
        allAdditional,
        severity
      );
      if (!localClarify.needsClarification) {
        setUsedFallbackEngine(true);
        setResult(
          matchLocalSymptom(
            primarySymptom.trim(),
            allAdditional,
            severity,
            duration,
            ageGroup,
            gender,
            allergies,
            currentMedications,
            []
          )
        );
        setStage('result');
      } else {
        setPreliminaryImpression(localClarify.preliminaryImpression);
        setClarifyingQuestions(localClarify.questions);
        setStage('clarifying');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // Stage 2: Submit Clarifying Answers & Generate Final Assessment
  const handleFinalizeAssessment = async (skipAnswers = false) => {
    setErrorMsg(null);
    setUsedFallbackEngine(false);
    setIsLoading(true);

    const allAdditional = getAllAdditional();
    const collectedAnswers: ClarifyingAnswer[] = skipAnswers
      ? []
      : clarifyingQuestions
          .map((q) => ({
            question: q.question,
            answer: (answersMap[q.id] || '').trim(),
          }))
          .filter((qa) => qa.answer.length > 0);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch('/api/assess-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          stage: 'assess',
          primarySymptom: primarySymptom.trim(),
          additionalSymptoms: allAdditional,
          duration,
          severity,
          ageGroup,
          gender,
          allergies: allergies.trim(),
          currentMedications: currentMedications.trim(),
          clarifyingAnswers: collectedAnswers,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.triageLevel && !data.fallback) {
        setResult(data as AssessmentResult);
        setStage('result');
      } else {
        setUsedFallbackEngine(true);
        setResult(
          matchLocalSymptom(
            primarySymptom.trim(),
            allAdditional,
            severity,
            duration,
            ageGroup,
            gender,
            allergies,
            currentMedications,
            collectedAnswers
          )
        );
        setStage('result');
      }
    } catch {
      setUsedFallbackEngine(true);
      setResult(
        matchLocalSymptom(
          primarySymptom.trim(),
          allAdditional,
          severity,
          duration,
          ageGroup,
          gender,
          allergies,
          currentMedications,
          collectedAnswers
        )
      );
      setStage('result');
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const selectClarifyAnswer = (qId: string, option: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [qId]: prev[qId] === option ? '' : option,
    }));
  };

  const answeredCount = clarifyingQuestions.filter(
    (q) => (answersMap[q.id] || '').trim().length > 0
  ).length;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Intake Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  AI Symptom Scout: Clinical Triage Intake
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  2-Step Smart Interview
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Asks targeted diagnostic follow-ups, checks drug &amp; allergy safety, and builds a personalized dual-cure plan.
              </p>
            </div>
          </div>

          {(primarySymptom || result || stage !== 'intake') && (
            <button
              type="button"
              onClick={handleResetForm}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Intake</span>
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span
            className={`px-2.5 py-1 rounded-lg ${
              stage === 'intake'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            1. Intake &amp; Allergy Profile
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span
            className={`px-2.5 py-1 rounded-lg ${
              stage === 'clarifying'
                ? 'bg-emerald-600 text-white'
                : stage === 'result'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            2. AI Clarifying Questions
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span
            className={`px-2.5 py-1 rounded-lg ${
              stage === 'result'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            3. Safety &amp; Treatment Protocol
          </span>
        </div>

        {/* Quick Examples */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="font-bold text-slate-400 mr-1">Quick try:</span>
          {QUICK_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setPrimarySymptom(ex);
                setShowSuggestions(false);
                if (stage !== 'intake') setStage('intake');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition"
            >
              {ex}
            </button>
          ))}
        </div>

        <form onSubmit={handleStartClarify} className="mt-5 space-y-5">
          {/* Primary Symptom with Autocomplete */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              1. What is your primary symptom or condition? *
            </label>
            <input
              type="text"
              value={primarySymptom}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 160)}
              onChange={(e) => {
                setPrimarySymptom(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="e.g. Throbbing migraine, Burning urination, Sore throat and fever, Knee swelling..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition"
              required
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                {filteredSuggestions.map((item) => (
                  <li
                    key={item.label}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setPrimarySymptom(item.label);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        item.triage === 'EMERGENCY'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : item.triage === 'URGENT'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : item.triage === 'MODERATE'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.triage}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick chip suggestions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              2. Additional co-occurring symptoms:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CHIPS.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {chip}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customAdditional}
              onChange={(e) => setCustomAdditional(e.target.value)}
              placeholder="Other accompanying signs (e.g. tingling fingers, sour taste, night sweats)..."
              className="mt-2.5 w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Duration & Severity Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                3. How long have you had this?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Under 2 hours (Sudden onset)">Under 2 hours (Sudden onset)</option>
                <option value="6 to 12 hours">6 to 12 hours</option>
                <option value="1-2 days">1 to 2 days</option>
                <option value="3-7 days">3 to 7 days</option>
                <option value="1-2 weeks">1 to 2 weeks</option>
                <option value="Over 2 weeks (Chronic)">Over 2 weeks (Chronic)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  4. Pain / Severity Level (1 - 10)
                </label>
                <span className="text-xs font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {severity} / 10 (
                  {severity <= 3
                    ? 'Mild'
                    : severity <= 6
                    ? 'Moderate'
                    : severity <= 8
                    ? 'Severe'
                    : 'Critical'}
                  )
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Mild)</span>
                <span>5 (Distracting)</span>
                <span>10 (Unbearable)</span>
              </div>
            </div>
          </div>

          {/* Demographics, Allergies & Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Age Group
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Infant (<1 year)">Infant (&lt;1 year)</option>
                <option value="Child (1-12 years)">Child (1-12 years)</option>
                <option value="Teenager (13-17 years)">Teenager (13-17 years)</option>
                <option value="Adult (18-64 years)">Adult (18-64 years)</option>
                <option value="Senior (65+ years)">Senior (65+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Biological Sex
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Female">Female</option>
                <option value="Female (Pregnant)">Female (Pregnant)</option>
                <option value="Male">Male</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Known Drug Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, NSAIDs, Sulfa..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Current Medications
              </label>
              <input
                type="text"
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder="e.g. Blood thinners, Metformin, SSRIs..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{errorMsg}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {isLoading && stage === 'intake' ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Symptoms &amp; Preparing Follow-Up Check...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  <span>
                    {stage === 'intake'
                      ? 'Run Clinical Interview & Allergy Safety Check'
                      : 'Re-Run Clinical Interview with Updated Intake'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* STAGE 2: Interactive Multi-Turn Clarifying Questions */}
      {stage === 'clarifying' && clarifyingQuestions.length > 0 && (
        <div
          ref={clarifyRef}
          className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Step 2 of 3 · Clinical Clarification
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  A few quick follow-ups to sharpen your triage &amp; medication safety
                </h3>
                {preliminaryImpression && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {preliminaryImpression}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleFinalizeAssessment(true)}
              className="self-start inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition whitespace-nowrap"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip &amp; Assess Now</span>
            </button>
          </div>

          <div className="space-y-4">
            {clarifyingQuestions.map((q, index) => {
              const selectedVal = answersMap[q.id] || '';
              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {index + 1}. {q.question}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Why this matters: {q.whyItMatters}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const active = selectedVal === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => selectClarifyAnswer(q.id, opt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            active
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                          }`}
                        >
                          {active ? '✓ ' : ''}
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={selectedVal}
                    onChange={(e) =>
                      setAnswersMap((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="Or type your own answer..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Answered {answeredCount} of {clarifyingQuestions.length} follow-up questions
            </span>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleFinalizeAssessment(false)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Personalized Care Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Personalized Protocol</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: Assessment Results Section */}
      {result && stage === 'result' && (
        <div
          ref={resultsRef}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          {usedFallbackEngine && (
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                Offline Clinical Engine Active — matched across 500+ global conditions &amp; patient allergy guardrails.
              </span>
            </div>
          )}

          {/* Allergy & Medication Guardrail Banner */}
          {result.patientSafetyAlerts && result.patientSafetyAlerts.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/35 border border-amber-300 dark:border-amber-800/70 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Personal Allergy &amp; Medication Guardrails</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed pl-6 list-disc">
                {result.patientSafetyAlerts.map((alert, i) => (
                  <li key={i}>{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Triage Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              result.triageLevel === 'EMERGENCY'
                ? 'bg-rose-500/10 border-rose-500/80 text-rose-900 dark:text-rose-200'
                : result.triageLevel === 'URGENT'
                ? 'bg-amber-500/10 border-amber-500/80 text-amber-900 dark:text-amber-200'
                : result.triageLevel === 'MODERATE'
                ? 'bg-blue-500/10 border-blue-500/80 text-blue-900 dark:text-blue-200'
                : 'bg-emerald-500/10 border-emerald-500/80 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {result.triageLevel === 'EMERGENCY' ? (
                <AlertOctagon className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
              ) : result.triageLevel === 'URGENT' ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                    TRIAGE LEVEL: {result.triageLevel}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-white transition"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>
                <h3 className="text-lg font-black mt-1.5">
                  {result.triageLevel === 'EMERGENCY'
                    ? 'Critical Hospital Emergency Care Required'
                    : result.triageLevel === 'URGENT'
                    ? 'Urgent Care Center Evaluation Recommended Today'
                    : result.triageLevel === 'MODERATE'
                    ? 'Schedule Doctor Consultation or Walk-in Clinic'
                    : 'Self-Care & Pharmacist Over-The-Counter Treatment'}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium max-w-xl leading-relaxed">
                  {result.summary}
                </p>
                {result.confidenceNote && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 italic">
                    Clinical Note: {result.confidenceNote}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const mapType =
                  result.triageLevel === 'EMERGENCY'
                    ? 'hospital'
                    : result.triageLevel === 'URGENT'
                    ? 'urgent_care'
                    : result.triageLevel === 'MODERATE'
                    ? 'clinic'
                    : 'pharmacy';
                onNavigateToMap(mapType);
              }}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-90 transition active:scale-95"
            >
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Locate {result.recommendedFacility}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Potential Diagnoses */}
          {result.possibleCauses?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Differential Causes Evaluated
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.possibleCauses.map((cause, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {cause.condition}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                        {cause.probability} Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {cause.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Action Plan */}
          {result.howToHandleIt && (
            <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-emerald-500" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Action Timeline: How to Handle It
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1.5">
                    0-15 Mins Immediate:
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {result.howToHandleIt.immediateSteps?.map((st, i) => (
                      <li key={i}>• {st}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1.5">
                    Next 1-2 Hours:
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {result.howToHandleIt.hourlyCare?.map((st, i) => (
                      <li key={i}>• {st}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1.5">
                    24-48 Hours Monitoring:
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {result.howToHandleIt.dailyTimeline?.map((st, i) => (
                      <li key={i}>• {st}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Natural Cures & Artificial Medicines Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-emerald-950/5 dark:bg-emerald-950/20 border border-emerald-300/70 dark:border-emerald-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>Natural &amp; Herbal Remedies</span>
              </div>
              {result.naturalRemedies?.length ? (
                <div className="space-y-3">
                  {result.naturalRemedies.map((rem, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-bold text-slate-900 dark:text-white">{rem.name}</h5>
                        {rem.type && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                            {rem.type}
                          </span>
                        )}
                      </div>
                      {rem.mechanism && (
                        <p className="text-slate-600 dark:text-slate-300">{rem.mechanism}</p>
                      )}
                      {rem.preparation && (
                        <p className="text-slate-700 dark:text-slate-200">
                          <strong>Prep: </strong>
                          {rem.preparation}
                        </p>
                      )}
                      {rem.dosage && (
                        <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Dose: {rem.dosage}
                        </p>
                      )}
                      {rem.precautions && (
                        <p className="text-amber-700 dark:text-amber-400 text-[11px]">
                          Caution: {rem.precautions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3">
                  Home herbal remedies are skipped for this high-urgency triage profile—seek immediate clinical care.
                </p>
              )}
            </div>

            <div className="bg-blue-950/5 dark:bg-blue-950/20 border border-blue-300/70 dark:border-blue-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300 font-bold text-sm">
                <Pill className="w-4 h-4 text-blue-500" />
                <span>Pharmaceutical Medicines (Active Ingredients)</span>
              </div>
              {result.pharmaceuticalMedicines?.length ? (
                <div className="space-y-3">
                  {result.pharmaceuticalMedicines.map((med, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white">
                            {med.activeIngredient}
                          </h5>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {med.brandNames}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                            med.prescriptionRequired
                              ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300'
                              : 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {med.prescriptionRequired ? 'Prescription' : 'OTC Available'}
                        </span>
                      </div>
                      {med.drugClass && (
                        <p className="text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-200">Class: </strong>
                          {med.drugClass}
                        </p>
                      )}
                      <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Dose: {med.typicalDose}
                      </p>
                      {med.mechanism && (
                        <p className="text-slate-600 dark:text-slate-300">{med.mechanism}</p>
                      )}
                      <p className="text-rose-600 dark:text-rose-400 text-[11px]">
                        Warnings: {med.warnings}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3">
                  Evaluation by a clinician is recommended before taking oral medications.
                </p>
              )}
            </div>
          </div>

          {/* Drug Interactions & Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1.5">
                Interactions &amp; Patient Profile Safety Check:
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {result.drugHerbInteractions?.map((inter, i) => (
                  <li key={i}>• {inter}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 text-xs">
              <span className="font-bold text-rose-800 dark:text-rose-400 block mb-1.5">
                Stop Home Care &amp; Seek Immediate Help If:
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {result.emergencyRedFlags?.map((rf, i) => (
                  <li key={i}>• {rf}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Local Offline Stage 1 Clarifying Question Generator
function buildLocalClarifyingStage(
  primary: string,
  additional: string[],
  severity: number
): {
  needsClarification: boolean;
  preliminaryImpression: string;
  questions: ClarifyingQuestion[];
} {
  const combined = `${primary} ${additional.join(' ')}`.toLowerCase();
  const immediateEmergencyWords = [
    'chest pain',
    'chest pressure',
    'heart attack',
    'slurred speech',
    'face droop',
    'stroke',
    'anaphylaxis',
    'throat swelling',
    'cannot breathe',
    'overdose',
    'suicidal',
    'coughing blood',
    'vomiting blood',
    'testicular torsion',
  ];

  if (severity >= 9 || immediateEmergencyWords.some((w) => combined.includes(w))) {
    return {
      needsClarification: false,
      preliminaryImpression: 'Immediate urgent clinical evaluation prioritized.',
      questions: [],
    };
  }

  const questions: ClarifyingQuestion[] = [
    {
      id: 'q-onset',
      question: `How did "${primary}" begin, and has it been worsening?`,
      options: [
        'Came on suddenly within minutes/hours',
        'Built up gradually over 1–2 days',
        'Comes and goes intermittently',
        'Steadily getting worse today',
      ],
      whyItMatters: 'Sudden onset often points toward acute vascular, stone, or infectious events.',
    },
    {
      id: 'q-systemic',
      question: 'Are you noticing any fever, chills, dizziness, or trouble keeping fluids down?',
      options: [
        'Yes — Fever (>38°C / 100.4°F) or chills',
        'Yes — Dizziness or lightheadedness',
        'Yes — Repeated vomiting / poor fluid intake',
        'No — None of these',
      ],
      whyItMatters: 'Systemic signs distinguish mild localized care from same-day clinic triage.',
    },
    {
      id: 'q-relief',
      question: 'Have you taken any home remedies or OTC medication for it yet?',
      options: [
        'Nothing taken yet',
        'OTC pain reliever helped temporarily',
        'Tried medication with zero relief',
        'Triggered after food, exertion, or new drug',
      ],
      whyItMatters: 'Helps prevent accidental double-dosing and highlights medication responsiveness.',
    },
  ];

  return {
    needsClarification: true,
    preliminaryImpression: `Running structured clinical clarification for "${primary}" alongside our 500+ condition & allergy safety index.`,
    questions,
  };
}

// Upgraded Offline Clinical Rules & Safety Engine (searches BOTH 46 Monographs & 455+ A-Z Atlas Entries)
function matchLocalSymptom(
  primary: string,
  additional: string[],
  sev: number,
  duration: string,
  ageGroup: string,
  gender: string,
  allergies: string,
  currentMedications: string,
  clarifyingAnswers: ClarifyingAnswer[]
): AssessmentResult {
  const answerText = clarifyingAnswers.map((c) => c.answer).join(' ');
  const combinedQuery = `${primary} ${additional.join(' ')} ${answerText}`.toLowerCase();
  const tokens = combinedQuery
    .split(/[^a-z0-9]+/)
    .filter(
      (t) =>
        t.length >= 3 &&
        !['and', 'with', 'the', 'for', 'mild', 'severe', 'pain', 'yes', 'none', 'these'].includes(t)
    );

  const emergencyKeywords = [
    'chest pain',
    'chest pressure',
    'heart attack',
    'crush',
    'slurred speech',
    'face droop',
    'stroke',
    'anaphylaxis',
    'throat swelling',
    'cannot breathe',
    'shortness of breath',
    'choking',
    'suicidal',
    'overdose',
    'unconscious',
    'coughing blood',
    'vomiting blood',
    'black tarry',
    'sepsis',
    'testicular',
  ];
  const isEmergencyKeyword = emergencyKeywords.some((k) => combinedQuery.includes(k));

  // 1. Score curated full monographs (SYMPTOMS_DATA)
  let bestMonograph: (typeof SYMPTOMS_DATA)[number] | null = null;
  let bestMonographScore = 0;

  for (const symp of SYMPTOMS_DATA) {
    let score = 0;
    const nameLower = symp.name.toLowerCase();
    const aliasesLower = (symp.aliases || []).join(' ').toLowerCase();
    const overviewLower = symp.overview.toLowerCase();
    const causesLower = symp.commonCauses.join(' ').toLowerCase();

    if (nameLower.includes(primary.toLowerCase()) || aliasesLower.includes(primary.toLowerCase())) {
      score += 14;
    }
    for (const tok of tokens) {
      if (nameLower.includes(tok)) score += 5;
      else if (aliasesLower.includes(tok)) score += 4;
      else if (overviewLower.includes(tok) || causesLower.includes(tok)) score += 1.5;
    }

    if (score > bestMonographScore) {
      bestMonographScore = score;
      bestMonograph = symp;
    }
  }

  // 2. Score 455+ A-Z Global Symptom Atlas entries if curated score is weak
  let bestAtlas: AtlasEntry | null = null;
  let bestAtlasScore = 0;
  for (const entry of GLOBAL_SYMPTOM_ATLAS) {
    let score = 0;
    const n = entry.name.toLowerCase();
    const al = entry.aliases.toLowerCase();
    if (n.includes(primary.toLowerCase()) || al.includes(primary.toLowerCase())) score += 12;
    for (const tok of tokens) {
      if (n.includes(tok)) score += 4.5;
      else if (al.includes(tok)) score += 3.5;
    }
    if (score > bestAtlasScore) {
      bestAtlasScore = score;
      bestAtlas = entry;
    }
  }

  // Upgrade triage if systemic fever/vomiting or suddenly worse reported in follow-ups
  const hasSystemicEscalation =
    combinedQuery.includes('fever') ||
    combinedQuery.includes('vomiting') ||
    combinedQuery.includes('getting worse') ||
    combinedQuery.includes('zero relief');

  const referenceTriage: TriageLevel =
    bestMonograph && bestMonographScore >= 3
      ? bestMonograph.triage
      : bestAtlas && bestAtlasScore >= 3.5
      ? bestAtlas.triage
      : 'COMMON';

  let triageLevel: TriageLevel = 'COMMON';
  let facility = 'Pharmacy';

  if (isEmergencyKeyword || referenceTriage === 'EMERGENCY' || sev >= 9) {
    triageLevel = 'EMERGENCY';
    facility = '24/7 Emergency Hospital';
  } else if (referenceTriage === 'URGENT' || sev >= 7 || (sev >= 6 && hasSystemicEscalation)) {
    triageLevel = 'URGENT';
    facility = 'Urgent Care Center';
  } else if (
    referenceTriage === 'MODERATE' ||
    sev >= 4 ||
    hasSystemicEscalation ||
    duration.includes('week') ||
    duration.includes('Over')
  ) {
    triageLevel = 'MODERATE';
    facility = 'Walk-in Medical Clinic';
  }

  // Personal Allergy, Demographic & Medication Safety Alerts
  const patientSafetyAlerts: string[] = [];
  const safetyNotes: string[] = [];
  const allergyLower = allergies.toLowerCase();
  const medsLower = currentMedications.toLowerCase();

  const avoidNsaid =
    allergyLower.includes('nsaid') ||
    allergyLower.includes('ibuprofen') ||
    allergyLower.includes('naproxen') ||
    allergyLower.includes('aspirin') ||
    gender.includes('Pregnant') ||
    medsLower.includes('warfarin') ||
    medsLower.includes('eliquis') ||
    medsLower.includes('xarelto') ||
    medsLower.includes('thin') ||
    medsLower.includes('lisinopril');

  if (ageGroup.includes('Infant')) {
    const msg =
      'INFANT SAFETY: Never give honey (botulism risk <12 months) or aspirin (Reye syndrome risk). Use pediatric weight-based dosing only.';
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  } else if (ageGroup.includes('Child') || ageGroup.includes('Teenager')) {
    const msg =
      'PEDIATRIC SAFETY: Avoid Aspirin/salicylates under age 18 during viral illness (Reye syndrome risk).';
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  } else if (ageGroup.includes('Senior')) {
    const msg =
      'SENIOR GUARDRAIL (65+): Use extreme caution with NSAIDs (GI bleed/kidney risk) and diphenhydramine/sedating antihistamines (fall & confusion risk).';
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  }

  if (gender.includes('Pregnant')) {
    const msg =
      'PREGNANCY ALERT: NSAIDs (Ibuprofen, Naproxen, Aspirin) and decongestants (Pseudoephedrine) are excluded; verify any herb or Rx with your OB-GYN.';
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  }

  if (allergies.trim()) {
    const msg = `ALLERGY GUARDRAIL ("${allergies.trim()}"): Flagged in your safety filter—double-check both single-ingredient and combination cough/cold labels before swallowing.`;
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  }

  if (medsLower.includes('warfarin') || medsLower.includes('eliquis') || medsLower.includes('thin')) {
    const msg =
      'ANTICOAGULANT CONFLICT: Avoid NSAIDs, Aspirin, and concentrated Ginger/Ginkgo/Turmeric supplements due to bleeding risk.';
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  } else if (
    medsLower.includes('ssri') ||
    medsLower.includes('sertraline') ||
    medsLower.includes('fluoxetine') ||
    medsLower.includes('lexapro')
  ) {
    const msg =
      'SSRI INTERACTION CHECK: Avoid Dextromethorphan (DM cough syrups) and St. John’s Wort to prevent Serotonin Syndrome.';
    patientSafetyAlerts.push(msg);
    safetyNotes.push(msg);
  } else if (currentMedications.trim()) {
    const msg = `MEDICATION INTERACTION CHECK: Confirm timing/CYP450 compatibility with "${currentMedications.trim()}" with a pharmacist.`;
    safetyNotes.push(msg);
  }

  if (safetyNotes.length === 0) {
    safetyNotes.push(
      'Check active ingredient panels carefully to avoid doubling up Acetaminophen (Tylenol) or NSAIDs across multi-symptom products.'
    );
  }

  // Filter conflicting OTC medicines when unsafe
  const filterSafeMeds = (meds: AssessmentResult['pharmaceuticalMedicines']) =>
    meds.filter((m) => {
      const ing = m.activeIngredient.toLowerCase();
      if (
        avoidNsaid &&
        (ing.includes('ibuprofen') || ing.includes('naproxen') || ing.includes('aspirin'))
      ) {
        return false;
      }
      if (allergyLower.includes('acetaminophen') || allergyLower.includes('tylenol')) {
        if (ing.includes('acetaminophen') || ing.includes('paracetamol')) return false;
      }
      if (allergyLower.includes('penicillin') && ing.includes('amoxicillin')) return false;
      if (allergyLower.includes('sulfa') && ing.includes('sulfamethoxazole')) return false;
      return true;
    });

  if (bestMonograph && bestMonographScore >= 3) {
    const safeMeds = bestMonograph.skipHomeRemedies
      ? []
      : filterSafeMeds(bestMonograph.pharmaceuticalMedicines);

    return {
      triageLevel,
      summary: `Clinical triage evaluation for "${primary}" (severity ${sev}/10, ${duration}). Matched clinical protocol: ${bestMonograph.name}.`,
      confidenceNote:
        clarifyingAnswers.length > 0
          ? `Adjusted using ${clarifyingAnswers.length} follow-up answer(s) plus ${
              allergies || currentMedications ? 'personal allergy/medication filters' : 'curated rules'
            }.`
          : undefined,
      patientSafetyAlerts,
      possibleCauses: [
        {
          condition: bestMonograph.name,
          probability: bestMonographScore >= 8 ? 'High' : 'Moderate',
          description: bestMonograph.overview,
        },
        ...bestMonograph.commonCauses.slice(0, 2).map((c) => ({
          condition: c,
          probability: 'Possible Factor',
          description: 'Recognized underlying factor requiring monitoring.',
        })),
      ],
      howToHandleIt: bestMonograph.howToHandleIt,
      naturalRemedies:
        triageLevel === 'EMERGENCY' || bestMonograph.skipHomeRemedies
          ? []
          : bestMonograph.naturalRemedies,
      pharmaceuticalMedicines: safeMeds,
      drugHerbInteractions: safetyNotes,
      emergencyRedFlags: bestMonograph.redFlags,
      recommendedFacility: facility,
    };
  }

  if (bestAtlas && bestAtlasScore >= 3.5) {
    const safeGenericMeds =
      triageLevel === 'EMERGENCY'
        ? []
        : filterSafeMeds([
            {
              activeIngredient: 'Acetaminophen (Paracetamol) — Pharmacist Guidance',
              brandNames: 'Tylenol, Panadol',
              drugClass: 'Central Analgesic / Antipyretic',
              typicalDose: 'Verify label dosing (typically 500 mg every 6h for adults, max 3000 mg/day)',
              mechanism: 'Eases discomfort and fever safely when NSAIDs are contraindicated.',
              warnings: 'Avoid if severe liver disease or duplicate acetaminophen products.',
              prescriptionRequired: false,
            },
          ]);

    return {
      triageLevel,
      summary: `Matched Global Atlas entry "${bestAtlas.name}" (${bestAtlas.icdCode}) in specialty ${bestAtlas.category.replace(
        /_/g,
        ' '
      )}. Severity ${sev}/10 over ${duration}.`,
      confidenceNote:
        'Matched from the 500+ Global Clinical Index. Re-assess with live AI or visit the suggested care level for definitive examination.',
      patientSafetyAlerts,
      possibleCauses: [
        {
          condition: `${bestAtlas.name} (${bestAtlas.icdCode})`,
          probability: 'High Match',
          description: `Associated clinical presentation keywords: ${bestAtlas.aliases}.`,
        },
      ],
      howToHandleIt: {
        immediateSteps:
          triageLevel === 'EMERGENCY'
            ? [
                'Call 911 / 112 or proceed directly to the nearest Emergency Hospital.',
                'Do not eat, drink, or self-medicate while awaiting emergency triage.',
              ]
            : [
                'Rest comfortably and monitor exact symptom onset, progression, and temperature.',
                `Note relevant medical history (${bestAtlas.name}) to share at a pharmacy or clinic.`,
              ],
        hourlyCare: [
          'Maintain steady hydration unless fluid-restricted by a physician.',
          'Avoid alcohol, sedatives, or overlapping unverified supplements.',
        ],
        dailyTimeline: [
          'Book an evaluation with a licensed clinician if not improving within 24–48 hours or immediately if red flags appear.',
        ],
      },
      naturalRemedies:
        triageLevel === 'EMERGENCY'
          ? []
          : [
              {
                name: 'Targeted Hydration & Physiological Rest',
                type: 'Foundational Supportive Care',
                mechanism: 'Supports recovery and prevents dehydration while awaiting clinical confirmation.',
                preparation: 'Water or balanced oral electrolyte solution; warm or cool compress as tolerated.',
                dosage: 'Small steady sips hourly.',
                precautions: 'Stop home measures promptly if urgent symptoms escalate.',
              },
            ],
      pharmaceuticalMedicines: safeGenericMeds,
      drugHerbInteractions: safetyNotes,
      emergencyRedFlags: [
        'Shortness of breath, chest pain, fainting, or slurred speech',
        'Persistent high fever (>39°C / 102.2°F), rigid neck, or severe confusion',
        'Rapidly worsening pain or inability to keep fluids down',
      ],
      recommendedFacility: facility,
    };
  }

  // Generic safe fallback
  const fallbackMeds =
    triageLevel === 'EMERGENCY'
      ? []
      : filterSafeMeds([
          {
            activeIngredient: 'Acetaminophen (Paracetamol) — Pharmacist Guidance',
            brandNames: 'Tylenol, Panadol',
            drugClass: 'Central Analgesic / Antipyretic',
            typicalDose:
              'Verify exact adult/pediatric dose with a pharmacist (typically 500 mg every 6h for adults, max 3000 mg/day)',
            mechanism: 'Eases fever and moderate somatic pain without stomach irritation.',
            warnings:
              'Avoid if severe liver disease or already taking combination flu products containing acetaminophen.',
            prescriptionRequired: false,
          },
        ]);

  return {
    triageLevel,
    summary: `Structured triage assessment for "${primary}" (severity ${sev}/10 over ${duration}). Because this combination warrants individualized evaluation, follow standard safety monitoring below.`,
    patientSafetyAlerts,
    possibleCauses: [
      {
        condition: `Localized or Systemic Response (${primary})`,
        probability: 'Primary Assessment',
        description:
          'Symptoms may reflect localized irritation, viral inflammation, metabolic imbalance, or musculoskeletal strain depending on clinical exam.',
      },
      {
        condition: 'Medication, Hydration, or Trigger Sensitivity',
        probability: 'Secondary Factor',
        description:
          'New medications, dehydration, sleep debt, or allergens can trigger overlapping manifestations.',
      },
    ],
    howToHandleIt: {
      immediateSteps:
        triageLevel === 'EMERGENCY'
          ? [
              'Call 911 / 112 or proceed to the nearest Emergency Room immediately.',
              'Stop exertion, sit or lie comfortably, and do not attempt self-medication before triage.',
            ]
          : [
              'Pause heavy physical exertion and rest in a comfortable, well-ventilated area.',
              'Log exact onset time, pain/fever progression, and visible changes.',
            ],
      hourlyCare:
        triageLevel === 'EMERGENCY'
          ? ['Await paramedic/ER clinical stabilization.']
          : [
              'Maintain gentle fluid hydration unless fluid-restricted by a doctor.',
              'Consult a licensed pharmacist or clinic clinician before combining OTC drugs.',
            ],
      dailyTimeline: [
        'Seek in-person medical examination if symptoms worsen, spread, or fail to steadily improve over 24–48 hours.',
      ],
    },
    naturalRemedies:
      triageLevel === 'EMERGENCY'
        ? []
        : [
            {
              name: 'Oral Hydration + Thermal Comfort (Warm or Cool Compress)',
              type: 'Foundational Supportive Care',
              mechanism:
                'Supports cellular circulation while soothing localized surface inflammation safely without systemic toxicity.',
              preparation:
                'Plain water or oral electrolytes; apply damp warm/cool compress based on soreness vs acute swelling.',
              dosage: 'Steady small sips throughout the day.',
              precautions: 'Stop home measures promptly if systemic red flags develop.',
            },
          ],
    pharmaceuticalMedicines: fallbackMeds,
    drugHerbInteractions: safetyNotes,
    emergencyRedFlags: [
      'Chest pain, difficulty breathing, choking, or bluish lips/face',
      'Sudden confusion, fainting, slurred speech, or one-sided weakness',
      'High persistent fever >39.4°C (103°F) with stiff neck or spreading purple rash',
      'Severe worsening pain or inability to keep fluids down for >24 hours',
    ],
    recommendedFacility: facility,
  };
}
