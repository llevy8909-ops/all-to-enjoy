import React, { useState } from 'react';
import {
  Leaf,
  Pill,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck
} from 'lucide-react';

interface MedicineComparison {
  condition: string;
  natural: {
    name: string;
    substance: string;
    pros: string;
    bestFor: string;
    onset: string;
    dosage: string;
  };
  pharmaceutical: {
    activeIngredient: string;
    brands: string;
    pros: string;
    bestFor: string;
    onset: string;
    dosage: string;
  };
  interactionWarning: string;
}

export const MedicineCabinet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const comparisons: MedicineComparison[] = [
    {
      condition: 'Nausea & Motion Sickness',
      natural: {
        name: 'Fresh Ginger Root Extract (Zingiber officinale)',
        substance: 'Gingerols & Shogaols',
        pros: 'Non-drowsy, safe during pregnancy, accelerates gastric motility.',
        bestFor: 'Mild travel sickness, morning sickness, post-prandial fullness.',
        onset: '20 to 30 minutes',
        dosage: '1 to 2 grams dried root or 1 cup concentrated tea.',
      },
      pharmaceutical: {
        activeIngredient: 'Dimenhydrinate / Meclizine',
        brands: 'Dramamine, Bonine',
        pros: 'High potency vestibular suppression, prevents vomiting during turbulence/rough seas.',
        bestFor: 'Severe motion sickness, boat voyages, vertigo.',
        onset: '30 to 60 minutes',
        dosage: '50-100 mg orally 1 hour before travel.',
      },
      interactionWarning: 'High doses of ginger combined with blood thinners (Warfarin/Aspirin) may slightly increase bleeding tendency.',
    },
    {
      condition: 'Acute Muscle Soreness & Head Pain',
      natural: {
        name: 'Curcumin (Turmeric) with Piperine & White Willow Bark',
        substance: 'Curcuminoids & Natural Salicin',
        pros: 'Lowers chronic systemic inflammation without gastric ulceration.',
        bestFor: 'Mild joint soreness, post-exercise recovery, tension tightness.',
        onset: '1 to 2 hours',
        dosage: '500-1000 mg standardized extract with black pepper.',
      },
      pharmaceutical: {
        activeIngredient: 'Ibuprofen (NSAID)',
        brands: 'Advil, Motrin IB',
        pros: 'Fast, powerful anti-inflammatory and pain relief within 30 minutes.',
        bestFor: 'Acute throbbing pain, menstrual cramps, sprains, dental aches.',
        onset: '20 to 30 minutes',
        dosage: '200 to 400 mg with food every 6 hours.',
      },
      interactionWarning: 'Do NOT combine high-dose White Willow Bark with prescription NSAIDs or blood thinners (compounds salicylate load).',
    },
    {
      condition: 'Acid Reflux & Heartburn',
      natural: {
        name: 'Deglycyrrhizinated Licorice (DGL) & Slippery Elm',
        substance: 'Plant Mucilage & Flavonoids',
        pros: 'Protects and coats esophageal and stomach mucosa without altering gastric acid pH.',
        bestFor: 'Pre-meal coating, mild indigestion, sensitive stomach.',
        onset: '10 to 15 minutes',
        dosage: 'Chew 1-2 DGL tablets 20 mins before meals.',
      },
      pharmaceutical: {
        activeIngredient: 'Famotidine / Omeprazole',
        brands: 'Pepcid AC, Prilosec OTC',
        pros: 'Direct chemical suppression of gastric acid production for 12 to 24 hours.',
        bestFor: 'Frequent nighttime GERD, erosive esophagitis, sour regurgitation.',
        onset: '30 to 60 minutes (Famotidine) / 1-3 days (Omeprazole)',
        dosage: 'Famotidine 20 mg 1-2 times daily or Omeprazole 20 mg morning.',
      },
      interactionWarning: 'Take mucilage-rich herbal teas at least 2 hours apart from pharmaceutical tablets to avoid slowing pill absorption.',
    },
    {
      condition: 'Dry Disruptive Cough',
      natural: {
        name: 'Raw Honey & Thyme (Thymus vulgaris)',
        substance: 'Thymol & Invert Sugars',
        pros: 'Natural antimicrobial coating; clinically proven as effective as dextromethorphan in pediatric studies.',
        bestFor: 'Nighttime scratchy cough, dry throat tickle, viral recovery.',
        onset: '5 to 10 minutes',
        dosage: '1 to 2 teaspoons raw honey (never under 12 months of age).',
      },
      pharmaceutical: {
        activeIngredient: 'Dextromethorphan HBr',
        brands: 'Delsym, Robitussin Cough',
        pros: 'Suppresses cough reflex directly at the medullary center in the brain.',
        bestFor: 'Severe paroxysmal non-productive coughing interrupting sleep.',
        onset: '15 to 30 minutes',
        dosage: '30 mg orally every 6 to 8 hours (max 120 mg/day).',
      },
      interactionWarning: 'NEVER combine Dextromethorphan with MAOI or SSRI antidepressants (risk of severe Serotonin Syndrome).',
    },
    {
      condition: 'Mild Insomnia & Circadian Sleep Onset',
      natural: {
        name: 'Chamomile, Valerian Root & Magnesium Glycinate',
        substance: 'Apigenin, Valerenic Acid, Elemental Magnesium',
        pros: 'Non-addictive, relaxes muscle tension, calms nocturnal mental chatter.',
        bestFor: 'Stress-related sleeplessness, evening restlessness.',
        onset: '45 to 60 minutes',
        dosage: '200-400 mg magnesium glycinate + warm infusion.',
      },
      pharmaceutical: {
        activeIngredient: 'Melatonin / Doxylamine Succinate',
        brands: 'Nature Made Melatonin, Unisom SleepTabs',
        pros: 'Rapidly resets circadian clock; strong histamine H1 antagonism.',
        bestFor: 'Jet lag shift work, acute sleep deprivation.',
        onset: '30 to 45 minutes',
        dosage: 'Melatonin 1-3 mg or Doxylamine 25 mg at bedtime.',
      },
      interactionWarning: 'Do not combine sedating antihistamines with alcohol or benzodiazepines.',
    },
    {
      condition: 'Seasonal Allergies & Hay Fever',
      natural: {
        name: 'Quercetin + Stinging Nettle Leaf',
        substance: 'Quercetin Flavonoid & Urtica Phytocompounds',
        pros: 'Stabilizes mast cell histamine release naturally with zero drowsiness.',
        bestFor: 'Preventive seasonal sinus congestion and itchy palate.',
        onset: 'Daily cumulative stabilization (1-2 weeks)',
        dosage: 'Quercetin 500 mg twice daily.',
      },
      pharmaceutical: {
        activeIngredient: 'Cetirizine / Fluticasone Propionate Spray',
        brands: 'Zyrtec, Flonase',
        pros: 'Directly blocks H1 receptors within 1 hour or halts nasal eosinophilic inflammation.',
        bestFor: 'Severe pollen storms, watery eyes, nasal blockage.',
        onset: '30-60 minutes (Cetirizine) / 12-48 hours (Fluticasone)',
        dosage: 'Cetirizine 10 mg daily or Flonase 2 sprays/nostril daily.',
      },
      interactionWarning: 'Avoid older 1st-gen Diphenhydramine (Benadryl) before driving or in adults 65+.',
    },
    {
      condition: 'Migraine & Vascular Headache',
      natural: {
        name: 'Topical 10% Peppermint Oil + Feverfew / Riboflavin (B2)',
        substance: 'Menthol TRPM8 & Parthenolide',
        pros: 'Topical cooling relaxes scalp pericranial muscles; B2 + magnesium lower monthly frequency.',
        bestFor: 'Tension-migraine overlap and long-term prophylaxis.',
        onset: '15-30 minutes (topical menthol) / 4 weeks (B2 preventive)',
        dosage: 'Magnesium 400 mg + Riboflavin 400 mg daily.',
      },
      pharmaceutical: {
        activeIngredient: 'Sumatriptan / Ibuprofen + Caffeine',
        brands: 'Imitrex (Rx), Excedrin Migraine',
        pros: 'Triptans directly constrict dilated meningeal blood vessels and halt calcitonin gene-related peptide (CGRP) surges.',
        bestFor: 'Throbbing unilateral migraine with nausea and photophobia.',
        onset: '30 to 60 minutes when taken at first aura/twinge',
        dosage: 'Sumatriptan 50-100 mg Rx at onset; limit Excedrin strictly to <=2 days/week.',
      },
      interactionWarning: 'Do NOT combine Triptans with MAOIs or multiple serotonergic drugs without prescriber approval.',
    },
    {
      condition: 'Urinary Tract Discomfort & Bladder Irritation',
      natural: {
        name: 'D-Mannose Powder + Unsweetened Cranberry Extract',
        substance: 'Monosaccharide D-Mannose & A-Type PACs',
        pros: 'Flushes floating E. coli bacteria cleanly without disturbing beneficial vaginal/gut flora.',
        bestFor: 'Recurrent UTI prevention and hydration washout.',
        onset: '24 to 48 hours supportive washout',
        dosage: '2 grams D-mannose in water twice daily.',
      },
      pharmaceutical: {
        activeIngredient: 'Phenazopyridine (Symptom Relief) / Nitrofurantoin (Rx Cure)',
        brands: 'AZO Standard, Macrobid (Rx)',
        pros: 'Phenazopyridine numbs burning bladder nerves rapidly; Nitrofurantoin eradicates bacterial DNA.',
        bestFor: 'Confirmed active bacterial cystitis with painful urination.',
        onset: '30 minutes (AZO pain relief) / 24-48 hours (antibiotic)',
        dosage: 'AZO max 2 days while obtaining Rx antibiotic course.',
      },
      interactionWarning: 'Never mask fever or back/flank pain with AZO—flank pain signals kidney infection requiring urgent antibiotics.',
    },
    {
      condition: 'Eczema & Itchy Inflamed Skin Patches',
      natural: {
        name: 'Colloidal Oatmeal Soaks + Unscented Ceramide Balm',
        substance: 'Beta-Glucans, Avenanthramides, Skin-Identical Ceramides',
        pros: 'Rebuilds damaged stratum corneum barrier without steroid skin thinning.',
        bestFor: 'Daily maintenance and mild dryness in adults and infants.',
        onset: '15 minutes itch relief; 1-2 weeks barrier repair',
        dosage: 'Apply within 3 minutes after every lukewarm shower.',
      },
      pharmaceutical: {
        activeIngredient: 'Hydrocortisone 1% Cream (OTC)',
        brands: 'Cortizone-10 Intensive',
        pros: 'Rapidly shuts down acute red angry immune itch flares.',
        bestFor: 'Short targeted bursts on inflamed non-facial skin plaques.',
        onset: '12 to 24 hours',
        dosage: 'Thin film twice daily for up to 7-14 days under barrier balm.',
      },
      interactionWarning: 'Never apply hydrocortisone cream onto fungal ringworm infections (causes spread) or broken weeping infection.',
    },
    {
      condition: 'Everyday Stress & Autonomic Nervous Tension',
      natural: {
        name: 'L-Theanine + Lemon Balm / Passionflower',
        substance: 'L-Theanine Amino Acid & Rosmarinic Acid',
        pros: 'Encourages calm alpha brainwaves and GABA tone without next-day grogginess.',
        bestFor: 'Daytime focus tension, mild nervousness, social jitteriness.',
        onset: '30 to 45 minutes',
        dosage: 'L-Theanine 100-200 mg orally as needed.',
      },
      pharmaceutical: {
        activeIngredient: 'Hydroxyzine or Propranolol (Clinic Prescribed)',
        brands: 'Vistaril, Inderal',
        pros: 'Hydroxyzine calms acute central arousal without benzodiazepine addiction risk; Propranolol stops racing heartbeat.',
        bestFor: 'Acute severe anxiety attacks or physical stage-fright tremor.',
        onset: '20 to 45 minutes',
        dosage: 'Physician prescribed PRN dosing only.',
      },
      interactionWarning: 'Avoid Propranolol if asthmatic; use the Hope & Support Sanctuary tab anytime distress feels heavy.',
    }
  ];

  const filtered = comparisons.filter(
    (c) =>
      c.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.natural.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pharmaceutical.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pharmaceutical.brands.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Evidence-Based Therapeutics ({comparisons.length} Pairings)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Natural vs. Conventional Medicine Cabinet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Side-by-side pharmacological comparisons: when to choose herbal solutions and when to use targeted OTC/Rx pharmaceutical drugs.
            </p>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search condition or medication..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="mt-6 space-y-6">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No comparisons matched &ldquo;{searchTerm}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
              >
                Show All {comparisons.length} Comparisons
              </button>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {item.condition}
                  </h3>
                  <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
                    Comparative Guide
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Natural Herb Side */}
                  <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      <span>Natural / Herbal Route</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.natural.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      Active: {item.natural.substance}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">
                      <strong className="text-emerald-700 dark:text-emerald-400">Advantages: </strong>
                      {item.natural.pros}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <div><strong>Best for:</strong> {item.natural.bestFor}</div>
                      <div><strong>Speed:</strong> {item.natural.onset}</div>
                      <div><strong>Dosing:</strong> {item.natural.dosage}</div>
                    </div>
                  </div>

                  {/* Pharmaceutical Side */}
                  <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
                      <Pill className="w-4 h-4 text-blue-500" />
                      <span>Conventional / OTC Route</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.pharmaceutical.activeIngredient}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      Brands: {item.pharmaceutical.brands}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">
                      <strong className="text-blue-700 dark:text-blue-400">Advantages: </strong>
                      {item.pharmaceutical.pros}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <div><strong>Best for:</strong> {item.pharmaceutical.bestFor}</div>
                      <div><strong>Speed:</strong> {item.pharmaceutical.onset}</div>
                      <div><strong>Dosing:</strong> {item.pharmaceutical.dosage}</div>
                    </div>
                  </div>
                </div>

                {/* Safety Warning */}
                <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Interaction Safety Rule: </strong>{item.interactionWarning}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
