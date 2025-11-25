export const callGemini = async (prompt, jsonSchema = null, model = null, image = null) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 👇 Pass the image property
      body: JSON.stringify({ prompt, jsonSchema, model, image })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Failed to fetch AI response');
    }

    const text = data.text;

    if (jsonSchema) {
      try {
        const cleanText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanText);
      } catch (e) {
        console.error("JSON Parse Error:", text);
        throw new Error("AI returned invalid JSON");
      }
    }

    return text;
  } catch (error) {
    console.error("AI Client Error:", error);
    throw error;
  }
};