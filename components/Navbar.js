'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Activity, UserCircle, Brain, Stethoscope, Layers, Map as MapIcon, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login status on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        setIsLoggedIn(data.authenticated);
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [pathname]); // Re-check when path changes

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    router.push('/login');
    router.refresh();
  };

  // HIDE Navbar on Login Page
  if (pathname === '/login') return null;

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'mindmap', label: 'Mindmap', path: '/mindmap' },
    { id: 'cases', label: 'Cases', path: '/cases' },
    { id: 'skills', label: 'Skills', path: '/skills' },
    { id: 'tools', label: 'Tools', path: '/tools' },
    { id: 'roadmap', label: 'Roadmap', path: '/roadmap' },
  ];

  const mobileItems = [
    { icon: Brain, label: 'Map', path: '/mindmap' },
    { icon: Stethoscope, label: 'Cases', path: '/cases' },
    { icon: Layers, label: 'Tools', path: '/tools' },
    { icon: MapIcon, label: 'Plan', path: '/roadmap' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-teal-100 text-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2 rounded-lg shadow-lg shadow-teal-200/50">
                 <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                 <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">MedMap</span>
                 <span className="text-[10px] font-bold text-teal-600 tracking-widest uppercase">MBBS Aid</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      active 
                      ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5' 
                      : 'text-slate-500 hover:text-teal-600 hover:bg-white/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {!loading && (
                isLoggedIn ? (
                  <button 
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all group"
                  >
                    <LogOut size={16} className="text-slate-400 group-hover:text-red-500"/>
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-red-600">Logout</span>
                  </button>
                ) : (
                  <Link 
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md"
                  >
                    <LogIn size={16} />
                    <span className="text-xs font-bold">Login / Sign Up</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden flex justify-around bg-white/95 backdrop-blur-md border-t border-slate-100 py-3 fixed bottom-0 w-full z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {mobileItems.map((item) => {
            const active = isActive(item.path);
            return (
            <Link 
                key={item.label}
                href={item.path} 
                className={`flex flex-col items-center p-1 min-w-[60px] transition-colors ${active ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <item.icon size={22} className={`mb-1 ${active ? 'fill-teal-50 stroke-teal-600' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
            )
        })}
        
        {/* Mobile Auth Action */}
        {isLoggedIn ? (
            <button onClick={handleLogout} className="flex flex-col items-center p-1 min-w-[60px] text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={22} className="mb-1" />
                <span className="text-[10px] font-medium">Logout</span>
            </button>
        ) : (
            <Link href="/login" className="flex flex-col items-center p-1 min-w-[60px] text-teal-600">
                <LogIn size={22} className="mb-1" />
                <span className="text-[10px] font-medium">Login</span>
            </Link>
        )}
      </div>
    </>
  );
}