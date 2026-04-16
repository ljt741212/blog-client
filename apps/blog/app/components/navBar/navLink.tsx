// 'use client';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent-purple)] to-[var(--accent-pink)] 
                       bg-clip-text text-transparent 
                       hover:from-[var(--primary-light)] hover:via-[var(--accent-purple)] hover:to-[var(--accent-pink)]
                       transition-all duration-200"
    >
      {label}
    </Link>
  );
}
