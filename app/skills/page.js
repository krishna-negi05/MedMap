'use client';
import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Dna, ChevronRight, Activity, X, 
  Stethoscope, Pill, Microscope, Brain, HeartPulse, Droplet,
  Syringe, Thermometer, Zap, ShieldAlert, FileText, LayoutGrid, Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// DATASET: A-Z (User Data A-N + Indian MBBS Curriculum O-Z)
// ============================================================================
const DATA_TERMS = `
A
Abduction: A body part is moved away from the body’s center, such as an arm or a leg.
Ablation: A procedure involving destruction of damaged tissue using electrical energy, heat, cold, or alcohol.
Abrasion: Removal of skin or surface through scraping or rubbing.
Abdominoplasty: Procedure to trim underlying stomach muscles and remove extra skin (tummy tuck).
Abdominal Ultrasound: Process for inspecting abdominal organs using an ultrasound transducer.
Abdominoperineal Resection: Surgery to remove the anus, rectum, and part of the sigmoid colon.
Abscopal Effect: Reduction in size of tumors outside the target area of local treatments like radiation.
Absolute Neutrophil Count: Measure of the blood’s neutrophil content, used to assess infection risk.
ACE: Angiotensin-converting enzyme; changes angiotensin I to the active vasoconstrictor angiotensin II.
Acute: Severe, sharp, or beginning quickly.
Acute Lymphocytic Leukemia (ALL): Rapidly progressing blood cancer affecting immature lymphocytes.
Acute Myelogenous Leukemia (AML): Rapid blood cancer characterized by excess immature granulocytes.
Adenocarcinoma: Cancer starting in glandular cells (e.g., breast, pancreas, lung).
Adjuvant Therapy: Therapy used in addition to standard care (e.g., chemo after surgery).
Allogenic Bone Marrow Transplant: Stem cells received from a compatible donor.
Alopecia: Hair loss.
Alternative Therapy: Unproven therapy used in place of conventional medicine.
Angiogram: Imaging of blood vessels using dye to identify blockages or tumors.
Anemia: Condition characterized by low red blood cell count or hemoglobin (Very common in Indian demographics).
Anesthesia: Loss of sensation induced by drugs; can be general, regional, or local.
Anesthesiologist: Specialist in administering anesthesia and managing pain.
Antiemetic: Medication to treat or prevent nausea and vomiting.
Apheresis: Procedure where blood is drawn, separated into components, and select parts returned to the patient.
Aplastic Anemia: Bone marrow failure resulting in deficiency of all blood cell types.
Autologous Bone Marrow Transplant: Patient’s own marrow is extracted, treated, and reinfused.
AYUSH: Acronym for Ayurveda, Yoga & Naturopathy, Unani, Siddha and Homoeopathy (Indian systems of medicine).
B
Bacillus Calmette-Guérin (BCG): Vaccine against tuberculosis, included in India's Universal Immunization Program.
Baclofen: Muscle relaxant used for treating spasms.
Bacteria: Microscopic single-celled organisms; can be pathogenic or commensal.
BAER test: Brainstem Auditory Evoked Response; detects hearing loss due to nerve damage.
Balloon angioplasty: Procedure to open clogged heart arteries using a catheter balloon.
Barbiturate: CNS depressant medication reducing brain activity.
Bariatric surgery: Weight loss surgery altering the digestive system.
Barium enema: X-ray exam of the large intestine using barium contrast.
Basket trial: Clinical trial testing a drug on different cancers sharing the same mutation.
B-cell: Lymphocyte that produces antibodies; part of humoral immunity.
Benign: Non-cancerous growth that does not spread (metastasize).
Bilateral: Affecting both sides of the body.
Bile: Fluid produced by the liver, stored in the gallbladder, aids fat digestion.
Biopsy: Removal of a small tissue sample for laboratory examination.
Blasts: Immature blood cells.
Blood-Brain Barrier: Selective membrane preventing harmful substances from entering the brain.
BMI: Body Mass Index; a measure of body fat based on height and weight.
Bone Marrow: Spongy tissue inside bones producing RBCs, WBCs, and platelets.
Brachytherapy: Internal radiation therapy placing radioactive sources near the tumor.
Bronchoscopy: Visual examination of the airways using a flexible scope.
C
Calcification: Accumulation of calcium salts in body tissues.
Calcium Channel Blocker: Drug that lowers blood pressure by relaxing blood vessels.
Candidiasis: Fungal infection caused by Candida yeasts (Oral Thrush).
Carcinogen: Substance capable of causing cancer.
Cardiac Tamponade: Compression of the heart caused by fluid accumulation in the pericardial sac.
Cardiomyopathy: Disease of the heart muscle making it harder to pump blood.
Carotid Endarterectomy: Surgery to remove plaque from the carotid arteries to prevent stroke.
Carpal Tunnel Syndrome: Compression of the median nerve in the wrist causing numbness.
Cataract: Clouding of the eye's lens leading to vision loss (Major cause of blindness in India).
Catheter: Flexible tube inserted into the body to remove or introduce fluids.
CBC: Complete Blood Count; measures RBCs, WBCs, hemoglobin, hematocrit, and platelets.
Celiac Disease: Autoimmune reaction to gluten damaging the small intestine.
Cellulitis: Bacterial skin infection causing redness, swelling, and pain.
Cephalosporin: Class of beta-lactam antibiotics.
Cerebellum: Brain region coordinating voluntary movements and balance.
Cerebrovascular Accident (CVA): Stroke; damage to the brain from interruption of blood supply.
Chemotherapy: Cytotoxic drug treatment to kill rapidly dividing cancer cells.
Chikungunya: Viral disease transmitted by Aedes mosquitoes, causing severe joint pain.
Cholecystectomy: Surgical removal of the gallbladder.
Cirrhosis: Late-stage scarring (fibrosis) of the liver.
Clinical Trial: Research study testing medical interventions in humans.
Colonoscopy: Endoscopic examination of the large bowel and distal part of the small bowel.
Colostomy: Surgical operation creating an opening for the colon through the abdomen.
Congenital: Present from birth.
COPD: Chronic Obstructive Pulmonary Disease; chronic inflammatory lung disease obstructing airflow.
Coronary Artery Bypass Graft (CABG): Surgery to restore blood flow to the heart muscle.
Creatinine: Waste product of muscle metabolism; marker of kidney function.
Cyanosis: Bluish discoloration of skin due to poor oxygenation.
Cystic Fibrosis: Genetic disorder affecting lungs and digestive system with thick mucus.
Cytology: Study of cells.
D
Debridement: Removal of damaged tissue or foreign objects from a wound.
Deep Vein Thrombosis (DVT): Blood clot forming in a deep vein, usually in the legs.
Defibrillator: Device delivering electric shock to restore normal heart rhythm.
Dehydration: Harmful reduction in the amount of water in the body.
Dementia: Decline in mental ability severe enough to interfere with daily life.
Dengue: Mosquito-borne viral infection causing severe flu-like symptoms (Aedes aegypti).
Dermatology: Branch of medicine dealing with skin, nails, and hair.
Diabetes Mellitus: Metabolic group of diseases characterized by high blood sugar (India is the Diabetes capital).
Dialysis: Artificial process of eliminating waste and water from the blood.
Diastole: Phase of the heartbeat when the heart muscle relaxes and fills with blood.
Differential Diagnosis: Distinguishing a particular disease from others with similar symptoms.
Diuretic: Drug that increases the production of urine (water pill).
DNA: Deoxyribonucleic acid; carrier of genetic information.
DOTS: Directly Observed Treatment, Short-course; the internationally recommended strategy for TB control.
Dopamine: Neurotransmitter regulating movement, motivation, and reward.
Dyspnea: Difficult or labored breathing.
Dysplasia: Abnormal development of cells within tissues.
Dystrophy: Degeneration of tissue (e.g., Muscular Dystrophy).
E
ECG (Electrocardiogram): Recording of the electrical activity of the heart.
Echocardiogram: Ultrasound of the heart.
Eclampsia: Seizures in a pregnant woman with high blood pressure (preeclampsia).
Ectopic Pregnancy: Implantation of fertilized egg outside the uterus.
Edema: Swelling caused by excess fluid trapped in body tissues.
EEG (Electroencephalogram): Test detecting electrical activity in the brain.
Electrolytes: Minerals (Na, K, Ca) in blood carrying electric charge.
Embolism: Obstruction of an artery, typically by a clot or air bubble.
Emphysema: Lung condition involving damage to the air sacs (alveoli).
Endocrinology: Study of hormones and endocrine glands.
Endoscopy: Non-surgical procedure to examine a person's digestive tract.
Epidemiology: Study of distribution and determinants of health states (PSM subject).
Epilepsy: Neurological disorder characterized by recurrent seizures.
Erythrocyte: Red blood cell.
Esophagus: Tube connecting the throat to the stomach.
Estrogen: Primary female sex hormone.
Etiology: The cause or set of causes of a disease.
Excision: Surgical removal of part of the body.
F
Fallopian Tubes: Tubes transporting eggs from ovaries to the uterus.
Fasciculation: Brief, spontaneous contraction affecting a small number of muscle fibers.
Febrile: Showing symptoms of a fever.
Femur: The thigh bone; longest bone in the body.
Filaria: Parasitic disease caused by roundworms, transmitted by mosquitoes (Lymphatic Filariasis).
Fibrillation: Rapid, irregular, and unsynchronized contraction of muscle fibers.
Fibrosis: Thickening and scarring of connective tissue.
Fistula: Abnormal connection between two hollow spaces or organs.
Fluoroscopy: Imaging technique to obtain real-time moving images of internal structures.
Folate: Vitamin B9, essential for cell growth and metabolism (Deficiency causes neural tube defects).
Fracture: A break in bone or cartilage.
Fungal Infection: Infection caused by fungus (Mycosis).
G
Gastritis: Inflammation of the stomach lining.
Gastroenteritis: Inflammation of the stomach and intestines (stomach flu).
Gastroesophageal Reflux Disease (GERD): Chronic acid reflux.
Generic Drug: Medication created to be the same as an already marketed brand-name drug (Jan Aushadhi).
Genetics: Study of heredity and variation of inherited characteristics.
Geriatrics: Health care of elderly people.
Gingivitis: Inflammation of the gums.
Glaucoma: Eye condition damaging the optic nerve, often linked to high pressure.
Glomerular Filtration Rate (GFR): Test to estimate how much blood passes through glomeruli per minute.
Glucose: Simple sugar; main source of energy for the body.
Goiter: Abnormal enlargement of the thyroid gland (Iodine deficiency).
Gout: Arthritis caused by excess uric acid crystals in joints.
Gynecology: Medical practice dealing with the health of the female reproductive system.
H
Haemoglobin: Protein in RBCs that carries oxygen.
Haemophilia: Genetic disorder impairing the body's ability to make blood clots.
Halitosis: Bad breath.
Hematology: Study of blood and blood disorders.
Hematoma: Collection of blood outside of blood vessels (bruise).
Hemodialysis: Kidney dialysis.
Hepatitis: Inflammation of the liver (Hep A, B, C, D, E).
Hernia: Organ pushing through an opening in the muscle or tissue that holds it in place.
Histology: Microscopic study of tissues.
HIV: Human Immunodeficiency Virus; attacks the immune system.
Homeostasis: State of steady internal physical and chemical conditions.
Hormone Replacement Therapy (HRT): Treatment with hormones to replace natural deficiencies.
Hospice: Care focused on quality of life for those with life-limiting illness.
Hypertension: High blood pressure.
Hypoglycemia: Low blood sugar.
Hypoxia: Deficiency in the amount of oxygen reaching the tissues.
Hysterectomy: Surgical removal of the uterus.
I
Iatrogenic: Illness caused by medical examination or treatment.
Idiopathic: Disease of unknown cause.
Ileum: Third portion of the small intestine.
Immunoassay: Biochemical test measuring the presence or concentration of a macromolecule.
Immunoglobulin (Ig): Antibody.
Immunosuppressant: Drug that suppresses the immune response.
Implant: Medical device manufactured to replace a missing biological structure.
Incision: Cut made during surgery.
Incontinence: Inability to control urination or defecation.
Infarct: Tissue death (necrosis) due to inadequate blood supply.
Inflammation: Immune response to injury/infection (Redness, Heat, Swelling, Pain).
Influenza: Viral infection attacking the respiratory system.
Insulin: Hormone regulating blood glucose levels.
Intubation: Insertion of a tube into the trachea for ventilation.
Ischemia: Restriction in blood supply to tissues.
IV (Intravenous): Delivery of fluids/medication directly into a vein.
J
Japanese Encephalitis: Viral brain infection spread by mosquitoes, prevalent in parts of India.
Jaundice: Yellowing of skin/eyes due to excess bilirubin (liver dysfunction).
Jejunum: The middle section of the small intestine.
Joint: The location at which bones connect.
Jugular Vein: Major vein in the neck carrying blood from the head to the heart.
Juvenile Diabetes: Type 1 Diabetes, typically diagnosed in children/young adults.
K
Kala-azar: Visceral Leishmaniasis; parasitic disease transmitted by sandflies (Endemic in Bihar/WB).
Karyotype: The number and visual appearance of the chromosomes in the cell nuclei.
Keloid: Overgrowth of scar tissue.
Keratin: Structural protein in skin, hair, and nails.
Ketoacidosis: Serious diabetes complication where the body produces excess blood acids (ketones).
Kidney Stones: Hard deposits made of minerals and salts that form inside kidneys.
Koplik's Spots: Small white spots in the mouth, early sign of Measles.
Kyphosis: Excessive outward curvature of the spine (hunchback).
L
Laparoscopy: Minimally invasive surgery using small incisions and a camera.
Larynx: The voice box.
Leprosy: Hansen's disease; chronic infectious disease caused by Mycobacterium leprae.
Lesion: A region in an organ or tissue that has suffered damage.
Leukemia: Cancer of blood-forming tissues hindering the body's ability to fight infection.
Leukocyte: White blood cell.
Ligament: Fibrous tissue connecting bone to bone.
Lipid Profile: Blood test measuring cholesterol and triglycerides.
Lipoma: Fatty lump situated between the skin and underlying muscle layer.
Liver Function Tests (LFTs): Blood tests to check how well the liver is working.
Lumbar Puncture: Spinal tap; needle inserted into spinal canal to collect CSF.
Lymph Node: Small bean-shaped structure filtering substances in lymphatic fluid.
Lymphoma: Cancer of the lymphatic system.
M
Magnetic Resonance Imaging (MRI): Imaging using strong magnetic fields and radio waves.
Malaria: Mosquito-borne disease caused by Plasmodium parasite (High yield topic in India).
Malignant: Cancerous; capable of invading and destroying nearby tissue.
Mammogram: X-ray picture of the breast.
Mantoux Test: Skin test for Tuberculosis sensitivity.
Mastectomy: Surgical removal of the breast.
Melanoma: The most serious type of skin cancer.
Meningitis: Inflammation of the membranes (meninges) surrounding brain and spinal cord.
Menopause: Natural cessation of menstruation.
Metabolism: Chemical processes that occur within a living organism to maintain life.
Metastasis: Spread of cancer cells to new areas of the body.
Microbiology: Study of microscopic organisms (bacteria, viruses, fungi).
Migraine: Headache of varying intensity, often accompanied by nausea and sensitivity to light.
Mitral Valve: Valve between the left atrium and the left ventricle.
Morbidity: Condition of suffering from a disease or medical condition.
Mortality: Death rate.
Multiple Sclerosis (MS): Disease where immune system eats away at the protective covering of nerves.
Myocardial Infarction (MI): Heart attack.
Myopia: Nearsightedness.
N
Narcolepsy: Chronic sleep disorder characterized by overwhelming daytime drowsiness.
Nasogastric Tube: Tube passed through the nose into the stomach.
Nebulizer: Device converting liquid medicine into mist for inhalation.
Necrosis: Death of cells or tissue.
Neonatology: Care of newborn infants, especially ill or premature newborns.
Nephrology: Branch of medicine dealing with physiology and diseases of the kidneys.
Neurology: Branch of medicine dealing with disorders of the nervous system.
Neutropenia: Abnormally low count of neutrophils (type of WBC).
Non-Invasive: Procedure not involving breaks in the skin or entry into body cavities.
Nosocomial Infection: Hospital-acquired infection.
NSAID: Non-Steroidal Anti-Inflammatory Drug (e.g., Ibuprofen, Aspirin).
O
Obesity: Medical condition characterized by excess body fat accumulating to the extent that it may have a negative effect on health.
Obstetrics: Branch of medicine covering pregnancy, childbirth, and the postpartum period.
Occipital: Relating to the back of the head or skull.
Occlusion: The blockage or closing of a blood vessel or hollow organ.
Oedema: (Indian/UK spelling) Swelling caused by excess fluid in body tissues.
Oesophagus: (Indian/UK spelling) The muscular tube connecting the throat to the stomach.
Olfactory: Relating to the sense of smell.
Oncology: Branch of medicine that deals with the prevention, diagnosis, and treatment of cancer.
Onychomycosis: Fungal infection of the nail.
Oophorectomy: Surgical removal of one or both ovaries.
Ophthalmology: Branch of medicine dealing with the diagnosis and treatment of eye disorders.
Opioid: A class of drugs that include the illegal drug heroin, synthetic opioids such as fentanyl, and pain relievers.
Optic Nerve: The nerve that transmits visual information from the retina to the brain.
Oral Rehydration Solution (ORS): Fluid replacement used to prevent/treat dehydration (Crucial in Indian Pediatrics).
Orchitis: Inflammation of one or both testicles.
Orthopedics: Branch of surgery concerned with conditions involving the musculoskeletal system.
Osteoarthritis: Degenerative joint disease caused by breakdown of cartilage.
Osteoblast: A cell that secretes the matrix for bone formation.
Osteoclast: A large multinucleate bone cell that absorbs bone tissue during growth and healing.
Osteomalacia: Softening of the bones, typically through a deficiency of vitamin D or calcium.
Osteoporosis: A medical condition in which the bones become brittle and fragile.
Otitis Media: Inflammation of the middle ear.
Otolaryngology: ENT (Ear, Nose, and Throat) medicine.
Ovary: A female reproductive organ in which ova or eggs are produced.
Oximeter: Device used to measure the proportion of oxygenated hemoglobin in the blood.
Oxytocin: Hormone causing contraction of the uterus during labor and stimulating milk ejection.
P
Pacemaker: An artificial device for stimulating the heart muscle and regulating its contractions.
Paediatrics: Branch of medicine dealing with children and their diseases.
Palliative Care: Specialized medical care for people living with a serious illness, focusing on relief from symptoms.
Palpation: Method of feeling with the fingers or hands during a physical examination.
Palpitations: A noticeably rapid, strong, or irregular heartbeat due to agitation, exertion, or illness.
Pancreatitis: Inflammation of the pancreas.
Pandemic: A widespread occurrence of an infectious disease over a whole country or the world.
Pap Smear: Screening procedure for cervical cancer.
Paracetamol: (Acetaminophen) Common pain reliever and fever reducer.
Parasitology: Study of parasites (e.g., Malaria, worms).
Parathyroid: Small glands in the neck that control the body's calcium levels.
Parkinson's Disease: A progressive nervous system disorder that affects movement.
Pathogen: A bacterium, virus, or other microorganism that can cause disease.
Pathology: The study of the causes and effects of disease or injury.
Pelvic Inflammatory Disease (PID): Infection of the female reproductive organs.
Pepsin: The chief digestive enzyme in the stomach, which breaks down proteins.
Peptic Ulcer: A sore on the lining of the stomach, small intestine, or esophagus.
Percussion: Tapping on a surface to determine the underlying structure.
Pericardium: The membrane enclosing the heart.
Peritoneum: The serous membrane lining the cavity of the abdomen and covering the abdominal organs.
Petechiae: Tiny round brown-purple spots due to bleeding under the skin.
Pharmacology: The branch of medicine concerned with the uses, effects, and modes of action of drugs.
Phlebitis: Inflammation of a vein.
Photophobia: Extreme sensitivity to light.
Physiology: The branch of biology that deals with the normal functions of living organisms and their parts.
Physiotherapy: Treatment of disease, injury, or deformity by physical methods such as massage, heat treatment, and exercise.
Placebo: A harmless pill, medicine, or procedure prescribed more for the psychological benefit to the patient.
Placenta: An organ that develops in the uterus during pregnancy to provide oxygen and nutrients to the baby.
Plasma: The colorless fluid part of blood, lymph, or milk, in which corpuscles or fat globules are suspended.
Platelets: (Thrombocytes) Small colorless disk-shaped cell fragments involved in clotting.
Pleural Effusion: Build-up of excess fluid between the layers of the pleura outside the lungs.
Pneumonia: Infection that inflames air sacs in one or both lungs, which may fill with fluid.
Pneumothorax: A collapsed lung.
Poliomyelitis: Infectious viral disease that affects the central nervous system (Polio eradication is a major Indian milestone).
Polyuria: Production of abnormally large volumes of dilute urine.
Post-Op: Post-operative; after surgery.
Pre-eclampsia: Pregnancy complication characterized by high blood pressure and signs of damage to another organ system.
Prescription: An instruction written by a medical practitioner that authorizes a patient to be provided a medicine or treatment.
Prognosis: The likely course of a disease or ailment.
Prolapse: A slipping forward or down of one of the parts or organs of the body.
Prophylaxis: Action taken to prevent disease.
Prostate: A gland surrounding the neck of the bladder in male mammals.
Proteinuria: The presence of abnormal quantities of protein in the urine, indicating kidney damage.
Psoriasis: A skin disease that causes red, itchy scaly patches.
Psychiatry: The study and treatment of mental illness, emotional disturbance, and abnormal behavior.
Psychosis: A severe mental disorder in which thought and emotions are so impaired that contact is lost with external reality.
Ptosis: Drooping of the upper eyelid.
Pulmonary Embolism (PE): Blockage in one of the pulmonary arteries in the lungs.
Pulse Oximetry: Non-invasive method for monitoring a person's oxygen saturation.
Purulent: Consisting of, containing, or discharging pus.
Pyrexia: Raised body temperature; fever.
Q
QRS Complex: The combination of three of the graphical deflections seen on a typical electrocardiogram (ECG).
Quadriplegia: Paralysis of all four limbs; tetraplegia.
Quarantine: Restriction on the movement of people/goods to prevent the spread of disease.
Quinine: Medication used to treat malaria and babesiosis.
Quinsy: Peritonsillar abscess; a complication of tonsillitis where an abscess forms behind the tonsil.
R
Rabies: Viral disease causing inflammation of the brain in humans and other mammals (Hydrophobia).
Radial Artery: Major artery in the forearm; common site for taking pulse.
Radiation Therapy: The use of high-energy radiation to damage cancer cells' DNA.
Radiology: The medical specialty that uses medical imaging to diagnose and treat diseases.
Rash: A noticeable change in the texture or color of the skin.
Recessive: A gene that can be masked by a dominant gene.
Rectum: The final section of the large intestine, terminating at the anus.
Red Blood Cell: Erythrocyte; cell that carries oxygen.
Reflex: An action that is performed as a response to a stimulus and without conscious thought.
Regurgitation: Backward flow of blood through a defective heart valve.
Rehabilitation: Care that can help you get back, keep, or improve abilities that you need for daily life.
Remission: A diminution of the seriousness or intensity of disease or pain.
Renal: Relating to the kidneys.
Renal Failure: Condition in which the kidneys lose the ability to remove waste and balance fluids.
Respiration: The action of breathing.
Resuscitation: The action of reviving someone from unconsciousness or apparent death (CPR).
Retina: Layer at the back of the eyeball containing cells that are sensitive to light.
Rhesus Factor: (Rh Factor) An antigen occurring on the red blood cells of many humans.
Rheumatic Fever: Inflammatory disease that can develop when strep throat or scarlet fever isn't properly treated.
Rheumatoid Arthritis: Chronic inflammatory disorder affecting many joints, including those in the hands and feet.
Rhinitis: Inflammation of the mucous membrane of the nose.
Rickets: Softening and weakening of bones in children, usually due to extreme and prolonged vitamin D deficiency.
Rigor Mortis: Stiffening of the joints and muscles of a body a few hours after death.
RNTCP: Revised National Tuberculosis Control Programme (Now NTEP - National TB Elimination Program in India).
Root Canal: Treatment to repair and save a badly damaged or infected tooth.
Rubella: (German Measles) Contagious viral infection best known by its distinctive red rash.
S
Saline: A solution of salt in water.
Sarcoma: A malignant tumor of connective or other nonepithelial tissue.
Scabies: Contagious skin infestation by the itch mite Sarcoptes scabiei.
Schizophrenia: Disorder that affects a person's ability to think, feel, and behave clearly.
Sclera: The white outer layer of the eyeball.
Scoliosis: Abnormal lateral curvature of the spine.
Scrub Typhus: Mite-borne infectious disease (Tsutsugamushi disease) common in parts of India.
Sedative: A drug taken for its calming or sleep-inducing effect.
Sepsis: Life-threatening complication of an infection.
Septicemia: Blood poisoning, especially that caused by bacteria or their toxins.
Serum: An amber-colored, protein-rich liquid that separates out when blood coagulates.
Shock: Critical condition brought on by a sudden drop in blood flow through the body.
Sickle Cell Anemia: Inherited red blood cell disorder where there aren't enough healthy RBCs to carry oxygen.
Sigmoidoscopy: Examination of the sigmoid colon by means of a flexible tube inserted through the anus.
Sinusitis: Inflammation of a nasal sinus.
Sleep Apnea: Sleep disorder in which breathing repeatedly stops and starts.
Sonography: Ultrasound imaging.
Spasm: Sudden involuntary muscular contraction or convulsive movement.
Sphygmomanometer: Instrument for measuring blood pressure.
Spinal Cord: Cylindrical bundle of nerve fibers and associated tissue that is enclosed in the spine.
Spirometry: Common office test used to assess how well your lungs work.
Spleen: Organ involved in the production and removal of blood cells.
Splenomegaly: Abnormal enlargement of the spleen (Common in Malaria/Kala-azar).
Spondylitis: Inflammation of the joints of the backbone.
Sputum: A mixture of saliva and mucus coughed up from the respiratory tract (Used in TB testing).
Statin: Class of drugs often prescribed to help lower cholesterol levels.
Stem Cell: Cell with the unique ability to develop into specialized cell types.
Stenosis: The abnormal narrowing of a passage in the body.
Stent: A tubular support placed temporarily inside a blood vessel, canal, or duct to aid healing or relieve an obstruction.
Sterilization: Process of making something free from bacteria or other living microorganisms; also surgical contraception.
Stethoscope: Acoustic medical device for auscultation, or listening to internal sounds of an animal or human body.
Stroke: Damage to the brain from interruption of its blood supply.
Subcutaneous: Situated or applied under the skin.
Supine: Lying face upward.
Suture: A stitch or row of stitches holding together the edges of a wound or surgical incision.
Sympathetic Nervous System: Part of the autonomic nervous system that stimulates the body's fight-or-flight response.
Symptom: A physical or mental feature that is regarded as indicating a condition of disease.
Synapse: A junction between two nerve cells.
Syndrome: A group of symptoms which consistently occur together.
Systole: The phase of the heartbeat when the heart muscle contracts and pumps blood from the chambers into the arteries.
T
Tachycardia: Abnormally rapid heart rate.
TB (Tuberculosis): Infectious bacterial disease characterized by the growth of nodules (tubercles) in the tissues, especially the lungs.
Tendon: A flexible but inelastic cord of strong fibrous collagen tissue attaching a muscle to a bone.
Teratogen: An agent or factor that causes malformation of an embryo.
Testosterone: Steroid hormone that stimulates development of male secondary sexual characteristics.
Tetanus: (Lockjaw) Bacterial infection causing painful muscle spasms and can lead to death.
Thalassemia: Inherited blood disorder characterized by less oxygen-carrying protein (hemoglobin) and fewer red blood cells.
Thorax: The part of the body between the neck and the abdomen.
Thrombosis: Local coagulation or clotting of the blood in a part of the circulatory system.
Thyroid: Large ductless gland in the neck that secretes hormones regulating growth and development through the rate of metabolism.
Tinnitus: Ringing or buzzing in the ears.
Tissue: A group of cells that have similar structure and that function together as a unit.
Tonsillitis: Inflammation of the tonsils.
Tourniquet: Device for stopping the flow of blood through a vein or artery, typically by compressing a limb.
Toxicology: The branch of science concerned with the nature, effects, and detection of poisons.
Trachea: Windpipe; tube connecting the larynx to the bronchi.
Transfusion: Transferring blood or blood products into the bloodstream.
Transplant: Surgical procedure to place a functioning organ or tissue into a person's body.
Trauma: Physical injury or deep psychological distress.
Tremor: Involuntary quivering movement.
Triage: The assignment of degrees of urgency to wounds or illnesses to decide the order of treatment.
Triglycerides: The main constituents of natural fats and oils; high concentrations in the blood indicate an elevated risk of stroke.
Tumor: A swelling of a part of the body, generally without inflammation, caused by an abnormal growth of tissue.
Typhoid: Bacterial fever caused by Salmonella typhi (Water-borne disease).
U
Ulcer: A sore on the skin or a mucous membrane, accompanied by the disintegration of tissue.
Ulna: The thinner and longer of the two bones in the human forearm.
Ultrasound: Sound or other vibrations having an ultrasonic frequency, used in medical imaging.
Umbilical Cord: A flexible cordlike structure containing blood vessels and attaching a human fetus to the placenta.
Universal Donor: A person of blood group O negative, who can donate blood to recipients of any ABO blood group.
Universal Recipient: A person of blood group AB positive, who can receive blood from any donor.
Urea: Colorless crystalline compound that is the main nitrogenous breakdown product of protein metabolism, excreted in urine.
Uremia: A raised level in the blood of urea and other nitrogenous waste compounds that are normally eliminated by the kidneys.
Ureter: The duct by which urine passes from the kidney to the bladder.
Urethra: The duct by which urine is conveyed out of the body from the bladder.
Urinalysis: Analysis of urine to test for the presence of disease, drugs, etc.
Urology: Branch of medicine and physiology concerned with the function and disorders of the urinary system.
Urticaria: Hives; a rash of round, red welts on the skin that itch intensely.
Uterus: The womb.
UTI (Urinary Tract Infection): Infection in any part of the urinary system, the kidneys, bladder, or urethra.
V
Vaccination: Treatment with a vaccine to produce immunity against a disease.
Vagina: The muscular tube leading from the external genitals to the cervix of the uterus.
Varicose Veins: Gnarled, enlarged veins, most commonly appearing in the legs and feet.
Vasectomy: Medical sterilization procedure for men.
Vasoconstriction: The constriction of blood vessels, which increases blood pressure.
Vasodilation: The dilatation of blood vessels, which decreases blood pressure.
Vector: An organism, typically a biting insect or tick, that transmits a disease or parasite from one animal or plant to another (e.g., Mosquitoes).
Vein: Any of the tubes forming part of the blood circulation system of the body, carrying in most cases oxygen-depleted blood toward the heart.
Ventilator: A machine that moves breathable air into and out of the lungs.
Ventricle: A hollow part or cavity in an organ, especially one of the two main chambers of the heart.
Vertigo: A sensation of whirling and loss of balance.
Virology: The branch of science that deals with the study of viruses.
Virus: An infective agent that typically consists of a nucleic acid molecule in a protein coat.
Viscera: The internal organs in the main cavities of the body, especially those in the abdomen.
Vital Signs: Clinical measurements, specifically pulse rate, temperature, respiration rate, and blood pressure.
Vitamin: A group of organic compounds which are essential for normal growth and nutrition.
Vitiligo: A condition in which the pigment is lost from areas of the skin, causing whitish patches.
Vomiting: Eject matter from the stomach through the mouth.
W
Wart: A small, hard, benign growth on the skin, caused by a virus.
WBC (White Blood Cell): Leukocyte; cells involved in defending the body against infective organisms and foreign substances.
Western Blot: Laboratory method used to detect specific protein molecules from among a mixture of proteins (Used in HIV confirmation).
Wheeze: Breathe with a whistling or rattling sound in the chest.
Whipple Procedure: A complex operation to remove the head of the pancreas, the first part of the small intestine, the gallbladder, and the bile duct.
Widal Test: Diagnostic test for Enteric Fever (Typhoid), commonly used in India.
Wilson's Disease: A rare genetic disorder that causes copper to accumulate in your liver, brain, and other vital organs.
Withdrawal: Physical and mental symptoms that occur after stopping or reducing intake of a drug.
Womb: The uterus.
World Health Organization (WHO): A specialized agency of the United Nations responsible for international public health.
Wound: An injury to living tissue caused by a cut, blow, or other impact.
X
Xanax: Brand name for Alprazolam, used to treat anxiety and panic disorders.
X-chromosome: The sex chromosome found in both men and women.
Xenograft: A tissue graft or organ transplant from a donor of a different species from the recipient.
Xeroderma: Excessive dryness of the skin.
Xerophthalmia: Abnormal dryness of the conjunctiva and cornea of the eye, typically caused by vitamin A deficiency (Public health concern in developing nations).
Xerostomia: Dry mouth resulting from reduced or absent saliva flow.
X-linked: Trait or disorder determined by a gene on the X chromosome.
X-ray: Electromagnetic radiation used to view internal body structures.
Y
Y-chromosome: The sex chromosome found only in males.
Yeast Infection: Infection caused by the yeast Candida.
Yellow Fever: Viral disease transmitted by mosquitoes (Vaccine mandatory for travel to certain African/S. American countries).
Yersinia pestis: Bacteria that causes plague.
Yoga: A Hindu spiritual and ascetic discipline, a part of which, including breath control, simple meditation, and the adoption of specific bodily postures, is widely practiced for health and relaxation.
Z
Zinc: Essential mineral involved in numerous aspects of cellular metabolism; supplements used in diarrhea management in children.
Zoonosis: A disease which can be transmitted to humans from animals.
Zygote: A diploid cell resulting from the fusion of two haploid gametes; a fertilized ovum.
`;
// ============================================================================
// DATASET 2: CLINICAL CONDITIONS (Dark Mode Data)
// ============================================================================
const DATA_CONDITIONS = `
A
Abdominal Aortic Aneurysm: An enlarged area in the lower part of the major vessel that supplies blood to the body.
Acute Coronary Syndrome: A range of conditions associated with sudden, reduced blood flow to the heart.
Acute Flaccid Paralysis: A sudden onset of weakness or paralysis of a limb, a key indicator for Polio surveillance in India.
Acute Glomerulonephritis: Inflammation of the tiny filters in the kidneys (glomeruli), often post-streptococcal.
Acute Kidney Injury: Abrupt loss of kidney function that develops within 7 days.
Acute Liver Failure: Loss of liver function that occurs rapidly, often in a person who has no pre-existing liver disease.
Acute Lymphoblastic Leukemia: A type of cancer of the blood and bone marrow that affects white blood cells.
Acute Myeloid Leukemia: A cancer of the myeloid line of blood cells, characterized by the rapid growth of abnormal cells.
Acute Otitis Media: A painful type of ear infection resulting from an infection of the middle ear.
Acute Pancreatitis: Sudden inflammation of the pancreas, often due to gallstones or alcohol.
Acute Renal Failure: Sudden loss of the ability of the kidneys to remove waste and concentrate urine.
Acute Respiratory Distress Syndrome: Fluid leakage into the lungs making breathing difficult or impossible.
Acute Rheumatic Fever: An inflammatory disease that can develop as a complication of inadequately treated strep throat.
Addison's Disease: A disorder in which the adrenal glands don't produce enough hormones.
Adhesive Capsulitis: Frozen shoulder; stiffness and pain in the shoulder joint.
Alcoholic Liver Disease: Liver damage caused by excessive alcohol intake, leading to fatty liver, hepatitis, and cirrhosis.
Allergic Rhinitis: Diagnosis associated with a group of symptoms affecting the nose due to allergen inhalation.
Alzheimer's Disease: A progressive disease that destroys memory and other important mental functions.
Amoebic Liver Abscess: A collection of pus in the liver in response to an intestinal parasite (Entamoeba histolytica).
Anaphylactic Shock: A severe, potentially life-threatening allergic reaction.
Ankylosing Spondylitis: An inflammatory arthritis affecting the spine and large joints.
Antiphospholipid Syndrome: An immune system disorder that increases the risk of blood clots.
Aortic Regurgitation: Leaking of the aortic valve that causes blood to flow in the reverse direction.
Aortic Stenosis: Narrowing of the valve in the large blood vessel branching off the heart.
Aplastic Anemia: A rare condition in which the body stops producing enough new blood cells.
Atrial Fibrillation: An irregular, often rapid heart rate that usually causes poor blood flow.
Atrial Septal Defect: A birth defect of the heart in which there is a hole in the wall (septum) that divides the upper chambers.
Autoimmune Hemolytic Anemia: A group of disorders characterized by a malfunction of the immune system that produces autoantibodies, which attack red blood cells.
B
Bacterial Endocarditis: An infection of the inner lining of your heart chambers and heart valves.
Bacterial Meningitis: A serious infection of the fluid and membranes surrounding the brain and spinal cord.
Bacterial Vaginosis: A type of vaginal inflammation caused by the overgrowth of bacteria naturally found in the vagina.
Barrett's Esophagus: A condition where the tissue lining the esophagus is replaced by tissue that is similar to the intestinal lining.
Basal Cell Carcinoma: A type of skin cancer that begins in the basal cells.
Becker Muscular Dystrophy: An inherited disorder that involves slowly worsening muscle weakness of the legs and pelvis.
Beckwith-Wiedemann Syndrome: An overgrowth disorder usually present at birth, characterized by an increased risk of childhood cancer.
Bell's Palsy: Sudden weakness in the muscles on one half of the face.
Benign Paroxysmal Positional Vertigo: A sensation of spinning that occurs suddenly with movement of the head.
Benign Prostatic Hyperplasia: Age-associated prostate gland enlargement that can cause urination difficulty.
Berry Aneurysm: A small, berry-shaped bulge in a blood vessel in the brain (Circle of Willis).
Bipolar Disorder: A mental disorder that causes unusual shifts in mood, energy, activity levels, and concentration.
Borderline Personality Disorder: A mental health disorder impacting the way you think and feel about yourself and others.
Brachial Plexus Injury: Injury to the network of nerves that sends signals from your spine to your shoulder, arm and hand.
Bronchial Asthma: A condition in which a person's airways become inflamed, narrow and swell, and produce extra mucus.
Bronchopulmonary Dysplasia: A chronic lung disease that affects newborns (mostly premature) who received oxygen therapy.
Budd-Chiari Syndrome: A very rare condition, affecting one in a million adults, caused by occlusion of the hepatic veins.
Buerger's Disease: Thromboangiitis obliterans; blood vessels become inflamed, swell and can become blocked with blood clots (Smokers).
Bulimia Nervosa: A serious eating disorder marked by binging, followed by methods to avoid weight gain (purging).
Bullous Pemphigoid: A rare skin condition that causes large, fluid-filled blisters.
Burkitt's Lymphoma: A cancer of the lymphatic system, particularly B lymphocytes (Starry sky appearance).
C
Carpal Tunnel Syndrome: A numbness and tingling in the hand and arm caused by a pinched nerve in the wrist.
Cauda Equina Syndrome: A serious neurologic condition in which there is acute loss of function of the lumbar plexus.
Celiac Disease: An immune reaction to eating gluten, a protein found in wheat, barley and rye.
Cerebral Malaria: A severe complication of Plasmodium falciparum infection causing coma.
Cerebral Palsy: A congenital disorder of movement, muscle tone, or posture.
Cervical Cancer: A type of cancer that occurs in the cells of the cervix.
Cervical Spondylosis: Age-related wear and tear affecting the spinal disks in your neck.
Chicken Pox: A highly contagious viral infection causing an itchy, blister-like rash (Varicella).
Chikungunya Fever: A viral disease transmitted to humans by infected mosquitoes.
Cholecystitis Acute: Inflammation of the gallbladder.
Chronic Bronchitis: Inflammation of the lining of bronchial tubes, which carry air to and from the lungs.
Chronic Kidney Disease: Longstanding disease of the kidneys leading to renal failure.
Chronic Liver Disease: A disease process of the liver that involves a process of progressive destruction and regeneration.
Chronic Lymphocytic Leukemia: A type of cancer of the blood and bone marrow.
Chronic Myeloid Leukemia: An uncommon type of cancer of the bone marrow (Philadelphia Chromosome).
Chronic Obstructive Pulmonary Disease: A chronic inflammatory lung disease that causes obstructed airflow from the lungs.
Chronic Pancreatitis: Long-standing inflammation of the pancreas that alters the organ's normal structure and functions.
Cluster Headache: Severe headaches on one side of the head, often around the eye.
Coarctation of Aorta: A birth defect in which a part of the aorta is narrower than usual.
Colorectal Cancer: Cancer of the colon or rectum, located at the digestive tract's lower end.
Congenital Heart Disease: An abnormality in the heart that develops before birth.
Congestive Heart Failure: A chronic condition in which the heart doesn't pump blood as well as it should.
Conn's Syndrome: Primary hyperaldosteronism; excess production of the hormone aldosterone.
Cor Pulmonale: Abnormal enlargement of the right side of the heart as a result of disease of the lungs.
Coronary Artery Disease: Damage or disease in the heart's major blood vessels.
Crohn's Disease: A chronic inflammatory bowel disease that affects the lining of the digestive tract.
Cushing's Syndrome: A condition that occurs from exposure to high cortisol levels for a long time.
Cystic Fibrosis: An inherited life-threatening disorder that damages the lungs and digestive system.
Cytomegalovirus Infection: A common virus that can infect almost anyone; dangerous in immunocompromised.
D
Deep Vein Thrombosis: A blood clot in a deep vein, usually in the legs.
Degenerative Disc Disease: Osteoarthritis of the spine, usually in the neck or lower back.
Dengue Hemorrhagic Fever: A severe form of Dengue causing bleeding, low platelets, and blood plasma leakage.
Dengue Shock Syndrome: A dangerous complication of dengue infection with severe hypotension.
Dermatitis Herpetiformis: A chronic, very itchy skin rash made up of bumps and blisters (Linked to Celiac).
Diabetes Insipidus: A condition characterized by large amounts of dilute urine and increased thirst.
Diabetes Mellitus Type 1: A chronic condition in which the pancreas produces little or no insulin.
Diabetes Mellitus Type 2: A chronic condition that affects the way the body processes blood sugar.
Diabetic Ketoacidosis: A serious diabetes complication where the body produces excess blood acids (ketones).
Diabetic Neuropathy: A type of nerve damage that can occur if you have diabetes.
Diabetic Retinopathy: A diabetes complication that affects eyes (Cotton wool spots).
Dilated Cardiomyopathy: A condition in which the heart's ability to pump blood is decreased because the left ventricle is enlarged.
Disseminated Intravascular Coagulation: A condition affecting the blood's ability to clot and stop bleeding.
Diverticular Disease: A condition where small, bulging pouches develop in the digestive tract.
Down Syndrome: A genetic disorder caused by abnormal cell division which results in an extra full or partial copy of chromosome 21.
Dry Eye Syndrome: A condition in which a person doesn't have enough quality tears to lubricate and nourish the eye.
Duchenne Muscular Dystrophy: A severe type of muscular dystrophy that primarily affects boys.
Duodenal Ulcer: A peptic ulcer that develops in the first part of the small intestine.
Dysfunctional Uterine Bleeding: Abnormal bleeding from the vagina that is due to changes in hormone levels.
Dyslipidemic Syndrome: High levels of lipids (fats) in the blood (hyperlipidemia).
E
Ectopic Pregnancy: A pregnancy in which the fertilized egg implants outside the uterus.
Ehlers-Danlos Syndrome: A group of inherited disorders that affect your connective tissues.
Emphysematous Pyelonephritis: A severe, life-threatening infection of the kidney parenchyma with gas formation.
Encephalitis Lethargica: A disease characterized by high fever, headache, double vision, delayed physical and mental response, and lethargy.
End Stage Renal Disease: The last stage of chronic kidney disease.
Endometrial Cancer: A type of cancer that begins in the lining of the uterus (endometrium).
Enteric Fever: Typhoid fever; a bacterial infection that can spread throughout the body.
Epidural Hematoma: Bleeding between the tough outer membrane of the covering of the brain and the skull.
Epileptic Status: Status epilepticus; a seizure that lasts longer than 5 minutes, or having more than 1 seizure within a 5-minute period.
Erectile Dysfunction: The inability to get or keep an erection firm enough to have sexual intercourse.
Erythema Multiforme: A skin reaction that can be triggered by an infection or some medicines.
Erythema Nodosum: A skin inflammation that is located in a part of the fatty layer of skin.
Esophageal Varices: Abnormal, enlarged veins in the tube that connects the throat and stomach.
Essential Hypertension: High blood pressure that doesn't have a known secondary cause.
Essential Tremor: A nervous system (neurological) disorder that causes involuntary and rhythmic shaking.
Ewing's Sarcoma: A rare type of cancer that occurs in bones or in the soft tissue around the bones.
Extrapulmonary Tuberculosis: TB infection occurring outside the lungs (Lymph nodes, Spine, Intestines).
F
Facial Nerve Palsy: Paralysis of the facial nerve (Bell's Palsy).
Factor V Leiden: A mutation of one of the clotting factors in the blood preventing clots from dissolving.
Familial Adenomatous Polyposis: An inherited disorder characterized by cancer of the large intestine and rectum.
Familial Hypercholesterolemia: A genetic disorder characterized by high cholesterol levels.
Fanconi Anemia: A rare disease passed down through families that mainly affects the bone marrow.
Fat Embolism Syndrome: A disruption to blood supply caused by fat globules in a blood vessel.
Fatty Liver Disease: A condition in which excess fat builds up in the liver.
Febrile Convulsion: A seizure associated with a high body temperature but without any serious underlying health issue.
Femoral Hernia: A bulge in the upper part of the thigh near the groin.
Fetal Alcohol Syndrome: A condition in a child that results from alcohol exposure during the mother's pregnancy.
Fibrocystic Breast Disease: A condition characterized by lumpy, tender breasts.
Fibromyalgia Syndrome: A disorder characterized by widespread musculoskeletal pain.
Folate Deficiency Anemia: A decrease in red blood cells due to a lack of folate.
Follicular Lymphoma: A cancer that affects white blood cells called lymphocytes.
Fragile X Syndrome: A genetic condition that causes a range of developmental problems including learning disabilities.
Friedreich's Ataxia: A rare genetic disease that causes difficulty walking, a loss of sensation in the arms and legs, and impaired speech.
Frozen Shoulder: Adhesive capsulitis; stiffness and pain in the shoulder joint.
Fungal Keratitis: A fungal infection of the cornea.
G
Gallstone Pancreatitis: Inflammation of the pancreas caused by a gallstone blocking the pancreatic duct.
Gastric Ulcer: A sore that develops on the lining of the esophagus, stomach, or small intestine.
Gastroenteritis Acute: An intestinal infection marked by watery diarrhea, abdominal cramps, nausea or vomiting.
Gastroesophageal Reflux Disease: A digestive disease in which stomach acid or bile irritates the food pipe lining.
Generalized Anxiety Disorder: Severe, ongoing anxiety that interferes with daily activities.
Gestational Diabetes: A form of high blood sugar affecting pregnant women.
Gestational Hypertension: High blood pressure that develops during pregnancy.
Giant Cell Arteritis: An inflammation of the lining of your arteries (Temporal Arteritis).
Gilbert's Syndrome: A common, harmless liver condition in which the liver doesn't properly process bilirubin.
Glioblastoma Multiforme: An aggressive type of cancer that can occur in the brain or spinal cord.
Glomerular Filtration Rate: A test used to check how well the kidneys are working.
Goodpasture Syndrome: A rare disorder in which your body mistakenly makes antibodies that attack the lungs and kidneys.
Gouty Arthritis: A form of arthritis caused by excess uric acid in the bloodstream.
Graves' Disease: An immune system disorder that results in the overproduction of thyroid hormones.
Guillain-Barré Syndrome: A rare disorder in which your body's immune system attacks your nerves.
H
Hand Foot Mouth Disease: A mild, contagious viral infection common in young children.
Hashimoto's Thyroiditis: An autoimmune disease in which the immune system attacks the thyroid.
Heart Failure Preserved Ejection Fraction: A condition where the heart pumps normally but is too stiff to fill properly.
Heart Failure Reduced Ejection Fraction: A condition where the heart muscle doesn't contract effectively.
Helicobacter Pylori Infection: An infection that occurs when H. pylori bacteria infect your stomach.
Hemolytic Uremic Syndrome: A condition that affects the blood and blood vessels, resulting in the destruction of blood platelets.
Henoch-Schönlein Purpura: A disorder that causes the small blood vessels in your skin, joints, intestines, and kidneys to become inflamed and bleed.
Hepatic Encephalopathy: The loss of brain function when a damaged liver doesn't remove toxins from the blood.
Hepatitis B Virus: A serious liver infection caused by the hepatitis B virus.
Hepatitis C Virus: An infection caused by a virus that attacks the liver and leads to inflammation.
Hepatocellular Carcinoma: The most common type of primary liver cancer.
Hereditary Spherocytosis: An inherited condition that affects red blood cells.
Herpes Simplex Virus: A common viral infection that causes cold sores or genital herpes.
Herpes Zoster: Shingles; a viral infection that causes a painful rash.
Hiatal Hernia: A condition in which part of the stomach pushes up through the diaphragm muscle.
Hirschsprung Disease: A condition that affects the large intestine (colon) and causes problems with passing stool.
Hodgkin Lymphoma: A cancer of the immune system characterized by the presence of Reed-Sternberg cells.
Human Immunodeficiency Virus: A virus that attacks the body's immune system.
Human Papillomavirus: A viral infection that is passed between people through skin-to-skin contact.
Huntington's Disease: An inherited disease that causes the progressive breakdown of nerve cells in the brain.
Hyaline Membrane Disease: Respiratory distress syndrome in newborns.
Hyperosmolar Hyperglycemic State: A serious complication of diabetes.
Hypertrophic Cardiomyopathy: A disease in which the heart muscle becomes abnormally thick.
Hypoplastic Left Heart Syndrome: A complex and rare heart defect present at birth.
Hypoxic Ischemic Encephalopathy: Brain injury caused by oxygen deprivation to the brain.
I
Idiopathic Pulmonary Fibrosis: A type of lung disease that results in scarring (fibrosis) of the lungs.
Idiopathic Thrombocytopenic Purpura: A bleeding disorder in which the immune system destroys platelets.
IgA Nephropathy: Berger's disease; a kidney disease that occurs when an antibody called IgA lodges in your kidneys.
Immune Thrombocytopenia: A disorder that can lead to easy or excessive bruising and bleeding.
Impetigo Contagiosa: A common and highly contagious skin infection that mainly affects infants and children.
Infectious Mononucleosis: Usually caused by the Epstein-Barr virus (EBV).
Infective Endocarditis: An infection of the endocardial surface of the heart.
Inflammatory Bowel Disease: Chronic inflammation of the digestive tract.
Inflammatory Breast Cancer: A rare and aggressive form of breast cancer.
Inguinal Hernia: A condition in which soft tissue bulges through a weak point in the abdominal muscles.
Insulin Dependent Diabetes: Type 1 diabetes.
Interstitial Cystitis: A chronic condition causing bladder pressure, bladder pain and sometimes pelvic pain.
Interstitial Lung Disease: A group of disorders that cause progressive scarring of lung tissue.
Intracranial Hemorrhage: Bleeding inside the skull.
Intrauterine Growth Restriction: A condition in which an unborn baby is smaller than it should be.
Iron Deficiency Anemia: A common type of anemia where blood lacks adequate healthy red blood cells.
Irritable Bowel Syndrome: A common disorder that affects the large intestine.
Ischemic Heart Disease: Heart problems caused by narrowed heart arteries.
Ischemic Stroke: A stroke that occurs when a blood clot blocks or narrows an artery leading to the brain.
J
Japanese Encephalitis: A viral brain infection that's spread through mosquito bites.
Jaundice Neonatal: Yellow discoloration of a newborn baby's skin and eyes.
Jervell and Lange-Nielsen Syndrome: A type of long QT syndrome associated with hearing loss.
Jugular Vein Distension: Increased pressure of the superior vena cava causes the jugular vein to bulge.
Juvenile Dermatomyositis: An inflammatory disease of the muscle, skin, and blood vessels that affects children.
Juvenile Idiopathic Arthritis: The most common type of arthritis in children under the age of 16.
Juvenile Myoclonic Epilepsy: A type of epilepsy characterized by myoclonic jerks.
Juvenile Polyposis Syndrome: A disorder characterized by multiple noncancerous growths (polyps) in the intestines.
Juvenile Rheumatoid Arthritis: A former term for Juvenile Idiopathic Arthritis.
K
Kala Azar: Visceral leishmaniasis; a disease caused by protozoan parasites of the Leishmania genus.
Kaposi's Sarcoma: A form of cancer that develops from the cells that line lymph or blood vessels.
Kartagener Syndrome: A rare, hereditary disorder affecting the cilia.
Kawasaki Disease: A condition that causes inflammation in the walls of some blood vessels in the body.
Keloid Scar: A type of raised scar that occurs where the skin has healed after an injury.
Keratoconjunctivitis Sicca: Dry eye syndrome.
Ketoacidosis Diabetic: A serious diabetes complication where the body produces excess blood acids (ketones).
Kidney Stone Disease: Nephrolithiasis; hard deposits made of minerals and salts that form inside kidneys.
Klinefelter Syndrome: A genetic condition in which a male is born with an extra copy of the X chromosome.
Klippel-Feil Syndrome: A bone disorder characterized by the abnormal joining of two or more spinal bones in the neck.
Klippel-Trenaunay Syndrome: A rare congenital vascular disorder in which a limb may be affected by port wine stains.
Knee Osteoarthritis: A degenerative type of arthritis that most commonly affects the knee.
Korsakoff Syndrome: A chronic memory disorder caused by severe deficiency of thiamine (vitamin B-1).
Kwashiorkor: A severe form of malnutrition caused by a lack of protein in the diet.
Kyphoscoliosis: A combination of outward curvature (kyphosis) and sideways curvature (scoliosis) of the spine.
L
Lactose Intolerance: The inability to fully digest sugar (lactose) in dairy products.
Large B-Cell Lymphoma: The most common type of non-Hodgkin lymphoma.
Laryngeal Cancer: Cancer that affects the larynx (voice box).
Lateral Epicondylitis: Tennis elbow; a painful condition that occurs when tendons in your elbow are overloaded.
Left Ventricular Failure: A condition where the left side of the heart cannot pump blood effectively.
Left Ventricular Hypertrophy: Enlargement and thickening of the walls of the heart's main pumping chamber.
Legg-Calve-Perthes Disease: A childhood condition that affects the hip, where the thighbone and pelvis meet.
Legionnaires' Disease: A severe form of pneumonia — lung inflammation usually caused by infection.
Leishmaniasis Cutaneous: The most common form of leishmaniasis affecting the skin.
Leptospirosis: A bacterial disease spread through the urine of infected animals.
Lichen Planus: An inflammatory condition that can affect your skin and mucous membranes.
Lipid Storage Diseases: A group of inherited metabolic disorders in which harmful amounts of fatty materials accumulate in cells.
Liver Cirrhosis: Late-stage scarring (fibrosis) of the liver caused by many forms of liver diseases and conditions.
Long QT Syndrome: A heart rhythm condition that can potentially cause fast, chaotic heartbeats.
Lower Urinary Tract Symptoms: Problems relating to the bladder and urethra.
Lumbar Spinal Stenosis: Narrowing of the open spaces within your spine.
Lung Abscess: A necrosis of the pulmonary tissue and formation of cavities containing necrotic debris.
Lyme Disease: A tick-borne illness caused by the bacterium Borrelia burgdorferi.
Lymphatic Filariasis: Elephantiasis; a parasitic disease caused by microscopic, thread-like worms.
M
Macular Degeneration: An eye disease that causes vision loss.
Major Depressive Disorder: A mental health disorder characterized by persistently depressed mood.
Malabsorption Syndrome: A condition that prevents the absorption of nutrients through the small intestine.
Malignant Hyperthermia: A severe reaction to certain drugs used for anesthesia.
Malignant Melanoma: The most serious type of skin cancer.
Mallory-Weiss Tear: A tear in the mucous membrane, or inner lining, where the esophagus meets the stomach.
Marfan Syndrome: An inherited disorder that affects connective tissue.
Meckel's Diverticulum: An outpouching or bulge in the lower part of the small intestine.
Medullary Thyroid Cancer: A form of thyroid cancer that starts in C cells.
Megaloblastic Anemia: A condition in which the bone marrow produces unusually large, structurally abnormal, immature red blood cells.
Meniere's Disease: A disorder of the inner ear that can lead to dizzy spells (vertigo) and hearing loss.
Meningococcal Meningitis: A bacterial form of meningitis, a serious infection of the thin lining that surrounds the brain and spinal cord.
Metabolic Acidosis: A condition that occurs when the body produces too much acid or when the kidneys are not removing enough acid.
Metabolic Syndrome: A cluster of conditions that increase the risk of heart disease, stroke and diabetes.
Mitral Regurgitation: A backflow of blood caused by failure of the heart's mitral valve to close tightly.
Mitral Stenosis: A narrowing of the heart's mitral valve.
Mitral Valve Prolapse: Improper closure of the valve between the heart's upper and lower left chambers.
Motor Neuron Disease: A group of diseases that affect the nerves (motor neurons) in the brain and spinal cord.
Mucocutaneous Lymph Node Syndrome: Kawasaki disease.
Multidrug-Resistant Tuberculosis: A form of TB caused by bacteria that do not respond to isoniazid and rifampicin.
Multiple Myeloma: A cancer that forms in a type of white blood cell called a plasma cell.
Multiple Sclerosis: A disease in which the immune system eats away at the protective covering of nerves.
Muscular Dystrophy: A group of diseases that cause progressive weakness and loss of muscle mass.
Myasthenia Gravis: A weakness and rapid fatigue of muscles under voluntary control.
Myocardial Infarction: A blockage of blood flow to the heart muscle (Heart Attack).
Myocarditis: Inflammation of the heart muscle.
N
Nasopharyngeal Carcinoma: Cancer that occurs in the nasopharynx, which is located behind your nose and above the back of your throat.
Necrotizing Enterocolitis: A devastating disease that affects mostly the intestine of premature infants.
Necrotizing Fasciitis: A serious bacterial infection that destroys tissue under the skin.
Neonatal Jaundice: Yellowing of the skin and eyes in newborn babies.
Nephrotic Syndrome: A kidney disorder that causes your body to pass too much protein in your urine.
Neurofibromatosis Type 1: A genetic disorder that causes tumors to form on nerve tissue.
Neurogenic Bladder: Bladder dysfunction (flaccid or spastic) caused by neurologic damage.
Non-Alcoholic Fatty Liver Disease: An accumulation of fat in the liver of people who drink little or no alcohol.
Non-Hodgkin Lymphoma: Cancer that starts in the lymphatic system.
Non-Small Cell Lung Cancer: The most common type of lung cancer.
Normal Pressure Hydrocephalus: A brain disorder in which excess cerebrospinal fluid accumulates in the brain's ventricles.
Nosocomial Infection: An infection acquired in a hospital or other health care facility.
Nutritional Anemia: Anemia caused by a lack of iron, protein, B12, or other vitamins and minerals.
O
Obsessive-Compulsive Disorder: A pattern of unwanted thoughts and fears (obsessions) that lead you to do repetitive behaviors (compulsions).
Obstructive Sleep Apnea: A serious sleep disorder where breathing repeatedly stops and starts.
Occupational Lung Disease: Lung problems that are made worse by your work environment.
Ocular Hypertension: Higher than normal pressure inside the eye.
Open-Angle Glaucoma: The most common form of glaucoma, where the drainage angle formed by the cornea and iris remains open.
Optic Neuritis: Inflammation of the optic nerve.
Oral Squamous Cell Carcinoma: Cancer of the lining of the mouth.
Oral Submucous Fibrosis: A chronic disease of the mouth characterized by inflammation and fibrosis.
Orthostatic Hypotension: A form of low blood pressure that happens when you stand up from sitting or lying down.
Osgood-Schlatter Disease: A knee inflammation that causes a painful bump at the top of the shinbone.
Osteoarthritis Knee: A degenerative type of arthritis that most commonly affects the knee.
Osteogenesis Imperfecta: Inherited (genetic) bone disorder that is present at birth.
Osteomyelitis Acute: Inflammation of bone caused by infection.
Ovarian Cyst: A solid or fluid-filled sac or pocket (cyst) within or on the surface of an ovary.
Ovarian Hyperstimulation Syndrome: A condition that can occur in women who take injectable hormone medications to stimulate the development of eggs.
P
Panic Disorder: A type of anxiety disorder causing repeated unexpected panic attacks.
Parkinson's Disease: A progressive nervous system disorder that affects movement.
Patent Ductus Arteriosus: A persistent opening between the two major blood vessels leading from the heart.
Pelvic Inflammatory Disease: An infection of the female reproductive organs.
Pemphigus Vulgaris: A rare autoimmune disease that causes painful blistering on the skin and mucous membranes.
Peptic Ulcer Disease: Painful sores or ulcers in the lining of the stomach or the first part of the small intestine.
Peripheral Artery Disease: A common circulatory problem in which narrowed arteries reduce blood flow to your limbs.
Peripheral Neuropathy: Weakness, numbness, and pain from nerve damage, usually in the hands and feet.
Pernicious Anemia: A decrease in red blood cells when the body can't absorb enough vitamin B-12.
Persistent Pulmonary Hypertension: High blood pressure in the arteries of the lungs.
Pheochromocytoma: A hormone-secreting tumor that can occur in the adrenal glands.
Placenta Previa: A condition where the placenta lies low in the uterus and partially or completely covers the cervix.
Plantar Fasciitis: Inflammation of a thick band of tissue that connects the heel bone to the toes.
Pleural Effusion: A buildup of fluid between the tissues that line the lungs and the chest.
Pneumocystis Pneumonia: A serious infection caused by the fungus Pneumocystis jirovecii.
Polycystic Kidney Disease: An inherited disorder in which clusters of cysts develop primarily within your kidneys.
Polycystic Ovary Syndrome: A hormonal disorder common among women of reproductive age.
Polycythemia Vera: A type of blood cancer. It causes your bone marrow to make too many red blood cells.
Post-Traumatic Stress Disorder: A mental health condition that's triggered by a terrifying event.
Postpartum Hemorrhage: Severe bleeding after giving birth.
Preeclampsia: A pregnancy complication characterized by high blood pressure.
Premature Ovarian Failure: Loss of normal function of your ovaries before age 40.
Primary Biliary Cirrhosis: A chronic disease in which the bile ducts in your liver are slowly destroyed.
Primary Pulmonary Hypertension: High blood pressure in the lungs for no known reason.
Protein Energy Malnutrition: A form of malnutrition that is defined by a lack of dietary protein and/or energy.
Psoriatic Arthritis: A form of arthritis that affects some people who have psoriasis.
Pulmonary Edema: A condition caused by excess fluid in the lungs.
Pulmonary Embolism: A blockage in one of the pulmonary arteries in your lungs.
Pulmonary Fibrosis: A lung disease that occurs when lung tissue becomes damaged and scarred.
Pulmonary Tuberculosis: Infectious bacterial disease characterized by the growth of nodules in the tissues, especially the lungs.
Pyelonephritis Acute: A sudden and severe kidney infection.
Q
Q Fever: An infection caused by the bacterium Coxiella burnetii.
Quadriplegia: Paralysis caused by illness or injury that results in the partial or total loss of use of all four limbs and torso.
Quinsy Abscess: Peritonsillar abscess; a complication of tonsillitis.
R
Rabies Encephalitis: Inflammation of the brain caused by the rabies virus.
Radiation Pneumonitis: Inflammation of the lungs caused by radiation therapy.
Raynaud's Phenomenon: A condition in which some areas of the body feel numb and cool in certain circumstances.
Reactive Arthritis: Joint pain and swelling triggered by an infection in another part of your body.
Refractive Error: A problem with focusing of light on the retina (Myopia/Hypermetropia).
Renal Artery Stenosis: The narrowing of one or more arteries that carry blood to your kidneys.
Renal Cell Carcinoma: The most common type of kidney cancer.
Renal Colic: Pain caused by a kidney stone.
Respiratory Distress Syndrome: A breathing disorder in newborns caused by immature lungs.
Respiratory Syncytial Virus: A common virus that causes mild, cold-like symptoms.
Restless Legs Syndrome: A condition that causes an uncontrollable urge to move your legs.
Restrictive Cardiomyopathy: The heart muscle becomes rigid and less elastic.
Retinal Detachment: An emergency when part of the eye (the retina) pulls away from supportive tissue.
Retinitis Pigmentosa: A rare, inherited group of disorders that causes the breakdown and loss of cells in the retina.
Retrograde Ejaculation: Semen enters the bladder instead of emerging through the penis during orgasm.
Reye's Syndrome: A rare but serious condition that causes swelling in the liver and brain.
Rhabdomyolysis: A serious syndrome due to a direct or indirect muscle injury.
Rheumatic Heart Disease: Permanent damage to heart valves caused by rheumatic fever.
Rheumatoid Arthritis: A chronic inflammatory disorder affecting many joints, including those in the hands and feet.
Rocky Mountain Spotted Fever: A bacterial disease spread through the bite of an infected tick.
Rotator Cuff Injury: An injury to the group of muscles and tendons that surround the shoulder joint.
Rubella Syndrome Congenital: A condition that occurs in a developing baby in the womb whose mother is infected with the rubella virus.
S
Sarcoidosis: The growth of tiny collections of inflammatory cells (granulomas) in different parts of the body.
Scabies Infestation: An itchy skin condition caused by a tiny burrowing mite called Sarcoptes scabiei.
Schizoaffective Disorder: A mental health disorder that is marked by a combination of schizophrenia symptoms and mood disorder symptoms.
Sciatica Pain: Pain that radiates along the path of the sciatic nerve.
Scleroderma: A group of rare diseases that involve the hardening and tightening of the skin and connective tissues.
Seborrheic Dermatitis: A common skin condition that mainly affects your scalp.
Septic Arthritis: A painful infection in a joint.
Septic Shock: A widespread infection causing organ failure and dangerously low blood pressure.
Severe Acute Respiratory Syndrome: A viral respiratory illness caused by a coronavirus.
Sickle Cell Anemia: An inherited red blood cell disorder where there aren't enough healthy RBCs to carry oxygen.
Sjogren's Syndrome: An immune system disorder characterized by dry eyes and dry mouth.
Sleep Apnea Obstructive: A serious sleep disorder where breathing repeatedly stops and starts.
Small Bowel Obstruction: A blockage in the small intestine.
Small Cell Lung Cancer: An aggressive type of lung cancer.
Spina Bifida: A birth defect that occurs when the spine and spinal cord don't form properly.
Spinal Muscular Atrophy: A genetic disease affecting the part of the nervous system that controls voluntary muscle movement.
Spinal Stenosis: Narrowing of the spaces within your spine, which can put pressure on the nerves.
Squamous Cell Carcinoma: A common form of skin cancer that develops in the squamous cells.
Status Asthmaticus: An acute exacerbation of asthma that remains unresponsive to initial treatment.
Stevens-Johnson Syndrome: A rare, serious disorder of the skin and mucous membranes.
Stress Incontinence: Leakage of urine during moments of physical activity.
Subarachnoid Hemorrhage: Bleeding in the space between the brain and the tissue covering the brain.
Subdural Hematoma: A collection of blood outside the brain.
Sudden Infant Death Syndrome: The unexplained death, usually during sleep, of a seemingly healthy baby.
Superior Vena Cava Syndrome: Obstruction of blood flow through the superior vena cava.
Systemic Lupus Erythematosus: An autoimmune disease in which the immune system attacks its own tissues.
Systemic Sclerosis: An autoimmune disease of the connective tissue.
T
Takayasu's Arteritis: A rare type of vasculitis, a group of disorders that cause blood vessel inflammation.
Tension Pneumothorax: A severe condition where air is trapped in the pleural space under positive pressure.
Testicular Torsion: A condition that occurs when the testicle rotates, twisting the spermatic cord.
Tetanus Infection: A serious bacterial infection that causes painful muscle spasms and can lead to death.
Tetralogy of Fallot: A rare condition caused by a combination of four heart defects that are present at birth.
Thalassemia Major: A blood disorder passed down through families (inherited) in which the body makes an abnormal form or inadequate amount of hemoglobin.
Thoracic Outlet Syndrome: A group of disorders that occur when blood vessels or nerves in the space between your collarbone and your first rib are compressed.
Thrombocytopenia Purpura: A disorder that can lead to easy or excessive bruising and bleeding.
Thrombotic Thrombocytopenic Purpura: A rare blood disorder characterized by clotting in small blood vessels.
Thyroid Storm: A life-threatening health condition that is associated with untreated or undertreated hyperthyroidism.
Tinea Corporis: Ringworm of the body; a fungal infection.
Tinea Pedis: Athlete's foot; a fungal infection that usually begins between the toes.
Total Knee Replacement: A surgical procedure to replace the weight-bearing surfaces of the knee joint.
Toxic Epidermal Necrolysis: A life-threatening skin disorder characterized by a blistering and peeling of the skin.
Toxic Shock Syndrome: A rare, life-threatening complication of certain types of bacterial infections.
Toxoplasmosis: An infection caused by a parasite called Toxoplasma gondii.
Transient Ischemic Attack: A temporary period of symptoms similar to those of a stroke.
Traumatic Brain Injury: Brain dysfunction caused by an outside force, usually a violent blow to the head.
Tricuspid Regurgitation: A disorder in which the tricuspid valve does not close tight enough.
Trigeminal Neuralgia: A chronic pain condition that affects the trigeminal nerve.
Tropical Pulmonary Eosinophilia: A hyper-responsive lung condition to the filarial parasite.
Tuberculous Meningitis: An infection of the tissues covering the brain and spinal cord (meninges) caused by Mycobacterium tuberculosis.
Tuberous Sclerosis: A rare genetic disease that causes non-cancerous tumors to grow in the brain and on other vital organs.
Turner Syndrome: A chromosomal condition that affects development in females.
Type 1 Diabetes: A chronic condition in which the pancreas produces little or no insulin.
Type 2 Diabetes: A chronic condition that affects the way the body processes blood sugar.
Typhoid Fever: A bacterial infection that can lead to a high fever, diarrhea, and vomiting.
U
Ulcerative Colitis: An inflammatory bowel disease that causes long-lasting inflammation and ulcers in your digestive tract.
Umbilical Hernia: A condition in which the intestine protrudes through the umbilical muscles.
Undescended Testicle: Cryptorchidism; a testicle that hasn't moved into its proper position in the bag of skin hanging below the penis.
Unstable Angina: A condition in which your heart doesn't get enough blood flow and oxygen.
Upper Respiratory Infection: Viral infection affecting the nose, throat, and airways.
Uremic Encephalopathy: Organic brain disorder. It develops in patients with acute or chronic renal failure.
Urethral Stricture: Narrowing of the urethra caused by injury, instrumentation, or infection.
Urinary Incontinence: The loss of bladder control.
Urinary Tract Infection: An infection in any part of your urinary system.
Uterine Fibroids: Noncancerous growths of the uterus that often appear during childbearing years.
Uterine Prolapse: A condition in which the uterus slides from its normal position into the vaginal canal.
Uveitis Anterior: Inflammation of the middle layer of the eye (uvea).
V
Vaginal Candidiasis: A fungal infection that causes irritation, discharge and intense itchiness of the vagina.
Valvular Heart Disease: Damage to or a defect in one of the four heart valves.
Varicose Veins: Gnarled, enlarged veins, most commonly appearing in the legs and feet.
Vascular Dementia: Problems with reasoning, planning, judgment, memory and other thought processes caused by brain damage from impaired blood flow to your brain.
Vasovagal Syncope: Fainting; occurs when you faint because your body overreacts to certain triggers.
Venous Stasis Ulcer: A wound on the leg or ankle caused by abnormal or damaged veins.
Ventricular Fibrillation: A heart rhythm problem that occurs when the heart beats with rapid, erratic electrical impulses.
Ventricular Septal Defect: A hole in the heart; a common heart defect that's present at birth.
Ventricular Tachycardia: A fast heart rhythm that starts in the lower heart chambers (ventricles).
Vertebral Artery Dissection: A flap-like tear of the inner lining of the vertebral artery.
Viral Gastroenteritis: Stomach flu; an intestinal infection marked by watery diarrhea.
Viral Hepatitis: Inflammation of the liver caused by a virus.
Viral Meningitis: Inflammation of the brain and spinal cord membranes, typically caused by an infection.
Vitamin A Deficiency: A lack of vitamin A in humans (Causes Night Blindness).
Vitamin B12 Deficiency: A condition in which your body doesn't have enough vitamin B12.
Vitamin D Deficiency: A low level of vitamin D in the body, leading to bone weakness.
Vitreous Hemorrhage: The extravasation, or leakage, of blood into the areas in and around the vitreous humor of the eye.
Volvulus: A loop of intestine twists around itself and the mesentery that supports it.
Von Willebrand Disease: A lifelong bleeding disorder in which your blood doesn't clot well.
W
Waldenstrom Macroglobulinemia: A rare type of cancer that begins in the white blood cells.
Wegener's Granulomatosis: Granulomatosis with polyangiitis; an uncommon disorder that causes inflammation of the blood vessels.
Wernicke-Korsakoff Syndrome: A brain disorder caused by the lack of thiamine (vitamin B-1).
West Nile Virus: A viral infection typically spread by mosquitoes.
Whipple's Disease: A rare bacterial infection that most often affects your joints and digestive system.
Whooping Cough: Pertussis; a highly contagious respiratory tract infection.
Wilms Tumor: A rare kidney cancer that primarily affects children.
Wilson's Disease: A rare genetic disorder that causes copper to accumulate in your liver, brain and other vital organs.
Wolff-Parkinson-White Syndrome: A syndrome in which an extra electrical pathway in the heart causes a rapid heartbeat.
X
X-Linked Agammaglobulinemia: A disorder that affects the immune system and occurs almost exclusively in males.
Xeroderma Pigmentosum: An inherited condition characterized by an extreme sensitivity to ultraviolet (UV) rays from sunlight.
Xerophthalmia: Abnormal dryness of the conjunctiva and cornea of the eye, typically caused by vitamin A deficiency.
Y
Yellow Fever: A viral infection spread by a particular species of mosquito.
Yersinia Enterocolitis: An infection caused by the bacterium Yersinia enterocolitica.
Z
Zellweger Syndrome: A rare congenital disorder characterized by the reduction or absence of functional peroxisomes in the cells.
Zenker's Diverticulum: A pouch that can form at the junction of the hypopharynx and the esophagus.
Zika Virus Disease: A disease caused by the Zika virus, which is spread to people primarily through the bite of an infected Aedes species mosquito.
Zollinger-Ellison Syndrome: A complex condition in which one or more tumors form in your pancreas or the upper part of your small intestine.
`;

const getAcronym = (term) => {
  const words = term.split(' ');
  if (words.length > 1) {
    return words.map(w => w[0]).join('').toUpperCase().substring(0, 4);
  }
  return term.substring(0, 3).toUpperCase();
};

const getCategoryIcon = (term) => {
  const t = term.toLowerCase();
  if (t.includes('heart') || t.includes('cardio') || t.includes('atrial') || t.includes('ventricular')) return <HeartPulse className="text-rose-500" />;
  if (t.includes('brain') || t.includes('cerebral') || t.includes('neuro') || t.includes('mental')) return <Brain className="text-indigo-400" />;
  if (t.includes('lung') || t.includes('respiratory') || t.includes('pulmonary')) return <Wind className="text-teal-400" />;
  if (t.includes('blood') || t.includes('anemia') || t.includes('sepsis')) return <Stethoscope className="text-red-500" />;
  if (t.includes('infection') || t.includes('virus') || t.includes('bacterial')) return <Thermometer className="text-orange-400" />;
  return <Activity className="text-slate-500" />;
};

export default function MedicalSuperApp() {
  // Mode: 'lexicon' (Light) or 'encyclopedia' (Dark)
  const [mode, setMode] = useState('lexicon'); 
  const [activeLetter, setActiveLetter] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');

  // --------------------------------------------------------------------------
  // PARSING LOGIC
  // --------------------------------------------------------------------------
  const parseData = (raw) => {
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
    const data = {};
    let currentLetter = '';
    const regex = /^([^:\-–]+)[:\-–]\s*(.+)$/;

    lines.forEach(line => {
      if (line.length === 1 && /[A-Z]/.test(line)) {
        currentLetter = line;
        data[currentLetter] = [];
      } else if (currentLetter) {
        const match = line.match(regex);
        if (match) {
          data[currentLetter].push({
            term: match[1].trim(),
            def: match[2].trim(),
            acronym: mode === 'encyclopedia' ? getAcronym(match[1].trim()) : null
          });
        }
      }
    });
    return data;
  };

  const glossaryData = useMemo(() => parseData(mode === 'lexicon' ? DATA_TERMS : DATA_CONDITIONS), [mode]);
  const letters = Object.keys(glossaryData);

  const displayTerms = useMemo(() => {
    if (searchTerm.trim() !== '') {
      const flat = [];
      Object.keys(glossaryData).forEach(key => {
        glossaryData[key].forEach(item => {
          if (
            item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.def.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            flat.push(item);
          }
        });
      });
      return flat;
    }
    return glossaryData[activeLetter] || [];
  }, [activeLetter, searchTerm, glossaryData]);

  // --------------------------------------------------------------------------
  // THEME VARIABLES
  // --------------------------------------------------------------------------
  const isDark = mode === 'encyclopedia';
  
  const theme = {
    bg: isDark ? 'bg-[#0f172a]' : 'bg-slate-50',
    navBg: isDark ? 'bg-slate-900' : 'bg-white',
    navBorder: isDark ? 'border-slate-800' : 'border-slate-200',
    headerBg: isDark ? 'bg-slate-950/80' : 'bg-white/80',
    textMain: isDark ? 'text-white' : 'text-slate-800',
    textSub: isDark ? 'text-slate-400' : 'text-slate-500',
    accentColor: isDark ? 'bg-indigo-600' : 'bg-teal-600',
    accentText: isDark ? 'text-indigo-400' : 'text-teal-600',
    cardBg: isDark ? 'bg-slate-900' : 'bg-white',
    cardBorder: isDark ? 'border-slate-800' : 'border-slate-100',
    cardHover: isDark ? 'hover:border-indigo-500/50' : 'hover:border-teal-300/50',
    inputBg: isDark ? 'bg-slate-900' : 'bg-slate-50',
    inputText: isDark ? 'text-slate-100' : 'text-slate-900',
    logoIcon: isDark ? <Zap size={20} fill="currentColor"/> : <Dna size={20} />,
    bigLetter: isDark ? 'text-slate-800/40' : 'text-slate-200',
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen font-sans overflow-hidden transition-colors duration-500 ${theme.bg} ${isDark ? 'dark' : ''}`}>
      
      {/* SIDEBAR NAVIGATION (DNA STRAND) */}
      <nav className={`w-full md:w-20 ${theme.navBg} border-r ${theme.navBorder} z-30 flex flex-col items-center flex-shrink-0 relative transition-colors duration-500`}>
        <div className="hidden md:flex p-4 mb-2 mt-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 hover:rotate-12 ${theme.accentColor}`}>
            {theme.logoIcon}
          </div>
        </div>

        {/* Alphabet Scroller */}
        <div className="flex-1 w-full overflow-x-auto md:overflow-x-hidden md:overflow-y-auto hide-scrollbar flex md:flex-col items-center gap-2 px-4 py-3 md:py-4">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => { setActiveLetter(letter); setSearchTerm(''); }}
              className={`
                relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-300
                ${activeLetter === letter && !searchTerm 
                  ? `${theme.accentColor} text-white scale-110 shadow-md` 
                  : `${theme.textSub} hover:bg-slate-200 dark:hover:bg-slate-800`}
              `}
            >
              {letter}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* HEADER AREA */}
        <header className={`px-4 md:px-8 py-4 ${theme.headerBg} backdrop-blur-xl border-b ${theme.navBorder} flex flex-col gap-4 z-20 sticky top-0 transition-colors duration-500`}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* LOGO */}
            <div className="flex items-center justify-between md:justify-start">
               <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${theme.textMain}`}>
                {isDark ? 'ClinicalEncyclopedia' : 'MedLexicon'}
              </h1>
              {/* Mobile Logo Icon */}
              <div className={`md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md ${theme.accentColor}`}>
                {theme.logoIcon}
              </div>
            </div>

            {/* EXPANDED TOGGLE BAR (CENTERED) */}
            <div className="flex-1 max-w-lg mx-auto w-full">
               <div className={`relative flex p-1.5 rounded-full w-full backdrop-blur-md border shadow-sm transition-colors duration-500 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100/80 border-slate-200'}`}>
                  {/* Sliding Background */}
                  <motion.div 
                    layout
                    className={`absolute top-1.5 bottom-1.5 rounded-full shadow-sm z-0 ${isDark ? 'bg-indigo-600' : 'bg-white'}`}
                    initial={false}
                    animate={{ 
                      left: mode === 'lexicon' ? '6px' : '50%', 
                      width: 'calc(50% - 9px)',
                      x: mode === 'lexicon' ? 0 : 3
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  
                  <button 
                    onClick={() => { setMode('lexicon'); setActiveLetter('A'); setSearchTerm(''); }}
                    className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 rounded-full ${mode === 'lexicon' ? (isDark ? 'text-white' : 'text-teal-700') : theme.textSub}`}
                  >
                    Medical Terms
                  </button>
                  <button 
                    onClick={() => { setMode('encyclopedia'); setActiveLetter('M'); setSearchTerm(''); }}
                    className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 rounded-full ${mode === 'encyclopedia' ? 'text-white' : theme.textSub}`}
                  >
                    Conditions
                  </button>
               </div>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-64 lg:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${theme.textSub}`} />
              </div>
              <input
                type="text"
                placeholder={isDark ? "Search conditions..." : "Search terms..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-8 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${theme.inputBg} ${theme.navBorder} ${theme.inputText} focus:border-transparent ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-teal-500'}`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className={`absolute inset-y-0 right-3 flex items-center ${theme.textSub} hover:${theme.textMain}`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative custom-scrollbar">
          
          {/* BACKGROUND LETTER DECORATION */}
          <div className={`fixed left-4 lg:left-24 top-40 text-[12rem] lg:text-[16rem] font-black leading-none pointer-events-none select-none transition-colors duration-700 opacity-20 ${theme.bigLetter}`}>
             {searchTerm ? '' : activeLetter}
          </div>

          {/* GRID OF CARDS */}
          {displayTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-20 relative z-10">
              <AnimatePresence mode='popLayout'>
                {displayTerms.map((item, index) => (
                  <motion.div
                    key={`${item.term}-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.015 }}
                    className={`
                      group rounded-2xl p-6 shadow-sm border transition-all duration-300 relative overflow-hidden flex flex-col
                      ${theme.cardBg} ${theme.cardBorder} ${theme.cardHover}
                      ${isDark ? 'hover:shadow-indigo-500/10 hover:shadow-2xl' : 'hover:shadow-teal-500/10 hover:shadow-xl'}
                    `}
                  >
                    {/* Dark Mode: Top Gradient Line */}
                    {isDark && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>}
                    
                    {/* Light Mode: Side Accent */}
                    {!isDark && <div className="absolute top-4 bottom-4 left-0 w-1 bg-teal-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className={`text-lg font-bold leading-tight pr-4 transition-colors ${theme.textMain} ${isDark ? 'group-hover:text-indigo-300' : 'group-hover:text-teal-700'}`}>
                                {item.term}
                            </h3>
                            
                            {/* Acronym Badge */}
                            {isDark && (
                              <span className="flex-shrink-0 text-[10px] font-black bg-slate-950 text-slate-500 px-2 py-1 rounded border border-slate-800 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                                  {item.acronym}
                              </span>
                            )}
                            
                            {/* Term Icon */}
                            {!isDark && (
                               <LayoutGrid size={16} className="text-teal-100 group-hover:text-teal-500 transition-colors" />
                            )}
                        </div>
                        
                        <p className={`text-sm leading-relaxed ${theme.textSub} ${isDark ? 'group-hover:text-slate-300' : 'group-hover:text-slate-600'}`}>
                            {item.def}
                        </p>
                    </div>

                    {/* Footer Area */}
                    <div className={`mt-5 pt-4 border-t flex items-center justify-between transition-colors ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
                        {isDark ? (
                           <div className="flex gap-2 items-center">
                              <div className="p-1.5 rounded-md bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                                 {getCategoryIcon(item.term)}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-indigo-300 uppercase tracking-wider">
                                Clinical Entity
                              </span>
                           </div>
                        ) : (
                           <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                             Read Definition
                           </span>
                        )}
                        <ChevronRight size={16} className={`${isDark ? 'text-slate-600' : 'text-teal-200'} group-hover:text-white transition-all`} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center relative z-10">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-300 shadow-sm'}`}>
                <Search size={28} />
              </div>
              <h3 className={`text-lg font-bold ${theme.textMain}`}>No results found</h3>
              <p className={`max-w-xs mt-2 text-sm ${theme.textSub}`}>
                Try adjusting your search or switching categories.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className={`mt-6 px-6 py-2 text-white text-sm font-bold rounded-full transition-colors shadow-lg ${theme.accentColor} hover:opacity-90`}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}