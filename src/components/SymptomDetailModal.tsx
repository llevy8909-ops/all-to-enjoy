import React, { useEffect } from 'react';
import {
  X,
  AlertOctagon,
  PhoneCall,
  Clock,
  Leaf,
  Pill,
  ShieldAlert,
  ArrowRight,
  MapPin,
  FileText,
  Sparkles,
} from 'lucide-react';
import { SymptomEntry } from '../types/medical';

interface SymptomDetailModalProps {
  symptom: SymptomEntry | null;
  onClose: () => void;
  onNavigateToMap: (facilityType: 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital') => void;
  onOpenSymptomChecker: (symptomName: string) => void;
}

export const SymptomDetailModal: React.FC<SymptomDetailModalProps> = ({
  symptom,
  onClose,
  onNavigateToMap,
  onOpenSymptomChecker,
}) => {
  // Close modal on Escape key and lock background body scroll cleanly
  useEffect(() => {
    if (!symptom) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [symptom, onClose]);

  if (!symptom) return null;

  const isEmergency = symptom.triage === 'EMERGENCY';
  const isUrgent = symptom.triage === 'URGENT';
  const isModerate = symptom.triage === 'MODERATE';

  const triageBadgeColor = isEmergency
    ? 'bg-rose-500 text-white'
    : isUrgent
    ? 'bg-amber-500 text-slate-950 font-bold'
    : isModerate
    ? 'bg-blue-600 text-white'
    : 'bg-emerald-600 text-white';

  const triageBorderColor = isEmergency
    ? 'border-rose-500'
    : isUrgent
    ? 'border-amber-500'
    : isModerate
    ? 'border-blue-500'
    : 'border-emerald-500';

  const facilityButtonLabel =
    symptom.recommendedFacilityType === 'pharmacy'
      ? 'Pharmacy'
      : symptom.recommendedFacilityType === 'hospital'
      ? 'Hospital ER'
      : symptom.recommendedFacilityType === 'urgent_care'
      ? 'Urgent Care'
      : 'Walk-in Clinic';

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="symptom-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Triage Banner */}
        <div
          className={`sticky top-0 z-20 px-6 py-4 border-b ${triageBorderColor} bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-start justify-between gap-4`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full ${triageBadgeColor}`}
              >
                {symptom.triage === 'EMERGENCY'
                  ? 'CRITICAL EMERGENCY'
                  : symptom.triage === 'URGENT'
                  ? 'URGENT CARE'
                  : symptom.triage === 'MODERATE'
                  ? 'SEE A DOCTOR'
                  : 'COMMON / HOME CARE'}
              </span>

              {symptom.icdCode && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  ICD-10: {symptom.icdCode}
                </span>
              )}

              {symptom.isAiGenerated && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Clinical Monograph</span>
                </span>
              )}

              {symptom.aliases && symptom.aliases.length > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Also known as: {symptom.aliases.join(', ')}
                </span>
              )}
            </div>

            <h2
              id="symptom-modal-title"
              className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white"
            >
              {symptom.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Emergency Alert Banner for EMERGENCY conditions */}
          {isEmergency && (
            <div className="rounded-2xl bg-rose-500/10 border-2 border-rose-500/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <AlertOctagon className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                    LIFE-THREATENING EMERGENCY
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                    Do not attempt home remedies or delay care. Call emergency medical dispatch immediately or go to the nearest trauma hospital.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="tel:911"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 911 / 112</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToMap('hospital');
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Nearest Hospital</span>
                </button>
              </div>
            </div>
          )}

          {/* Overview & Common Causes */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Clinical Overview &amp; Pathophysiology
            </h4>
            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-normal">
              {symptom.overview}
            </p>

            {symptom.commonCauses.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80">
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  Common Underlying Causes:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {symptom.commonCauses.map((cause, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg"
                    >
                      • {cause}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* How to Handle It (Action Steps by Time) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                How to Handle It: Step-by-Step Action Plan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Immediate Steps */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Minute 0 – 15: Immediate</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {symptom.howToHandleIt.immediateSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next 1-2 Hours */}
              <div className="bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Next 1 – 2 Hours: Care</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {symptom.howToHandleIt.hourlyCare.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-cyan-600 shrink-0">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Daily Timeline */}
              <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>24 – 48 Hours: Recovery</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {symptom.howToHandleIt.dailyTimeline.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-purple-600 shrink-0">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Side-by-Side: Natural & Herbal Cures VS Artificial / Pharmaceutical Medicines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Treatment Protocols: Natural &amp; Pharmaceutical Medicine</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Evidence-based comparisons
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Natural & Herbal Remedies */}
              <div className="bg-emerald-950/5 dark:bg-emerald-950/20 border border-emerald-300/80 dark:border-emerald-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-emerald-200 dark:border-emerald-800/50">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-200">
                      Natural &amp; Herbal Cures
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Botanicals, teas, compressions, dietary nutrients
                    </p>
                  </div>
                </div>

                {symptom.naturalRemedies.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">
                    No safe home remedies for this acute condition—seek urgent/emergency hospital care.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {symptom.naturalRemedies.map((remedy, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/40 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                            {remedy.name}
                          </h5>
                          <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md shrink-0">
                            {remedy.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                          <strong className="text-slate-700 dark:text-slate-200">How it works: </strong>
                          {remedy.mechanism}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs grid grid-cols-1 gap-1 text-slate-600 dark:text-slate-400">
                          <div>
                            <strong className="text-slate-700 dark:text-slate-300">Preparation: </strong>
                            {remedy.preparation}
                          </div>
                          <div>
                            <strong className="text-slate-700 dark:text-slate-300">Dose: </strong>
                            {remedy.dosage}
                          </div>
                          <div className="text-amber-700 dark:text-amber-400 text-[11px]">
                            <strong>Caution: </strong>
                            {remedy.precautions}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Artificial / Conventional Pharmaceutical Medicines */}
              <div className="bg-blue-950/5 dark:bg-blue-950/20 border border-blue-300/80 dark:border-blue-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-200 dark:border-blue-800/50">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-blue-900 dark:text-blue-200">
                      Pharmaceutical &amp; OTC Medicines
                    </h4>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400">
                      Active compounds, standard adult doses &amp; precautions
                    </p>
                  </div>
                </div>

                {symptom.pharmaceuticalMedicines.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">
                    No oral OTC medication indicated. Physical first aid or emergency room care required.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {symptom.pharmaceuticalMedicines.map((med, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-blue-100 dark:border-blue-900/40 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                              {med.activeIngredient}
                            </h5>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              Brands: {med.brandNames}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                              med.prescriptionRequired
                                ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            }`}
                          >
                            {med.prescriptionRequired ? 'Prescription' : 'OTC Available'}
                          </span>
                        </div>

                        <div className="mt-2.5 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Class: </span>
                          {med.drugClass}
                        </div>

                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Typical Dose: </span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {med.typicalDose}
                          </span>
                        </div>

                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Mechanism: </span>
                          {med.mechanism}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-rose-700 dark:text-rose-400">
                          <strong>Safety &amp; Warnings: </strong>
                          {med.warnings}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Red Flag Warning Box */}
          <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2 text-rose-800 dark:text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Red Flag Warning Signs: See a Doctor or ER Immediately If:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 mt-2">
              {symptom.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenSymptomChecker(symptom.name);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Assess in AI Symptom Scout</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMap(symptom.recommendedFacilityType);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                <span>Find Nearest {facilityButtonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
