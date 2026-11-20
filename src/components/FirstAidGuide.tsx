import React, { useState } from 'react';
import {
  Siren,
  PhoneCall,
  HeartPulse,
  AlertOctagon,
  Flame,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MapPin
} from 'lucide-react';

interface FirstAidGuideProps {
  onNavigateToMap: (facilityType: 'hospital') => void;
}

export const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ onNavigateToMap }) => {
  const [openCard, setOpenCard] = useState<string>('cpr');

  const protocols = [
    {
      id: 'cpr',
      title: 'Adult CPR (Cardiopulmonary Resuscitation)',
      badge: 'Unconscious / No Breathing',
      steps: [
        'Check responsiveness: Tap shoulders firmly and shout: "Are you okay?".',
        'Call 911 / 112 immediately. If someone is nearby, point and order: "You, call 911 and get an AED!".',
        'Place heel of one hand in the center of the chest, interlock fingers of the other hand over it.',
        'Push HARD and FAST: Compress at 100-120 beats per minute (to the beat of "Stayin\' Alive") at least 5-6 cm (2 inches) deep.',
        'Allow chest to recoil fully after each compression. Do not stop until paramedics arrive or AED is applied.'
      ]
    },
    {
      id: 'choking',
      title: 'Choking / Heimlich Maneuver',
      badge: 'Silent Gasping / Airway Block',
      steps: [
        'Confirm choking: Ask "Can you speak?". If they nod and cannot speak, act immediately.',
        'Deliver 5 firm back blows between shoulder blades with heel of your hand.',
        'If airway is still blocked, deliver 5 abdominal thrusts: Stand behind person, wrap arms around waist, make a fist above navel, pull sharply inward and upward.',
        'Repeat alternating 5 back blows and 5 abdominal thrusts until object is expelled or person becomes unconscious (if unconscious, begin CPR).'
      ]
    },
    {
      id: 'anaphylaxis',
      title: 'Severe Anaphylaxis / EpiPen Protocol',
      badge: 'Throat Swelling / Stridor',
      steps: [
        'Remove safety release cap from the Epinephrine auto-injector.',
        'Swing and press orange tip firmly against outer mid-thigh at a 90-degree angle (works through clothing).',
        'Hold firmly in place for 3 to 10 seconds until click is heard and medicine dispenses.',
        'Remove auto-injector and massage thigh injection site for 10 seconds.',
        'Call 911/112 immediately. Lay person flat with legs elevated unless they are struggling to breathe.'
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Arterial Bleeding / Tourniquet',
      badge: 'Spurting Blood / Deep Cut',
      steps: [
        'Apply immediate direct pressure with clean cloth or bare hands without letting up.',
        'If bleeding is from an arm or leg and does not stop: Place tourniquet 5-7 cm above the wound (never on a joint).',
        'Tighten windlass rod until bright red bleeding completely stops and distal pulse vanishes. Lock rod in clip.',
        'Write the exact time (e.g. 14:35) on the tourniquet band for trauma surgeons.'
      ]
    },
    {
      id: 'seizure',
      title: 'Grand Mal Seizure Protocol',
      badge: 'Convulsions / Jerking',
      steps: [
        'Clear hard or sharp objects away from the surrounding floor.',
        'DO NOT HOLD THE PERSON DOWN OR RESTRAIN THEIR MOVEMENTS.',
        'DO NOT PUT ANYTHING IN THEIR MOUTH (they cannot swallow their tongue, but teeth can break).',
        'Gently turn the person onto their side (recovery position) once convulsions ease to keep airway clear of saliva.',
        'Time the seizure: If lasting >5 minutes or repeats without waking up, call 911 immediately.'
      ]
    },
    {
      id: 'stroke',
      title: 'Acute Stroke Recognition (BE-FAST Emergency)',
      badge: 'Facial Droop / Arm Weakness / Speech',
      steps: [
        'B (Balance): Sudden loss of balance or coordination; E (Eyes): sudden blurred or lost vision.',
        'F (Face): Ask them to smile—check if one side of the mouth droops.',
        'A (Arms): Ask them to raise both arms—check if one drifts downward.',
        'S (Speech): Listen for slurred words or inability to repeat a simple sentence.',
        'T (Time): CALL 911 IMMEDIATELY and note the EXACT clock time they were last seen completely normal (critical for clot-busting tPA!). Do NOT give food, water, or aspirin.'
      ]
    },
    {
      id: 'overdose',
      title: 'Suspected Opioid Overdose & Naloxone (Narcan)',
      badge: 'Pinpoint Pupils / Slow Breathing',
      steps: [
        'Shout and rub sternum knuckles firmly to check responsiveness; call 911 immediately.',
        'Spray 1 full dose of Naloxone (Narcan 4mg nasal spray) into ONE nostril immediately (safe even if unsure).',
        'Tilt head back, lift chin, give 1 rescue breath every 5 seconds if trained (or perform chest compressions if no pulse).',
        'If no response after 2-3 minutes, spray a second dose into the OTHER nostril. Stay until paramedics arrive (overdose can rebound once naloxone wears off in 30-90 mins).'
      ]
    },
    {
      id: 'heatstroke',
      title: 'Heat Stroke / Extreme Hyperthermia Rapid Cooling',
      badge: 'Confusion + Temp >40°C (104°F)',
      steps: [
        'CALL 911 IMMEDIATELY. Cool the victim BEFORE moving ("Cool first, transport second").',
        'Move into shade/AC, strip heavy outer clothing, and immerse in cold/ice water bath if available.',
        'If no tub: cover skin with cold wet sheets, fan vigorously, and place ice packs against neck, armpits, and groin.',
        'Do NOT give oral water or juice if confused/drowsy, and do NOT give acetaminophen or ibuprofen (ineffective in heat stroke).'
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2">
              <Siren className="w-3.5 h-3.5" />
              <span>Emergency First Aid Station</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Life-Saving First Aid Protocols
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Standard resuscitation and trauma guidance for bystanders before emergency medical services arrive.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:911"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>Quick Dial 911 / 112</span>
            </a>

            <button
              onClick={() => onNavigateToMap('hospital')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition"
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>24/7 Hospitals</span>
            </button>
          </div>
        </div>

        {/* Protocols Accordion */}
        <div className="mt-6 space-y-3">
          {protocols.map((proto) => {
            const isOpen = openCard === proto.id;
            return (
              <div
                key={proto.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <button
                  onClick={() => setOpenCard(isOpen ? '' : proto.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {proto.title}
                    </h3>
                    <span className="hidden sm:inline-block text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full">
                      {proto.badge}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm border-t border-rose-100 dark:border-rose-900/40">
                    <ol className="space-y-2.5 mt-2">
                      {proto.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-black text-rose-600 dark:text-rose-400 shrink-0 bg-rose-100 dark:bg-rose-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
