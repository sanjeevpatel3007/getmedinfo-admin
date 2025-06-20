'use client';

import Sidebar from '../components/Sidebar';
import { Bell, Search, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Sidebar activePage={page} /> */}
      
      {/* Main Content */}
      {children}
    </div>
  );
}