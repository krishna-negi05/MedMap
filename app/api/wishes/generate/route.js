import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';
import { callGemini } from '../../../../lib/gemini';
import { FEATURE_MODELS } from '../../../../lib/ai-config'; 

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { recipient, occasion, details } = await req.json();

    const prompt = `
      Act as an expert Frontend Developer. 
      Create a single-file, responsive, beautiful HTML/Tailwind CSS website for a "${occasion}" wish.
      
      Recipient: ${recipient}
      Details to include: ${details}
      
      Requirements:
      - Use Tailwind CSS via CDN link (<script src="https://cdn.tailwindcss.com"></script>).
      - Include animations (using standard CSS or a script tag).
      - Center content and make it mobile responsive.
      - Make it look like a high-quality digital greeting card.
      - Return ONLY the raw HTML code.
    `;

    const rawResponse = await callGemini(
        prompt, 
        null, 
        FEATURE_MODELS.wishes_generator
    );

    // 🛠️ FIX: Clean the output to remove markdown backticks
    let htmlContent = rawResponse;
    if (typeof htmlContent === 'string') {
        htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '');
    }

    const slug = `${recipient.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`;

    await prisma.wish.create({
      data: {
        slug,
        recipient,
        occasion,
        details,
        htmlContent, // Saved clean HTML
        userId: user.sub
      }
    });

    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/wishes/${slug}`;
    
    return NextResponse.json({ ok: true, url: fullUrl });

  } catch (error) {
    console.error("Wish Gen Error:", error); // Check your terminal for this log
    return NextResponse.json({ error: 'Failed to generate wish' }, { status: 500 });
  }
}