// ✅ Shared Navbar component (used in layout.tsx)
// 💬 "Provides consistent navigation across the app — highlights active page with underline."


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/profile', label: 'Profile' },
  { href: '/slides', label: 'Slides' },
  { href: '/upload', label: 'Upload' },
  { href: '/fhir-gateway', label: 'FHIR Gateway' },
  { href: '/tissue/dashboard', label: 'Tissue Dashboard' },
  { href: '/blog', label: 'Blog' }, // ← Add this
  { href: '/contact', label: 'Contact' }, 
];


export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-blue-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">🧬 MedData Dashboard</div>
      <div className="flex gap-4">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`hover:underline ${pathname === href ? 'font-semibold underline' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
