'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Droplet,
  Heart,
  Calendar,
  Building2,
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/donors', label: 'Donors', icon: Users },
  { href: '/admin/inventory', label: 'Inventory', icon: Droplet },
  { href: '/admin/requests', label: 'Requests', icon: ClipboardList },
  { href: '/admin/donations', label: 'Donations', icon: Heart },
  { href: '/admin/camps', label: 'Camps', icon: Calendar },
  { href: '/admin/users', label: 'Users', icon: Building2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-red-50 text-red-600'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
