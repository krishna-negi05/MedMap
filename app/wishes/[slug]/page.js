import prisma from '../../../lib/prisma';
import { notFound } from 'next/navigation';

export default async function WishPage({ params }) {
  // Await params for Next.js 15+ compliance
  const { slug } = await Promise.resolve(params);

  const wish = await prisma.wish.findUnique({
    where: { slug }
  });

  if (!wish) return notFound();

  // Increment view count silently
  try {
    await prisma.wish.update({
      where: { id: wish.id },
      data: { views: { increment: 1 } }
    });
  } catch(e) {}

  return (
    <div 
      className="w-full min-h-screen bg-white"
      dangerouslySetInnerHTML={{ __html: wish.htmlContent }}
    />
  );
}