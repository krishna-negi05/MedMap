export const MODELS = {
  STRUCTURAL: "qwen/qwen-2.5-72b-instruct", 
  // Using Llama 3.3 70B for Reasoning and Medical Judgement
  REASONING: "meta-llama/llama-3.3-70b-instruct:free",       
  VISION: "qwen/qwen-2.5-vl-72b-instruct", 
  TTS: "gemini-2.5-flash-preview-tts", // Added TTS model
};

export const FEATURE_MODELS = {
  caseVignette: MODELS.REASONING, 
  caseQuestions: MODELS.REASONING,
  
  mindmap: MODELS.STRUCTURAL,
  flashcards: MODELS.STRUCTURAL,
  pharma: MODELS.STRUCTURAL,
  labs: MODELS.STRUCTURAL,
  
  osce: MODELS.REASONING, 
  helpChat: MODELS.REASONING,
  radiology: MODELS.VISION,
  
  // 👇 NEW TOOL
  symptom_checker: MODELS.REASONING, 
};