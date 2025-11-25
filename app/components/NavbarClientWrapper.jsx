'use client';

import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast'; // <--- 1. Import Toaster

const Navbar = dynamic(() => import('../../components/Navbar'), {
  ssr: false,
  loading: () => <div className="h-16" />
});

export default function NavbarClientWrapper() {
  return (
    <>
      <Navbar />
      {/* 2. Add Toaster here with global settings */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#334155',
            borderRadius: '16px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '600',
          },
          success: {
            iconTheme: { primary: '#0d9488', secondary: '#f0fdfa' }, // Teal
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fef2f2' }, // Red
          },
        }}
      />
    </>
  );
}