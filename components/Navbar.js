'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, UserCircle, Brain, Stethoscope, Layers, Map as MapIcon } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

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

  const [sessionUser, setSessionUser] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (!mounted) return;
        if (json?.ok && json?.user) setSessionUser(json.user);
        else setSessionUser(null);
      } catch {
        if (mounted) setSessionUser(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSessionUser(null);
      router.refresh();
      router.push('/login');
    } catch {
      // ignore
    }
  };

  // Auth pages where navigation should be disabled
  const onAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/onboard');

  // helper to render desktop nav item (disabled when onAuthPage)
  function NavItem({ item }) {
    const isActive = pathname === item.path;
    const baseClasses = `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200`;
    const activeClasses = 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5';
    const inactiveClasses = 'text-slate-500 hover:text-teal-600 hover:bg-white/50';

    if (onAuthPage) {
      // render a non-clickable disabled element
      return (
        <div
          aria-disabled="true"
          className={`${baseClasses} text-slate-300 opacity-60 cursor-not-allowed select-none`}
          title="Navigation disabled while on auth page"
        >
          {item.label}
        </div>
      );
    }

    return (
      <Link
        href={item.path}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {item.label}
      </Link>
    );
  }

  // helper for mobile bottom nav: disable when onAuthPage
  function MobileNavItem({ item }) {
    const isActive = pathname === item.path;
    if (onAuthPage) {
      return (
        <div className="flex flex-col items-center p-1 min-w-[60px] text-slate-300 opacity-60 cursor-not-allowed select-none">
          <item.icon size={22} className="mb-1" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.path}
        className={`flex flex-col items-center p-1 min-w-[60px] transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <item.icon size={22} className={`mb-1 ${isActive ? 'fill-teal-50 stroke-teal-600' : ''}`} />
        <span className="text-[10px] font-medium">{item.label}</span>
      </Link>
    );
  }

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
              {navItems.map((item) => (
                <NavItem item={item} key={item.id} />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* show profile or logout */}
              {sessionUser ? (
                <>
                  <button onClick={() => router.push('/profile')} className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-100 ${onAuthPage ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-teal-50'}`}>
                    <UserCircle size={16} className={onAuthPage ? 'text-slate-400' : 'text-teal-600'} />
                    <span className={`text-xs font-semibold ${onAuthPage ? 'text-slate-400' : 'text-teal-800'}`}>{sessionUser.name || 'Profile'}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`px-3 py-1.5 rounded-full border border-red-100 bg-red-50 text-red-600 text-sm hidden sm:inline ${onAuthPage ? 'opacity-60 cursor-not-allowed' : ''}`}
                    aria-disabled={onAuthPage}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-100 ${onAuthPage ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-teal-50'}`}
                >
                  <UserCircle size={16} className={onAuthPage ? 'text-slate-400' : 'text-teal-600'} />
                  <span className={`text-xs font-semibold ${onAuthPage ? 'text-slate-400' : 'text-teal-800'}`}>Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden flex justify-around bg-white/95 backdrop-blur-md border-t border-slate-100 py-3 fixed bottom-0 w-full z-50 pb-safe">
        {mobileItems.map((item) => (
          <MobileNavItem key={item.label} item={item} />
        ))}
      </div>
    </>
  );
}
