'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, signOut } from '@/action/auth';
import Sidebar from '../../components/Sidebar';
import MedicinePage from '../../components/MedicinePage';
import BrandsPage from '../../components/BrandsPage';
import CategoryPage from '../../components/CategoryPage';
import ContactPage from '../../components/ContactPage';

export default function AdminPanelClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'medicine';

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getCurrentUser();
      
      if (response.error) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        setUser(response.data);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // Render the appropriate page component based on the page query parameter
  const renderPage = () => {
    switch (page) {
      case 'medicine':
        return <MedicinePage />;
      case 'brands':
        return <BrandsPage />;
      case 'category':
        return <CategoryPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <MedicinePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
            <button
              onClick={handleSignOut}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar activePage={page} />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
} 