'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('../../components/Navbar'), {
  ssr: false,
  loading: () => <div className="h-16" /> // placeholder height to avoid layout shift
});

export default function NavbarClientWrapper() {
  return <Navbar />;
}
