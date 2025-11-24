'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// 1. Define paths that ANYONE can see
const PUBLIC_PATHS = [
  '/login', 
  '/register', 
  '/', 
  '/onboard',
    '/reset-password'
];

export default function ClientAuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. If the user is on a public page, stop checking and just let them view it.
    // We also allow any path starting with /api so authentication requests aren't blocked.
    if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/api')) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    // 3. If on a protected page, hit the session API to check login status.
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (!data.ok || !data.user) {
          // Not logged in? Boom, send to login.
          router.replace('/login');
        } else {
          // Logged in? All good.
          setAuthorized(true);
        }
      } catch (error) {
        // If network fails, safer to redirect to login
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  // 4. While checking, show a loading spinner so they don't see the protected content flashing.
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 fixed inset-0 z-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  // 5. If authorized, show the actual page content
  return authorized ? <>{children}</> : null;
}