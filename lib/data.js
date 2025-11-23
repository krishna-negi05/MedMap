import { 
  Brain, HeartPulse, FlaskConical, Activity, Search, Pill, AlertTriangle, 
  Ear, Eye, Map as MapIcon, Stethoscope, Syringe, UserCircle, Thermometer, 
  Bone, Layers, Wind, Smile 
} from 'lucide-react';

export const MBBS_SYLLABUS = [
  // ... (Keep your existing content here, just ensure it starts with export const) ...
  {
    id: 1,
    yearLabel: "First Professional",
    semesters: "Semesters 1-2 (Pre-Clinical)",
    description: "Anatomy, Physiology, Biochemistry",
    subjects: [
      { 
        id: 'anat', 
        name: "Anatomy", 
        icon: Brain, 
        color: "text-purple-600", 
        bg: "bg-purple-100",
        modules: [
          {
            title: "Gross Anatomy",
            topics: [
              "Introduction: Nomenclature, position, planes, tissues",
              "Osteology: Bone classification, general features, ossification, blood supply",
              "Muscular System: Classification, attachments, nerve supply, action",
              "Arthrology: Joint classification, major limb joints, movements",
              "Cardio Vascular: Heart (external/internal), coronary circulation, conducting system",
              "Respiratory: Upper/Lower tract, pleura, lungs, bronchopulmonary segments",
              "Digestive: GIT position, relations, blood/nerve supply, peritoneum",
              "Genito-Urinary: Kidney, ureter, bladder, urethra, reproductive organs",
              "Endocrine: Pituitary, thyroid, parathyroid, adrenal, pancreas",
              "Nervous: Brain parts, meninges, ventricles, CSF, spinal cord, cranial nerves",
              "Special Senses: Eye ball, Ear, Nose, Tongue",
              "Lymphatic: Major lymph nodes, thoracic duct",
              "Surface & Cross-sectional Anatomy"
            ]
          },
          {
            title: "Microanatomy (Histology)",
            topics: [
              "Microscopy principles and staining",
              "Epithelium: Types, junctions, glands",
              "Connective Tissue: Cells, fibers, cartilage, bone",
              "Muscle: Skeletal, cardiac, smooth",
              "Nervous Tissue: Neurons, ganglia, nerves",
              "Systemic Histology: Circulatory, Respiratory, Digestive, Urinary, Reproductive, Endocrine systems"
            ]
          },
          {
            title: "Embryology",
            topics: [
              "General Embryology: Gametogenesis, Fertilization, Cleavage, Blastocyst",
              "Development weeks 2-8: Germ layers, folding, somites",
              "Fetal Period, Placenta, Umbilical cord, Amniotic cavity",
              "Teratology and Twinning",
              "Systemic Embryology: Development of organ systems and anomalies"
            ]
          },
          {
            title: "Genetics & Neuroanatomy",
            topics: [
              "Human Genetics: Karyotype, chromosomal aberrations, pedigree analysis",
              "Neuroanatomy: Spinal cord tracts, brainstem, cerebellum, thalamus, cortex, limbic system"
            ]
          }
        ]
      },
      { 
        id: 'physio', 
        name: "Physiology", 
        icon: HeartPulse, 
        color: "text-red-500", 
        bg: "bg-red-100",
        modules: [
          {
            title: "General & Nerve-Muscle",
            topics: [
              "Homeostasis and control systems",
              "Cell membrane transport & resting potential",
              "Action potential & nerve fibers",
              "Neuromuscular junction & transmission",
              "Muscle contraction (Skeletal, Smooth, Cardiac)"
            ]
          },
          {
            title: "Blood",
            topics: [
              "Plasma proteins, Hemopoiesis, Erythropoiesis",
              "Anemia, Jaundice, Polycythemia",
              "WBC functions, Immunity, Platelets",
              "Hemostasis & Coagulation",
              "Blood groups & Transfusion"
            ]
          },
          {
            title: "Cardiovascular System",
            topics: [
              "Cardiac cycle, ECG, Heart sounds",
              "Cardiac output regulation",
              "Blood pressure regulation",
              "Hemodynamics, Shock, Regional circulation (Coronary, Cerebral)"
            ]
          },
          {
            title: "Respiratory System",
            topics: [
              "Mechanics of respiration, Lung volumes",
              "Gas exchange & Transport (O2, CO2)",
              "Regulation of respiration (Neural/Chemical)",
              "Hypoxia, Cyanosis, High altitude physiology"
            ]
          },
          {
            title: "Gastrointestinal System",
            topics: [
              "Secretions: Salivary, Gastric, Pancreatic, Bile",
              "Motility: Deglutition, Peristalsis, Defecation",
              "Digestion & Absorption",
              "GI Hormones"
            ]
          },
          {
            title: "Neurophysiology",
            topics: [
              "Synapse, Neurotransmitters, Reflexes",
              "Sensory system: Pathways, Pain",
              "Motor system: Pyramidal/Extrapyramidal, Basal ganglia, Cerebellum",
              "Limbic system, Hypothalamus, ANS",
              "Special Senses: Vision, Hearing, Taste, Smell",
              "Sleep, EEG, Higher functions"
            ]
          },
          {
            title: "Renal & Endocrine",
            topics: [
              "GFR, Tubular function, Counter-current mechanism",
              "Micturition, Acid-Base balance",
              "Hormones: Pituitary, Thyroid, Adrenal, Pancreas, Parathyroid",
              "Reproductive physiology"
            ]
          }
        ]
      },
      { 
        id: 'biochem', 
        name: "Biochemistry", 
        icon: FlaskConical, 
        color: "text-teal-600", 
        bg: "bg-teal-100",
        modules: [
          {
            title: "Biomolecules & Cell",
            topics: [
              "Cell architecture & membrane transport",
              "Carbohydrates: Classification & Chemistry",
              "Lipids: Classification & Chemistry",
              "Proteins: Structure, Hb/Mb, Plasma proteins",
              "Enzymes: Kinetics, Inhibition, Regulation"
            ]
          },
          {
            title: "Metabolism",
            topics: [
              "Carbohydrate: Glycolysis, TCA, HMP, Gluconeogenesis, Glycogen",
              "Lipid: Fatty acid oxidation/synthesis, Ketones, Cholesterol, Lipoproteins",
              "Protein: Transamination, Urea cycle, Amino acid metabolism",
              "Biological oxidation & ETC",
              "Integration & Regulation of metabolism"
            ]
          },
          {
            title: "Molecular Biology & Nutrition",
            topics: [
              "Nucleic acids structure",
              "Replication, Transcription, Translation",
              "Gene expression regulation",
              "Recombinant DNA technology",
              "Vitamins (Fat/Water soluble) & Minerals",
              "Energy metabolism & Nutrition"
            ]
          },
          {
            title: "Clinical Biochemistry",
            topics: [
              "Acid-Base balance & pH regulation",
              "Organ function tests (Liver, Renal, Gastric)",
              "Immunology basics",
              "Cancer biochemistry & Environmental hazards"
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    yearLabel: "Second Professional",
    semesters: "Semesters 3-5 (Para-Clinical)",
    description: "Pathology, Microbiology, Pharmacology, Forensic Medicine",
    subjects: [
      { 
        id: 'path', 
        name: "Pathology", 
        icon: Activity, 
        color: "text-pink-600", 
        bg: "bg-pink-100",
        modules: [
          {
            title: "General Pathology",
            topics: [
              "Cell Injury: Necrosis, Apoptosis, Adaptation",
              "Inflammation (Acute/Chronic) & Repair",
              "Hemodynamic disorders: Thrombosis, Embolism, Shock",
              "Neoplasia: Carcinogenesis, Tumor markers",
              "Genetics & Immunopathology",
              "Infectious diseases pathology"
            ]
          },
          {
            title: "Systemic Pathology - I",
            topics: [
              "Hematology: Anemias, Leukemias, Bleeding disorders",
              "CVS: Rheumatic, Ischemic, Hypertensive heart disease",
              "Respiratory: COPD, Pneumonia, TB, Tumors",
              "GIT: Ulcers, IBD, Tumors, Cirrhosis, Hepatitis"
            ]
          },
          {
            title: "Systemic Pathology - II",
            topics: [
              "Renal: Glomerulonephritis, Renal failure, Stones",
              "Reproductive: Cervix, Uterus, Breast tumors",
              "Endocrine: Thyroid, Diabetes, Adrenal",
              "Bone & CNS pathology"
            ]
          }
        ]
      },
      { 
        id: 'micro', 
        name: "Microbiology", 
        icon: Search, 
        color: "text-indigo-600", 
        bg: "bg-indigo-100",
        modules: [
          {
            title: "General & Immunology",
            topics: [
              "Bacterial morphology & physiology",
              "Sterilization & Disinfection",
              "Bacterial Genetics",
              "Immunity: Antigen-Antibody, Hypersensitivity, Vaccines"
            ]
          },
          {
            title: "Bacteriology",
            topics: [
              "Staphylococcus, Streptococcus, Pneumococcus",
              "Mycobacterium (TB/Leprosy)",
              "Enterobacteriaceae (E.coli, Salmonella, Shigella)",
              "Vibrio, Pseudomonas, Anaerobes"
            ]
          },
          {
            title: "Virology, Mycology, Parasitology",
            topics: [
              "General Virology: HIV, Hepatitis, Dengue, Rabies",
              "Mycology: Superficial, Subcutaneous, Systemic",
              "Parasitology: Malaria, Amoeba, Helminths"
            ]
          }
        ]
      },
      { 
        id: 'pharm', 
        name: "Pharmacology", 
        icon: Pill, 
        color: "text-green-600", 
        bg: "bg-green-100",
        modules: [
          {
            title: "General & ANS",
            topics: [
              "Pharmacokinetics & Pharmacodynamics",
              "Adverse Drug Reactions",
              "Cholinergic & Anticholinergic drugs",
              "Adrenergic drugs & Blockers"
            ]
          },
          {
            title: "Systemic Pharmacology",
            topics: [
              "CVS: Antihypertensives, Antianginal, Diuretics",
              "CNS: Sedatives, Antiepileptics, Antidepressants, Opioids",
              "GIT: Antacids, Antiemetics",
              "Respiratory: Asthma drugs"
            ]
          },
          {
            title: "Chemotherapy & Hormones",
            topics: [
              "Antimicrobials: Penicillins, Cephalosporins, Antitubercular",
              "Antimalarial, Antiviral, Anticancer",
              "Hormones: Insulin, Steroids, Thyroid, Contraceptives"
            ]
          }
        ]
      },
      { 
        id: 'fmt', 
        name: "Forensic Medicine", 
        icon: AlertTriangle, 
        color: "text-orange-600", 
        bg: "bg-orange-100",
        modules: [
          {
            title: "Forensic Pathology",
            topics: [
              "Legal procedures, Inquest, Courts",
              "Death: Signs, Time since death",
              "Autopsy procedures",
              "Asphyxial deaths (Hanging, Drowning)",
              "Thermal injuries, Starvation"
            ]
          },
          {
            title: "Clinical Forensic Medicine",
            topics: [
              "Identification (Age, Sex, Race)",
              "Mechanical Injuries & Regional injuries",
              "Firearm injuries",
              "Sexual offences (Rape, Sodomy)",
              "Pregnancy, Abortion, Infanticide",
              "Medical Jurisprudence & Ethics"
            ]
          },
          {
            title: "Toxicology",
            topics: [
              "General Toxicology & Law",
              "Corrosives (Acids/Alkalis)",
              "Metallic poisons (Arsenic, Lead)",
              "Agricultural (Organophosphorus)",
              "Animal poisons (Snake bite)",
              "Alcohol & Drug abuse"
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    yearLabel: "Third Professional Part 1",
    semesters: "Semesters 6-7",
    description: "ENT, Ophthalmology, Community Medicine",
    subjects: [
      { 
        id: 'ent', 
        name: "Otorhinolaryngology", 
        icon: Ear, 
        color: "text-blue-600", 
        bg: "bg-blue-100",
        modules: [
          {
            title: "Ear",
            topics: [
              "Anatomy & Examination",
              "Otitis Externa",
              "CSOM (Safe/Unsafe) & Complications",
              "Otosclerosis & Deafness",
              "Vertigo & Meniere's disease"
            ]
          },
          {
            title: "Nose & Throat",
            topics: [
              "Rhinitis & Sinusitis",
              "Nasal Polyps & DNS",
              "Epistaxis",
              "Tonsillitis & Adenoids",
              "Laryngeal tumors & Hoarseness",
              "Tracheostomy"
            ]
          }
        ]
      },
      { 
        id: 'eye', 
        name: "Ophthalmology", 
        icon: Eye, 
        color: "text-cyan-600", 
        bg: "bg-cyan-100",
        modules: [
          {
            title: "Clinical Ophthalmology",
            topics: [
              "Conjunctivitis & Trachoma",
              "Corneal Ulcers & Keratitis",
              "Cataract: Etiology & Management",
              "Glaucoma (Open/Closed angle)",
              "Uveitis",
              "Retina: Diabetic/Hypertensive retinopathy",
              "Squint & Refractive Errors",
              "Ocular emergencies & Blindness control"
            ]
          }
        ]
      },
      { 
        id: 'psm', 
        name: "Community Medicine", 
        icon: MapIcon, 
        color: "text-emerald-600", 
        bg: "bg-emerald-100",
        modules: [
          {
            title: "Concepts & Epidemiology",
            topics: [
              "Concept of Health & Disease",
              "Epidemiology: Methods & Studies",
              "Screening of disease",
              "Biostatistics basics"
            ]
          },
          {
            title: "Health Programs & Environment",
            topics: [
              "National Health Programs (RCH, TB, Vector borne)",
              "Environment & Health (Water, Air, Waste)",
              "Occupational Health",
              "Health Administration & Planning",
              "Nutrition & Health",
              "Maternal & Child Health (MCH)"
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    yearLabel: "Third Professional Part 2",
    semesters: "Semesters 8-9 (Final)",
    description: "Medicine, Surgery, Obs/Gyn, Peds, Ortho, Derm, Psych",
    subjects: [
      { 
        id: 'med', 
        name: "General Medicine", 
        icon: Stethoscope, 
        color: "text-blue-700", 
        bg: "bg-blue-100",
        modules: [
          {
            title: "Cardio-Respiratory",
            topics: [
              "Heart Failure, IHD, Hypertension",
              "Rheumatic Heart Disease",
              "Pneumonia, Tuberculosis, Asthma, COPD",
              "Respiratory failure"
            ]
          },
          {
            title: "GI, Renal & Neuro",
            topics: [
              "Peptic Ulcer, Hepatitis, Cirrhosis",
              "Acute/Chronic Renal Failure",
              "Stroke, Meningitis, Epilepsy",
              "Coma & Cranial nerves"
            ]
          },
          {
            title: "Infections, Endo & Heme",
            topics: [
              "Malaria, Typhoid, HIV/AIDS, Dengue",
              "Diabetes, Thyroid disorders",
              "Anemia, Leukemia, Bleeding disorders",
              "Poisoning & Bites"
            ]
          }
        ]
      },
      { 
        id: 'surg', 
        name: "General Surgery", 
        icon: Syringe, 
        color: "text-red-700", 
        bg: "bg-red-100",
        modules: [
          {
            title: "General Surgery & Trauma",
            topics: [
              "Wounds, Ulcers, Shock, Burns",
              "Fluid & Electrolytes",
              "Trauma management (ATLS)",
              "Tumors & Cysts"
            ]
          },
          {
            title: "GI & Abdominal",
            topics: [
              "Hernia, Hydrocele",
              "Appendicitis, Peritonitis",
              "Intestinal Obstruction",
              "Gall bladder & Pancreas",
              "Stomach & Colorectal malignancies"
            ]
          },
          {
            title: "Speciality Surgery",
            topics: [
              "Urology: Stones, Prostate, Tumors",
              "Breast: Lumps & Carcinoma",
              "Thyroid swellings",
              "Vascular: Varicose veins"
            ]
          }
        ]
      },
      { 
        id: 'obg', 
        name: "Obstetrics & Gynaecology", 
        icon: UserCircle, 
        color: "text-pink-600", 
        bg: "bg-pink-100",
        modules: [
          {
            title: "Obstetrics",
            topics: [
              "Diagnosis of Pregnancy & ANC",
              "Normal Labor & Puerperium",
              "APH & PPH",
              "Hypertension in Pregnancy (Pre-eclampsia)",
              "Malpresentations & Obstructed labor",
              "Medical disorders in pregnancy (Anemia)"
            ]
          },
          {
            title: "Gynaecology",
            topics: [
              "Menstrual disorders (Amenorrhea, DUB)",
              "Fibroids, Prolapse, Endometriosis",
              "Infections (PID, STD)",
              "Malignancy (Cervix, Endometrium, Ovary)",
              "Contraception & Infertility"
            ]
          }
        ]
      },
      { 
        id: 'peds', 
        name: "Pediatrics", 
        icon: Thermometer, 
        color: "text-orange-500", 
        bg: "bg-orange-100",
        modules: [
          {
            title: "General Pediatrics",
            topics: [
              "Growth & Development",
              "Nutrition & Malnutrition (PEM)",
              "Immunization & Infectious diseases",
              "Neonatology: Normal newborn, Jaundice, Sepsis"
            ]
          },
          {
            title: "Systemic Pediatrics",
            topics: [
              "Respiratory (Pneumonia, Asthma)",
              "Diarrheal diseases & Dehydration",
              "Cardiovascular (Congenital heart disease)",
              "CNS (Meningitis, Seizures)",
              "Nephrotic syndrome & Glomerulonephritis"
            ]
          }
        ]
      },
      {
        id: 'ortho',
        name: "Orthopaedics",
        icon: Bone,
        color: "text-slate-600",
        bg: "bg-slate-200",
        modules: [
          {
            title: "Trauma",
            topics: [
              "Fractures: Principles & Healing",
              "Upper limb fractures (Colles, Humerus)",
              "Lower limb fractures (Hip, Femur, Tibia)",
              "Dislocations (Shoulder, Hip)"
            ]
          },
          {
            title: "Diseases",
            topics: [
              "Bone Infection (Osteomyelitis, TB)",
              "Arthritis (Rheumatoid, Osteoarthritis)",
              "Bone Tumors",
              "Congenital anomalies (CTEV)"
            ]
          }
        ]
      },
      {
        id: 'derma',
        name: "Dermatology",
        icon: Layers,
        color: "text-rose-500",
        bg: "bg-rose-100",
        modules: [
          {
            title: "Skin & VD",
            topics: [
              "Infections: Pyoderma, Fungal, Viral",
              "Eczema, Psoriasis, Lichen Planus",
              "Leprosy",
              "Sexually Transmitted Diseases (Syphilis, Gonorrhea)"
            ]
          }
        ]
      },
      {
        id: 'psych',
        name: "Psychiatry",
        icon: Smile,
        color: "text-violet-500",
        bg: "bg-violet-100",
        modules: [
          {
            title: "Clinical Psychiatry",
            topics: [
              "Schizophrenia",
              "Mood disorders (Depression, Bipolar)",
              "Anxiety disorders",
              "Substance abuse (Alcohol)",
              "Somatoform disorders"
            ]
          }
        ]
      },
      {
        id: 'anes',
        name: "Anaesthesiology",
        icon: Wind,
        color: "text-sky-500",
        bg: "bg-sky-100",
        modules: [
          {
            title: "Basics & CPR",
            topics: [
              "General & Regional Anaesthesia",
              "Drugs & Pre-medication",
              "Airway management",
              "Cardio-Pulmonary Resuscitation (CPR)"
            ]
          }
        ]
      }
    ]
  }
];