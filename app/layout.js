import './globals.css';
import { Inter } from 'next/font/google';
import NavbarClientWrapper from './components/NavbarClientWrapper';
import ClientAuthGuard from '../components/ClientAuthGuard'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MedMap - MBBS Study Aid',
  description: 'AI powered medical study companion',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <ClientAuthGuard>
          
          <NavbarClientWrapper />

          {/* CHANGED: Added 'pt-16' to prevent content from hiding behind fixed navbar */}
          <main className="pt-16 min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
            {children}
          </main>

        </ClientAuthGuard>
      </body>
    </html>
  );
}