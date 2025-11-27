import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';
import { callGemini } from '../../../lib/gemini';
import { FEATURE_MODELS } from '../../../lib/ai-config';

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { recipient, occasion, details } = await req.json();

    const prompt = `
      Act as an expert Creative Technologist and Frontend Developer. 
      Create a single-file, responsive, beautiful HTML website for a "${occasion}" wish.
      
      Recipient Name: ${recipient}
      Context/Details: ${details}
      
      Technical Requirements:
      1. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
      2. Use Google Fonts (e.g., Poppins, Playfair Display).
      3. Add subtle animations (CSS keyframes or simple JS).
      4. Make it visually stunning (gradients, glassmorphism, confetti if appropriate).
      5. IMPORTANT: Return ONLY the raw HTML code. Do NOT wrap it in markdown code blocks (no \`\`\`html).
    `;

    // 1. Call AI
    const rawResponse = await callGemini(
        prompt, 
        null, 
        FEATURE_MODELS.wishes_generator 
    );

    // 2. 🧹 CLEANING: Remove markdown backticks if the AI adds them
    let htmlContent = rawResponse;
    if (typeof htmlContent === 'string') {
        htmlContent = htmlContent
            .replace(/^```html\s*/i, '') // Remove start tag
            .replace(/^```\s*/i, '')     // Remove generic start tag
            .replace(/```\s*$/i, '');    // Remove end tag
    }

    // 3. Create Slug
    const slug = `${recipient.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`;

    // 4. Save to Database
    await prisma.wish.create({
      data: {
        slug,
        recipient,
        occasion,
        details,
        htmlContent, 
        userId: user.sub
      }
    });

    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/wishes/${slug}`;
    
    return NextResponse.json({ ok: true, url: fullUrl });

  } catch (error) {
    console.error("Wish Gen Error:", error);
    return NextResponse.json({ error: 'Failed to generate wish' }, { status: 500 });
  }
}