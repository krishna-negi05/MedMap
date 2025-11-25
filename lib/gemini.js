// lib/gemini.js

export const callGemini = async (prompt, jsonSchema = null, model = null, image = null) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, jsonSchema, model, image })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Failed to fetch AI response');
    }

    const text = data.text;

    if (jsonSchema) {
      try {
        // 👇 IMPROVED CLEANING LOGIC
        // 1. Remove markdown code blocks (```json ... ```)
        let cleanText = text.replace(/```json|```/g, '');
        
        // 2. Remove any potential <think> tags (just in case)
        cleanText = cleanText.replace(/<think>[\s\S]*?<\/think>/g, '');
        
        // 3. Find the first '{' and last '}' to ignore any intro/outro text
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(cleanText);
      } catch (e) {
        console.error("JSON Parse Error. Raw text:", text);
        throw new Error("AI returned invalid JSON");
      }
    }

    return text;
  } catch (error) {
    console.error("AI Client Error:", error);
    throw error;
  }
};