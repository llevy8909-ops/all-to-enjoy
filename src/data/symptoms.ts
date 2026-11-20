import { SymptomEntry } from '../types/medical';
import { SYMPTOMS_EXTENDED_DATA } from './symptoms_extended';

const CORE_SYMPTOMS_DATA: SymptomEntry[] = [
  // ==========================================
  // 1. EMERGENCY (Call Emergency 911 / 112 / 999 Immediately)
  // ==========================================
  {
    id: 'heart-attack',
    name: 'Chest Pain / Suspected Heart Attack',
    aliases: ['Myocardial Infarction', 'Crushing Chest Pressure', 'Angina'],
    category: 'cardiovascular',
    triage: 'EMERGENCY',
    urgencySummary: 'LIFE-THREATENING EMERGENCY: Immediate 911/112 ambulance dispatch required. Time is heart muscle.',
    overview: 'Sudden or crushing pressure, squeezing, fullness, or pain in the center of the chest lasting more than a few minutes, radiating to the left shoulder, jaw, neck, back, or abdomen, often accompanied by cold sweat, nausea, or shortness of breath.',
    commonCauses: [
      'Coronary Artery Occlusion / Thrombosis',
      'Acute Coronary Syndrome (ACS)',
      'Aortic Dissection',
      'Pulmonary Embolism'
    ],
    skipHomeRemedies: true,
    howToHandleIt: {
      immediateSteps: [
        'CALL EMERGENCY DISPATCH (911 / 112 / 999) IMMEDIATELY. State: "Suspected heart attack, conscious/unconscious".',
        'Have patient sit down and rest in a comfortable position (half-seated with knees bent to reduce heart strain).',
        'If the patient has no aspirin allergy or bleeding disorder, administer 1 adult chewable Aspirin (325 mg) or 2-4 baby aspirins (81 mg each). Chewing speeds absorption into bloodstream.',
        'Loosen tight clothing around the neck, chest, and waist.'
      ],
      hourlyCare: [
        'Monitor pulse and breathing continuously while waiting for emergency responders.',
        'Locate the nearest Automated External Defibrillator (AED) if in a public or commercial building.',
        'If patient becomes unresponsive and stops breathing normally, begin CPR immediately (100-120 chest compressions per minute).'
      ],
      dailyTimeline: [
        'Hospital coronary catheterization / angioplasty or ICU cardiac monitoring under cardiologists.',
        'Prescription cardiac rehabilitation (beta-blockers, statins, dual antiplatelet therapy).'
      ]
    },
    naturalRemedies: [
      {
        name: 'STRICT MEDICAL WARNING: NO NATURAL HOME REMEDIES',
        type: 'Emergency Protocol',
        mechanism: 'Herbs, teas, and essential oils have NO role during acute myocardial infarction and delay life-saving hospital intervention.',
        preparation: 'Do not ingest garlic, cayenne, or oils during an active heart attack.',
        dosage: 'N/A - Emergency Hospital Only',
        precautions: 'Delaying emergency care significantly increases mortality. Call 911/112.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Aspirin (Chewable Acetylsalicylic Acid)',
        brandNames: 'Bayer Chewable, St. Joseph',
        drugClass: 'Platelet Aggregation Inhibitor',
        typicalDose: '162 mg to 325 mg chewed immediately upon onset of symptoms (if no contraindications)',
        mechanism: 'Rapidly inhibits thromboxane A2 synthesis to prevent further coronary clot enlargement.',
        warnings: 'Do NOT take if allergic to aspirin, history of active GI hemorrhage, or suspected aortic dissection.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Nitroglycerin Sublingual (Hospital / Prescription)',
        brandNames: 'Nitrostat, Nitrolingual',
        drugClass: 'Nitrate Vasodilator',
        typicalDose: '0.4 mg sublingual tablet under tongue every 5 minutes (max 3 doses) if prescribed for angina',
        mechanism: 'Relaxes smooth muscle and dilates coronary arteries, reducing cardiac preload.',
        warnings: 'NEVER take if patient has used PDE-5 inhibitors (e.g. Viagra, Cialis) in last 24-48 hours (causes fatal hypotension).',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Crushing central chest pain or squeezing sensation',
      'Pain radiating down left arm, jaw, teeth, or upper back',
      'Cold diaphoresis (profuse cold sweat) and pale/ashen skin',
      'Shortness of breath or lightheaded dizziness / syncope'
    ],
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'stroke-fast',
    name: 'Stroke / Transient Ischemic Attack (FAST)',
    aliases: ['Brain Attack', 'Cerebrovascular Accident', 'Hemiplegia'],
    category: 'head_neurological',
    triage: 'EMERGENCY',
    urgencySummary: 'CRITICAL EMERGENCY: Use FAST test. Every minute without treatment destroys 1.9 million brain neurons.',
    overview: 'Sudden interruption of blood supply to the brain, causing sudden facial drooping, one-sided arm or leg weakness, difficulty speaking or understanding, severe headache, or sudden loss of balance.',
    commonCauses: [
      'Ischemic Thromboembolism (87% of strokes)',
      'Intracerebral Hemorrhage',
      'Subarachnoid Hemorrhage / Ruptured Aneurysm'
    ],
    skipHomeRemedies: true,
    howToHandleIt: {
      immediateSteps: [
        'PERFORM F.A.S.T. TEST: Face (smile uneven?), Arms (raise both?), Speech (slurred?), Time (note exact onset time and CALL 911/112).',
        'Do NOT give the patient anything to eat, drink, or swallow (severe aspiration risk due to pharyngeal paralysis).',
        'Do NOT give aspirin (if the stroke is hemorrhagic, aspirin can cause fatal intracranial bleeding until CT scan confirms type).',
        'Lay the person flat on their side (recovery position) if vomiting or semi-upright if conscious.'
      ],
      hourlyCare: [
        'Note the exact time symptoms started—clot-busting medication (tPA/Alteplase) must typically be administered within 3 to 4.5 hours.',
        'Keep patient calm, warm, and monitored until emergency paramedics arrive.'
      ],
      dailyTimeline: [
        'Emergency hospital neuro-imaging (CT/MRI) and thrombectomy or thrombolytic therapy.',
        'Intensive neuro-critical care and specialized stroke rehabilitation.'
      ]
    },
    naturalRemedies: [
      {
        name: 'STRICT WARNING: ZERO HOME TREATMENT',
        type: 'Emergency Protocol',
        mechanism: 'Acute ischemic or hemorrhagic stroke cannot be managed at home.',
        preparation: 'Immediate hospital transport via ambulance.',
        dosage: 'N/A',
        precautions: 'Do not administer water or pills.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Alteplase (tPA) / Tenecteplase (Hospital IV Only)',
        brandNames: 'Activase, TNKase',
        drugClass: 'Tissue Plasminogen Activator',
        typicalDose: 'Administered strictly in Hospital ER/ICU via IV infusion based on body weight',
        mechanism: 'Binds to fibrin in a thrombus and converts plasminogen to plasmin, dissolving the cerebral clot.',
        warnings: 'Must be given strictly within 3-4.5 hour therapeutic window after non-contrast head CT rules out hemorrhage.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Facial droop on one side of the mouth',
      'Arm drift or complete motor weakness in one extremity',
      'Inability to speak, word salad, or incomprehensible speech',
      'Sudden loss of vision in one or both eyes',
      'Sudden thunderclap headache ("worst headache of my life")'
    ],
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'anaphylaxis',
    name: 'Severe Allergic Anaphylaxis',
    aliases: ['Anaphylactic Shock', 'Severe Peanut / Bee Allergy', 'Angioedema'],
    category: 'pediatric_allergy',
    triage: 'EMERGENCY',
    urgencySummary: 'AIRWAY EMERGENCY: Immediate Epinephrine Auto-Injector (EpiPen) administration and emergency transport.',
    overview: 'A rapid, life-threatening multi-system allergic reaction characterized by throat swelling, audible stridor, hives/wheals, severe hypotension, bronchospasm, and tongue or lip edema following exposure to an allergen (nuts, insect stings, medications, latex).',
    commonCauses: [
      'Food Allergies (Peanuts, Tree Nuts, Shellfish, Eggs)',
      'Hymenoptera Stings (Wasps, Bees, Hornets)',
      'Medication Reactions (Penicillin, Cephalosporins, NSAIDs)',
      'Radiocontrast media or Latex'
    ],
    skipHomeRemedies: true,
    howToHandleIt: {
      immediateSteps: [
        'INJECT EPINEPHRINE IMMEDIATELY (EpiPen / Auvi-Q) into the outer mid-thigh. Hold firmly in place for 3 to 10 seconds.',
        'CALL 911 / 112 / 999 IMMEDIATELY and state "Anaphylactic shock requiring ALS ambulance".',
        'Lay patient flat on their back with legs elevated 30 cm (Trendelenburg) to maintain cardiac venous return, unless breathing is difficult (then sit upright).',
        'If symptoms do not improve after 5 minutes, administer a second Epinephrine dose if available.'
      ],
      hourlyCare: [
        'Keep the used auto-injector to show hospital paramedics.',
        'Even if symptoms completely resolve, the patient MUST go to hospital ER due to danger of biphasic anaphylaxis rebound (re-triggering within 1-72 hours).'
      ],
      dailyTimeline: [
        'Hospital observation for 6-12 hours minimum.',
        'Follow-up with allergist for allergy action plan and dual epinephrine refill.'
      ]
    },
    naturalRemedies: [
      {
        name: 'NO NATURAL ALTERNATIVE FOR EPINEPHRINE',
        type: 'Life-Safety Rule',
        mechanism: 'Herbs and antihistamines CANNOT reverse airway edema or cardiovascular collapse.',
        preparation: 'Rely solely on injectable epinephrine.',
        dosage: 'N/A',
        precautions: 'Oral antihistamines like Benadryl take 30-60 minutes to absorb and do NOT reverse tracheal closure.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Epinephrine Auto-Injector',
        brandNames: 'EpiPen (0.3mg Adult), EpiPen Jr (0.15mg Child), Auvi-Q',
        drugClass: 'Alpha and Beta-Adrenergic Agonist',
        typicalDose: '0.3 mg IM in mid-outer thigh (adults); 0.15 mg IM (children 15-30 kg)',
        mechanism: 'Causes rapid peripheral vasoconstriction (reverses shock/hypotension) and bronchial smooth muscle dilation (opens airway).',
        warnings: 'Do not inject into buttocks or intravenously. Minor side effects include tremors and tachycardia.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Diphenhydramine (Secondary Adjunct ONLY)',
        brandNames: 'Benadryl',
        drugClass: 'H1 Histamine Antagonist',
        typicalDose: '25-50 mg orally ONLY after epinephrine and ONLY if patient can safely swallow',
        mechanism: 'Blocks secondary histamine receptors for cutaneous hives and itching; does NOT open airway.',
        warnings: 'Never rely on diphenhydramine alone for anaphylaxis; it will NOT save an airway.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Swelling of the tongue, uvula, or feeling of "lump in the throat"',
      'High-pitched whistling sound on inhale (stridor)',
      'Inability to swallow saliva or speak in full sentences',
      'Dizziness, fainting, or systolic blood pressure dropping below 90'
    ],
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'choking-airway',
    name: 'Acute Airway Obstruction / Choking',
    aliases: ['Foreign Body Airway Obstruction', 'Asphyxiation'],
    category: 'respiratory',
    triage: 'EMERGENCY',
    urgencySummary: 'IMMEDIATE LIFE-THREAT: Execute abdominal thrusts (Heimlich maneuver) or back blows now.',
    overview: 'Inability to breathe, speak, or cough due to a foreign object lodged in the trachea or pharynx. The universal sign is hands clutching the throat with rapidly developing cyanosis (blue lips).',
    commonCauses: [
      'Solid Food Bolus (Meat, Hard Candies, Hot Dogs, Grapes)',
      'Small Toys or Coins in Pediatric Patients',
      'Alcohol impairment or neurological dysphagia'
    ],
    skipHomeRemedies: true,
    howToHandleIt: {
      immediateSteps: [
        'Ask: "Are you choking? Can you speak?" If they can speak or cough forcibly, encourage coughing. DO NOT INTERFERE.',
        'If the person CANNOT speak, breathe, or cough: Stand behind them, lean them forward, deliver 5 firm back blows with heel of hand between shoulder blades.',
        'If back blows fail, perform 5 ABDOMINAL THRUSTS (Heimlich Maneuver): Make a fist above their navel, grasp with other hand, pull inward and upward sharply.',
        'If pregnant or obese, deliver chest thrusts over the mid-sternum.',
        'If patient falls unconscious: Call 911 immediately, lay flat, inspect mouth (finger sweep ONLY if object is visible), and begin 30 chest compressions.'
      ],
      hourlyCare: [
        'Any person who received successful abdominal thrusts must still be evaluated at a clinic/hospital to check for internal visceral trauma or rib fractures.'
      ],
      dailyTimeline: [
        'Hospital medical checkup for pulmonary aspiration or airway mucosal laceration.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [],
    redFlags: [
      'Hands clutching the throat with silent gasping',
      'Cyanosis (lips, tongue, or nail beds turning blue or purple)',
      'Inability to make sound or vocalize',
      'Rapid progression to unresponsiveness'
    ],
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'severe-trauma-bleeding',
    name: 'Severe Hemorrhage / Uncontrolled Bleeding',
    aliases: ['Arterial Bleeding', 'Massive Blood Loss', 'Deep Laceration'],
    category: 'emergency_firstaid',
    triage: 'EMERGENCY',
    urgencySummary: 'HEMOSTASIS EMERGENCY: Apply continuous direct pressure or tactical tourniquet immediately.',
    overview: 'Pulsatile, spurting, or rapidly pooling bright red blood from an arterial or major venous injury that does not stop with light pressure.',
    commonCauses: [
      'High-velocity Glass or Knife Laceration',
      'Vehicular or Industrial Machine Trauma',
      'Compound Fracture / Bone Fragment Vascular Laceration'
    ],
    skipHomeRemedies: true,
    howToHandleIt: {
      immediateSteps: [
        'CALL 911 / 112 IMMEDIATELY.',
        'Apply IMMEDIATE, continuous hard pressure directly onto the bleeding site using sterile gauze, clean cloth, or bare hands.',
        'If bleeding is from an arm or leg and pressure fails or blood spurts: Apply a TOURNIQUET 5-7 cm (2-3 inches) above the wound (not over a joint). Tighten until bleeding stops completely. Note exact time applied.',
        'Keep patient warm with a blanket to prevent trauma-induced hypothermia and coagulopathy.'
      ],
      hourlyCare: [
        'Do NOT remove saturated dressings—layer new dressings on top to maintain clot stability.',
        'Do NOT loosen or release a tourniquet once applied; only emergency trauma surgeons should remove it.'
      ],
      dailyTimeline: [
        'Surgical exploration, vessel ligation, microvascular repair, and packed red blood cell transfusion in hospital trauma theater.'
      ]
    },
    naturalRemedies: [],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Hemostatic Gauze (Kaolin / Chitosan impregnated)',
        brandNames: 'QuikClot, Celox',
        drugClass: 'Topical Hemostatic Agent',
        typicalDose: 'Pack directly into deep wound cavity and compress for 3 minutes',
        mechanism: 'Activates clotting factor XII to accelerate natural coagulation cascade within minutes.',
        warnings: 'Must be packed deep against the bleeding vessel.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Blood spurting in rhythm with heartbeat',
      'Blood soaking completely through multiple thick towels in seconds',
      'Confusion, pale clammy skin, or dizziness (hypovolemic shock onset)',
      'Weak or rapid thread-like pulse'
    ],
    recommendedFacilityType: 'hospital'
  },

  // ==========================================
  // 2. URGENT (Same-day Urgent Care / Walk-in / ER)
  // ==========================================
  {
    id: 'acute-appendicitis',
    name: 'Acute Lower Right Abdominal Pain (Suspected Appendicitis)',
    aliases: ['Appendicitis', 'Right Iliac Fossa Pain', 'Peritonitis Warning'],
    category: 'digestive',
    triage: 'URGENT',
    urgencySummary: 'URGENT SURGICAL EVALUATION: Requires immediate emergency department ultrasound/CT to prevent rupture.',
    overview: 'Pain that starts around the navel and progressively migrates and localizes to the right lower abdomen (McBurney point), worsening with walking, coughing, or sudden bumps, accompanied by low-grade fever, nausea, and loss of appetite.',
    commonCauses: [
      'Luminal obstruction by fecalith or lymphoid hyperplasia',
      'Bacterial infection and acute distension of the vermiform appendix'
    ],
    skipHomeRemedies: true,
    howToHandleIt: {
      immediateSteps: [
        'Head immediately to the nearest Emergency Hospital or Urgent Care facility equipped with imaging.',
        'DO NOT EAT OR DRINK ANYTHING (Nil Per Os) in case emergency laparoscopic appendectomy is required.',
        'DO NOT TAKE LAXATIVES OR USE HEATING PADS—heat increases inflammation and significantly increases risk of appendix rupture.',
        'Avoid taking NSAIDs (like Ibuprofen) which can mask peritoneal signs.'
      ],
      hourlyCare: [
        'Rest in bed with knees drawn up to abdomen to relieve abdominal wall tension while en route to hospital.',
        'Do not take heavy painkillers until emergency physicians have conducted their initial physical examination.'
      ],
      dailyTimeline: [
        'Emergency surgical removal (laparoscopic appendectomy) or IV broad-spectrum antibiotics under surgical observation.'
      ]
    },
    naturalRemedies: [
      {
        name: 'STRICT CAUTION: NO NATURAL REMEDIES',
        type: 'Surgical Warning',
        mechanism: 'Herbal teas, castor oil packs, or enemas can trigger fatal perforation and peritonitis.',
        preparation: 'Strictly avoid home remedies.',
        dosage: 'N/A',
        precautions: 'Appendicitis is a surgical disease; do not attempt home treatment.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'IV Ceftriaxone + Metronidazole (Hospital Only)',
        brandNames: 'Rocephin, Flagyl',
        drugClass: 'Broad-Spectrum Antimicrobial Regimen',
        typicalDose: 'Administered intravenously by hospital physicians pre-operatively',
        mechanism: 'Covers Gram-negative enteric bacilli and anaerobes to prevent bacteremia.',
        warnings: 'Strictly physician-managed during hospital admission.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Sharp pain migrating to the lower right abdomen that intensifies when releasing pressure (rebound tenderness)',
      'Inability to stand straight or jump on right heel without excruciating pain',
      'Sudden temporary relief followed by widespread severe pain (indicates rupture and peritonitis)',
      'High spiking fever with rigid, board-like abdomen'
    ],
    recommendedFacilityType: 'hospital'
  },
  {
    id: 'severe-asthma-attack',
    name: 'Acute Asthma Exacerbation / Severe Wheeze',
    aliases: ['Asthmatic Bronchospasm', 'Status Asthmaticus'],
    category: 'respiratory',
    triage: 'URGENT',
    urgencySummary: 'SAME-DAY / IMMEDIATE URGENT CARE: Execute quick-relief inhaler protocol now.',
    overview: 'Sudden tightening of the chest, persistent expiratory wheezing, breathlessness making it hard to speak full sentences, and ribs pulling in during inhalation (intercostal retractions).',
    commonCauses: [
      'Viral Respiratory Tract Infection',
      'Allergen exposure (pollen, dust mites, pet dander)',
      'Cold air inhalation or strenuous exercise',
      'Smoke, aerosols, or chemical vapors'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Sit upright comfortably—do NOT lie down, as lying down compresses the diaphragm.',
        'Take 2 to 4 puffs of short-acting beta-2 agonist (Albuterol / Salbutamol) using a spacer if available. Inhale slowly and hold breath for 10 seconds per puff.',
        'Wait 4 minutes. If symptoms do not improve, take 2 to 4 more puffs.',
        'If patient cannot complete a sentence without gasping or inhaler provides no relief, call 911 or go immediately to Urgent Care/Hospital.'
      ],
      hourlyCare: [
        'Stay in a calm, smoke-free, warm room away from cold drafts.',
        'Sip warm (not hot) water to hydrate mucus membranes.'
      ],
      dailyTimeline: [
        'Physician evaluation for oral corticosteroid burst (Prednisone 5-day course) to reduce airway wall remodeling and inflammation.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Warm Steam Inhalation & Moist Air',
        type: 'Supportive Hydrotherapy',
        mechanism: 'Helps loosen viscous mucus plugs in bronchial tree; provides comfort between inhaler doses.',
        preparation: 'Breathe steam from a warm shower or vapor cup for 10 minutes.',
        dosage: 'As needed; do not use essential oils which can trigger bronchospasm in asthmatics.',
        precautions: 'Never use steam as a substitute for rescue bronchodilators.'
      },
      {
        name: 'Caffeinated Warm Coffee or Black Tea',
        type: 'Emergency Adjunct',
        mechanism: 'Caffeine is chemically related to theophylline, a weak bronchodilator that opens airways slightly.',
        preparation: 'Drink 1-2 cups of warm black coffee if stranded without an inhaler while calling emergency help.',
        dosage: '1 cup',
        precautions: 'Temporary emergency buffer only; does not replace medical inhalers.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Albuterol / Salbutamol Inhaler (MDI)',
        brandNames: 'Ventolin HFA, ProAir HFA, Proventil',
        drugClass: 'Short-Acting Beta-2 Adrenergic Agonist (SABA)',
        typicalDose: '2 to 4 puffs every 4 to 6 hours as needed; up to 6-8 puffs in severe acute episode',
        mechanism: 'Stimulates adenylate cyclase in bronchial smooth muscle, causing rapid airway relaxation within 5 minutes.',
        warnings: 'Causes temporary mild tremors and elevated heart rate (tachycardia).',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Oral Prednisone / Prednisolone',
        brandNames: 'Deltasone, Prelone',
        drugClass: 'Systemic Corticosteroid',
        typicalDose: '40 mg to 50 mg daily for 5 days prescribed by urgent care physician',
        mechanism: 'Suppresses cellular inflammatory mediators, reducing mucosal swelling and sputum production.',
        warnings: 'Short-term burst reduces relapse risk; take with food to prevent GI upset.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Inability to speak more than 2-3 words at a time between breaths',
      'Chest and neck muscles straining visibly on inhalation',
      'No improvement 15 minutes after taking 4 puffs of rescue inhaler',
      'Silent chest (wheezing stops because air is barely moving at all)'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'kidney-stones',
    name: 'Severe Flank Pain / Kidney Stone Colic',
    aliases: ['Renal Colic', 'Nephrolithiasis', 'Urolithiasis'],
    category: 'digestive',
    triage: 'URGENT',
    urgencySummary: 'URGENT CARE / EMERGENCY: Intense spasmodic flank pain radiating to groin with nausea requires imaging.',
    overview: 'Sudden, excruciating, waves of sharp pain in the side and back below the ribs, radiating to the lower abdomen and groin, often accompanied by pink or red urine (hematuria), nausea, vomiting, and inability to find a comfortable position.',
    commonCauses: [
      'Calcium Oxalate or Uric Acid Crystal aggregation',
      'Chronic dehydration or high dietary sodium/animal protein',
      'Metabolic or hyperparathyroid disorders'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Visit Urgent Care or Emergency Department for non-contrast low-dose CT KUB scan and pain control.',
        'Drink plenty of warm water or electrolytes if not actively vomiting.',
        'Apply a warm heating pad to the flank area to relax ureteral spasm.',
        'Collect urine using a urine strainer if available to catch passed stones for laboratory chemical analysis.'
      ],
      hourlyCare: [
        'Take an approved anti-inflammatory (such as Ketorolac or Ibuprofen) if prescribed and renal function is normal.',
        'Avoid excessive consumption of calcium or vitamin C supplements while stones are active.'
      ],
      dailyTimeline: [
        'Urgent Care / Urologist follow-up for medical expulsive therapy (Tamsulosin) or shockwave lithotripsy (ESWL).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Fresh Lemon Water (Citrate Therapy)',
        type: 'Dietary Alkalinizer',
        mechanism: 'Citrate binds with urinary calcium, inhibiting crystals from growing and facilitating passage.',
        preparation: 'Squeeze juice of 2 fresh lemons into 500 ml warm water.',
        dosage: 'Drink 2 to 3 glasses throughout the day.',
        precautions: 'Does not dissolve established large calcium stones; aids smaller stones (<4mm).'
      },
      {
        name: 'Chanca Piedra (Phyllanthus niruri) Herbal Tea',
        type: 'Traditional Lithotropic Herb',
        mechanism: 'Traditionally recognized in South American herbal medicine to relax ureter smooth muscle.',
        preparation: 'Brew 1 teaspoon dried herb in boiling water for 10 minutes.',
        dosage: '1 cup twice daily.',
        precautions: 'Avoid if pregnant or on insulin medications.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ibuprofen or Ketorolac (NSAID)',
        brandNames: 'Motrin, Toradol',
        drugClass: 'Nonsteroidal Anti-Inflammatory Drug',
        typicalDose: 'Ibuprofen 600-800 mg orally every 8 hours with food (or IV Toradol at Urgent Care)',
        mechanism: 'Inhibits prostaglandin synthesis, lowering glomerular filtration pressure and ureteral peristaltic spasm.',
        warnings: 'Do not use if severe kidney impairment or gastrointestinal ulcers.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Tamsulosin (Medical Expulsive Therapy)',
        brandNames: 'Flomax',
        drugClass: 'Alpha-1 Adrenergic Receptor Antagonist',
        typicalDose: '0.4 mg once daily taken 30 minutes after the same meal each day',
        mechanism: 'Relaxes smooth muscle in the distal ureter, accelerating stone passage and decreasing colicky episodes.',
        warnings: 'May cause orthostatic dizziness or nasal congestion.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'High fever (>38.5°C / 101.3°F) and chills combined with flank pain (indicates infected obstructed kidney—sepsis emergency!)',
      'Inability to pass any urine (anuria / complete urinary tract obstruction)',
      'Intractable vomiting unable to keep fluids down'
    ],
    recommendedFacilityType: 'urgent_care'
  },
  {
    id: 'deep-laceration',
    name: 'Deep Wound / Laceration Needing Stitches',
    aliases: ['Cut Requiring Sutures', 'Open Puncture', 'Wound Debridement'],
    category: 'emergency_firstaid',
    triage: 'URGENT',
    urgencySummary: 'URGENT CLINIC: Wounds must be sutured or stapled within 6 to 12 hours of injury.',
    overview: 'A deep cut through the dermis exposing yellow subcutaneous fat, muscle, or bone, gaping open with edges that cannot be easily held together, or caused by rusty, contaminated objects or animal bites.',
    commonCauses: [
      'Kitchen knife slips or broken glass injuries',
      'Power tool or industrial metal injuries',
      'Animal or human bites'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Apply firm direct pressure with clean sterile gauze for 10-15 minutes without lifting to check.',
        'Once bleeding is managed, gently rinse wound with clean tap water or saline to remove loose debris. DO NOT POUR HYDROGEN PEROXIDE or rubbing alcohol inside deep tissue (delays healing).',
        'Head to Urgent Care within 6 to 12 hours for optimal closure and tetanus prophylaxis.',
        'Keep the injured limb elevated above heart level.'
      ],
      hourlyCare: [
        'Cover loosely with sterile non-stick pad until evaluated by physician.',
        'Verify your tetanus booster status (needs booster within 5 years for contaminated wounds).'
      ],
      dailyTimeline: [
        'Keep sutures clean and dry for 24-48 hours. Return for suture removal in 5-14 days depending on body location.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Sterile Normal Saline Flush',
        type: 'Mechanical Wound Cleansing',
        mechanism: 'Isotonic fluid safely washes away bacteria and foreign particulate without damaging viable fibroblasts.',
        preparation: 'Use sterile 0.9% sodium chloride wound wash.',
        dosage: 'Irrigate thoroughly under gentle pressure.',
        precautions: 'Do not use dirty pond water or unboiled water.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Bacitracin / Polymyxin B Topical Ointment',
        brandNames: 'Polysporin, Neosporin',
        drugClass: 'Topical Antibacterial Ointment',
        typicalDose: 'Apply thin film 1-3 times daily after wound is closed/evaluated',
        mechanism: 'Inhibits bacterial cell wall synthesis against common skin flora (Staph/Strep).',
        warnings: 'Discontinue if localized contact dermatitis or rash develops.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Tetanus Toxoid Vaccine Booster (Clinic)',
        brandNames: 'Tdap, Td-VAX',
        drugClass: 'Active Immunization Toxoid',
        typicalDose: '0.5 mL IM single injection at Urgent Care',
        mechanism: 'Stimulates neutralizing antibodies against Clostridium tetani neurotoxin.',
        warnings: 'Mild soreness at injection site is common.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Wound gaping open more than 0.5 cm or exposing muscle, tendon, or yellow fat',
      'Numbness, loss of sensation, or inability to wiggle fingers/toes past the cut',
      'Animal bite, human bite, or contaminated metal puncture',
      'Spreading red streaks, warmth, or foul-smelling purulent discharge'
    ],
    recommendedFacilityType: 'urgent_care'
  },

  // ==========================================
  // 3. MODERATE (See a Doctor / Walk-In Clinic / Telehealth)
  // ==========================================
  {
    id: 'acute-bronchitis',
    name: 'Acute Bronchitis & Productive Chest Cough',
    aliases: ['Chest Cold', 'Deep Bronchial Cough', 'Tracheobronchitis'],
    category: 'respiratory',
    triage: 'MODERATE',
    urgencySummary: 'SEE A DOCTOR: Persistent deep cough lasting over 10-14 days with thick mucus.',
    overview: 'Inflammation of the bronchial tubes leading to a persistent chest cough producing clear, yellow, or greenish sputum, often accompanied by mild fatigue, chest soreness when coughing, and low-grade temperature.',
    commonCauses: [
      'Viral infection (Influenza, RSV, Rhinovirus, Coronavirus in 90% of cases)',
      'Secondary bacterial infection (Mycoplasma pneumoniae, Bordetella pertussis)',
      'Environmental pollutants or tobacco smoke irritation'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Rest and sleep with head elevated on 2 pillows to facilitate nighttime bronchial drainage.',
        'Increase daily hydration to 2.5 - 3 liters (water, herbal teas, clear broths) to thin bronchial secretions.',
        'Use a cool-mist room humidifier to keep airways hydrated.',
        'Avoid cough suppressants if cough is productive; the body needs to expel infected mucus.'
      ],
      hourlyCare: [
        'Take warm honey-lemon infusions every 2 to 3 hours for mucosal soothing.',
        'Perform steam inhalation over a warm bowl of water for 10-15 minutes.'
      ],
      dailyTimeline: [
        'Monitor temperature twice daily. If fever exceeds 38.5°C (101.3°F) or lasts >3 days, see a doctor for chest X-ray to rule out pneumonia.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Raw Honey & Thyme Infusion',
        type: 'Natural Expectorant & Demulcent',
        mechanism: 'Thyme leaves contain thymol, an essential volatile compound with antispasmodic and antibacterial properties; honey forms a soothing protective coating over inflamed pharynx.',
        preparation: 'Steep 2 teaspoons fresh thyme in 250 ml boiling water for 10 minutes, strain, and stir in 1 tablespoon raw unpasteurized honey.',
        dosage: 'Drink 1 cup 3 times daily.',
        precautions: 'NEVER give honey to infants under 12 months (risk of infant botulism).'
      },
      {
        name: 'Ivy Leaf Extract (Hedera helix)',
        type: 'Standardized Herbal Mucolytic',
        mechanism: 'Saponins in ivy leaf stimulate beta-2 adrenergic receptors in lungs, reducing mucus viscosity and relaxing airways.',
        preparation: 'Standardized oral syrup (e.g., Prospan).',
        dosage: '7.5 ml twice daily for adults.',
        precautions: 'May cause mild gastrointestinal upset.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Guaifenesin',
        brandNames: 'Mucinex, Robitussin Mucus + Chest Congestion',
        drugClass: 'Expectorant',
        typicalDose: '600 mg to 1200 mg extended-release tablet every 12 hours with a full glass of water',
        mechanism: 'Increases the volume and reduces the viscosity of respiratory tract secretions, making coughs more productive.',
        warnings: 'Drink abundant water; guaifenesin requires hydration to thin secretions effectively.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Dextromethorphan HBr (For dry disruptive nighttime cough ONLY)',
        brandNames: 'Delsym, Robitussin Cough',
        drugClass: 'Centrally Acting Antitussive',
        typicalDose: '30 mg orally every 6 to 8 hours (max 120 mg/day)',
        mechanism: 'Acts centrally on the medullary cough center to elevate the cough reflex threshold.',
        warnings: 'Do NOT combine with MAOIs or SSRIs (risk of serotonin syndrome). Do not use for productive "wet" cough.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Coughing up rust-colored sputum or bright red blood (hemoptysis)',
      'Shortness of breath even while resting in bed',
      'Fever above 39°C (102.2°F) accompanied by shaking chills',
      'Cough lasting longer than 3 weeks without improvement'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'urinary-tract-infection',
    name: 'Urinary Tract Infection (UTI / Dysuria)',
    aliases: ['Cystitis', 'Bladder Infection', 'Painful Urination'],
    category: 'digestive',
    triage: 'MODERATE',
    urgencySummary: 'SEE A DOCTOR: Burning sensation during urination and pelvic urgency requires urinalysis and targeted antibiotics.',
    overview: 'A sharp, burning or scalding sensation when passing urine, frequent compelling urge to urinate with small amounts produced, cloudy, dark or strong-smelling urine, and low pelvic cramp.',
    commonCauses: [
      'Uropathogenic Escherichia coli (E. coli) colonization (80-85%)',
      'Staphylococcus saprophyticus, Klebsiella pneumoniae',
      'Anatomical short urethra in females, sexual activity, or catheterization'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Schedule a clinic visit or telehealth consultation for a rapid dipstick urinalysis and culture.',
        'Drink 500 ml of pure water immediately and maintain 2 to 3 liters daily to flush bacteria from the bladder wall.',
        'Urinate frequently; do not hold urine in the bladder.',
        'Apply a warm heating pad across the lower pelvis to alleviate bladder spasms.'
      ],
      hourlyCare: [
        'Avoid bladder irritants: coffee, caffeinated teas, alcohol, carbonated soda, and spicy foods.',
        'Wear loose cotton underwear and avoid tight pants to keep the perineal area dry.'
      ],
      dailyTimeline: [
        'Complete the full prescribed antibiotic course (typically 3-5 days of Nitrofurantoin) even if burning disappears on day 2.'
      ]
    },
    naturalRemedies: [
      {
        name: 'D-Mannose Powder',
        type: 'Simple Sugar Supplement',
        mechanism: 'D-Mannose binds directly to the FimH adhesin pili of E. coli bacteria, preventing them from clinging to bladder urothelial cells so they are flushed out in urine.',
        preparation: 'Dissolve 2 grams of pure D-Mannose powder in 200 ml of water.',
        dosage: 'Take 2g every 3 to 4 hours for 48 hours, then 2g daily for prevention.',
        precautions: 'Does not kill established bacteria; complementary to antibiotics.'
      },
      {
        name: 'Pure Cranberry PAC Extract (Proanthocyanidins)',
        type: 'Botanical Polyphenol',
        mechanism: 'Type-A proanthocyanidins inhibit P-fimbriated bacterial adhesion to the urinary tract lining.',
        preparation: 'Standardized capsules containing 36 mg PACs (avoid sugary commercial juices).',
        dosage: '1 capsule daily with water.',
        precautions: 'Avoid if prone to calcium oxalate kidney stones.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Nitrofurantoin Monohydrate / Macrocrystals',
        brandNames: 'Macrobid, Macrodantin',
        drugClass: 'Nitrofuran Antibacterial',
        typicalDose: '100 mg capsule orally twice daily for 5 days with meals',
        mechanism: 'Inactivates bacterial ribosomal proteins and enzymatic metabolic pathways in bladder urine.',
        warnings: 'Harmlessly discolors urine dark brown or yellow. Do not use in severe kidney impairment.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Phenazopyridine Hydrochloride (Symptom Relief Only)',
        brandNames: 'AZO Urinary Pain Relief, Pyridium',
        drugClass: 'Urinary Tract Analgesic',
        typicalDose: '95 mg to 200 mg orally 3 times daily after meals for maximum 2 days',
        mechanism: 'Exerts topical local anesthetic effect on the mucosa of the urinary tract.',
        warnings: 'Turns urine and tears bright orange-red. Does NOT cure the bacterial infection—must be taken with antibiotics.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'High spiking fever (>38.3°C / 101°F) with shaking chills',
      'Pain in the upper back or flank (CVA tenderness), indicating kidney infection (Pyelonephritis)',
      'Nausea and vomiting unable to tolerate oral medications',
      'Visible bright blood in urine (gross hematuria)'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'migraine-aura',
    name: 'Migraine Headache with or without Aura',
    aliases: ['Migraine Attack', 'Hemicrania', 'Neurovascular Headache'],
    category: 'head_neurological',
    triage: 'MODERATE',
    urgencySummary: 'SEE A DOCTOR: Throbbing unilateral head pain with sensory sensitivity, nausea, or visual aura.',
    overview: 'Severe throbbing or pulsating pain usually on one side of the head, lasting 4 to 72 hours, aggravated by physical activity, accompanied by nausea, vomiting, and extreme sensitivity to light (photophobia) and sound (phonophobia). Some patients experience a preceding visual aura (flashing lights, blind spots).',
    commonCauses: [
      'Trigeminovascular neurogenic inflammation and calcitonin gene-related peptide (CGRP) release',
      'Triggers: Hormonal fluctuations, lack of sleep, sensory overload, tyramine-rich foods, stress let-down'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Retire immediately to a dark, quiet, cool room and close eyes at the earliest warning sign.',
        'Apply an ice pack or cold gel compress wrapped in a towel across forehead and back of neck.',
        'Take acute medication (Triptan or NSAID + Caffeine) within the first 30 minutes of headache onset for highest efficacy.',
        'Hydrate with 500 ml cold electrolyte water.'
      ],
      hourlyCare: [
        'Practice slow diaphragmatic breathing to reduce sympathetic nervous system tone.',
        'Avoid screens, smartphone blue light, loud sounds, and strong perfumes.'
      ],
      dailyTimeline: [
        'Keep a migraine diary noting sleep hours, meals, weather, and menstrual cycle to identify personal triggers.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Magnesium Glycinate or Citrate',
        type: 'Mineral Neuromodulator',
        mechanism: 'Magnesium regulates cortical spreading depression and blocks NMDA glutamate receptors involved in migraine pathogenesis.',
        preparation: 'Oral elemental magnesium capsule.',
        dosage: '400 mg to 600 mg daily for prevention; 400 mg at onset.',
        precautions: 'Excessive magnesium citrate can cause loose stools; glycinate is gentler on digestion.'
      },
      {
        name: 'Feverfew (Tanacetum parthenium) & Ginger',
        type: 'Botanical Parthenolide & Gingerol',
        mechanism: 'Feverfew inhibits platelet aggregation and serotonin release; ginger reduces migraine-associated nausea and prostaglandin synthesis.',
        preparation: 'Brew fresh crushed ginger root tea or take standardized capsule.',
        dosage: '500 mg ginger powder at aura onset.',
        precautions: 'Avoid feverfew during pregnancy.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Sumatriptan',
        brandNames: 'Imitrex',
        drugClass: '5-HT1B/1D Serotonin Receptor Agonist (Triptan)',
        typicalDose: '50 mg to 100 mg orally at onset of headache; may repeat after 2 hours if headache recurs (max 200 mg/24h)',
        mechanism: 'Causes cranial vasoconstriction and blocks release of inflammatory neuropeptides from trigeminal nerve endings.',
        warnings: 'Contraindicated in coronary artery disease, uncontrolled hypertension, or previous stroke.',
        prescriptionRequired: true
      },
      {
        activeIngredient: 'Acetaminophen + Aspirin + Caffeine',
        brandNames: 'Excedrin Migraine',
        drugClass: 'Combination Analgesic',
        typicalDose: '2 caplets orally at onset with a full glass of water (max 2 caplets in 24 hours)',
        mechanism: 'Aspirin and acetaminophen provide central and peripheral analgesia while caffeine enhances drug absorption and cranial vasoconstriction.',
        warnings: 'Do not use more than 2-3 days per week to avoid medication-overuse (rebound) headaches.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Sudden "thunderclap" headache reaching maximal agony in under 60 seconds (subarachnoid bleed rule-out)',
      'Headache with fever, stiff neck, and rash',
      'New onset neurological deficit: persistent numbness, limb weakness, or difficulty talking',
      'First severe headache in someone over 50 years of age'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'bacterial-sinusitis',
    name: 'Persistent Sinusitis (>10 Days)',
    aliases: ['Rhinosinusitis', 'Sinus Infection', 'Facial Pressure'],
    category: 'eyes_ears_throat',
    triage: 'MODERATE',
    urgencySummary: 'SEE A DOCTOR: Facial pain, maxillary tenderness, and purulent nasal drainage persisting beyond 10 days.',
    overview: 'Inflammation of the paranasal sinus cavities causing throbbing pressure behind the eyes, forehead, and cheekbones, nasal congestion, thick discolored mucus, reduced sense of smell, and pain that worsens when bending forward.',
    commonCauses: [
      'Viral upper respiratory infection developing secondary bacterial superinfection (Streptococcus pneumoniae, Haemophilus influenzae)',
      'Allergic rhinitis or deviated nasal septum obstructing osteomeatal complex drainage'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Perform nasal sinus irrigation using a sterile isotonic saline squeeze bottle or Neti pot twice daily.',
        'Apply warm moist towels across the cheeks and bridge of nose for 10 minutes 3 times a day.',
        'Drink plenty of warm liquids to thin tenacious mucus.',
        'Sleep with head elevated 30 degrees to reduce venous sinus engorgement.'
      ],
      hourlyCare: [
        'Use steam inhalation with 2 drops eucalyptus or peppermint oil over hot water.',
        'Avoid swimming in chlorinated pools or flying in airplanes while sinuses are fully blocked.'
      ],
      dailyTimeline: [
        'Consult a physician if symptoms "double-sicken" (start to get better then suddenly spike with fever and severe facial pain).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Buffered Hypertonic Saline Sinus Rinse (Neti Pot)',
        type: 'Topical Mucociliary Clearance',
        mechanism: 'Physically rinses away trapped stagnant mucus, inflammatory cytokines, and allergens while restoring ciliary beat frequency.',
        preparation: 'Mix 1 packet pharmaceutical salt buffer with 240 ml of DISTILLED or BOILED (cooled) water. NEVER use untreated tap water.',
        dosage: 'Irrigate each nostril morning and night.',
        precautions: 'Do not irrigate if nasal passage is 100% blocked.'
      },
      {
        name: 'Bromelain (Pineapple Enzyme Extract)',
        type: 'Proteolytic Anti-inflammatory',
        mechanism: 'Helps degrade inflammatory kinins and reduces mucosal edema in sinus cavities.',
        preparation: 'Oral capsule taken between meals.',
        dosage: '500 mg daily.',
        precautions: 'Use caution if taking blood thinners.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Fluticasone Propionate Nasal Spray',
        brandNames: 'Flonase Allergy Relief',
        drugClass: 'Intranasal Corticosteroid',
        typicalDose: '2 sprays in each nostril once daily directed outward away from nasal septum',
        mechanism: 'Potent local glucocorticoid that reduces nasal mucosal swelling and opens sinus ostia.',
        warnings: 'Takes 2-4 days of consistent daily use to reach maximal therapeutic efficacy.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Amoxicillin-Clavulanate (Physician Prescription)',
        brandNames: 'Augmentin',
        drugClass: 'Penicillin-Class Antibiotic with Beta-Lactamase Inhibitor',
        typicalDose: '875/125 mg orally twice daily for 5-7 days prescribed by physician',
        mechanism: 'Binds to penicillin-binding proteins, causing bacterial lysis in acute bacterial rhinosinusitis.',
        warnings: 'Take with food to minimize diarrhea. Do not use if penicillin allergic.',
        prescriptionRequired: true
      }
    ],
    redFlags: [
      'Swelling, redness, or protrusion around one or both eyes (periorbital cellulitis risk)',
      'Double vision or decreased visual acuity',
      'Severe frontal headache with high fever and stiff neck',
      'Altered mental state or lethargy'
    ],
    recommendedFacilityType: 'clinic'
  },
  {
    id: 'gerd-gastritis',
    name: 'Persistent Acid Reflux / Gastritis / Peptic Ulcer Suspicion',
    aliases: ['GERD', 'Epigastric Burning', 'Dyspepsia'],
    category: 'digestive',
    triage: 'MODERATE',
    urgencySummary: 'SEE A DOCTOR: Chronic burning stomach pain, nocturnal acid regurgitation, or food sticking.',
    overview: 'Gnawing, burning pain in the upper abdomen (epigastrium) or behind the breastbone, sour acid taste in mouth, chronic throat clearing, bloating, and discomfort that changes relative to meals.',
    commonCauses: [
      'Helicobacter pylori bacterial colonization',
      'Prolonged NSAID/Ibuprofen use damaging gastric mucosal barrier',
      'Lower esophageal sphincter (LES) laxity, hiatal hernia',
      'Excess coffee, alcohol, smoking, or late-night heavy meals'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Do not lie down for at least 3 hours after eating any meal.',
        'Elevate the head of your bed 15 cm (6 inches) using bed risers or a wedge pillow (extra pillows alone just bend the neck).',
        'Eat smaller, more frequent meals rather than large heavy dinners.',
        'Avoid dietary triggers: chocolate, mint, tomato sauce, citrus, coffee, fried foods, and carbonation.'
      ],
      hourlyCare: [
        'Sip slippery elm tea or deglycyrrhizinated licorice (DGL) 20 minutes before meals.',
        'Chew non-mint gum for 30 minutes after eating to stimulate alkaline saliva production.'
      ],
      dailyTimeline: [
        'Consult physician for H. pylori urea breath test or endoscopy if pain persists >2 weeks or requires daily medication.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Deglycyrrhizinated Licorice (DGL)',
        type: 'Mucosal Protectant',
        mechanism: 'Stimulates mucus-secreting goblet cells in stomach and esophagus, strengthening the protective lining against acid attack.',
        preparation: 'Chewable tablets.',
        dosage: 'Chew 1-2 tablets 20 minutes before meals.',
        precautions: 'DGL has had glycyrrhizin removed, so it does NOT raise blood pressure like raw licorice.'
      },
      {
        name: 'Chamomile & Marshmallow Root Tea',
        type: 'Demulcent Infusion',
        mechanism: 'High mucilage content forms a protective physical barrier over irritated esophageal mucosa.',
        preparation: 'Steep 1 tablespoon dried marshmallow root in cool water for 4 hours (cold infusion) or warm chamomile for 10 min.',
        dosage: '1 cup before bedtime.',
        precautions: 'Take 1-2 hours apart from medications as mucilage can slow pill absorption.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Famotidine',
        brandNames: 'Pepcid AC',
        drugClass: 'H2 Receptor Antagonist',
        typicalDose: '20 mg orally once or twice daily, taken 15-60 minutes before meals or at bedtime',
        mechanism: 'Competitively blocks histamine H2 receptors on gastric parietal cells, reducing basal and nocturnal gastric acid secretion.',
        warnings: 'Quick acting (takes effect within 1 hour). Do not exceed 40 mg daily without doctor advice.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Omeprazole',
        brandNames: 'Prilosec OTC',
        drugClass: 'Proton Pump Inhibitor (PPI)',
        typicalDose: '20 mg orally once daily in the morning 30-60 minutes before breakfast for a 14-day course',
        mechanism: 'Irreversibly inhibits the H+/K+ ATPase enzyme system in gastric parietal cells, dramatically shutting down acid production.',
        warnings: 'Takes 1-4 days for full effect. Do not use for more than 14 days without physician supervision.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Difficulty or pain when swallowing food (dysphagia / feeling food gets stuck)',
      'Vomiting blood or coffee-ground emesis',
      'Black, tarry, foul-smelling stools (melena - indicates upper GI bleeding)',
      'Unexplained significant weight loss'
    ],
    recommendedFacilityType: 'clinic'
  },

  // ==========================================
  // 4. COMMON / MILD (Home Care + OTC Medicines)
  // ==========================================
  {
    id: 'tension-headache',
    name: 'Tension-Type Headache',
    aliases: ['Stress Headache', 'Muscle Contraction Headache', 'Band-like Head Pain'],
    category: 'head_neurological',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Dull, aching, bilateral pain like a tight band around the forehead and temples.',
    overview: 'The most common type of headache, characterized by a constant dull, non-pulsatile ache wrapping around both sides of the forehead, temples, or back of the head and neck. Usually does not worsen with routine physical activity.',
    commonCauses: [
      'Prolonged screen time and poor cervical neck posture (tech neck)',
      'Psychological stress, anxiety, or fatigue',
      'Dehydration, skipped meals, or caffeine withdrawal',
      'Jaw clenching (bruxism) or lack of restorative sleep'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Drink 500 ml to 1 liter of fresh water immediately; mild dehydration is the #1 silent trigger.',
        'Take a 15-minute break from computer screens and smartphones. Practice the 20-20-20 rule.',
        'Gently massage the temples, suboccipital muscles at the base of the skull, and upper trapezius shoulders.',
        'Apply a warm compress to tight neck muscles or a cool cloth across the forehead.'
      ],
      hourlyCare: [
        'Do gentle neck stretching: tilt chin to chest, then look over left and right shoulders slowly.',
        'Take an approved OTC pain reliever with a light snack if pain impairs concentration.'
      ],
      dailyTimeline: [
        'Evaluate desk ergonomics: ensure monitor is at eye level and chair supports lumbar spine. Aim for 7-8 hours sleep.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Peppermint Oil Aromatherapy & Temple Application',
        type: 'Topical Analgesic Essential Oil',
        mechanism: 'Menthol stimulates cutaneous cold receptors (TRPM8) and inhibits calcium channels, generating a cooling analgesic effect and promoting microvascular blood flow.',
        preparation: 'Dilute 2 drops 100% pure peppermint oil in 1 teaspoon jojoba or almond carrier oil. Gently rub onto temples and back of neck.',
        dosage: 'Apply once; reapply after 30 minutes if needed.',
        precautions: 'Keep strictly away from eyes. Do not use on infants or young children.'
      },
      {
        name: 'Magnesium Glycinate & Chamomile Tea',
        type: 'Musculoskeletal Relaxation Support',
        mechanism: 'Acts as a natural calcium antagonist, relaxing contracted pericranial muscles and calming neurological excitability.',
        preparation: 'Brew warm chamomile tea and take with 200-400 mg magnesium glycinate.',
        dosage: '1 cup in evening.',
        precautions: 'Do not exceed 350 mg supplemental elemental magnesium daily.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Acetaminophen (Paracetamol)',
        brandNames: 'Tylenol Regular / Extra Strength, Panadol',
        drugClass: 'Non-Opioid Analgesic / Antipyretic',
        typicalDose: '500 mg to 1000 mg orally every 4 to 6 hours as needed (do NOT exceed 3000 mg in 24 hours)',
        mechanism: 'Inhibits central prostaglandin synthesis in the brain and modulates serotonergic inhibitory pathways.',
        warnings: 'Liver toxicity warning: Never combine with other medications containing acetaminophen or heavy alcohol.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Ibuprofen',
        brandNames: 'Advil, Motrin IB',
        drugClass: 'NSAID (Nonsteroidal Anti-Inflammatory Drug)',
        typicalDose: '200 mg to 400 mg orally every 4 to 6 hours with food or milk (max 1200 mg/day OTC)',
        mechanism: 'Reversibly inhibits COX-1 and COX-2 enzymes, decreasing peripheral inflammatory prostaglandin production.',
        warnings: 'Always take with food. Do not use if history of stomach ulcers, kidney disease, or in third trimester of pregnancy.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Sudden onset agonizing headache reaching peak intensity in under 1 minute',
      'Headache accompanied by stiff neck, fever, confusion, or vomiting',
      'Headache following a direct blow or trauma to the head',
      'Progressive worsening over weeks that awakens you from deep sleep'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'common-cold',
    name: 'Common Cold & Nasal Congestion',
    aliases: ['Viral Rhinitis', 'Upper Respiratory Tract Infection', 'Head Cold'],
    category: 'respiratory',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Sneezing, stuffy or runny nose, scratchy sore throat, and mild tiredness.',
    overview: 'A mild, self-limiting viral infection of the upper respiratory tract. Typical symptom progression: scratchy throat on day 1-2, followed by sneezing and clear rhinorrhea on day 2-3, thick nasal secretions on day 4-5, and mild cough resolving within 7 to 10 days.',
    commonCauses: [
      'Rhinovirus (over 50% of colds)',
      'Coronaviruses, Adenoviruses, Enteroviruses, RSV'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Rest and sleep—metabolic rest is the primary driver of viral immune clearance.',
        'Hydrate heavily: warm water, herbal teas, bone broths, and fresh lemon water thin nasal secretions.',
        'Gargle with warm salt water (1/2 tsp salt in 1 cup warm water) for 30 seconds to reduce throat edema.',
        'Use sterile saline nasal spray to clear dried mucus and viral particles from the nasal cavity.'
      ],
      hourlyCare: [
        'Use a cool-mist humidifier in the bedroom to keep mucous membranes moist during sleep.',
        'Take zinc lozenges within 24 hours of first symptom onset to shorten cold duration.'
      ],
      dailyTimeline: [
        'Symptoms normally peak around day 3-4 and steadily subside. If fever spikes after day 7, check for secondary bacterial infection.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Elderberry (Sambucus nigra) Syrup',
        type: 'Antiviral Flavonoid Botanical',
        mechanism: 'Contains anthocyanins that bind to viral surface glycoproteins, inhibiting viral hemagglutinin and viral penetration into host cells.',
        preparation: 'Standardized elderberry extract or home-cooked syrup with raw honey.',
        dosage: '1 tablespoon (15 ml) 3 to 4 times daily during acute cold.',
        precautions: 'Do not consume raw, uncooked elderberries (contain cyanogenic glycosides).'
      },
      {
        name: 'Ginger, Lemon & Raw Honey Elixir',
        type: 'Demulcent & Anti-inflammatory Tea',
        mechanism: 'Fresh gingerol suppresses pro-inflammatory cytokines; raw honey coats the inflamed pharynx, and lemon provides vitamin C and citric acid.',
        preparation: 'Slice 2 cm fresh ginger root into 300 ml boiling water, simmer 10 minutes, add juice of 1/2 lemon and 1 tbsp raw honey.',
        dosage: 'Sip 2 to 4 cups warm throughout the day.',
        precautions: 'Do not give honey to infants under 1 year.'
      },
      {
        name: 'Zinc Acetate / Gluconate Lozenges',
        type: 'Trace Mineral Antiviral',
        mechanism: 'Ionic zinc binds to rhinovirus capsid proteins in the oropharynx, physically blocking viral replication.',
        preparation: 'Dissolve slowly in mouth; do not chew.',
        dosage: '13-23 mg elemental zinc every 2-3 hours while awake for first 3 days.',
        precautions: 'Take with food to prevent nausea. Avoid zinc nasal sprays (can cause permanent anosmia).'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Pseudoephedrine (Behind-the-counter) or Phenylephrine',
        brandNames: 'Sudafed Congestion',
        drugClass: 'Oral Alpha-Adrenergic Sympathomimetic Decongestant',
        typicalDose: 'Pseudoephedrine 30 mg to 60 mg orally every 4 to 6 hours (max 240 mg/day)',
        mechanism: 'Stimulates alpha-adrenergic receptors on vascular smooth muscle, shrinking engorged nasal turbinate tissues.',
        warnings: 'May cause insomnia, nervousness, and elevated blood pressure. Avoid if uncontrolled hypertension or glaucoma.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Oxymetazoline Nasal Spray',
        brandNames: 'Afrin, Dristan 12HR',
        drugClass: 'Topical Nasal Decongestant',
        typicalDose: '2 to 3 sprays in each nostril every 10-12 hours',
        mechanism: 'Rapid direct vasoconstriction of dilated nasal mucosal blood vessels within 2-5 minutes.',
        warnings: 'STRICT WARNING: Do NOT use for more than 3 consecutive days. Prolonged use causes severe rebound congestion (Rhinitis Medicamentosa).',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'High persistent fever above 38.5°C (101.3°F) lasting more than 3 days',
      'Shortness of breath, wheezing, or chest pain during breathing',
      'Severe pain around eyes or temples that worsens when bending forward',
      'Inability to swallow liquids or fluids drooling from mouth'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'nausea-motion-sickness',
    name: 'Nausea, Motion Sickness & Upset Stomach',
    aliases: ['Motion Sickness', 'Kinetosis', 'Queasiness', 'Travel Sickness'],
    category: 'digestive',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Queasy stomach, dizziness, cold sweat from car, boat, or air travel.',
    overview: 'A feeling of gastric discomfort, uneasiness, and an urge to vomit, commonly caused by sensory mismatch between the inner ear vestibular system, eyes, and proprioceptive sensors during motion, or mild dietary indiscretion.',
    commonCauses: [
      'Vestibular mismatch during travel (cars, boats, planes, VR headsets)',
      'Mild food intolerance or overeating',
      'Early pregnancy or migraine prodrome',
      'Anxiety and vagal stimulation'
    ],
    howToHandleIt: {
      immediateSteps: [
        'If in a vehicle: Look at the distant, stable horizon. Do not read books or look down at smartphones.',
        'Get cool, fresh air: open car windows or point airplane air vent directly onto face.',
        'Sit in the location with least motion (front passenger seat of car, over the wing in an airplane, mid-ship on a boat).',
        'Apply firm pressure to the P6 (Neiguan) acupressure point on the inner wrist (3 finger widths below wrist crease).'
      ],
      hourlyCare: [
        'Sip small amounts of cold ginger ale, peppermint tea, or ice chips. Avoid gulping large glasses of water.',
        'Nibble on plain, bland starches: saltine crackers, dry toast, or pretzels.'
      ],
      dailyTimeline: [
        'Stick to the B.R.A.T. diet (Bananas, Rice, Applesauce, Toast) until gastric lining stabilizes.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Fresh Ginger Root (Zingiber officinale)',
        type: 'Standardized Botanical Antiemetic',
        mechanism: 'Gingerols and shogaols act as antagonists at 5-HT3 and cholinergic M receptors in the gastrointestinal tract and vestibular system, improving gastric emptying rate and dampening nausea.',
        preparation: 'Eat candied ginger, chew real ginger candy, or brew 1 gram of fresh grated ginger root in hot water.',
        dosage: '1 to 2 grams daily in divided doses (take 30 minutes before travel).',
        precautions: 'Safe for travel and mild morning sickness. High doses may cause mild heartburn.'
      },
      {
        name: 'P6 (Neiguan) Acupressure Wristband',
        type: 'Neuromodulation / Acupressure',
        mechanism: 'Stimulates the median nerve to disrupt vestibular-vagal nausea signaling pathways in the brainstem.',
        preparation: 'Wear elastic acupressure wristbands with plastic studs pressing the P6 point.',
        dosage: 'Wear continuously during travel on both wrists.',
        precautions: 'Non-pharmacological; zero drowsiness or drug interactions.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Dimenhydrinate',
        brandNames: 'Dramamine Original',
        drugClass: 'First-Generation H1 Antihistamine / Antiemetic',
        typicalDose: '50 mg to 100 mg orally 30 to 60 minutes BEFORE travel begins (repeat every 4-6 hours, max 400 mg/day)',
        mechanism: 'Inhibits vestibular stimulation in the inner ear labyrinth and depresses central chemoreceptor trigger zone.',
        warnings: 'Causes significant drowsiness. Do NOT drive or operate machinery. Avoid alcohol.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Meclizine Hydrochloride',
        brandNames: 'Dramamine Less Drowsy, Bonine',
        drugClass: 'H1 Antihistamine with Anticholinergic Activity',
        typicalDose: '25 mg to 50 mg orally once daily taken 1 hour prior to embarkation',
        mechanism: 'Blocks central histaminergic pathways from vestibular apparatus to emetic center.',
        warnings: 'Less sedating than dimenhydrinate, but may still cause mild dry mouth and fatigue.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Vomiting blood or dark granular "coffee ground" material',
      'Inability to keep liquids down for more than 24 hours (dehydration crisis)',
      'Severe abdominal pain, rigid abdomen, or high fever',
      'Nausea accompanied by sudden explosive headache or visual loss'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'heartburn-indigestion',
    name: 'Mild Heartburn & Acid Indigestion',
    aliases: ['Acid Dyspepsia', 'Sour Stomach', 'Pyrosis'],
    category: 'digestive',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Burning sensation in chest after eating heavy or spicy meals.',
    overview: 'A burning discomfort in the lower chest or behind the sternum occurring 30 to 60 minutes after eating, exacerbated by bending over or lying flat, often accompanied by a sour taste in the throat.',
    commonCauses: [
      'Transient lower esophageal sphincter relaxation',
      'Fatty, fried, spicy, or acidic foods (citrus, tomato)',
      'Overeating or lying down immediately post-meal'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Stand upright or sit straight—let gravity prevent stomach acid from traveling upward.',
        'Loosen tight belts or waistbands that exert upward pressure on the stomach.',
        'Drink a small glass of water to flush acid out of the esophagus.',
        'Take an antacid (Calcium Carbonate) for near-instant relief within 5 minutes.'
      ],
      hourlyCare: [
        'Avoid snacking or lying down for at least 2-3 hours.',
        'Chew a piece of sugar-free gum to promote acid-neutralizing saliva.'
      ],
      dailyTimeline: [
        'Identify food triggers in a diet log. Stop eating 3 hours before going to sleep.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Baking Soda (Sodium Bicarbonate) Flush',
        type: 'Fast-acting Alkaline Neutralizer',
        mechanism: 'Directly neutralizes hydrochloric acid, converting it to water, carbon dioxide, and sodium chloride.',
        preparation: 'Dissolve 1/2 teaspoon pure baking soda in 120 ml of cold water.',
        dosage: 'Drink slowly. Do not use more than 1-2 times per week.',
        precautions: 'High sodium content. Avoid if on a sodium-restricted diet or with hypertension.'
      },
      {
        name: 'Apple Cider Vinegar (Diluted)',
        type: 'Digestive Acid Harmonizer',
        mechanism: 'May improve digestive motility and stomach emptying for individuals with hypochlorhydria.',
        preparation: '1 teaspoon raw organic apple cider vinegar in 200 ml water.',
        dosage: 'Sip before meals.',
        precautions: 'Always dilute to protect tooth enamel; discontinue if it worsens burning.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Calcium Carbonate',
        brandNames: 'Tums Ultra 1000, Rolaids',
        drugClass: 'Direct Chemical Antacid',
        typicalDose: 'Chew 1 to 2 tablets thoroughly as symptoms occur (max 7 tablets/day)',
        mechanism: 'Reacts chemically with gastric HCl in stomach lumen to form neutral calcium chloride, CO2, and water within minutes.',
        warnings: 'Fastest onset (5 mins) but short duration (1-2 hours). Do not overuse to avoid calcium overload or rebound hyperacidity.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Famotidine',
        brandNames: 'Pepcid AC 10mg / 20mg',
        drugClass: 'H2-Receptor Blocker',
        typicalDose: '10 mg to 20 mg swallowed whole with water 15-60 minutes before consuming offending food or at bedtime',
        mechanism: 'Blocks histamine stimulation of parietal cells, suppressing acid production for up to 12 hours.',
        warnings: 'Provides longer protection than antacids. Do not use for more than 14 consecutive days without medical advice.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Chest pain that feels like heavy pressure or squeezing, radiating to jaw or left arm (rule out heart attack!)',
      'Difficulty or pain when swallowing',
      'Vomiting blood or black stools',
      'Heartburn occurring more than 2-3 times per week consistently'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'menstrual-cramps',
    name: 'Menstrual Cramps (Primary Dysmenorrhea)',
    aliases: ['Period Pain', 'Uterine Cramps', 'Dysmenorrhea'],
    category: 'musculoskeletal',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Lower abdominal aching and pelvic cramping before or during menstruation.',
    overview: 'Throbbing, cramping pain in the lower abdomen and pelvic area starting 1-2 days before or with the onset of menstrual bleeding, often radiating to the lower back and upper thighs.',
    commonCauses: [
      'Excess endometrial prostaglandin F2-alpha (PGF2a) production triggering strong myometrial contractions and temporary uterine ischemia',
      'Pelvic congestion and hormonal shift'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Apply a warm heating pad or hot water bottle (approx 40°C) across the lower abdomen; heat is clinically proven as effective as ibuprofen.',
        'Take an NSAID (Ibuprofen or Naproxen) at the earliest sign of cramping; NSAIDs block the enzyme creating prostaglandins.',
        'Rest in fetal position with a pillow between knees to alleviate lower back pressure.',
        'Take a warm bath with Epsom salts.'
      ],
      hourlyCare: [
        'Engage in gentle walking or light yoga poses (Child’s pose, Cat-Cow) to increase pelvic blood flow.',
        'Sip hot chamomile or ginger tea.'
      ],
      dailyTimeline: [
        'Maintain daily magnesium and omega-3 fish oil throughout the cycle to reduce baseline inflammatory prostaglandins.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Continuous Local Heat Therapy',
        type: 'Thermal Vasodilation',
        mechanism: 'Relaxes contracted uterine smooth muscle and stimulates cutaneous thermoreceptors to gate nociceptive pain signals.',
        preparation: 'Electric heating pad or adhesive heat wrap.',
        dosage: 'Apply for 20-30 minutes at a time.',
        precautions: 'Do not sleep with high-heat electric pads directly against bare skin.'
      },
      {
        name: 'Cinnamon & Ginger Decoction',
        type: 'Botanical Antispasmodic',
        mechanism: 'Cinnamon contains cinnamaldehyde and eugenol which inhibit cyclooxygenase and reduce uterine spasms.',
        preparation: 'Boil 1 cinnamon stick and 3 slices fresh ginger in 300 ml water for 10 minutes.',
        dosage: 'Drink 2 cups daily during first 2 days of cycle.',
        precautions: 'Avoid high medicinal doses if taking blood thinners.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ibuprofen',
        brandNames: 'Advil, Motrin',
        drugClass: 'NSAID',
        typicalDose: '400 mg orally every 4 to 6 hours with food at first onset of menstrual flow or cramping',
        mechanism: 'Potently inhibits cyclooxygenase enzymes (COX-1/COX-2), directly halting prostaglandin synthesis in the endometrium.',
        warnings: 'Take with food or milk to protect stomach lining. Most effective when started just before or at cramp onset.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Naproxen Sodium',
        brandNames: 'Aleve',
        drugClass: 'Long-Acting NSAID',
        typicalDose: '220 mg (1 tablet) every 8 to 12 hours with a full glass of water (max 2 tablets in 12 hours)',
        mechanism: 'Longer half-life than ibuprofen, providing sustained 8-12 hour reduction in uterine contractions.',
        warnings: 'Do not combine with other NSAIDs or aspirin.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Sudden excruciating one-sided pelvic pain with dizziness (rule out ruptured ectopic pregnancy or ovarian torsion!)',
      'Soaking through more than 1 pad or tampon per hour for several consecutive hours',
      'Fever, foul-smelling vaginal discharge, or pain that persists between menstrual cycles',
      'Severe pain in women over 25 who previously had normal, mild periods (possible endometriosis or fibroids)'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'minor-burns',
    name: 'Minor First-Degree Thermal Burn & Sunburn',
    aliases: ['Superficial Burn', 'Kitchen Scald', 'Mild Sunburn'],
    category: 'skin_dermatology',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Red, tender skin without blisters from touching a hot pan or sun exposure.',
    overview: 'Superficial injury to the epidermis characterized by localized redness, mild swelling, warmth, and pain when touched. Skin is intact with no open blistering or charred patches.',
    commonCauses: [
      'Touching hot cooking cookware, steam, or hot liquids',
      'Excessive ultraviolet (UVB) radiation from direct sun exposure',
      'Curling iron or clothing iron contact'
    ],
    howToHandleIt: {
      immediateSteps: [
        'HOLD UNDER COOL RUNNING TAP WATER FOR 10 TO 20 MINUTES IMMEDIATELY. This halts dermal heat progression.',
        'DO NOT USE ICE, ICE WATER, BUTTER, TOOTHPASTE, OR OIL. Ice constricts blood flow and causes tissue necrosis; butter traps heat and introduces bacteria.',
        'Remove rings or tight bracelets from the burned limb before swelling begins.',
        'Cover loosely with a clean, sterile non-adherent dressing.'
      ],
      hourlyCare: [
        'Apply pure aloe vera gel or petroleum jelly (after the heat has completely cooled from the skin).',
        'Take an oral NSAID (Ibuprofen) to relieve throbbing pain and dermal inflammation.'
      ],
      dailyTimeline: [
        'Keep skin moisturized. Avoid sun exposure on the recovering skin to prevent hyperpigmentation.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Pure Aloe Vera (Aloe barbadensis) Leaf Gel',
        type: 'Botanical Dermal Soothing & Re-epithelialization',
        mechanism: 'Contains acemannan and bradykinase which suppress thromboxane production, hydrate the stratum corneum, and stimulate fibroblast growth.',
        preparation: 'Apply 100% pure aloe vera gel or fresh gel squeezed from an aloe leaf.',
        dosage: 'Apply generous layer 3 to 4 times daily.',
        precautions: 'Use only on superficial closed skin; do not put in open deep burns.'
      },
      {
        name: 'Cool Colloidal Oatmeal Compress',
        type: 'Anti-Pruritic Hydrotherapy',
        mechanism: 'Avenanthramides in colloidal oats reduce histamine release and suppress dermal inflammation and itching during peeling.',
        preparation: 'Soak a clean cloth in cool colloidal oatmeal bath water and lay over sunburned area.',
        dosage: '15 minutes as needed.',
        precautions: 'Pat dry gently; do not rub skin.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ibuprofen',
        brandNames: 'Advil',
        drugClass: 'Oral NSAID',
        typicalDose: '400 mg orally every 6 hours with food for the first 24-48 hours',
        mechanism: 'Blocks inflammatory prostaglandin release in skin tissues, significantly reducing burn erythema and throbbing.',
        warnings: 'Take with food to prevent gastric irritation.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Hydrocortisone 1% Topical Cream',
        brandNames: 'Cortizone-10',
        drugClass: 'Mild Topical Corticosteroid',
        typicalDose: 'Apply sparingly to affected red skin 1 to 2 times daily for max 3-5 days',
        mechanism: 'Inhibits leukocyte infiltration and reduces cutaneous erythema and itching.',
        warnings: 'Do NOT apply on open broken blisters or infected weeping skin. Do not use on face long-term.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Burn covers a large area (larger than the palm of your hand) or involves face, hands, joints, or genitals',
      'Skin looks charred black, white, leathery, or painless (third-degree burn—emergency hospital!)',
      'Blisters break and form yellow crusting, spreading redness, or pus',
      'Burn was caused by strong chemicals or high-voltage electrical current'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'mild-insomnia',
    name: 'Mild Insomnia & Sleep Disruption',
    aliases: ['Sleep Initiation Difficulty', 'Poor Sleep Quality', 'Nocturnal Awakening'],
    category: 'mental_sleep',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Trouble falling or staying asleep due to stress, jet lag, or screen exposure.',
    overview: 'Difficulty falling asleep, waking up frequently during the night, or waking up too early and feeling unrefreshed, lasting less than 2-3 weeks.',
    commonCauses: [
      'Blue light exposure from screens before bedtime suppressing endogenous melatonin',
      'Caffeine consumption in late afternoon or evening',
      'Psychological stress, racing thoughts, or irregular sleep-wake schedules',
      'Bedroom too warm, noisy, or bright'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Turn off all smartphones, tablets, laptops, and televisions at least 60 minutes before bedtime.',
        'Keep bedroom temperature cool (around 18-20°C / 65-68°F) and pitch dark.',
        'If unable to sleep after 20 minutes, get out of bed. Go to a dimly lit room and read a physical book until sleepy.',
        'Do 5 minutes of 4-7-8 breathing: inhale for 4 sec, hold for 7 sec, exhale slowly for 8 sec.'
      ],
      hourlyCare: [
        'Avoid clock-watching; turn alarm clock display away from view.',
        'Take a warm shower or bath 90 minutes before bed; the subsequent drop in core body temperature signals sleep onset.'
      ],
      dailyTimeline: [
        'Get 15 minutes of direct morning sunlight within 1 hour of waking to anchor the circadian master clock (SCN).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Chamomile & Passionflower (Passiflora incarnata) Infusion',
        type: 'Herbal GABAergic Calming Tea',
        mechanism: 'Apigenin in chamomile binds to benzodiazepine receptors in the brain; passionflower increases GABA levels, reducing nocturnal mental chatter.',
        preparation: 'Steep 2 tea bags in 250 ml covered boiling water for 10 minutes.',
        dosage: 'Drink warm 45 minutes before bedtime.',
        precautions: 'Do not combine with sedative medications or alcohol.'
      },
      {
        name: 'Magnesium L-Threonate or Glycinate',
        type: 'Brain Bioavailable Mineral',
        mechanism: 'Crosses blood-brain barrier to enhance synaptic density, regulate NMDA receptors, and activate parasympathetic relaxation.',
        preparation: 'Oral capsule taken with water.',
        dosage: '200-400 mg 1 hour before sleep.',
        precautions: 'Gentle on stomach; safe for nightly use.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Melatonin',
        brandNames: 'Nature Made Melatonin, Natrol',
        drugClass: 'Pineal Hormone Chronobiotic',
        typicalDose: '0.5 mg to 3 mg orally taken 30 to 60 minutes before intended bedtime (lower doses are often more physiological)',
        mechanism: 'Binds MT1 and MT2 receptors in the suprachiasmatic nucleus to synchronize circadian sleep rhythm.',
        warnings: 'Best for jet lag and circadian shifts. Avoid high doses (>5mg) which cause morning grogginess and vivid nightmares.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Doxylamine Succinate',
        brandNames: 'Unisom SleepTabs',
        drugClass: 'Sedating First-Generation Antihistamine',
        typicalDose: '25 mg orally 30 minutes before bedtime (short-term use only, max 7-10 days)',
        mechanism: 'Blocks central H1 histamine receptors to induce drowsiness.',
        warnings: 'Short term use only. Can cause next-day grogginess, dry mouth, and urinary retention in older adults.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Chronic severe snoring, choking, or gasping during sleep witnessed by a partner (obstructive sleep apnea)',
      'Insomnia accompanied by severe depression, suicidal ideation, or hallucinations',
      'Sudden daytime sleep attacks while driving or talking (narcolepsy)'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'muscle-soreness',
    name: 'Delayed Onset Muscle Soreness (DOMS)',
    aliases: ['Exercise Soreness', 'Myalgia', 'Post-Workout Stiffness'],
    category: 'musculoskeletal',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Stiff, aching muscles 24 to 48 hours following unaccustomed physical exercise.',
    overview: 'Muscular tightness, aching, and reduced range of motion that typically develops 12 to 24 hours after intense or eccentric exercise, peaking around 48 hours and resolving by day 4 to 5.',
    commonCauses: [
      'Microscopic tears in muscle myofibrils and connective tissue from eccentric muscle contractions',
      'Local inflammatory response and fluid shifts in muscle compartments'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Engage in active recovery: 20 minutes of light walking, stationary cycling, or gentle swimming to promote circulation.',
        'Perform foam rolling or gentle percussion massage over tender muscle bellies.',
        'Soak in a warm Epsom salt bath (magnesium sulfate) for 20 minutes.',
        'Hydrate with water and electrolytes (potassium, sodium, magnesium).'
      ],
      hourlyCare: [
        'Apply topical arnica or menthol rubs to sore muscle groups.',
        'Perform gentle dynamic stretches without forcing past the point of mild tension.'
      ],
      dailyTimeline: [
        'Prioritize 8+ hours of sleep and adequate protein intake (1.6g/kg) to facilitate cellular myofibrillar repair.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Tart Cherry (Prunus cerasus) Juice',
        type: 'Anthocyanin Anti-inflammatory',
        mechanism: 'Rich in polyphenols and anthocyanins that reduce lipid peroxidation, neutrophil infiltration, and exercise-induced muscle damage.',
        preparation: 'Drink 240 ml of 100% pure tart cherry juice (or 30 ml concentrate in water).',
        dosage: 'Twice daily post-exercise.',
        precautions: 'Check sugar content if diabetic.'
      },
      {
        name: 'Curcumin (Turmeric Extract) with Piperine',
        type: 'Standardized Curcuminoid Anti-inflammatory',
        mechanism: 'Inhibits NF-kB pathway and COX-2 enzymes, lowering systemic creatine kinase and muscle soreness markers.',
        preparation: 'Oral capsule formulated with black pepper extract (piperine) for 2000% higher absorption.',
        dosage: '500-1000 mg daily with a fatty meal.',
        precautions: 'Avoid high therapeutic doses if taking warfarin or with gallstones.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Ibuprofen',
        brandNames: 'Advil, Motrin',
        drugClass: 'NSAID',
        typicalDose: '200 mg to 400 mg orally with food every 6 hours as needed',
        mechanism: 'Reduces exercise-induced prostaglandin production and inflammatory swelling.',
        warnings: 'Do not overuse routinely after workouts, as baseline inflammation is part of the muscle hypertrophy adaptation process.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Menthol + Methyl Salicylate Topical Gel',
        brandNames: 'Biofreeze, Bengay Ultra Strength, Icy Hot',
        drugClass: 'Topical Counterirritant Analgesic',
        typicalDose: 'Apply thin layer to sore muscles 3 to 4 times daily and massage gently',
        mechanism: 'Menthol stimulates cold sensory nerves while methyl salicylate provides localized salicylate analgesia, overriding deep muscle pain signals.',
        warnings: 'Wash hands thoroughly after use. Do NOT wrap tightly with bandages or apply over broken skin or with heating pads.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Urine turns dark brown or tea-colored (rhabdomyolysis—muscle breakdown releasing myoglobin into kidneys, emergency hospital!)',
      'Severe swelling, redness, or extreme muscle compartment firmness with excruciating pain',
      'Inability to move the limb or bear weight on the joint',
      'Soreness that does not improve after 7 days'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'seasonal-allergies',
    name: 'Seasonal Allergic Rhinitis (Hay Fever)',
    aliases: ['Hay Fever', 'Pollen Allergy', 'Allergic Rhinoconjunctivitis'],
    category: 'pediatric_allergy',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Itchy watery eyes, clear runny nose, sneezing fits, and scratchy palate during high pollen.',
    overview: 'An IgE-mediated allergic response of the nasal mucosa triggered by airborne environmental allergens (tree, grass, weed pollens, mold spores, or dust mites), causing repetitive sneezing, clear rhinorrhea, and ocular pruritus.',
    commonCauses: [
      'Tree, grass, and weed pollen grains',
      'Indoor allergens: house dust mites, cat and dog dander, fungal spores'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Check local pollen count forecast; keep windows closed on dry, windy, high-pollen days.',
        'Take a shower and wash hair before bed to remove pollen grains trapped on skin and hair.',
        'Wear sunglasses when outdoors to protect conjunctiva from airborne pollen contact.',
        'Rinse nasal passages with sterile saline to physically flush allergens out.'
      ],
      hourlyCare: [
        'Use sterile artificial tear drops to flush itchy eyes.',
        'Take a non-drowsy 2nd-generation oral antihistamine.'
      ],
      dailyTimeline: [
        'Run a HEPA room air purifier in the bedroom. Wash bed linens weekly in hot water (>60°C).'
      ]
    },
    naturalRemedies: [
      {
        name: 'Quercetin with Bromelain',
        type: 'Flavonoid Mast Cell Stabilizer',
        mechanism: 'Stabilizes mast cell membranes, preventing degranulation and histamine release in response to airborne allergens.',
        preparation: 'Oral dietary supplement capsules.',
        dosage: '500 mg quercetin + 100 mg bromelain twice daily.',
        precautions: 'Most effective when started 2 weeks before the pollen season.'
      },
      {
        name: 'Stinging Nettle (Urtica dioica) Leaf Tea',
        type: 'Natural Antihistaminic Herb',
        mechanism: 'Contains natural compounds that act as competitive antagonists at H1 histamine receptors and inhibit prostaglandin synthesis.',
        preparation: 'Steep 2 tablespoons dried nettle leaf in 300 ml boiling water for 15 minutes.',
        dosage: 'Drink 2 to 3 cups daily.',
        precautions: 'Mild diuretic effect.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Cetirizine or Loratadine',
        brandNames: 'Zyrtec (Cetirizine), Claritin (Loratadine)',
        drugClass: 'Second-Generation Non-Sedating H1 Antihistamine',
        typicalDose: '10 mg orally once daily with water (cetirizine has fastest onset; loratadine is least sedating)',
        mechanism: 'Selectively binds peripheral H1 histamine receptors, blocking allergic cascades without crossing blood-brain barrier significantly.',
        warnings: 'Cetirizine can cause mild drowsiness in about 10% of users. Do not exceed 10 mg daily.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Fluticasone Propionate Nasal Spray',
        brandNames: 'Flonase',
        drugClass: 'Intranasal Corticosteroid (First-Line Therapy)',
        typicalDose: '2 sprays in each nostril once daily in the morning',
        mechanism: 'Gold standard medical treatment: inhibits multiple inflammatory cell types and cytokines inside the nasal mucosa.',
        warnings: 'Aim spray away from nasal septum toward outer ear to prevent epistaxis (nosebleeds).',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Wheezing, chest tightness, or difficulty breathing (asthma exacerbation)',
      'Severe facial pain or thick yellow/green discharge with tooth pain (secondary sinus infection)',
      'Severe eyelid swelling or painful light sensitivity'
    ],
    recommendedFacilityType: 'pharmacy'
  },
  {
    id: 'acute-constipation',
    name: 'Acute Mild Constipation',
    aliases: ['Hard Stool', 'Infrequent Bowel Movements', 'Bowel Sluggishness'],
    category: 'digestive',
    triage: 'COMMON',
    urgencySummary: 'HOME CARE: Infrequent, hard, or difficult-to-pass stools relieved by hydration and fiber.',
    overview: 'Fewer than 3 bowel movements per week, or stools that are hard, lumpy, dry, and require straining to pass, often accompanied by abdominal fullness or mild cramping.',
    commonCauses: [
      'Inadequate dietary fiber intake and insufficient daily water consumption',
      'Sedentary lifestyle or ignoring the urge to defecate',
      'Travel, routine changes, or medications (iron supplements, opioids, anticholinergics)'
    ],
    howToHandleIt: {
      immediateSteps: [
        'Drink 2 large glasses of warm water or warm prune juice first thing in the morning.',
        'Use a toilet footstool (Squatty Potty style) to elevate knees above hips, straightening the anorectal angle for effortless defecation.',
        'Do 20 minutes of brisk walking to stimulate gastrocolic reflex.',
        'Do not strain forcefully, which can trigger hemorrhoids or anal fissures.'
      ],
      hourlyCare: [
        'Eat 4-6 dried prunes or 2 kiwi fruits (both have natural laxative enzymes and sorbitol).',
        'Add 1 tablespoon of ground flaxseed or psyllium husk to 300 ml of water.'
      ],
      dailyTimeline: [
        'Gradually increase dietary fiber to 25-35 grams daily (beans, oats, chia seeds, vegetables). Drink 2.5 liters of water daily.'
      ]
    },
    naturalRemedies: [
      {
        name: 'Prune Juice & Stewed Prunes (Sorbitol Therapy)',
        type: 'Natural Osmotic Botanical',
        mechanism: 'Prunes contain high levels of sorbitol (a poorly absorbed sugar alcohol that draws water into the colon lumen) and dihydroxyphenyl isatin.',
        preparation: 'Drink 200 ml pure prune juice warmed.',
        dosage: 'Once daily in the morning.',
        precautions: 'May cause mild bloating if consumed in large quantities.'
      },
      {
        name: 'Psyllium Husk (Plantago ovata)',
        type: 'Bulk-Forming Soluble Fiber',
        mechanism: 'Soluble fiber absorbs water to form a smooth gelatinous mass, increasing stool volume and softening consistency.',
        preparation: 'Stir 1 rounded tablespoon into a full 250 ml glass of water and drink immediately.',
        dosage: 'Once to twice daily.',
        precautions: 'CRITICAL: Must drink at least 1-2 additional glasses of water immediately after; otherwise dry fiber can worsen blockages.'
      }
    ],
    pharmaceuticalMedicines: [
      {
        activeIngredient: 'Polyethylene Glycol 3350 (PEG 3350)',
        brandNames: 'MiraLAX, ClearLax',
        drugClass: 'Osmotic Laxative (First-Line Doctor Recommended)',
        typicalDose: '17 grams (1 capful) dissolved in 120-240 ml of water, juice, or coffee once daily',
        mechanism: 'Non-absorbable polymer that acts as an osmotic agent, holding water in the stool to soften and lubricate passage without cramping.',
        warnings: 'Takes 1 to 3 days to produce a comfortable bowel movement. Does not cause habit-forming dependence.',
        prescriptionRequired: false
      },
      {
        activeIngredient: 'Docusate Sodium',
        brandNames: 'Colace',
        drugClass: 'Stool Softener (Surfactant)',
        typicalDose: '100 mg orally once or twice daily with a full glass of water',
        mechanism: 'Lowers surface tension at oil-water interface of fecal material, allowing water and lipids to penetrate hard stool.',
        warnings: 'For preventing straining (e.g., post-surgery or post-partum); not a fast-acting stimulant.',
        prescriptionRequired: false
      }
    ],
    redFlags: [
      'Inability to pass both stool AND gas accompanied by severe abdominal distension and vomiting (bowel obstruction!)',
      'Unexplained rectal bleeding or maroon/black stools',
      'Severe sharp abdominal pain with fever',
      'Constipation alternating with sudden pencil-thin stools in older adults'
    ],
    recommendedFacilityType: 'pharmacy'
  }
];

export const SYMPTOMS_DATA: SymptomEntry[] = [
  ...CORE_SYMPTOMS_DATA,
  ...SYMPTOMS_EXTENDED_DATA,
];

export const CATEGORIES_CONFIG = [
  { id: 'all', label: 'All Specialties', icon: 'Sparkles' },
  { id: 'emergency_firstaid', label: 'Emergency & First Aid', icon: 'Siren' },
  { id: 'cardiovascular', label: 'Heart & Circulation', icon: 'HeartPulse' },
  { id: 'head_neurological', label: 'Head & Brain', icon: 'Brain' },
  { id: 'respiratory', label: 'Lungs & Breathing', icon: 'Wind' },
  { id: 'digestive', label: 'Stomach & Gut', icon: 'Apple' },
  { id: 'endocrine_metabolic', label: 'Endocrine & Metabolic', icon: 'Flame' },
  { id: 'urology_renal', label: 'Kidneys & Urology', icon: 'Droplets' },
  { id: 'infectious_disease', label: 'Infectious & Tropical', icon: 'ShieldAlert' },
  { id: 'musculoskeletal', label: 'Muscles & Joints', icon: 'Activity' },
  { id: 'womens_mens_health', label: 'Reproductive Health', icon: 'Heart' },
  { id: 'dental_oral', label: 'Dental & Oral', icon: 'Sparkles' },
  { id: 'pediatric_allergy', label: 'Allergies & Pediatrics', icon: 'ShieldAlert' },
  { id: 'skin_dermatology', label: 'Skin & Burns', icon: 'Droplets' },
  { id: 'eyes_ears_throat', label: 'Eyes, Ears & Sinus', icon: 'Eye' },
  { id: 'mental_sleep', label: 'Mental Health & Sleep', icon: 'Moon' },
];
