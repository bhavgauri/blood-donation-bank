'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 bg-slate-50 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
