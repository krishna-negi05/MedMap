// lib/ai-config.js

export const MODELS = {
  STRUCTURAL: "qwen/qwen-2.5-72b-instruct", // Text/JSON (Fast & Strict)
  REASONING: "meta-llama/llama-3.3-70b-instruct:free",        // Logic (Deep Thinking)
  VISION: "qwen/qwen-2.5-vl-72b-instruct",  // Images (X-Rays, Skin lesions)
};

export const FEATURE_MODELS = {
  caseVignette: MODELS.STRUCTURAL,
  caseQuestions: MODELS.REASONING,
  mindmap: MODELS.STRUCTURAL,
  flashcards: MODELS.STRUCTURAL,
  pharma: MODELS.STRUCTURAL,
  labs: MODELS.STRUCTURAL,
  osce: MODELS.REASONING,
  helpChat: MODELS.STRUCTURAL,
  radiology: MODELS.VISION, // New!
};