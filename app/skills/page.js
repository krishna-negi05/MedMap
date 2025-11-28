'use client';
import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Dna, ChevronRight, Activity, X, 
  Stethoscope, Pill, Microscope, Brain, HeartPulse, 
  Syringe, Thermometer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// DATASET: A-Z (User Data A-N + Indian MBBS Curriculum O-Z)
// ============================================================================
const RAW_DATA = `
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

export default function IndianMedicalGlossary() {
  const [activeLetter, setActiveLetter] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --------------------------------------------------------------------------
  // PARSER
  // --------------------------------------------------------------------------
  const glossaryData = useMemo(() => {
    const lines = RAW_DATA.split('\n').map(l => l.trim()).filter(l => l);
    const data = {};
    let currentLetter = '';

    // Regex handles "Term: Def", "Term- Def", "Term– Def"
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
            def: match[2].trim()
          });
        }
      }
    });
    return data;
  }, []);

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
  // UI COMPONENTS
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR: DNA STRAND NAVIGATION */}
      <nav className="w-full lg:w-20 bg-white border-r border-slate-200 z-30 flex flex-col items-center flex-shrink-0 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-4 mb-2 lg:mb-6">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200 rotate-3">
            <Dna size={22} />
          </div>
        </div>

        {/* Scrollable Alphabet */}
        <div className="flex-1 w-full overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto hide-scrollbar flex lg:flex-col items-center gap-2 px-4 lg:px-0 pb-4">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => { setActiveLetter(letter); setSearchTerm(''); }}
              className={`
                relative w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-300
                ${activeLetter === letter && !searchTerm 
                  ? 'bg-teal-600 text-white shadow-md z-10 scale-110' 
                  : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'}
              `}
            >
              {letter}
              {activeLetter === letter && !searchTerm && (
                <motion.div 
                  layoutId="activeBubble"
                  className="absolute inset-0 bg-teal-600 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
        
        {/* HEADER */}
        <header className="px-6 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20 sticky top-0">
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-slate-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                MedLexicon
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 font-bold tracking-wide">
                MBBS EDITION
              </span>
            </h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search terms (e.g., Malaria, ORS)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </header>

        {/* TERM LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative custom-scrollbar">
          
          {/* Section Heading */}
          <div className="mb-8 flex items-end gap-4 select-none">
            <h2 className="text-7xl lg:text-8xl font-black text-slate-200/80 leading-none tracking-tighter">
              {searchTerm ? 'Search' : activeLetter}
            </h2>
            <div className="h-px bg-slate-200 flex-1 mb-4 opacity-50"></div>
            <span className="text-xs font-bold text-slate-400 mb-4 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              {displayTerms.length} Terms
            </span>
          </div>

          {/* Cards Grid */}
          {displayTerms.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-20"
            >
              <AnimatePresence mode='popLayout'>
                {displayTerms.map((item, index) => (
                  <motion.div
                    key={`${item.term}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }} // Stagger effect
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 relative overflow-hidden flex flex-col"
                  >
                    {/* Background Icon Decoration */}
                    <div className="absolute -right-4 -top-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-right-2 group-hover:-top-2 rotate-12">
                       <Stethoscope size={64} />
                    </div>

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center justify-between mb-3">
                         <div className="w-1 h-6 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all absolute -left-6 group-hover:-left-3"></div>
                         <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                           {item.term}
                         </h3>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600">
                        {item.def}
                      </p>
                    </div>

                    {/* Footer decoration */}
                    <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                       <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                       </div>
                       <ChevronRight size={14} className="text-teal-500"/>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-slate-100">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No medical terms found</h3>
              <p className="text-slate-500 max-w-sm mt-2 text-sm">
                We couldn't find matches for "{searchTerm}". Check the spelling or browse by alphabet.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-8 px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-teal-600 transition-colors shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}