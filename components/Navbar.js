'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  UserCircle,
  Brain,
  Stethoscope,
  Layers,
  Map as MapIcon,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  Bookmark,
  Sparkles,
  CreditCard,
  Moon,
  MessageSquare,
  HelpCircle,
  Shield
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation Data
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

  // State
  const [sessionUser, setSessionUser] = useState(undefined); 
  const [sessionLoading, setSessionLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Refs
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // --- Auth & Session Logic ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      setSessionLoading(true);
      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (!mounted) return;
        if (json?.ok && json?.user) setSessionUser(json.user);
        else setSessionUser(null);
      } catch {
        if (mounted) setSessionUser(null);
      } finally {
        if (mounted) setSessionLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSessionUser(null);
      setMenuOpen(false);
      router.refresh();
      router.push('/login');
    } catch { /* ignore */ }
  };

  const onAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/onboard');

  // --- Click Outside Logic ---
  useEffect(() => {
    function handleDocClick(e) {
      if (!menuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('click', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  // --- Sub-Components ---

  function NavItem({ item }) {
    const isActive = pathname === item.path;
    const baseClasses = `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200`;
    const activeClasses = 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5';
    const inactiveClasses = 'text-slate-500 hover:text-teal-600 hover:bg-white/50';

    if (onAuthPage) {
      return <div aria-disabled="true" className={`${baseClasses} text-slate-300 opacity-60 cursor-not-allowed select-none`}>{item.label}</div>;
    }
    return <Link href={item.path} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>{item.label}</Link>;
  }

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
      <Link key={item.label} href={item.path} className={`flex flex-col items-center p-1 min-w-[60px] transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
        <item.icon size={22} className={`mb-1 ${isActive ? 'fill-teal-50 stroke-teal-600' : ''}`} />
        <span className="text-[10px] font-medium">{item.label}</span>
      </Link>
    );
  }

  // Helper for menu items
  function MenuItem({ icon: Icon, label, onClick, href, className = "", badge }) {
    const content = (
      <div className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${className || 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'}`}>
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className="text-slate-400 group-hover:text-teal-600" />}
          <span>{label}</span>
        </div>
        {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-md">{badge}</span>}
      </div>
    );

    if (href) {
      return (
        <Link href={href} onClick={() => setMenuOpen(false)} role="menuitem" className="block mx-2">
          {content}
        </Link>
      );
    }
    return (
      <button onClick={onClick} role="menuitem" className="block w-[calc(100%-16px)] mx-2 text-left">
        {content}
      </button>
    );
  }

  // --- Render ---

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-teal-100 text-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2 rounded-lg shadow-lg shadow-teal-200/50 transition-transform group-hover:scale-105">
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

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 relative">
              
              {/* Profile Trigger Button (Optimized) */}
              <button
                ref={btnRef}
                onClick={() => { if (!onAuthPage) setMenuOpen(v => !v); }}
                disabled={onAuthPage}
                className={`
                  group flex items-center gap-2 transition-all outline-none
                  ${onAuthPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  /* Mobile: Simple circle */
                  p-0.5 rounded-full
                  /* Desktop: Pill shape with border & background */
                  sm:p-1.5 sm:pl-1.5 sm:pr-3 sm:bg-teal-50 sm:border sm:border-teal-100 sm:hover:bg-white sm:hover:shadow-sm
                  ${menuOpen ? 'ring-2 ring-teal-100 ring-offset-2' : ''}
                `}
              >
                {/* Avatar Image */}
                <div className="relative h-9 w-9 sm:h-8 sm:w-8 rounded-full overflow-hidden border border-white shadow-sm ring-1 ring-slate-100">
                  {sessionUser?.avatar ? (
                    <img src={sessionUser.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-teal-100 flex items-center justify-center">
                      <UserCircle size={20} className="text-teal-600" />
                    </div>
                  )}
                </div>
                
                {/* Text Label - Hidden on Mobile, Visible on Desktop */}
                <div className={`hidden sm:flex items-center gap-2 ${onAuthPage ? 'text-slate-400' : 'text-teal-900'}`}>
                   <div className="flex flex-col items-start leading-none">
                      <span className="text-xs font-bold max-w-[100px] truncate">
                        {sessionUser ? (sessionUser.name || 'Account') : 'Log In'}
                      </span>
                   </div>
                   <ChevronDown size={14} className={`text-slate-400 ${menuOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
                </div>
              </button>

              {/* ------------------------------------------------ */}
              {/* POPUP MENU                                     */}
              {/* ------------------------------------------------ */}
              {menuOpen && (
                <div
                  ref={menuRef}
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 origin-top-right bg-white rounded-2xl shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in slide-in-from-top-2 z-50 overflow-hidden"
                >
                  {/* --- Header Section --- */}
                  <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                    {sessionUser ? (
                      <div className="flex items-center gap-3">
                        {sessionUser.avatar ? (
                          <img src={sessionUser.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-lg font-bold text-teal-700">
                              {sessionUser.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{sessionUser.name || 'User'}</h4>
                          <p className="text-xs text-slate-500 truncate">{sessionUser.email}</p>
                          <div className="mt-1 flex items-center gap-1">
                             <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100 font-medium">Free Plan</span>
                             <Link href="/upgrade" className="text-[10px] text-teal-600 hover:underline">Upgrade</Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <h4 className="text-base font-bold text-slate-900">Welcome to MedMap</h4>
                        <p className="text-xs text-slate-500 mb-3">Sign in to track your MBBS progress</p>
                        <Link 
                          href="/login" 
                          onClick={() => setMenuOpen(false)}
                          className="block w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        >
                          Log In / Sign Up
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* --- Menu Body --- */}
                  <div className="py-2 flex flex-col gap-0.5">
                    {sessionUser ? (
                      <>
                        {/* Learning Section */}
                        <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Learning</div>
                        <MenuItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <MenuItem href="/my-cases" icon={Bookmark} label="Saved Cases" />
                        <MenuItem href="/roadmap" icon={MapIcon} label="My Progress" />
                        
                        <div className="my-1.5 border-t border-slate-50" />
                        
                        {/* Account Section */}
                        <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Settings</div>
                        <MenuItem href="/profile" icon={UserIcon} label="Profile" />
                        <MenuItem href="/billing" icon={CreditCard} label="Subscription" badge="PRO" />
                        <MenuItem href="/settings" icon={Settings} label="Preferences" />
                        
                        {/* Feature Toggle (Mockup) */}
                        <button className="flex items-center justify-between w-[calc(100%-16px)] mx-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                             <Moon size={16} className="text-slate-400" />
                             <span>Dark Mode</span>
                          </div>
                          {/* Simple Toggle Switch UI */}
                          <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                             <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                          </div>
                        </button>
                      </>
                    ) : (
                       // Guest Links
                       <>
                        <MenuItem href="/features" icon={Sparkles} label="Features" />
                        <MenuItem href="/pricing" icon={CreditCard} label="Pricing" />
                        <MenuItem href="/about" icon={UserCircle} label="About Us" />
                       </>
                    )}

                    <div className="my-1.5 border-t border-slate-100" />

                    {/* Support & Legal */}
                    <MenuItem href="/help" icon={HelpCircle} label="Help Center" />
                    <MenuItem href="/feedback" icon={MessageSquare} label="Send Feedback" />
                    <MenuItem href="/privacy" icon={Shield} label="Privacy & Terms" />
                    
                    {sessionUser && (
                      <div className="mt-1 pt-1 border-t border-slate-100">
                          <MenuItem 
                            onClick={handleLogout} 
                            icon={LogOut} 
                            label="Sign Out" 
                            className="text-red-600 hover:bg-red-50 hover:text-red-700" 
                          />
                      </div>
                    )}
                  </div>
                </div>
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