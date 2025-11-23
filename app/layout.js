import './globals.css';
import { Inter } from 'next/font/google';
import NavbarClientWrapper from './components/NavbarClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MedMap - MBBS Study Aid',
  description: 'AI powered medical study companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <NavbarClientWrapper />

        <main className="min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
          {children}
        </main>
      </body>
    </html>
  );
}
