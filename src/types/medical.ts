export type TriageLevel = 'COMMON' | 'MODERATE' | 'URGENT' | 'EMERGENCY';

export type BodyCategory =
  | 'all'
  | 'head_neurological'
  | 'respiratory'
  | 'digestive'
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'skin_dermatology'
  | 'eyes_ears_throat'
  | 'mental_sleep'
  | 'emergency_firstaid'
  | 'pediatric_allergy'
  | 'endocrine_metabolic'
  | 'urology_renal'
  | 'infectious_disease'
  | 'dental_oral'
  | 'womens_mens_health';

export interface NaturalRemedy {
  name: string;
  type: string; // e.g. "Herbal Infusion", "Topical Compresses", "Dietary Supplement", "Acupressure"
  mechanism: string;
  preparation: string;
  dosage: string;
  precautions: string;
}

export interface PharmaceuticalMedicine {
  activeIngredient: string;
  brandNames: string;
  drugClass: string;
  typicalDose: string;
  mechanism: string;
  warnings: string;
  prescriptionRequired: boolean;
}

export interface HowToHandlePlan {
  immediateSteps: string[]; // Minute 0 - 15
  hourlyCare: string[]; // Next 1 - 2 hours
  dailyTimeline: string[]; // 24 - 48 hours & recovery
}

export interface SymptomEntry {
  id: string;
  name: string;
  aliases?: string[];
  icdCode?: string;
  isAiGenerated?: boolean;
  category: BodyCategory;
  triage: TriageLevel;
  urgencySummary: string;
  overview: string;
  commonCauses: string[];
  howToHandleIt: HowToHandlePlan;
  naturalRemedies: NaturalRemedy[];
  pharmaceuticalMedicines: PharmaceuticalMedicine[];
  redFlags: string[];
  skipHomeRemedies?: boolean; // For EMERGENCY conditions
  recommendedFacilityType: 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital';
}

export interface CareFacility {
  id: string;
  name: string;
  type: 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital';
  primaryTypeLabel?: string;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  rating?: number;
  reviewsCount?: number;
  emergency247: boolean;
  weekdayDescriptions?: string[];
  todayHours?: string;
  businessStatus?: string;
  googleMapsUri?: string;
  directionsUri?: string;
  distanceKm?: number;
  isOpenNow?: boolean | null;
  statusText: string;
  statusBadgeColor: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';
}

export interface AssessmentResult {
  triageLevel: TriageLevel;
  summary: string;
  confidenceNote?: string;
  patientSafetyAlerts?: string[];
  possibleCauses: {
    condition: string;
    probability: string;
    description: string;
  }[];
  howToHandleIt: HowToHandlePlan;
  naturalRemedies: NaturalRemedy[];
  pharmaceuticalMedicines: PharmaceuticalMedicine[];
  drugHerbInteractions: string[];
  emergencyRedFlags: string[];
  recommendedFacility: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  options: string[];
  whyItMatters: string;
}

export interface ClarifyingAnswer {
  question: string;
  answer: string;
}

export interface ClarifyResponsePayload {
  needsClarification: boolean;
  preliminaryImpression?: string;
  questions?: ClarifyingQuestion[];
  assessment?: AssessmentResult;
  fallback?: boolean;
}

export interface HopeBibleVerse {
  reference: string;
  text: string;
}

export interface HopeChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  crisisDetected?: boolean;
  groundingStep?: string | null;
  bibleVerse?: HopeBibleVerse | null;
}

export type HopeFocusArea = 'general' | 'crisis' | 'distress' | 'addiction';

export interface HopeChatSession {
  id: string;
  title: string;
  focusArea: HopeFocusArea;
  updatedAt: string;
  messages: HopeChatMessage[];
}

export interface RecoveryLogEntry {
  id: string;
  dateISO: string;
  moodScore: number; // 1 (Heavy/Low) to 5 (Steady/Peaceful)
  moodLabel: string;
  cravingLevel: number; // 0 (None) to 10 (Intense)
  triggers: string[];
  note: string;
  gratitude?: string;
  verseRef?: string;
}

export interface SobrietyProfile {
  goalLabel: string;
  startDateISO: string; // YYYY-MM-DD
  longestStreakDays: number;
}

export interface HopeRecoveryContextPayload {
  streakDays?: number;
  goalLabel?: string;
  recentMoodLabel?: string;
  recentCraving?: number;
  recentTriggers?: string[];
  latestNote?: string;
}

