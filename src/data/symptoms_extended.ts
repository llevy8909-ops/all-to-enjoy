import { SymptomEntry } from '../types/medical';

export const SYMPTOMS_EXTENDED_DATA: SymptomEntry[] = [
  // ======================== EMERGENCY & CRITICAL CONDITIONS ========================
  {
    id: 'sepsis-septic-shock',
    name: 'Suspected Sepsis (Bloodstream Infection)',
    aliases: ['Septic Shock', 'Blood Poisoning', 'Systemic Inflammatory Response'],
    icdCode: 'A41.9',
    category: 'emergency_firstaid',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: High fever or abnormally low temperature with confusion, racing pulse, shivering, and mottled skin.',
    overview: 'A life-threatening dysregulated immune response to an infection that causes organ dysfunction, dangerous drops in blood pressure, and cellular hypoxia.',
    commonCauses: [
      'Untreated pneumonia, kidney infection (pyelonephritis), or abdominal perforation',
      'Infected wound, cellulitis, or indwelling catheter infection'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CALL 911 / 112 OR GO TO EMERGENCY HOSPITAL IMMEDIATELY. Inform triage: "Possible sepsis."',
        'Do NOT attempt herbal remedies or wait to see if fever breaks.',
        'Keep patient lying flat; loosen tight clothing and monitor consciousness.'
      ],
      hourlyCare: [
        'Hospital team administers rapid broad-spectrum IV antibiotics, blood cultures, and IV crystalloid fluids within the first hour.'
      ],
      dailyTimeline: [
        'Inpatient ICU monitoring of blood pressure, lactate, and kidney/liver function.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Broad-Spectrum IV Antibiotics + IV Fluid Resuscitation',
        brandNames: 'Hospital Critical Care Protocol (Piperacillin-Tazobactam / Vancomycin)',
        drugClass: 'Intravenous Antimicrobial & Hemodynamic Support',
        typicalDose: 'Administered emergently via IV catheter in hospital ED',
        mechanism: 'Eradicates underlying bacterial source rapidly while restoring intravascular perfusion.',
        warnings: 'Every 1-hour delay in IV antibiotics significantly increases mortality. Seek ER immediately.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Slurred speech, new confusion, or extreme drowsiness',
      'Extreme shivering or body temp below 36°C (96.8°F) or above 38.5°C',
      'Passing no urine for 12+ hours',
      'Pale, mottled, bluish, or cold extremities'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'pulmonary-embolism',
    name: 'Pulmonary Embolism (Lung Blood Clot)',
    aliases: ['PE', 'Blood Clot in Lung', 'DVT Complication'],
    icdCode: 'I26.9',
    category: 'cardiovascular',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Sudden unexplained shortness of breath, sharp chest pain worse on inhaling, rapid heart rate, coughing blood.',
    overview: 'A blockage in one of the pulmonary arteries in the lungs, usually caused by a blood clot (deep vein thrombosis) traveling from the legs.',
    commonCauses: [
      'Prolonged immobility (long flights, recent surgery, bed rest)',
      'Estrogen therapy, pregnancy, active cancer, or genetic clotting disorders'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CALL 911 / 112 IMMEDIATELY. Do NOT drive yourself to the hospital.',
        'Keep the patient sitting slightly upright and completely still to avoid dislodging more clot.',
        'Do NOT massage a swollen calf if leg DVT is suspected.'
      ],
      hourlyCare: [
        'Emergency CT pulmonary angiogram and immediate hospital anticoagulation or thrombolysis.'
      ],
      dailyTimeline: [
        'Hospital stabilization followed by long-term monitored oral anticoagulant therapy.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Heparin / Apixaban / Alteplase (Hospital)',
        brandNames: 'Lovenox, Eliquis, Activase',
        drugClass: 'Anticoagulant / Thrombolytic',
        typicalDose: 'Emergency weight-based IV/SC hospital dosing',
        mechanism: 'Prevents new clot propagation while endogenous fibrinolysis or thrombolytics dissolve the obstruction.',
        warnings: 'Requires immediate emergency diagnostics and inpatient monitoring.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Sudden air hunger at rest or fainting/collapse',
      'Sharp pleuritic chest pain stabbing during deep breath',
      'Coughing up blood-streaked sputum',
      'One swollen, warm, painful calf or thigh'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'diabetic-ketoacidosis',
    name: 'Diabetic Ketoacidosis (DKA) / Extreme High Blood Sugar',
    aliases: ['DKA', 'Hyperglycemic Crisis', 'Fruity Breath Diabetes'],
    icdCode: 'E10.1',
    category: 'endocrine_metabolic',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Blood glucose >250 mg/dL with vomiting, deep fast breathing, abdominal pain, or fruity breath odor.',
    overview: 'A dangerous metabolic crisis occurring when severe insulin deficiency forces the body to break down fat rapidly into acidic ketones.',
    commonCauses: [
      'Missed insulin doses or insulin pump malfunction',
      'Acute infection or illness triggering stress hormones in Type 1 or Type 2 diabetes'
    ],
    howToHandleIt: {
      immediateSteps: [
        'GO TO HOSPITAL EMERGENCY ROOM IMMEDIATELY OR CALL 911.',
        'Check blood glucose and urine/blood ketones if supplies are on hand.',
        'If conscious and not vomiting, sip plain water while awaiting ambulance; never take unguided extra insulin without medical protocol if severely ill.'
      ],
      hourlyCare: [
        'Hospital team administers IV normal saline, controlled IV insulin drip, and potassium replacement.'
      ],
      dailyTimeline: [
        'Endocrinology follow-up to prevent recurrence and adjust basal/bolus insulin regimen.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'IV Regular Insulin + Potassium + Isotonic Saline',
        brandNames: 'Hospital ED Metabolic Resuscitation Protocol',
        drugClass: 'Hormone & Electrolyte Replacement',
        typicalDose: 'Continuous ICU/ED titration based on hourly BMP and glucose checks',
        mechanism: 'Halts ketogenesis, clears metabolic acidosis, and reverses severe dehydration.',
        warnings: 'Fatal cerebral edema or hypokalemia can occur without electrolyte-monitored hospital care.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Sweet/fruity-smelling breath (acetone)',
      'Deep, rapid panting respirations (Kussmaul breathing)',
      'Persistent vomiting preventing fluid intake',
      'Confusion or extreme lethargy'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'acute-glaucoma',
    name: 'Acute Angle-Closure Glaucoma',
    aliases: ['Sudden Eye Pain & Halos', 'Eye Pressure Emergency'],
    icdCode: 'H40.2',
    category: 'eyes_ears_throat',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Sudden severe throbbing eye pain, blurred vision, rainbow halos around lights, nausea, rock-hard eyeball.',
    overview: 'An abrupt blockage of aqueous humor drainage inside the eye causing a rapid spike in intraocular pressure that can permanently damage the optic nerve within hours.',
    commonCauses: [
      'Pupil dilation in dim light or triggered by anticholinergic drugs / decongestants in narrow-angle anatomy'
    ],
    howToHandleIt: {
      immediateSteps: [
        'GO TO NEAREST EMERGENCY EYE HOSPITAL / ED IMMEDIATELY (Sight-threatening within hours).',
        'Avoid dark rooms; keep ambient light bright so pupil stays slightly constricted until seen.',
        'Stop any cold decongestants or dilating drops immediately.'
      ],
      hourlyCare: [
        'Ophthalmologist lowers eye pressure rapidly using IV/oral carbonic anhydrase inhibitors, topical drops, and laser peripheral iridotomy.'
      ],
      dailyTimeline: [
        'Definitive laser iridotomy on both eyes prevents future pressure spikes.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Acetazolamide + Pilocarpine + Timolol Drops',
        brandNames: 'Diamox, Isopto Carpine',
        drugClass: 'Carbonic Anhydrase Inhibitor & Miotic Ophthalmic Protocol',
        typicalDose: 'Emergency ophthalmology administration',
        mechanism: 'Suppresses aqueous humor production and opens the trabecular drainage angle.',
        warnings: 'Delays exceeding a few hours cause irreversible optic nerve blindness.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Severe unilateral eye pain radiating to forehead with nausea/vomiting',
      'Halos or rainbows around lights with misty vision',
      'Fixed mid-dilated pupil and redness'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'testicular-torsion',
    name: 'Sudden Severe Scrotal / Testicular Pain (Possible Torsion)',
    aliases: ['Testicular Torsion', 'Acute Scrotal Emergency'],
    icdCode: 'N44.0',
    category: 'urology_renal',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Abrupt severe one-sided testicular pain with swelling and nausea. 6-hour surgical salvage window.',
    overview: 'Twisting of the spermatic cord cuts off blood supply to the testicle. Requires emergency surgical detorsion ideally within 4–6 hours to prevent permanent tissue loss.',
    commonCauses: [
      'Congenital bell-clapper anatomical mobility of the testis',
      'Physical exertion, trauma, or spontaneous torsion during sleep'
    ],
    howToHandleIt: {
      immediateSteps: [
        'GO DIRECTLY TO EMERGENCY ROOM IMMEDIATELY — Do not wait until morning.',
        'Do NOT eat or drink anything in case emergency surgery under anesthesia is required.'
      ],
      hourlyCare: [
        'STAT Doppler ultrasound and emergent surgical detorsion/orchiopexy.'
      ],
      dailyTimeline: [
        'Post-operative rest, scrotal support, and pain management per urologist.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Emergency Surgical Detorsion',
        brandNames: 'Urologic Surgical Protocol',
        drugClass: 'Surgical Salvage Intervention',
        typicalDose: 'Urgent operating room intervention (<6 hours from onset)',
        mechanism: 'Untwists spermatic cord to restore arterial perfusion.',
        warnings: 'Salvage rate drops sharply after 6–12 hours.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Sudden intense one-sided scrotal pain waking patient from sleep',
      'High-riding or horizontally oriented testis with nausea/vomiting'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'ectopic-pregnancy',
    name: 'Suspected Ectopic Pregnancy / Severe Early Pregnancy Pelvic Pain',
    aliases: ['Tubal Pregnancy', 'Pregnancy Vaginal Bleeding + One-Sided Pain'],
    icdCode: 'O00.9',
    category: 'womens_mens_health',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Positive pregnancy test or missed period with sharp one-sided pelvic pain, dizziness, shoulder tip pain, or vaginal spotting.',
    overview: 'A fertilized egg implants outside the uterus (usually the fallopian tube), risking life-threatening internal rupture and hemorrhage.',
    commonCauses: [
      'Fallopian tube scarring from prior PID, endometriosis, or previous pelvic surgery'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CALL 911 OR GO IMMEDIATELY TO OB/GYN EMERGENCY ROOM.',
        'Do NOT drive yourself if feeling lightheaded, dizzy, or faint.',
        'Do NOT eat or drink until evaluated in case emergency laparoscopy is needed.'
      ],
      hourlyCare: [
        'STAT serum beta-hCG, pelvic ultrasound, blood typing, and urgent medical/surgical management.'
      ],
      dailyTimeline: [
        'Structured serial hCG monitoring until resolution.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Methotrexate (Unruptured) or Emergency Laparoscopy',
        brandNames: 'Hospital OB/GYN Protocol',
        drugClass: 'Folate Antagonist / Surgical Care',
        typicalDose: 'Hospital specialist administration only',
        mechanism: 'Halts trophoblastic proliferation safely before tubal rupture.',
        warnings: 'Shoulder tip pain and fainting indicate possible ruptured internal bleeding—call 911.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Pain radiating to the tip of the shoulder (diaphragmatic blood irritation)',
      'Dizziness, fainting, or pale clammy skin',
      'Sharp unilateral lower abdominal pain with positive pregnancy test'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'carbon-monoxide-poisoning',
    name: 'Carbon Monoxide (CO) Poisoning',
    aliases: ['CO Exposure', 'Heater Exhaust Toxicity'],
    icdCode: 'T58.9',
    category: 'emergency_firstaid',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Group headache, dizziness, nausea, or confusion indoors near heaters, generators, or cars.',
    overview: 'Colorless, odorless gas binds hemoglobin 200x tighter than oxygen, starving brain and heart tissues of oxygen.',
    commonCauses: [
      'Faulty gas furnaces, indoor charcoal grills, running generators or vehicles in enclosed spaces'
    ],
    howToHandleIt: {
      immediateSteps: [
        'GET EVERYONE OUTSIDE INTO FRESH AIR IMMEDIATELY.',
        'Call 911 / Emergency Medical Services once safely outside.',
        'Do NOT re-enter the building until fire department clears CO levels.'
      ],
      hourlyCare: [
        'Paramedics administer 100% high-flow non-rebreather oxygen; severe cases receive hyperbaric oxygen therapy.'
      ],
      dailyTimeline: [
        'Install battery-backed CO detectors on every floor before returning home.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: '100% High-Flow Normobaric / Hyperbaric Oxygen',
        brandNames: 'Emergency EMS Oxygen Protocol',
        drugClass: 'Antidote Gas Therapy',
        typicalDose: 'Continuous high-flow oxygen via non-rebreather mask',
        mechanism: 'Displaces carbon monoxide from hemoglobin and accelerates half-life clearance from ~5 hours to <90 minutes.',
        warnings: 'Pulse oximeters read falsely normal (100%) in CO poisoning; blood carboxyhemoglobin test is required.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Multiple household members or pets sick simultaneously inside same building',
      'Confusion, chest pain, syncope, or coma'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'heat-stroke',
    name: 'Exertional / Classic Heat Stroke (Hyperthermia >40°C)',
    aliases: ['Hyperthermia', 'Sun Stroke Emergency'],
    icdCode: 'T67.0',
    category: 'emergency_firstaid',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: High body temp >40°C (104°F) WITH confusion, slurred speech, seizures, or collapse after heat exposure.',
    overview: 'A true medical emergency where thermoregulation fails completely, causing direct thermal injury to the brain, liver, and kidneys.',
    commonCauses: [
      'Heavy outdoor exertion in high humidity or elderly confined in uncooled homes during heatwaves'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CALL 911 / 112 IMMEDIATELY. Begin aggressive cooling BEFORE ambulance arrives ("Cool first, transport second").',
        'Move into shade/air conditioning and remove outer clothing.',
        'Immerse body in cold water tub if available, OR pack ice packs at neck, armpits, and groin while spraying cold water and fanning.'
      ],
      hourlyCare: [
        'Do NOT force fluids by mouth if patient is confused or drowsy (aspiration risk). Hospital IV cooling follows.'
      ],
      dailyTimeline: [
        'Monitor kidney function and creatine kinase in hospital for 24–48 hours.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Rapid Ice-Water Immersion + IV Crystalloids',
        brandNames: 'Wilderness & ED Thermoregulation Protocol',
        drugClass: 'Physical Resuscitation (Fever reducers DO NOT WORK)',
        typicalDose: 'Continuous cooling until core temp drops to 38.5°C',
        mechanism: 'Conductive heat transfer rapidly rescues brain neurons from thermal denaturation.',
        warnings: 'Do NOT give Paracetamol/Acetaminophen or Ibuprofen—they fail in heat stroke and worsen liver/kidney injury.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Core temp >= 40°C (104°F) plus confusion, agitation, or seizures',
      'Hot flushed dry skin OR profuse sweating with collapse'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'venomous-bite',
    name: 'Venomous Snakebite or Severe Scorpion Sting',
    aliases: ['Snake Bite', 'Scorpion Envenomation'],
    icdCode: 'T63.0',
    category: 'emergency_firstaid',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: Rapid swelling, fang marks, bruising, blurred vision, muscle twitching, or breathing difficulty.',
    overview: 'Systemic envenomation causing coagulopathy, tissue necrosis, hypotension, or neurotoxic paralysis requiring hospital antivenom.',
    commonCauses: [
      'Viper/pit viper (hemotoxic swelling) or elapid (neurotoxic) bites; dangerous scorpions'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CALL 911 / EMERGENCY SERVICES IMMEDIATELY.',
        'Keep the victim completely calm and still—limb movement accelerates venom spread through lymphatics.',
        'Remove rings, watches, and tight shoes BEFORE swelling starts.',
        'Keep bitten limb immobilized at or slightly below heart level.'
      ],
      hourlyCare: [
        'DO NOT cut the wound, DO NOT try to suck venom, DO NOT apply ice, and DO NOT apply a tight arterial tourniquet.'
      ],
      dailyTimeline: [
        'Hospital administers polyvalent antivenom, coagulation labs, and tetanus update.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Species-Specific Polyvalent Antivenom (CroFab / Anavip)',
        brandNames: 'Hospital Antivenom Protocol',
        drugClass: 'Immunoglobulin Antivenom',
        typicalDose: 'Titrated IV infusion per poison control / toxicologist',
        mechanism: 'Neutralizes circulating venom toxins before irreversible coagulopathy or paralysis occurs.',
        warnings: 'Cutting, tourniquets, or herbal poultices worsen tissue loss and delay antivenom.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Drooping eyelids, slurred speech, or difficulty swallowing/breathing',
      'Rapidly spreading tense limb swelling or oozing blood from gums/bite site'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'severe-hypertensive-crisis',
    name: 'Hypertensive Crisis (BP >= 180/120 with Symptoms)',
    aliases: ['Dangerously High Blood Pressure', 'Malignant Hypertension'],
    icdCode: 'I16.1',
    category: 'cardiovascular',
    triage: 'EMERGENCY',
    urgencySummary: 'EMERGENCY PROTOCOL: BP >= 180/120 accompanied by headache, chest pain, vision changes, or shortness of breath.',
    overview: 'Critically elevated blood pressure causing active end-organ damage to the brain, heart, aorta, retina, or kidneys.',
    commonCauses: [
      'Abruptly stopping blood pressure medications, missed doses, stimulant drugs, or renal artery stenosis'
    ],
    howToHandleIt: {
      immediateSteps: [
        'If BP >= 180/120 WITH chest pain, breathlessness, vision blur, numbness, or severe headache: CALL 911 / GO TO ER IMMEDIATELY.',
        'Sit quietly upright; do not double up or chew extra oral BP pills unless explicitly instructed by a physician (rapid unmonitored drops cause stroke).'
      ],
      hourlyCare: [
        'Hospital lowers blood pressure gradually by max 15–25% in the first hour using controlled IV drips.'
      ],
      dailyTimeline: [
        'Cardiology reconciliation of daily oral antihypertensives.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'IV Nicardipine / Labetalol / Clevidipine (Hospital)',
        brandNames: 'Cardene IV, Trandate IV',
        drugClass: 'Titratable IV Antihypertensive',
        typicalDose: 'Continuous ICU infusion with arterial monitoring',
        mechanism: 'Safely reduces systemic vascular resistance without crashing cerebral perfusion.',
        warnings: 'Never drop chronic extreme hypertension abruptly at home with sublingual nifedipine.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Blood pressure >= 180/120 with chest tearing pain, vision loss, confusion, or weakness',
      'Sudden decreased urination or coughing frothy pink fluid'
    ],
    skipHomeRemedies: true,
    recommendedFacilityType: 'hospital'
  },

  // ======================== URGENT CARE CONDITIONS ========================
  {
    id: 'kidney-stone-renal-colic',
    name: 'Kidney Stone (Renal Colic)',
    aliases: ['Nephrolithiasis', 'Severe Flank Pain', 'Ureteral Stone'],
    icdCode: 'N20.0',
    category: 'urology_renal',
    triage: 'URGENT',
    urgencySummary: 'URGENT CARE: Intense waves of sharp flank/back pain radiating into groin, blood in urine, restlessness.',
    overview: 'Hard mineral deposits (calcium oxalate, uric acid) migrating from the kidney down the narrow ureter, provoking intense ureteral spasm and obstruction.',
    commonCauses: [
      'Chronic dehydration, high dietary sodium/oxalate, hyperuricemia, or hot climates'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Visit Urgent Care (or ED if fever or uncontrollable vomiting is present) for imaging and IV/IM pain control.',
        'Apply a warm heating pad over the painful flank to soothe ureteral smooth muscle spasm.',
        'Strain urine through a fine mesh strainer to catch any passed stone for lab composition analysis.'
      ],
      hourlyCare: [
        'Sip steady water (2.5 L/day if keeping fluids down) to maintain urine flow.',
        'Prescribed alpha-blockers relax the distal ureter to help pass stones <10 mm.'
      ],
      dailyTimeline: [
        'Follow urologist CT/ultrasound schedule; stones >6 mm or infected obstructed stones need urgent stenting/lithotripsy.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Fresh Lemon Citrate + High Fluid Hydration',
        type: 'Urinary Alkalizer & Stone Inhibitor',
        mechanism: 'Dietary citrate binds urinary calcium to prevent crystal aggregation and helps dissolve uric acid crystals.',
        preparation: 'Mix 60–120 ml fresh lemon juice into 1.5 L water sipped throughout the day.',
        dosage: 'Daily during passage and prevention.',
        precautions: 'Rinse mouth with plain water afterward to protect tooth enamel; not a substitute if infection/fever is present.'
      },
      {
        name: 'Chanca Piedra (Phyllanthus niruri) Infusion',
        type: 'Traditional Antispasmodic Botanical',
        mechanism: 'May relax ureteral smooth muscle and reduce calcium oxalate crystal adhesion in small adjunct studies.',
        preparation: 'Standardized capsule or tea infusion.',
        dosage: '400–500 mg extract daily after medical evaluation.',
        precautions: 'Avoid during pregnancy; check interactions if taking blood pressure or diabetes medications.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ketorolac (Toradol) / Ibuprofen',
        brandNames: 'Toradol, Advil',
        drugClass: 'NSAID (First-Line Renal Colic Analgesia)',
        typicalDose: 'Ketorolac IV/IM in clinic; Ibuprofen 400-600 mg oral with food every 6-8 hrs short term',
        mechanism: 'Inhibits renal prostaglandin synthesis, which reduces glomerular pressure and ureteral wall edema faster than opioids.',
        warnings: 'Avoid NSAIDs if kidney function (GFR) is impaired or dehydrated.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Tamsulosin',
        brandNames: 'Flomax',
        drugClass: 'Alpha-1A Adrenergic Blocker (Medical Expulsive Therapy)',
        typicalDose: '0.4 mg orally once daily 30 minutes after same meal',
        mechanism: 'Relaxes distal ureteral smooth muscle, significantly improving spontaneous stone passage rates.',
        warnings: 'Stand up slowly to prevent orthostatic dizziness.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Fever or shaking chills WITH flank pain (Obstructed infected kidney = septic emergency!)',
      'Intractable vomiting preventing oral hydration',
      'Complete inability to urinate (single kidney or bilateral obstruction)'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'acute-asthma-flare',
    name: 'Acute Asthma Exacerbation (Wheezing Flare)',
    aliases: ['Asthma Attack', 'Bronchospasm', 'Tight Chest Wheezing'],
    icdCode: 'J45.901',
    category: 'respiratory',
    triage: 'URGENT',
    urgencySummary: 'URGENT / ER CARE: Audible wheezing, persistent coughing, chest tightness, incomplete relief from rescue inhaler.',
    overview: 'Acute narrowing and mucus plugging of small bronchial airways triggered by allergens, cold air, respiratory viruses, or irritants.',
    commonCauses: [
      'Viral upper respiratory infection, dust mites, smoke, cold dry air, exercise'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Sit straight upright (never lie flat) and loosen restrictive collars.',
        'Use prescribed Short-Acting Beta-Agonist rescue inhaler (Albuterol/Salbutamol): 2–4 puffs via spacer spacer every 20 minutes up to 1 hour if instructed in Asthma Action Plan.',
        'If lips turn bluish, unable to speak full sentences, or rescue inhaler fails after 2 rounds: CALL 911 IMMEDIATELY.'
      ],
      hourlyCare: [
        'Seek Urgent Care today for peak-flow check and a short burst of oral corticosteroids to calm airway inflammation.'
      ],
      dailyTimeline: [
        'Review daily inhaled corticosteroid controller adherence with physician within 48 hours.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Warm Caffeinated Black Tea or Coffee (Emergency Bridging Only)',
        type: 'Mild Natural Methylxanthine Bronchodilator',
        mechanism: 'Caffeine is chemically similar to theophylline and produces weak, temporary bronchial smooth muscle relaxation (~2 hours) ONLY if rescue inhaler is temporarily out of reach.',
        preparation: '1 cup warm black coffee or strong black tea.',
        dosage: 'Single supportive cup while traveling to pharmacy/clinic.',
        precautions: 'NEVER replaces Albuterol inhaler or emergency medical care during an asthma attack.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Albuterol / Salbutamol Sulfate HFA',
        brandNames: 'Ventolin, ProAir, Proventil',
        drugClass: 'Short-Acting Beta-2 Agonist (Rescue Bronchodilator)',
        typicalDose: '2 puffs (90 mcg/puff) inhaled every 4–6 hours PRN; 4–8 puffs during acute flare with medical follow-up',
        mechanism: 'Relaxes bronchial smooth muscle within 5 minutes to open constricted airways.',
        warnings: 'Needing rescue inhaler more than twice weekly indicates poorly controlled asthma requiring daily preventer therapy.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Prednisone (Oral Corticosteroid Burst)',
        brandNames: 'Deltasone',
        drugClass: 'Systemic Glucocorticoid',
        typicalDose: '40–50 mg orally once daily for 5 days (prescribed in Urgent Care)',
        mechanism: 'Shuts down eosinophilic airway inflammation and prevents rebound emergency visits.',
        warnings: 'Requires clinician prescription; take in the morning with food.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Unable to speak complete sentences without gasping ("silent chest" where airflow stops)',
      'Ribs sucking inward with each breath or bluish lips/nails',
      'No improvement 15 minutes after rescue Albuterol puffs'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'pyelonephritis-kidney-infection',
    name: 'Kidney Infection (Pyelonephritis)',
    aliases: ['Upper UTI', 'Fever + Flank Pain', 'Infected Kidney'],
    icdCode: 'N10',
    category: 'urology_renal',
    triage: 'URGENT',
    urgencySummary: 'URGENT CARE: Burning urination PLUS high fever, chills, nausea/vomiting, and deep upper back/flank ache.',
    overview: 'Bacterial infection that has ascended from the bladder up the ureters into the kidney parenchyma, carrying high risk of bloodstream sepsis if not treated promptly with antibiotics.',
    commonCauses: [
      'Ascending E. coli from untreated lower bladder infection, kidney stones, or urinary obstruction'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Seek SAME-DAY Urgent Care or Emergency Department evaluation for urine culture and prescription antibiotics.',
        'Do NOT rely solely on cranberry juice or OTC urinary pain pills (AZO)—these mask pain while bacteria damage kidney tissue.'
      ],
      hourlyCare: [
        'Drink steady water if tolerating fluids; take Acetaminophen for high fever comfort.',
        'Start prescribed antibiotic course immediately without skipping doses.'
      ],
      dailyTimeline: [
        'Fever must trend down within 48 hours of antibiotics; return to ER immediately if vomiting prevents keeping pills down.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Oral Rehydration & Rest (Adjunct to Antibiotics Only)',
        type: 'Supportive Fluid Clearance',
        mechanism: 'Maintains renal perfusion and tubular bacterial washout alongside definitive antibiotics.',
        preparation: 'Plain water and light broth.',
        dosage: '2–2.5 L/day if not fluid restricted.',
        precautions: 'Herbal supplements alone CANNOT cure pyelonephritis.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ceftriaxone (IM/IV) + Ciprofloxacin or TMP-SMX',
        brandNames: 'Rocephin, Cipro, Bactrim',
        drugClass: 'Systemic Tissue-Penetrating Antibiotics',
        typicalDose: 'Per Urgent Care/ED sensitivity culture protocol (7–14 days)',
        mechanism: 'Achieves high therapeutic concentrations inside kidney cortex to eradicate Gram-negative rods.',
        warnings: 'Nitrofurantoin (Macrobid) does NOT penetrate kidney tissue well and should NOT be used for pyelonephritis.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Inability to keep oral fluids or antibiotics down due to vomiting',
      'Confusion, severe weakness, dizziness upon standing, or temp >39.5°C',
      'Pregnancy with suspected kidney infection (requires inpatient IV antibiotics)'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'deep-vein-thrombosis-dvt',
    name: 'Suspected Deep Vein Thrombosis (One Swollen Painful Calf)',
    aliases: ['Leg Clot', 'DVT', 'Swollen Calf Red Warm'],
    icdCode: 'I82.4',
    category: 'cardiovascular',
    triage: 'URGENT',
    urgencySummary: 'URGENT CARE / ER: Unilateral calf/thigh swelling, deep throbbing ache, warmth, or redness—especially after travel or surgery.',
    overview: 'A blood clot formed inside a deep leg vein. Must be diagnosed quickly by venous Doppler ultrasound so anticoagulation prevents a fatal pulmonary embolism.',
    commonCauses: [
      'Long-haul flights/drives >4 hours, orthopedic surgery, oral contraceptives, immobility'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Seek SAME-DAY Urgent Care or Emergency Department with venous ultrasound capability.',
        'DO NOT massage, rub, or apply percussion massagers to the swollen leg (risks breaking clot loose!).'
      ],
      hourlyCare: [
        'Keep the leg comfortably rested and slightly elevated while awaiting ultrasound.'
      ],
      dailyTimeline: [
        'If DVT is confirmed, immediate physician-directed oral anticoagulant therapy (e.g., Apixaban/Rivaroxaban) begins that day.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Apixaban or Rivaroxaban',
        brandNames: 'Eliquis, Xarelto',
        drugClass: 'Direct Oral Anticoagulant (DOAC)',
        typicalDose: 'Doctor-prescribed loading dose immediately following positive ultrasound',
        mechanism: 'Inhibits Factor Xa to stop clot extension and protect the lungs.',
        warnings: 'Never self-treat a suspected DVT with aspirin or herbal blood thinners.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Sudden shortness of breath, rapid pulse, or sharp chest pain (Clot traveled to lungs -> Call 911!)'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'acute-gout-flare',
    name: 'Acute Gout Flare (Red Swollen Big Toe / Joint)',
    aliases: ['Gout Attack', 'Podagra', 'Uric Acid Crystal Arthritis'],
    icdCode: 'M10.9',
    category: 'musculoskeletal',
    triage: 'URGENT',
    urgencySummary: 'URGENT / CLINIC: Sudden overnight excruciating swelling, heat, and shiny redness in the base of big toe, ankle, or knee.',
    overview: 'Needle-sharp monosodium urate crystals precipitate in joint fluid, triggering an explosive neutrophilic inflammatory attack.',
    commonCauses: [
      'High purine intake (red meat, shellfish, organ meats), beer/alcohol, dehydration, fructose, diuretics'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Immobilize and elevate the foot on pillows; even a bedsheet touching the joint may hurt.',
        'Apply a cloth-wrapped ice pack gently for 15–20 minutes.',
        'Seek same-day clinic/urgent care to rule out septic (infected) joint and start prescription anti-inflammatory burst.'
      ],
      hourlyCare: [
        'Drink plenty of plain water to help kidneys flush uric acid; avoid all alcohol and sugary sodas.'
      ],
      dailyTimeline: [
        'Follow up in 2 weeks for serum uric acid test and possible long-term Allopurinol prevention (do NOT start/stop Allopurinol mid-flare unless advised).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Tart Cherry (Montmorency) Extract + Vitamin C Hydration',
        type: 'Uricosuric Anthocyanin Adjunct',
        mechanism: 'Anthocyanins dampen IL-1beta inflammasome signaling while mild uricosuric activity aids renal urate excretion.',
        preparation: '240 ml unsweetened tart cherry juice or 480 mg extract capsule.',
        dosage: 'Twice daily alongside heavy water intake.',
        precautions: 'Adjunctive relief only; severe gout flares typically require prescription NSAIDs, colchicine, or steroids.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Colchicine / Indomethacin / Prednisone',
        brandNames: 'Colcrys, Indocin, Naprosyn',
        drugClass: 'Microtubule Inhibitor / Potent NSAID / Corticosteroid',
        typicalDose: 'Colchicine 1.2 mg at onset followed by 0.6 mg 1 hr later (only within first 36 hrs), OR Naproxen 500 mg twice daily',
        mechanism: 'Blocks neutrophil migration into urate-filled joint spaces.',
        warnings: 'Do NOT take high toxic repeated doses of Colchicine; adjust dose strictly for kidney disease.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'High fever >38.3°C or open skin wound over the joint (Septic Arthritis emergency requiring joint aspiration!)'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'tooth-abscess-dental-infection',
    name: 'Acute Tooth Abscess & Facial Swelling',
    aliases: ['Dental Abscess', 'Periapical Infection', 'Severe Throbbing Toothache'],
    icdCode: 'K04.7',
    category: 'dental_oral',
    triage: 'URGENT',
    urgencySummary: 'URGENT CARE / DENTIST: Severe throbbing toothache with swollen cheek/gum, pus pocket, bad taste, or fever.',
    overview: 'Bacterial infection trapped inside the tooth root or periodontal pocket; untreated facial infections can spread to the neck airway or sinuses.',
    commonCauses: [
      'Deep untreated cavity, cracked tooth, or failed dental filling'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Book EMERGENCY dental appointment or Urgent Care today for drainage and antibiotics.',
        'If swelling involves the floor of the mouth under the tongue, voice changes, eyelid closure, or trouble swallowing: GO TO HOSPITAL ER IMMEDIATELY (Ludwig angina airway risk!).',
        'Rinse gently with warm salt water (1/2 tsp salt in 250 ml warm water) — never put crushed aspirin directly on gums (causes chemical burns!).'
      ],
      hourlyCare: [
        'Apply a cold compress on the outer cheek for 15 mins to limit soft-tissue swelling.',
        'Take Ibuprofen alternating with Acetaminophen (unless contraindicated) for dental pulp pain.'
      ],
      dailyTimeline: [
        'Antibiotics only quiet swelling temporarily—definitive root canal therapy or extraction by a dentist is mandatory.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Clove Oil (Eugenol) Spot Application + Warm Saline Rinse',
        type: 'Natural Topical Dental Analgesic',
        mechanism: 'Eugenol acts as a local anesthetic blocking voltage-gated sodium channels in exposed dental nerve endings.',
        preparation: 'Dilute 1 drop pure clove oil in 3 drops olive/coconut carrier oil on a tiny cotton swab.',
        dosage: 'Dab gently onto painful tooth (not raw open gums) up to 3 times daily while awaiting dentist.',
        precautions: 'Avoid swallowing undiluted clove oil; never use in young children.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ibuprofen + Acetaminophen Dual Analgesia',
        brandNames: 'Advil Dual Action, Motrin + Tylenol',
        drugClass: 'NSAID + Central Analgesic Synergy',
        typicalDose: 'Ibuprofen 400 mg + Acetaminophen 500 mg with food every 6–8 hours (synergistically stronger than opioids for dental pain)',
        mechanism: 'Reduces alveolar prostaglandin pressure while blocking central pain transmission.',
        warnings: 'Take with food; confirm liver/kidney safety and do not exceed daily limits.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Amoxicillin or Clindamycin (Prescribed)',
        brandNames: 'Amoxil, Cleocin',
        drugClass: 'Beta-Lactam / Lincosamide Antibiotic',
        typicalDose: 'Amoxicillin 500 mg every 8 hours for 5–7 days ONLY if spreading swelling/fever is present',
        mechanism: 'Eradicates oral streptococci and anaerobes spreading into facial tissues.',
        warnings: 'Check penicillin allergy first; complete entire prescribed course.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Difficulty swallowing saliva, muffled "hot potato" voice, or tongue pushing upward (ER immediately!)',
      'Swelling spreading around the eye or fever >38.5°C'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'malaria-acute-fever',
    name: 'Suspected Malaria / Tropical Fever After Travel',
    aliases: ['Traveler Fever', 'Cyclic Chills & Rigors', 'Vector-Borne Fever'],
    icdCode: 'B54',
    category: 'infectious_disease',
    triage: 'URGENT',
    urgencySummary: 'URGENT / ER DIAGNOSTICS: High cyclical fever, violent shaking chills (rigors), sweats, headache, or jaundice within weeks/months of endemic travel.',
    overview: 'Plasmodium parasitic infection transmitted by Anopheles mosquitoes; P. falciparum can progress rapidly to cerebral malaria and organ failure if not tested and treated urgently.',
    commonCauses: [
      'Mosquito exposure in Sub-Saharan Africa, South Asia, Amazon basin, or tropical regions'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Seek SAME-DAY Urgent Care or Hospital ED for STAT thick/thin blood smear and Rapid Diagnostic Test (RDT).',
        'Disclose ALL countries visited in the past 12 months immediately upon check-in.'
      ],
      hourlyCare: [
        'Treat discomfort with Acetaminophen/Paracetamol while awaiting blood smear; avoid NSAIDs until dengue hemorrhagic risk is ruled out.'
      ],
      dailyTimeline: [
        'Start targeted antimalarial therapy (Artemether-Lumefantrine or IV Artesunate for severe malaria) immediately on diagnosis.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Artemether-Lumefantrine / Atovaquone-Proguanil',
        brandNames: 'Coartem, Malarone',
        drugClass: 'ACT Antimalarial Chemotherapy',
        typicalDose: 'Weight- and species-specific physician course (take with fatty milk/food)',
        mechanism: 'Rapidly clears intra-erythrocytic Plasmodium parasites.',
        warnings: 'Never self-treat unconfirmed tropical fever; P. falciparum requires emergency hospital IV Artesunate if severe.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Confusion, seizures, extreme drowsiness, or coma (Cerebral malaria!)',
      'Dark cola-colored urine, yellow eyes (jaundice), or difficulty breathing'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'dengue-fever-suspected',
    name: 'Suspected Dengue Fever ("Breakbone Fever")',
    aliases: ['Dengue', 'Fever Behind Eyes Pain', 'Mosquito Rash Fever'],
    icdCode: 'A90',
    category: 'infectious_disease',
    triage: 'URGENT',
    urgencySummary: 'URGENT MONITORING: Sudden high fever, severe pain behind the eyes, intense bone/joint ache, flushed rash. STRICTLY AVOID NSAIDS/ASPIRIN.',
    overview: 'Aedes mosquito-borne viral infection causing sharp bone/muscle aches and a critical platelet drop around days 4–7 as fever subsides.',
    commonCauses: [
      'Aedes aegypti mosquito bites in tropical/subtropical urban zones'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CRITICAL MEDICATION RULE: Use ONLY Paracetamol (Acetaminophen) for fever. NEVER take Ibuprofen, Aspirin, Naproxen, or Diclofenac (triggers fatal internal hemorrhage when platelets drop!).',
        'Visit Clinic/Urgent Care for NS1 antigen test and serial daily CBC platelet + hematocrit checks.'
      ],
      hourlyCare: [
        'Aggressive oral hydration with ORS electrolytes, coconut water, or fruit juices to maintain blood volume.'
      ],
      dailyTimeline: [
        'Watch closest on Days 3–7 when the fever drops—this "Critical Phase" is when plasma leakage and warning signs appear.'
      ]
    },
    naturalRemedies: [
      {
        name: 'WHO Oral Rehydration Solution (ORS) & Tepid Sponging',
        type: 'Hemodynamic Fluid Support',
        mechanism: 'Counters fever fluid losses and supports microvascular plasma volume safely without antiplatelet effects.',
        preparation: 'Standard ORS packet in 1 L safe water or isotonic electrolyte fluids.',
        dosage: 'Continuous small sips targeting pale yellow urine every 4–6 hours.',
        precautions: 'Avoid herbal blood-thinners (high-dose garlic/ginkgo/turmeric) during suspected dengue.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Acetaminophen (Paracetamol) ONLY',
        brandNames: 'Tylenol, Panadol',
        drugClass: 'Antipyretic Analgesic (Safe Platelet Profile)',
        typicalDose: '500–650 mg every 6 hours (strictly <=3000 mg/day for adults)',
        mechanism: 'Reduces fever and retro-orbital headache safely without inhibiting platelet thromboxane.',
        warnings: 'STRICTLY AVOID all NSAIDs (Ibuprofen/Advil/Aspirin/Voltaren) due to gastrointestinal bleeding risk.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Severe abdominal pain or persistent vomiting (>3 times in 24h)',
      'Bleeding gums, nosebleeds, bruising, blood in vomit/stool',
      'Sudden restlessness, cold clammy hands, or dizzy fainting as fever drops (Dengue Shock Syndrome -> ER!)'
    ],
    recommendedFacilityType: 'urgent_care'
  },

  // ======================== MODERATE / CLINIC CONDITIONS ========================
  {
    id: 'urinary-tract-infection-uti',
    name: 'Uncomplicated Urinary Tract Infection (Bladder Cystitis)',
    aliases: ['UTI', 'Burning Urination', 'Painful Pee', 'Frequent Urination'],
    icdCode: 'N39.0',
    category: 'urology_renal',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC VISIT: Painful burning urination, frequent small urges, cloudy/strong-smelling urine WITHOUT fever or back pain.',
    overview: 'Bacterial colonization (most commonly E. coli >80%) causing inflammation of the bladder mucosal lining.',
    commonCauses: [
      'Urethral bacterial ascension, sexual activity, dehydration, holding urine, wiping back-to-front'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Increase water intake immediately (2.5–3 L/day) to flush bacteria from the bladder wall.',
        'Schedule a Walk-in Clinic or Telehealth urinalysis today for targeted prescription antibiotic.'
      ],
      hourlyCare: [
        'Use OTC Phenazopyridine for 48 hours maximum if burning is severe while awaiting antibiotics.',
        'Avoid caffeine, alcohol, and spicy foods which irritate bladder urothelium.'
      ],
      dailyTimeline: [
        'Complete every dose of prescribed antibiotic even after burning disappears within 24–48 hours.'
      ]
    },
    naturalRemedies: [
      {
        name: 'D-Mannose Powder + Unsweetened Cranberry Proanthocyanidins',
        type: 'Anti-Adhesion Urinary Nutraceutical',
        mechanism: 'D-Mannose competitively binds E. coli FimH pili, preventing bacteria from sticking to bladder walls so they flush out in urine.',
        preparation: 'Dissolve 2 grams pure D-mannose powder in 200 ml water.',
        dosage: 'Twice daily as adjunct/prevention alongside medical care.',
        precautions: 'Does NOT replace antibiotics for an active symptomatic infection.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Nitrofurantoin (Prescription First-Line)',
        brandNames: 'Macrobid',
        drugClass: 'Urinary-Specific Antibiotic',
        typicalDose: '100 mg orally TWICE daily WITH FOOD for 5 days (per prescriber)',
        mechanism: 'Concentrates exclusively in urine to damage bacterial DNA/ribosomes with minimal gut flora disruption.',
        warnings: 'Take with food to maximize absorption and reduce nausea; ineffective if infection reaches kidneys.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Phenazopyridine HCl (OTC Symptomatic Relief)',
        brandNames: 'AZO Standard, Uristat',
        drugClass: 'Urinary Tract Analgesic Dye',
        typicalDose: '95–200 mg three times daily after meals for max 2 days',
        mechanism: 'Exerts local anesthetic relief along urinary mucosa.',
        warnings: 'Turns urine bright orange-red (stains contact lenses and underwear). Max 2 days so it does not mask worsening infection.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Fever, chills, nausea, or mid-back/flank pain (Ascending Pyelonephritis -> Urgent Care/ER!)',
      'Visible blood clots in urine or pregnancy'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'benign-paroxysmal-vertigo',
    name: 'Spinning Vertigo (BPPV / Inner Ear Dizziness)',
    aliases: ['Room Spinning', 'BPPV', 'Labyrinthitis', 'Positional Dizziness'],
    icdCode: 'H81.1',
    category: 'head_neurological',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC / CAREFUL TRIAGE: Brief bursts of violent room-spinning lasting 15–60 seconds triggered by rolling over in bed or looking up.',
    overview: 'Tiny calcium crystals (otoconia) dislodge into a semicircular balance canal inside the inner ear, sending false spinning signals on head movement.',
    commonCauses: [
      'Benign Paroxysmal Positional Vertigo (BPPV), post-viral vestibular neuritis, dehydration'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Sit down or lie still immediately when the spin starts to prevent falls.',
        'Fix eyes on a single stationary point on the wall until the wave settles.',
        'Confirm NO stroke symptoms (double vision, facial droop, limb weakness, slurred speech).'
      ],
      hourlyCare: [
        'Wait 2 minutes after standing before walking; move head slowly.',
        'Clinicians cure ~80–90% of BPPV instantly via the 5-minute Epley Canalith Repositioning Maneuver.'
      ],
      dailyTimeline: [
        'Sleep slightly propped upright with 2 pillows for 2 nights following clinic Epley maneuver.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Guided Epley Canalith Maneuver + Fresh Ginger Root',
        type: 'Biomechanical Repositioning & Vestibular Antiemetic',
        mechanism: 'Specific sequence of 30-second head turns shifts misplaced ear crystals back into the utricle via gravity; ginger calms secondary nausea.',
        preparation: 'Perform clinically instructed Epley turns on bed after physician diagnosis + ginger tea.',
        dosage: 'Ginger 500–1000 mg as needed for vertigo nausea.',
        precautions: 'Ensure cervical spine has no instability before head repositioning.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Meclizine HCl',
        brandNames: 'Antivert, Bonine',
        drugClass: 'Antihistamine Vestibular Suppressant',
        typicalDose: '25 mg orally every 6–8 hours ONLY for severe acute nausea (max 2–3 days)',
        mechanism: 'Dampens hyperactive labyrinthine signaling in the brainstem vestibular nuclei.',
        warnings: 'Causes drowsiness; avoid driving. Prolonged daily use delays natural brain vestibular compensation.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Continuous severe dizziness with double vision, slurred speech, limb clumsiness, or inability to walk unsupported (Posterior Stroke -> Call 911!)',
      'Sudden hearing loss in one ear'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'hypothyroidism-fatigue',
    name: 'Chronic Fatigue, Cold Intolerance & Weight Gain (Suspected Hypothyroidism)',
    aliases: ['Underactive Thyroid', 'Low Thyroid TSH', 'Brain Fog + Cold Sensitivity'],
    icdCode: 'E03.9',
    category: 'endocrine_metabolic',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC LAB WORKUP: Persistent unexplained exhaustion, feeling cold, dry skin, hair thinning, constipation, and sluggish focus over weeks.',
    overview: 'Slowed cellular metabolism resulting from insufficient thyroid hormone (T4/T3) secretion—most commonly due to Hashimoto autoimmune thyroiditis.',
    commonCauses: [
      'Hashimoto thyroiditis, iodine deficiency, post-partum thyroiditis, lithium/amiodarone medications'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Schedule a morning primary clinic fasting blood panel for TSH and Free T4.',
        'Note all biotin supplements—STOP high-dose biotin 48 hours before thyroid blood tests (falsely skews lab results!).'
      ],
      hourlyCare: [
        'Focus on steady protein, selenium-rich foods, and consistent sleep hygiene while awaiting diagnosis.'
      ],
      dailyTimeline: [
        'If hypothyroid is confirmed, daily oral hormone replacement restores metabolism gradually over 4–6 weeks.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Selenium-Rich Nutrition (2 Brazil Nuts/Day)',
        type: 'Deiodinase Cofactor Support',
        mechanism: 'Selenium is an essential cofactor for deiodinase enzymes converting inactive T4 into active T3 hormone and may lower thyroid peroxidase antibodies.',
        preparation: '1–2 whole Brazil nuts daily (~100–150 mcg natural selenium).',
        dosage: 'Max 2 Brazil nuts per day (do not overdose selenium).',
        precautions: 'Natural nutrition NEVER replaces Levothyroxine in clinical hypothyroidism.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Levothyroxine Sodium',
        brandNames: 'Synthroid, Euthyrox, Tirosint',
        drugClass: 'Synthetic Thyroid Hormone (L-Thyroxine)',
        typicalDose: 'Doctor-titrated microgram dose once daily on an EMPTY STOMACH 30–60 mins before breakfast',
        mechanism: 'Restores physiological serum T4/T3 levels cleanly.',
        warnings: 'Calcium, iron, coffee, and antacids block absorption—separate by at least 4 hours.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Extreme lethargy progressing to confusion, slowed breathing, and low body temp (Myxedema Coma -> ER!)',
      'Rapidly enlarging neck mass causing choking when lying flat'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'hypoglycemia-low-blood-sugar',
    name: 'Acute Hypoglycemia (Low Blood Sugar Episode)',
    aliases: ['Low Blood Sugar', 'Insulin Reaction', 'Shakiness + Cold Sweat'],
    icdCode: 'E16.2',
    category: 'endocrine_metabolic',
    triage: 'URGENT',
    urgencySummary: 'IMMEDIATE 15-15 PROTOCOL: Shakiness, trembling, cold clammy sweat, racing heart, sudden irritability, glucose <70 mg/dL (3.9 mmol/L).',
    overview: 'A rapid drop in blood glucose starving brain neurons of fuel; quickly reversible if conscious, life-threatening if consciousness declines.',
    commonCauses: [
      'Excess insulin or sulfonylurea dose, skipped meal after diabetes medication, intense exercise, alcohol on empty stomach'
    ],
    howToHandleIt: {
      immediateSteps: [
        'If CONSCIOUS and able to swallow, apply the "15-15 Rule" IMMEDIATELY: Eat/drink 15 grams of fast simple carbs (4 glucose tablets, OR 120 ml fruit juice/regular soda, OR 1 tablespoon honey/sugar).',
        'If UNCONSCIOUS, having seizures, or unable to swallow safely: CALL 911 IMMEDIATELY, give NOTHING by mouth, and administer emergency Glucagon nasal spray / injection if available!'
      ],
      hourlyCare: [
        'Recheck fingerstick blood sugar after 15 minutes; repeat 15 g fast sugar if still <70 mg/dL.',
        'Once >70 mg/dL, eat a balanced snack containing complex carbs + protein (e.g., crackers + peanut butter) to prevent rebound crash.'
      ],
      dailyTimeline: [
        'Contact prescribing clinician to review insulin/medication dosing.'
      ]
    },
    naturalRemedies: [
      {
        name: '15g Fast Pure Sugar / Fruit Juice / Honey (Conscious Patients Only)',
        type: 'Rapid Glycemic Rescue',
        mechanism: 'Simple glucose/fructose enters intestinal portal circulation within 5–10 minutes without fat/fiber delay.',
        preparation: '120 ml regular orange/apple juice OR 1 tbsp pure honey/table sugar.',
        dosage: '15 grams carbs every 15 minutes until glucose >70 mg/dL.',
        precautions: 'Avoid chocolate or ice cream first—fat slows sugar absorption! NEVER pour liquids into an unconscious person mouth.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Oral Dextrose 15g Gel/Tablets or Nasal Glucagon',
        brandNames: 'Dex4 Tablets, Baqsimi (Nasal), Gvoke',
        drugClass: 'Rapid Monosaccharide / Glycogenolytic Hormone',
        typicalDose: '15g oral dextrose if awake; 3 mg Baqsimi 1 puff into one nostril if unconscious',
        mechanism: 'Directly raises plasma glucose or stimulates hepatic glycogen release.',
        warnings: 'Always seek clinician review if taking sulfonylureas (Glipizide/Glyburide) as low sugar can recur for 24h.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Confusion, slurred speech, combative behavior, seizures, or loss of consciousness -> Call 911 + Glucagon!'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'sciatica-nerve-pain',
    name: 'Sciatica (Radiating Shooting Leg / Lower Back Nerve Pain)',
    aliases: ['Pinched Sciatic Nerve', 'Lumbar Radiculopathy', 'Shooting Pain Down Leg'],
    icdCode: 'M54.3',
    category: 'musculoskeletal',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC CARE: Sharp, burning, electric pain shooting from one buttock down behind the thigh/calf, sometimes with foot tingling.',
    overview: 'Compression or inflammation of lumbosacral nerve roots (L4–S1), most commonly from a bulging intervertebral disc or piriformis muscle spasm.',
    commonCauses: [
      'Lumbar disc herniation, spinal stenosis, piriformis syndrome, prolonged heavy lifting'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Avoid strict prolonged bed rest (>2 days weakens core muscles); stay gently mobile with short, flat-surface walks.',
        'Place cold packs over lower lumbar spine for 15 mins during first 48 hours to calm acute root swelling, then transition to gentle heat.',
        'Sleep on your side with a firm pillow tucked between your knees.'
      ],
      hourlyCare: [
        'Do gentle McKenzie prone press-ups ONLY if they centralize pain out of the leg; stop immediately if leg shooting worsens.'
      ],
      dailyTimeline: [
        'Book physical therapy / clinic exam if radiating pain or numbness persists past 1–2 weeks.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Alpha-Lipoic Acid (ALA) + Curcumin Nerve Protocol',
        type: 'Neuroprotective Antioxidant & Anti-inflammatory',
        mechanism: 'Lowers perineural oxidative stress and inflammatory cytokines irritating lumbar nerve roots.',
        preparation: 'Oral supplement capsules taken apart from heavy mineral meals.',
        dosage: 'ALA 600 mg once daily + Curcumin 500 mg twice daily.',
        precautions: 'Consult doctor if on insulin/diabetes meds (ALA mildly lowers blood glucose).'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Naproxen Sodium or Ibuprofen',
        brandNames: 'Aleve, Advil',
        drugClass: 'Systemic NSAID',
        typicalDose: 'Naproxen 220–440 mg every 12 hours WITH food (short course <=10 days)',
        mechanism: 'Dampens prostaglandin inflammation swelling the compressed lumbar nerve root.',
        warnings: 'Avoid with stomach ulcers, kidney disease, or blood thinners.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Gabapentin or Short Oral Steroid Taper (Prescribed)',
        brandNames: 'Neurontin, Medrol Dosepak',
        drugClass: 'Gabapentinoid Nerve Modulator / Corticosteroid',
        typicalDose: 'Physician-prescribed titration if severe radicular burning persists',
        mechanism: 'Calms ectopic firing along irritated dorsal root ganglion neurons.',
        warnings: 'May cause initial drowsiness/dizziness; never stop abruptly.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Loss of bowel or bladder control OR numbness in the groin/saddle area ("Cauda Equina Syndrome" -> SURGICAL EMERGENCY ER!)',
      'Sudden inability to lift front of foot ("foot drop")',
      'Back pain with unexplained fever or history of cancer'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'shingles-herpes-zoster',
    name: 'Shingles (Painful One-Sided Blistering Nerve Rash)',
    aliases: ['Herpes Zoster', 'Burning Dermatome Rash'],
    icdCode: 'B02.9',
    category: 'skin_dermatology',
    triage: 'MODERATE',
    urgencySummary: 'TIME-SENSITIVE CLINIC (WITHIN 72 HOURS!): Painful, burning, tingling strip of red blisters strictly on ONE side of torso or face.',
    overview: 'Reactivation of dormant Varicella-Zoster (chickenpox) virus traveling down a single sensory nerve pathway.',
    commonCauses: [
      'Age-related decline in VZV cellular immunity (>50 years), stress, or immunosuppression'
    ],
    howToHandleIt: {
      immediateSteps: [
        'See a Walk-in Clinic within 72 HOURS of rash onset—starting oral antivirals early dramatically cuts blistering and prevents chronic Postherpetic Neuralgia nerve pain!',
        'Cover active fluid blisters cleanly; stay away from pregnant women, newborns, and immunocompromised people until every blister crusts over.'
      ],
      hourlyCare: [
        'Apply cool wet compresses and soothing calamine lotion for itching/burning.',
        'Wear loose soft cotton clothing over the nerve strip.'
      ],
      dailyTimeline: [
        'Complete full 7-day Valacyclovir antiviral course; ask doctor about Shingrix vaccine after recovery.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Colloidal Oatmeal Baths & Cool Wet Compresses',
        type: 'Soothing Dermatological Barrier',
        mechanism: 'Avenanthramides calm neurogenic skin itch and cool burning dermatomal C-fibers.',
        preparation: 'Soak in lukewarm bath with 1 cup colloidal oatmeal for 15 minutes; apply cool moist cloth 20 mins PRN.',
        dosage: '1–2 times daily until blisters crust dry.',
        precautions: 'Avoid scrubbing blisters or applying thick occlusive antibiotic ointments on viral vesicles.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Valacyclovir (Critical Early Prescription)',
        brandNames: 'Valtrex',
        drugClass: 'Nucleoside Analogue Antiviral',
        typicalDose: '1000 mg orally 3 times daily for 7 days (start within 72 hours of rash!)',
        mechanism: 'Halts viral DNA polymerase replication inside sensory ganglia.',
        warnings: 'Hydrate abundantly during therapy to protect renal tubules.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Lidocaine 4% Topical Patch + Acetaminophen/Ibuprofen',
        brandNames: 'Salonpas Lidocaine, Tylenol',
        drugClass: 'Local Sodium-Channel Blocker',
        typicalDose: '4% Lidocaine patch on INTACT painful skin only (12 hrs on / 12 hrs off)',
        mechanism: 'Numbs hyperexcitable cutaneous nociceptors.',
        warnings: 'Do NOT place lidocaine patches directly on open weeping blisters.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Blisters on the TIP OF THE NOSE, forehead, or around one eye (Hutchinson sign -> Urgent Ophthalmology ER to prevent blindness!)',
      'Severe headache, neck stiffness, or confusion'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'fungal-ringworm-tinea',
    name: 'Ringworm / Athlete’s Foot / Fungal Skin Rash (Tinea)',
    aliases: ['Tinea Corporis', 'Tinea Pedis', 'Jock Itch', 'Scaly Ring Rash'],
    icdCode: 'B35.9',
    category: 'skin_dermatology',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE / PHARMACY: Itchy circular red rash with raised scaly outer edge and clearer center, or peeling between toes.',
    overview: 'Superficial keratin-loving dermatophyte fungal infection on outer skin layer—NOT caused by an actual worm.',
    commonCauses: [
      'Warm damp locker rooms, tight sweaty footwear, pet contact, shared towels'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Keep the infected skin cleanly washed and thoroughly dried (use separate dedicated towel).',
        'CRITICAL: Do NOT put hydrocortisone or steroid creams on a suspected ringworm rash—steroids suppress local immunity and cause rampant "tinea incognito" spread!'
      ],
      hourlyCare: [
        'Apply OTC topical Terbinafine or Clotrimazole cream smoothly 2 cm past the visible border.'
      ],
      dailyTimeline: [
        'Continue antifungal cream for a full 1–2 WEEKS AFTER the visible rash fades completely to eliminate lingering fungal spores.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Diluted Tea Tree Oil (Melaleuca alternifolia 25–50%)',
        type: 'Antifungal Terpene Essential Oil',
        mechanism: 'Terpinen-4-ol disrupts fungal ergosterol cell membranes cleanly on mild tinea pedis.',
        preparation: 'Mix 1 part pure tea tree oil with 3 parts jojoba/coconut oil.',
        dosage: 'Apply cleanly twice daily with cotton swab for 3–4 weeks.',
        precautions: 'Discontinue if contact dermatitis redness develops; never ingest orally.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Terbinafine 1% Topical Cream',
        brandNames: 'Lamisil AT',
        drugClass: 'Allylamine Fungicidal Topical',
        typicalDose: 'Apply thin film to clean dry rash + 2cm rim once or twice daily for 1–2 weeks',
        mechanism: 'Blocks squalene epoxidase enzyme, directly killing dermatophytes faster than older azoles.',
        warnings: 'Wash hands immediately after applying; avoid eyes. Scalp ringworm requires oral prescription antifungals.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Spreading warm pus-filled cellulitis swelling or red streaks',
      'Scalp patches with hair loss (Tinea Capitis needs prescription oral Terbinafine/Griseofulvin)'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'hemorrhoids-piles',
    name: 'Hemorrhoids (Swollen Anal Veins / Rectal Discomfort)',
    aliases: ['Piles', 'Itchy Rectum', 'Bright Red Blood on Toilet Paper'],
    icdCode: 'K64.9',
    category: 'digestive',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE / CLINIC CHECK: Anal itching, soreness when sitting, small amount of bright red blood streaking toilet paper after straining.',
    overview: 'Swollen vascular cushions in the lower rectum or around the anus triggered by elevated abdominal pressure or hard stools.',
    commonCauses: [
      'Chronic constipation straining, prolonged toilet sitting, pregnancy, heavy lifting'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Soak the bottom gently in a warm shallow Sitz bath (plain warm water) for 15–20 minutes right away.',
        'Stop sitting on the toilet scrolling phones (>5 minutes engorges pelvic veins).',
        'Switch dry harsh toilet paper for moist unscented wipes or a gentle bidet rinse.'
      ],
      hourlyCare: [
        'Apply witch hazel cooling pads or OTC soothing barrier ointment.'
      ],
      dailyTimeline: [
        'Add daily Psyllium fiber + 2.5 L water + PEG 3350 if stool is hard so bowel movements glide painlessly.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Warm Water Sitz Bath + Alcohol-Free Witch Hazel Pads',
        type: 'Venous Soothing & Astringent Compress',
        mechanism: 'Warmth relaxes internal anal sphincter spasm and drains engorged venous plexuses; tannins shrink surface swelling.',
        preparation: '15 mins warm sitz soak followed by dabbing cold witch hazel pad gently.',
        dosage: '2–3 times daily and after each bowel movement.',
        precautions: 'Use alcohol-free witch hazel to prevent stinging.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Phenylephrine / Pramoxine / Hydrocortisone 1% Rectal Cream',
        brandNames: 'Preparation H, Anusol-HC',
        drugClass: 'Topical Vasoconstrictor / Local Anesthetic / Low-Potency Steroid',
        typicalDose: 'Apply externally up to 3–4 times daily (limit Hydrocortisone courses strictly to <=7 days)',
        mechanism: 'Temporarily constricts dilated hemorrhoidal venules and numbs irritated sensory fibers.',
        warnings: 'Using topical steroids longer than 7 days thins delicate perianal skin.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Dark maroon or tarry black stools, dizziness, or large bowl-filling blood (GI Bleed -> Urgent Care/ER!)',
      'Sudden rock-hard excruciating purple lump at the anus (Thrombosed external hemorrhoid -> Urgent Care within 72h!)',
      'Any new rectal bleeding in adults over 45 without prior colonoscopy'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'canker-sores-aphthous',
    name: 'Canker Sores (Painful Mouth Ulcers)',
    aliases: ['Aphthous Ulcer', 'Inside Lip Sore', 'Mouth Ulcer'],
    icdCode: 'K12.0',
    category: 'dental_oral',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Small round white/yellow painful ulcer inside cheek, lip, or under tongue; non-contagious.',
    overview: 'Benign focal mucosal ulcerations inside the mouth triggered by minor trauma, stress, acidic foods, toothpaste SLS, or vitamin deficiencies.',
    commonCauses: [
      'Accidental cheek bite, Sodium Lauryl Sulfate (SLS) toothpaste, B12/iron/folate deficiency, stress'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Swish gently with warm baking soda or salt water rinse (1 tsp baking soda in 120 ml warm water) to neutralize acidic sting.',
        'Avoid citrus juices, salty chips, hot coffee, and spicy foods until ulcer epithelializes.'
      ],
      hourlyCare: [
        'Apply OTC benzocaine oral gel right before meals to numb pain while eating.'
      ],
      dailyTimeline: [
        'Switch to an SLS-free toothpaste; typical aphthous ulcers heal completely in 7–14 days.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Warm Baking Soda Saline Rinse & Deglycyrrhizinated Licorice (DGL)',
        type: 'Mucosal Buffer & Protective Coating',
        mechanism: 'Neutralizes oral pH against acid pain while DGL promotes local mucin barrier regeneration.',
        preparation: 'Mix 1/2 tsp baking soda + 1/2 tsp salt in 240 ml warm water; swish 30 sec and spit.',
        dosage: '4 times daily after meals.',
        precautions: 'Do not swallow large amounts of salt/baking soda rinse.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Benzocaine 20% Mucoadhesive Paste',
        brandNames: 'Orajel Mouth Sore Gel, Kanka',
        drugClass: 'Topical Ester Local Anesthetic',
        typicalDose: 'Dab dry spot gently and apply tiny gel coat up to 4 times daily',
        mechanism: 'Temporarily blocks oral mucosal nerve conduction.',
        warnings: 'Do NOT use benzocaine in children under age 2 (rare methemoglobinemia risk).',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Any mouth ulcer lasting >2–3 weeks without shrinking (requires dentist/ENT biopsy check)',
      'Dozens of sores spreading down throat preventing swallowing, or high fever'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'dysmenorrhea-period-cramps',
    name: 'Menstrual Cramps (Primary Dysmenorrhea)',
    aliases: ['Period Pain', 'Uterine Cramping'],
    icdCode: 'N94.4',
    category: 'womens_mens_health',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Lower pelvic cramping radiating to lower back or thighs starting just before or during menstruation.',
    overview: 'High endometrial prostaglandin F2-alpha release causes strong uterine myometrial contractions and temporary uterine ischemia.',
    commonCauses: [
      'Normal ovulatory prostaglandin surges; secondary causes include endometriosis or uterine fibroids'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Place a warm heating pad (40–45°C) across the lower abdomen—clinically comparable in relief to low-dose ibuprofen for smooth muscle relaxation.',
        'Start an NSAID early at the very first twinge of bleeding before prostaglandin buildup peaks.'
      ],
      hourlyCare: [
        'Sip warm ginger or chamomile tea; gentle pelvic stretches or walking improves endorphin release.'
      ],
      dailyTimeline: [
        'Symptoms usually fade cleanly by Day 3 of flow; severe pain refractory to NSAIDs merits gynecology review for endometriosis.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Standardized Ginger Powder + Lower Abdominal Heat',
        type: 'Natural COX/Prostaglandin Modulator',
        mechanism: 'Gingerols suppress uterine prostaglandin synthesis nearly as effectively as mefenamic acid in randomized trials.',
        preparation: 'Fresh ginger tea or standardized ginger capsules.',
        dosage: '250–500 mg ginger 3 times daily starting Day 1 of cycle.',
        precautions: 'High doses may cause mild heartburn.'
      },
      {
        name: 'Magnesium Glycinate + Omega-3 EPA/DHA',
        type: 'Myometrial Relaxant Nutrients',
        mechanism: 'Magnesium antagonizes calcium-mediated uterine muscle spasm.',
        preparation: 'Oral supplement tablets taken nightly.',
        dosage: '200–300 mg magnesium daily during luteal/menstrual days.',
        precautions: 'Reduce dose if loose stools occur.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Naproxen Sodium or Ibuprofen',
        brandNames: 'Aleve, Midol Liquid Gels, Advil',
        drugClass: 'Prostaglandin-Synthetase Inhibitor (First-Line NSAID)',
        typicalDose: 'Naproxen 440 mg first dose then 220 mg every 8–12 hrs WITH FOOD, or Ibuprofen 400 mg every 6 hrs',
        mechanism: 'Directly halts uterine COX prostaglandin production, attacking the root cause of menstrual cramping rather than just masking pain.',
        warnings: 'Take with food; avoid if history of stomach ulcers, NSAID allergy, or pregnancy possibility.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Soaking through 1 or more large pads/tampons every hour for 2 consecutive hours',
      'Foul-smelling discharge with high fever, OR sudden severe pain with a possible positive pregnancy test (Ectopic -> ER!)'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'yeast-infection-vaginal-candidiasis',
    name: 'Vaginal Yeast Infection (Vulvovaginal Candidiasis)',
    aliases: ['Candida Thrush', 'Vaginal Itching & Thick White Discharge'],
    icdCode: 'B37.3',
    category: 'womens_mens_health',
    triage: 'COMMON',
    urgencySummary: 'PHARMACY / CLINIC CHECK: Intense vulvar itching, soreness, redness, and thick odorless cottage-cheese discharge.',
    overview: 'Overgrowth of opportunistic Candida albicans fungus inside vaginal flora, frequently after antibiotic courses, high estrogen, or uncontrolled blood sugar.',
    commonCauses: [
      'Recent broad-spectrum antibiotics, tight synthetic damp clothing, elevated blood glucose'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Wear breathable 100% cotton underwear; avoid scented soaps, douches, or bubble baths.',
        'If this is your VERY FIRST time experiencing these symptoms, see a Clinic first to rule out STI or bacterial vaginosis.'
      ],
      hourlyCare: [
        'Start OTC Miconazole/Clotrimazole vaginal suppository course at bedtime (with external itch cream for outer skin comfort).'
      ],
      dailyTimeline: [
        'Complete full 3-day or 7-day azole treatment (7-day cream is safest if pregnant—avoid oral fluconazole in pregnancy!).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Lactobacillus rhamnosus / reuteri Probiotics',
        type: 'Vaginal Microbiome Restoration',
        mechanism: 'Produces lactic acid and hydrogen peroxide to restore acidic pH (3.8–4.5) and suppress Candida hyphae.',
        preparation: 'Targeted oral probiotic capsule.',
        dosage: 'Once daily alongside or following antibiotic courses.',
        precautions: 'Helpful preventive adjunct; antifungal azoles resolve active symptomatic flares fastest.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Clotrimazole 1%–2% or Miconazole Vaginal Cream',
        brandNames: 'Gyne-Lotrimin, Monistat 3 / Monistat 7',
        drugClass: 'Topical Imidazole Antifungal',
        typicalDose: '1 applicator intravaginally at bedtime for 3 or 7 consecutive nights (7-day recommended during pregnancy)',
        mechanism: 'Inhibits fungal ergosterol biosynthesis, breaking down Candida cell walls.',
        warnings: 'Oil-based vaginal suppositories temporarily weaken latex condoms and diaphragms for up to 72 hours after use.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Fluconazole (Prescription Single Oral Dose)',
        brandNames: 'Diflucan',
        drugClass: 'Systemic Triazole Antifungal',
        typicalDose: '150 mg oral tablet single dose (non-pregnant uncomplicated cases)',
        mechanism: 'Systemic inhibition of Candida CYP450 14-alpha-demethylase.',
        warnings: 'AVOID during pregnancy; interacts with warfarin and certain statins.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Fishy odor with thin gray discharge (Bacterial Vaginosis -> needs prescription Metronidazole)',
      'Lower abdominal pain, fever, or chills (Pelvic Inflammatory Disease -> Urgent Care!)'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'earache-otitis-media-externa',
    name: 'Acute Earache (Swimmer’s Ear / Middle Ear Infection)',
    aliases: ['Ear Pain', 'Otitis Externa', 'Otitis Media'],
    icdCode: 'H92.0',
    category: 'eyes_ears_throat',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC ASSESSMENT: Throbbing ear pain, muffled hearing, tugging ear in children, or tenderness when pulling the outer earlobe.',
    overview: 'Painful infection of either the outer ear canal ("swimmer’s ear" exacerbated by moisture) or fluid trapped behind the eardrum after a cold ("otitis media").',
    commonCauses: [
      'Trapped pool water in ear canal, cotton swab trauma, post-cold Eustachian tube blockage'
    ],
    howToHandleIt: {
      immediateSteps: [
        'NEVER insert cotton swabs (Q-tips) into the ear canal—this impacts wax and tears protective canal skin.',
        'Do NOT place any ear drops inside the ear if fluid/blood/pus is draining out (eardrum may be perforated!).',
        'Hold a warm cloth over the outside ear for comfort and take weight-appropriate Acetaminophen or Ibuprofen.'
      ],
      hourlyCare: [
        'Have a clinician look inside with an otoscope to distinguish viral fluid vs outer canal infection vs bacterial otitis.'
      ],
      dailyTimeline: [
        'Keep ear completely dry during showers until clinician clears canal healing.'
      ]
    },
    naturalRemedies: [
      {
        name: 'External Warm Compress + Steam / Upright Rest',
        type: 'Eustachian Drainage & Pain Soothing',
        mechanism: 'Gentle external warmth reduces middle-ear vascular congestion; sleeping with sore ear elevated aids Eustachian drainage.',
        preparation: 'Warm dry cloth pressed softly over outer ear for 15 minutes.',
        dosage: 'Every 2–3 hours as needed for comfort.',
        precautions: 'Never drip warm garlic oil into an unexamined ear if eardrum perforation is possible.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ibuprofen or Acetaminophen Oral Pain Control',
        brandNames: 'Advil, Motrin, Tylenol',
        drugClass: 'Systemic Analgesic',
        typicalDose: 'Ibuprofen 400 mg every 6h (adult) with food while awaiting otoscopy',
        mechanism: 'Relieves painful periosteal pressure on the tympanic membrane—primary focus during first 48 hrs of mild otitis.',
        warnings: 'Check pediatric weight-based dosing in children; never give Aspirin under age 18.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Ciprofloxacin-Dexamethasone Ear Drops or Oral Amoxicillin',
        brandNames: 'Ciprodex, Amoxil',
        drugClass: 'Otic Fluoroquinolone + Steroid / Oral Antibiotic',
        typicalDose: 'Prescribed strictly after clinician confirms outer vs middle ear diagnosis',
        mechanism: 'Directly clears Pseudomonas in swimmer’s ear or S. pneumoniae in severe otitis media.',
        warnings: 'Prescription otoscopic confirmation avoids unnecessary antibiotics for viral fluid.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Redness, swelling, or tenderness BEHIND the ear bone pushing the ear outward (Mastoiditis -> ER!)',
      'Sudden vertigo, facial drooping, or high fever'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'pink-eye-conjunctivitis',
    name: 'Pink Eye (Infectious / Allergic Conjunctivitis)',
    aliases: ['Red Itchy Eyes', 'Crusty Eyelids', 'Sticky Eye Discharge'],
    icdCode: 'H10.9',
    category: 'eyes_ears_throat',
    triage: 'COMMON',
    urgencySummary: 'CLINIC / HYGIENE: Redness in white of eye, watery or sticky yellow crusting on lashes upon waking, gritty sand-like sensation.',
    overview: 'Inflammation of the clear conjunctiva membrane caused by respiratory adenoviruses, bacteria, or seasonal allergies.',
    commonCauses: [
      'Viral cold co-infection (watery, often starts one eye then spreads), bacterial staph/strep (thick yellow pus), pollen allergies (intense itch)'
    ],
    howToHandleIt: {
      immediateSteps: [
        'REMOVE CONTACT LENSES IMMEDIATELY and switch to glasses until completely cleared (contact wearers with red eye need urgent cornea check!).',
        'Wash hands meticulously; do NOT share pillows, face towels, or eye makeup.',
        'Wipe eyelashes cleanly from inner corner outward using warm damp sterile gauze (single swipe per pad).'
      ],
      hourlyCare: [
        'Use preservative-free lubricating artificial tears chilled in fridge for gritty relief; use antihistamine drops (Olopatadine) if purely itchy/allergic.'
      ],
      dailyTimeline: [
        'Discard contaminated mascara and soaked contact lens cases; see clinic if thick pus persists past 48h.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Cool / Warm Clean Sterile Compress & Preservative-Free Saline Tears',
        type: 'Soothing Ocular Flush',
        mechanism: 'Physically dilutes viral/allergic inflammatory mediators without irritating delicate corneal epithelium.',
        preparation: 'Clean single-use sterile damp cotton pad resting lightly over closed eyelids for 5–10 mins.',
        dosage: '3–4 times daily (use fresh pad for each eye to avoid cross-contamination!).',
        precautions: 'NEVER make homemade tap-water eye washes (risk of blinding Acanthamoeba keratitis) or drip herbal teas/honey into eyes!'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Olopatadine 0.2% / 0.7% (For Allergic Pink Eye)',
        brandNames: 'Pataday Twice/Once Daily',
        drugClass: 'Dual Mast-Cell Stabilizer & H1 Antihistamine Drop',
        typicalDose: '1 drop in each affected eye once or twice daily (remove contacts first)',
        mechanism: 'Stops ocular itching within minutes for allergic conjunctivitis.',
        warnings: 'Does not treat bacterial pus; avoid redness-reliever drops like Visine which cause rebound redness.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Erythromycin Ophthalmic Ointment or Polymyxin B/Trimethoprim',
        brandNames: 'Polytrim, Ilotycin',
        drugClass: 'Topical Ophthalmic Antibiotic (Bacterial Only)',
        typicalDose: 'Prescribed for thick yellow/green mucopurulent discharge after clinician exam',
        mechanism: 'Eradicates bacterial pathogens on conjunctival surface.',
        warnings: 'Do not touch dropper tip to eyeball; contact-lens wearers require antipseudomonal prescription drops.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Moderate-to-severe deep eye pain, blurred vision, or painful light sensitivity (photophobia)',
      'Red eye while wearing soft/overnight contact lenses (Corneal Ulcer -> Same-day Urgent Eye Exam!)'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'eczema-atopic-dermatitis',
    name: 'Eczema Flare (Dry, Cracked, Intensely Itchy Skin)',
    aliases: ['Atopic Dermatitis', 'Itchy Dry Patches', 'Flexural Rash'],
    icdCode: 'L20.9',
    category: 'skin_dermatology',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Dry scaly red/hyperpigmented patches inside elbows, behind knees, neck, or hands with severe itch.',
    overview: 'Genetically impaired skin barrier function allowing moisture loss ("leaky skin") and easy penetration by irritants, allergens, and scratching triggers.',
    commonCauses: [
      'Dry winter air, hot showers, fragranced detergents/soaps, wool clothing, dust mites, stress'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Take short lukewarm (never hot!) 5–10 minute showers with fragrance-free gentle cleanser.',
        'Apply the "Soak and Seal" Rule within 3 minutes of patting dry: lock moisture in with thick fragrance-free ointment/ceramide cream (NEVER watery scented lotions!).'
      ],
      hourlyCare: [
        'Keep fingernails clipped short; resist scratching by pressing a cool damp cloth onto itchy spots.'
      ],
      dailyTimeline: [
        'Use short thin courses of OTC Hydrocortisone 1% on inflamed red patches only, while applying thick barrier emollients 2–3 times daily year-round.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Colloidal Oatmeal Soaks + Pure Virgin Shea/Ceramide Barrier',
        type: 'Lipid-Restoring Emollient',
        mechanism: 'Beta-glucans and lipids repair stratum corneum cracks and block trans-epidermal water loss.',
        preparation: 'Lukewarm bath with colloidal oatmeal followed within 3 minutes by heavy unscented balm.',
        dosage: 'Apply barrier cream at least twice daily and immediately after handwashing.',
        precautions: 'Always patch-test natural oils first—raw essential oils worsen eczema flares.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Hydrocortisone 1% Cream (OTC Topical Steroid)',
        brandNames: 'Cortizone-10 Intensive Healing',
        drugClass: 'Low-Potency Topical Corticosteroid',
        typicalDose: 'Apply thin film ONLY on red itchy inflamed areas twice daily for up to 7–14 days, layered under thick emollient',
        mechanism: 'Downregulates cutaneous cytokine signaling to break the itch-scratch cycle.',
        warnings: 'Avoid prolonged unmonitored steroid application on thin eyelid/facial skin; seek clinic for prescription Triamcinolone or non-steroidal Tacrolimus if stubborn.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Cetirizine or Hydroxyzine (Itch Relief)',
        brandNames: 'Zyrtec, Atarax',
        drugClass: 'Antihistamine Adjunct',
        typicalDose: 'Cetirizine 10 mg daily (primarily helps sleep-disrupting itch)',
        mechanism: 'Modestly dampens peripheral histamine component.',
        warnings: 'Barrier creams + topical anti-inflammatories treat eczema directly far better than pills alone.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Golden honey-colored crusting, weeping yellow pus, or sudden painful punched-out blisters (Secondary bacterial Impetigo or Eczema Herpeticum -> Urgent Clinic!)'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'mild-panic-attack-anxiety',
    name: 'Acute Panic Attack / Intense Anxiety Surge',
    aliases: ['Panic Episode', 'Racing Heart + Tingling Hands', 'Sense of Doom'],
    icdCode: 'F41.0',
    category: 'mental_sleep',
    triage: 'MODERATE',
    urgencySummary: 'GROUNDING CARE (RULE OUT CARDIAC FIRST TIME): Sudden wave of intense fear peaking in 10 minutes with pounding heart, air hunger, sweating, hand tingling.',
    overview: 'Sudden activation of the sympathetic fight-or-flight alarm without real external physical danger, causing hyperventilation that temporarily shifts blood CO2 and causes tingling/dizziness.',
    commonCauses: [
      'Acute life stress, caffeine overdose, sleep deprivation, trauma reminders, hyperthyroidism (medical mimic)'
    ],
    howToHandleIt: {
      immediateSteps: [
        'CRITICAL: If this is your VERY FIRST chest pain/shortness of breath episode or you have cardiac risk factors, get an ECG at Urgent Care/ER first—do not assume panic!',
        'Slow exhale breathing immediately: Inhale softly through nose for 4 seconds, hold 4–7 seconds, exhale slowly through pursed lips for 7–8 seconds ("physiological sigh" slows heart rate via vagus nerve).',
        'Splash cold water onto cheeks/forehead (triggers mammalian dive reflex to rapidly drop heart rate).'
      ],
      hourlyCare: [
        'Use the 5-4-3-2-1 sensory grounding anchor; avoid extra caffeine or stimulants.',
        'Use the Hope & Support Sanctuary tab in this app anytime if distress feels heavy or persistent.'
      ],
      dailyTimeline: [
        'Schedule primary clinic visit to check thyroid TSH, iron, and discuss Cognitive Behavioral Therapy (CBT).'
      ]
    },
    naturalRemedies: [
      {
        name: '4-7-8 Vagal Breathing + L-Theanine / Chamomile Infusion',
        type: 'Autonomic Parasympathetic Activation',
        mechanism: 'Prolonged exhalations stimulate vagal acetylcholine release on the SA node; L-theanine promotes alpha brainwave calm without sedation.',
        preparation: 'L-Theanine 200 mg capsule or warm double-bagged chamomile tea after slow breathing cycles.',
        dosage: '100–200 mg L-theanine as needed for daytime nervousness.',
        precautions: 'Avoid mixing sedative herbs (valerian/kava) with prescription anxiety meds or alcohol.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Propranolol or Hydroxyzine (Clinic Prescribed)',
        brandNames: 'Inderal, Vistaril',
        drugClass: 'Beta-Blocker / Non-Habit-Forming Antihistamine Anxiolytic',
        typicalDose: 'Per physician prescription ONLY (e.g., Hydroxyzine 25 mg PRN or Propranolol 10–20 mg for physical racing pulse)',
        mechanism: 'Propranolol blocks peripheral adrenaline beta-receptors (stops shaking/pounding pulse); Hydroxyzine calms CNS histamine arousal.',
        warnings: 'Avoid Propranolol if you have asthma; schedule primary care evaluation for sustainable SSRI/CBT care rather than chronic benzodiazepines.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Thoughts of self-harm or suicide (Open Hope & Support tab immediately or Call/Text 988!)',
      'Crushing chest pressure radiating to arm/jaw, fever, or fainting'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'influenza-acute-flu',
    name: 'Influenza (Acute Flu: High Fever, Body Aches, Chills)',
    aliases: ['Seasonal Flu', 'Influenza A/B', 'Severe Malaise + Fever'],
    icdCode: 'J11.1',
    category: 'respiratory',
    triage: 'MODERATE',
    urgencySummary: 'HOME / EARLY CLINIC (<48h): Abrupt hit of high fever (>38.5°C), heavy muscle/joint aches, dry cough, exhaustion.',
    overview: 'Acute viral respiratory illness caused by Influenza A or B viruses; distinct from a mild cold by abrupt systemic fever and body aches.',
    commonCauses: [
      'Airborne droplet transmission of seasonal Influenza A/B'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Rest aggressively and isolate from elderly, infants, or immunocompromised household members.',
        'If high-risk (asthma, heart disease, pregnancy, diabetes, >65) OR onset within 48 hours: visit clinic/telehealth promptly for rapid flu swab and possible Oseltamivir (Tamiflu).'
      ],
      hourlyCare: [
        'Hydrate continuously with warm electrolyte broths; rotate Acetaminophen or Ibuprofen for body aches and fever comfort.'
      ],
      dailyTimeline: [
        'Fever typically eases by Day 3–5; cough fatigue can linger 2 weeks. Seek urgent care if fever spikes back up after improving (secondary bacterial pneumonia!).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Standardized Black Elderberry (Sambucus nigra) + Honey Ginger Broth',
        type: 'Antiviral Polyphenol Syrup',
        mechanism: 'Anthocyanins inhibit influenza hemagglutinin surface spikes in vitro and trimmed symptom duration by ~2–4 days in several clinical trials when started within 48h.',
        preparation: 'Verified commercial elderberry syrup (NEVER raw unboiled elderberries, which are toxic) + raw honey (over age 1).',
        dosage: '10–15 ml standardized extract 3–4 times daily for 3–5 days.',
        precautions: 'Consult doctor before use if on immunosuppressive drugs; NEVER give honey under 12 months.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Oseltamivir Phosphate (Within 48 Hours of Onset)',
        brandNames: 'Tamiflu',
        drugClass: 'Neuraminidase Inhibitor Antiviral',
        typicalDose: '75 mg orally twice daily WITH FOOD for 5 days (by prescription)',
        mechanism: 'Blocks viral neuraminidase enzyme, preventing newly replicated flu virions from budding off infected airway cells.',
        warnings: 'Greatest benefit when started <48 hours of symptom start; take with snack to avoid nausea.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Acetaminophen or Ibuprofen',
        brandNames: 'Tylenol, Advil',
        drugClass: 'Antipyretic Analgesic',
        typicalDose: 'Acetaminophen 500–650 mg every 6h OR Ibuprofen 400 mg every 6–8h with food',
        mechanism: 'Hypothalamic COX inhibition reduces distressing fever and myalgias.',
        warnings: 'NEVER give Aspirin to children or teens with viral flu (risk of fatal Reye syndrome).',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Shortness of breath, fast breathing, chest pain, or bluish lips',
      'Fever returning higher on Day 5–7 with thick rust-colored mucus (secondary pneumonia!)',
      'Confusion or inability to stay hydrated'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'iron-deficiency-anemia',
    name: 'Fatigue, Pallor & Dizzy Lightheadedness (Suspected Anemia)',
    aliases: ['Low Iron', 'Pale Lower Eyelids', 'Breathless on Stairs'],
    icdCode: 'D50.9',
    category: 'endocrine_metabolic',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC BLOOD TEST: Pale skin/gums, brittle nails, rapid heartbeat/shortness of breath climbing stairs, dizziness, craving ice.',
    overview: 'Reduced oxygen-carrying red blood cells or hemoglobin, most commonly caused by depleted body iron stores or B12 deficiency.',
    commonCauses: [
      'Heavy menstrual bleeding, unrecognized slow GI blood loss, low dietary iron, celiac malabsorption, pregnancy'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Schedule a Clinic CBC + Ferritin + Vitamin B12 blood test BEFORE blindly taking iron pills (taking iron without confirmed deficiency can mask causes or overload liver!).',
        'Rise slowly from bed/chairs to avoid orthostatic dizziness.'
      ],
      hourlyCare: [
        'Pair iron-rich meals (lean beef, lentils, spinach) with Vitamin C (citrus/bell pepper) and separate them by 2 hours from tea/coffee/milk (tannins & calcium block iron absorption!).'
      ],
      dailyTimeline: [
        'Confirmed iron-deficiency anemia typically requires 3–6 months of targeted oral iron to rebuild ferritin reserves.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Heme/Plant Iron Paired with Vitamin C (Ascorbic Acid)',
        type: 'Nutritional Erythropoiesis Protocol',
        mechanism: 'Vitamin C reduces ferric (Fe3+) to easily absorbable ferrous (Fe2+) iron in the duodenum.',
        preparation: 'Lentil/spinach meal drizzled with fresh lemon juice OR fortified food taken apart from coffee/black tea.',
        dosage: 'Daily dietary optimization alongside physician lab monitoring.',
        precautions: 'Do NOT self-supplement high-dose iron in adult men or postmenopausal women until GI blood loss is ruled out.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ferrous Bisglycinate or Ferrous Sulfate (After Lab Confirmation)',
        brandNames: 'Slow FE, Gentle Iron (Bisglycinate)',
        drugClass: 'Oral Iron Replacement',
        typicalDose: '65 mg elemental iron every OTHER day on empty stomach with orange juice/water (alternate-day dosing improves absorption & cuts nausea!)',
        mechanism: 'Directly supplies iron substrate for bone marrow hemoglobin synthesis.',
        warnings: 'Expected harmless dark green/black stools (distinct from tarry sticky GI bleed); store iron strictly locked away from children (fatal pediatric overdose risk!).',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Chest pain, fainting, black sticky tarry stools, or vomiting blood (Active hemorrhage -> ER!)',
      'Shortness of breath at rest'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'plantar-fasciitis-heel-pain',
    name: 'Morning Heel Pain (Plantar Fasciitis)',
    aliases: ['Heel Spur Pain', 'First Step Morning Heel Stab'],
    icdCode: 'M72.2',
    category: 'musculoskeletal',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Sharp stabbing pain under the heel on your very first steps out of bed in the morning that loosens slightly after walking.',
    overview: 'Micro-tears and chronic degenerative collagen stress along the thick plantar fascia band supporting the foot arch.',
    commonCauses: [
      'Sudden increase in standing/running mileage, worn-out flat shoes, tight calf/Achilles muscles'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Before stepping out of bed: sit on edge of bed and stretch toes gently backward toward your shin for 30 seconds x 3 reps.',
        'Put on supportive cushioned arch-support sandals/sneakers immediately (NO barefoot walking on hard tile floors!).'
      ],
      hourlyCare: [
        'Roll sole of painful foot over a frozen water bottle for 12–15 minutes to combine cryotherapy + fascial massage.'
      ],
      dailyTimeline: [
        'Perform daily wall calf stretches and insert firm OTC arch-support insoles into all everyday shoes.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Frozen Water Bottle Roll + Eccentric Calf Stretching',
        type: 'Mechanical Fascia Release & Cryotherapy',
        mechanism: 'Cold diminishes calcaneal enthesis inflammation while stretching tight gastrocnemius-soleus pulls stops overnight plantar shortening.',
        preparation: 'Roll arch firmly back and forth over frozen 500 ml plastic bottle.',
        dosage: '15 minutes twice daily + morning bed stretches.',
        precautions: 'Stop aggressive rolling if sharp bone tenderness increases (rule out calcaneal stress fracture).'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Diclofenac 1% Topical Gel or Ibuprofen',
        brandNames: 'Voltaren Arthritis Gel, Advil',
        drugClass: 'Topical / Oral NSAID',
        typicalDose: 'Rub 2 grams Diclofenac gel cleanly into heel underside up to 4 times daily',
        mechanism: 'Delivers localized COX anti-inflammatory relief directly to the plantar insertion with minimal stomach exposure.',
        warnings: 'Wash hands cleanly after application; wear supportive footwear consistently alongside analgesia.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Inability to bear any weight after sudden injury, numbness/tingling in sole (Tarsal Tunnel), or redness/fever'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'tinnitus-ear-ringing',
    name: 'Ringing / Buzzing in the Ears (Tinnitus)',
    aliases: ['Ear Ringing', 'Roaring Buzzing Sound'],
    icdCode: 'H93.1',
    category: 'eyes_ears_throat',
    triage: 'MODERATE',
    urgencySummary: 'CLINIC / ENT CHECK: Persistent ringing, hissing, or buzzing perceived in one or both ears without an external sound source.',
    overview: 'Phantom auditory neural activity typically triggered by subtle cochlear hair-cell fatigue, impacted earwax, jaw TMJ tension, or high-dose NSAID/aspirin exposure.',
    commonCauses: [
      'Loud concert/headphone noise exposure, cerumen (earwax) impaction, high stress/insomnia, medications (high-dose aspirin, certain diuretics)'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Review recent medications: high doses of Aspirin, Ibuprofen, or excess caffeine can trigger temporary reversible ringing.',
        'Avoid complete dead silence at night—play soft low-level brown noise, fan sound, or gentle rain audio to prevent brain auditory gain amplification.'
      ],
      hourlyCare: [
        'Protect ears immediately with earplugs around loud machinery or traffic.'
      ],
      dailyTimeline: [
        'Book clinic otoscopy to remove harmless impacted earwax or order audiometry if unilateral.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Sound Enrichment (Brown/Pink Noise) + Jaw Relaxation',
        type: 'Auditory Habituation Therapy',
        mechanism: 'Reduces contrast between internal tinnitus signal and background quiet, promoting rapid neural habituation.',
        preparation: 'Steady soft bedside rain/fan sound slightly softer than the ringing level.',
        dosage: 'Nightly during sleep onset.',
        precautions: 'Avoid blasting masking audio loudly through in-ear buds.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Carbamide Peroxide 6.5% Ear Drops (Only If Earwax Impaction Confirmed)',
        brandNames: 'Debrox',
        drugClass: 'Cerumenolytic Softener',
        typicalDose: '5–10 drops in affected ear twice daily up to 4 days (only if eardrum is intact)',
        mechanism: 'Releases oxygen micro-foam to soften hardened earwax blocking the tympanic membrane.',
        warnings: 'NEVER use if there is ear pain, drainage, or history of perforated eardrum.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Rhythmic WHOOSHING pulsing in sync with your heartbeat (Pulsatile Tinnitus -> Urgent vascular/neuro workup!)',
      'Sudden tinnitus in ONLY ONE ear paired with sudden hearing drop -> Needs ENT steroids within 72 hours!'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'gallstones-biliary-colic',
    name: 'Right Upper Abdominal Attack After Fatty Meal (Suspected Gallstones)',
    aliases: ['Biliary Colic', 'Gallbladder Attack', 'Pain Right Under Ribs to Shoulder Blade'],
    icdCode: 'K80.2',
    category: 'digestive',
    triage: 'URGENT',
    urgencySummary: 'URGENT / CLINIC EVALUATION: Deep gripping pain under the right ribcage after greasy/fatty meals, often radiating into the right shoulder blade with nausea.',
    overview: 'Temporary blockage of the gallbladder cystic duct by a cholesterol/pigment gallstone when the gallbladder contracts to digest fats.',
    commonCauses: [
      'Cholesterol gallstones, rapid weight loss, pregnancy, high saturated-fat meals'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Stop eating immediately—even light snacks re-trigger painful gallbladder contraction during an attack.',
        'If pain lasts >4–6 hours continuously OR brings fever, chills, or yellowing eyes: GO TO EMERGENCY ROOM IMMEDIATELY (Acute Cholecystitis / Pancreatitis!).'
      ],
      hourlyCare: [
        'Sip small amounts of plain water only; rest with warm compress over upper right abdomen.'
      ],
      dailyTimeline: [
        'Schedule abdominal ultrasound urgently and adhere strictly to a very low-fat bland diet until evaluated by surgery.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Hospital IV Analgesia / Laparoscopic Cholecystectomy (Definitive)',
        brandNames: 'Urgent Surgical Protocol',
        drugClass: 'Definitive Surgical Care / NSAID Biliary Control',
        typicalDose: 'Prescribed Ketorolac/IV analgesia in clinic/ED; surgical removal cures recurrent attacks permanently',
        mechanism: 'Removes stone-forming gallbladder cleanly via minimally invasive laparoscopy.',
        warnings: 'Avoid risky internet "gallbladder olive oil flushes"—they can force stones dangerously into the common bile duct causing acute pancreatitis!',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Pain lasting continuously >5 hours',
      'Fever/chills, yellowing eyes/skin (jaundice), pale clay stools, or dark tea urine (Bile duct obstruction -> ER!)'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'carpal-tunnel-wrist-tingling',
    name: 'Numb / Tingling Thumb, Index & Middle Fingers (Carpal Tunnel)',
    aliases: ['Median Nerve Compression', 'Nighttime Hand Numbness', 'Typing Wrist Pain'],
    icdCode: 'G56.0',
    category: 'musculoskeletal',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE / CLINIC: Tingling pins-and-needles waking you at night in thumb, index, middle fingers—relieved by shaking hands out.',
    overview: 'Swelling inside the narrow fibrous wrist carpal tunnel compresses the median nerve against flexor tendons.',
    commonCauses: [
      'Sleeping with bent wrists, repetitive keyboard/tool gripping, pregnancy fluid retention, hypothyroidism'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Wear a neutral wrist cock-up splint EVERY NIGHT while sleeping (prevents wrist flexion that spikes carpal tunnel pressure 8x during sleep!).',
        'Adjust desk ergonomics so elbows sit at 90 degrees and wrists hover straight, never resting hard on sharp desk edges.'
      ],
      hourlyCare: [
        'Perform gentle 30-second median nerve tendon-gliding hand stretches every 1–2 hours of typing.'
      ],
      dailyTimeline: [
        'Consistent nighttime splinting improves mild-to-moderate symptoms within 3–6 weeks; see clinic if dropping objects or thumb muscle flattens.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Neutral Nighttime Wrist Splinting + Warm Contrast Soaks',
        type: 'Mechanical Nerve Decompression',
        mechanism: 'Keeps carpal canal at maximum cross-sectional area overnight to allow ischemic median nerve recovery.',
        preparation: 'Soft cushioned metal-stay neutral wrist brace fitted snugly without tight straps.',
        dosage: 'Every night for 6 weeks.',
        precautions: 'Loosen strap immediately if fingertips turn cold or pale.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Topical Diclofenac Gel or Short-Term Ibuprofen',
        brandNames: 'Voltaren Gel, Advil',
        drugClass: 'Anti-inflammatory Adjunct',
        typicalDose: 'Topical gel over flexor wrist creases 3–4 times daily',
        mechanism: 'Eases associated wrist flexor tenosynovitis discomfort (splinting & steroid injections are more effective for nerve compression).',
        warnings: 'Noticeable thumb base muscle wasting (thenar atrophy) requires prompt orthopedic nerve release surgery.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Constant loss of grip strength, dropping coffee cups, or visible flattening of muscle pad below thumb'
    ],
    recommendedFacilityType: 'clinic'
  }
];
