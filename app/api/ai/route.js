import { NextResponse } from 'next/server';
import { MODELS } from '../../../lib/ai-config'; // Optional: Import if you want to use constants server-side

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SITE_NAME = 'MedMap';

export async function POST(req) {
  try {
    // 1. Accept 'image' (base64 or url) in the request
    const { prompt, jsonSchema, model, image } = await req.json();

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    // 2. Determine Model & Content Structure
    let selectedModel = model || "google/gemini-2.0-flash-exp:free";
    let userContent;

    if (image) {
      // 🧠 DYNAMIC SWITCH: If image is present, force a Vision model
      console.log("🖼️ Image detected, switching to Vision Model");
      selectedModel = "qwen/qwen-2.5-vl-72b-instruct"; // Or 'google/gemini-2.0-flash-exp:free'

      // OpenRouter/OpenAI Multimodal format
      userContent = [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: image // Can be a URL or "data:image/jpeg;base64,..."
          }
        }
      ];
    } else {
      // Standard Text format
      userContent = prompt;
    }

    // 3. Construct Messages
    const messages = [
      {
        role: "system",
        content: "You are an expert medical AI .You have to help the Indian Medical Students. Respond with valid JSON if requested."
      },
      {
        role: "user",
        content: userContent
      }
    ];

    // 4. Enforce Schema (Text Only)
    // Note: Some vision models struggle with strict schema enforcement in system prompts, 
    // so we append it to the user text if possible.
    if (jsonSchema) {
      const schemaText = `\n\nIMPORTANT: Output strictly in JSON format following this schema:\n${JSON.stringify(jsonSchema)}`;
      
      if (Array.isArray(userContent)) {
        // Append to the text part of the array
        userContent[0].text += schemaText;
      } else {
        // Append to the string
        messages[1].content += schemaText;
      }
    }

    // 5. Call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenRouter API Error');
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return NextResponse.json({ ok: true, text });

  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}