// lib/gemini.js
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const callGemini = async (prompt, jsonSchema = null) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: jsonSchema ? {
      responseMimeType: "application/json",
      responseSchema: jsonSchema
    } : {}
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (jsonSchema) {
      return JSON.parse(text);
    }
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};