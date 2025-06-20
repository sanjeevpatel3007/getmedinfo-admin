'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, signOut } from '@/action/auth';
import Sidebar from '../../components/Sidebar';
import MedicinePage from '../../components/MedicinePage';
import BrandsPage from '../../components/BrandsPage';
import CategoryPage from '../../components/CategoryPage';
import ContactPage from '../../components/ContactPage';
import DashboardPage from '../../components/DashboardPage';
import { User, ChevronDown } from 'lucide-react';

export default function AdminPanelClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'dashboard';

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const userButton = document.getElementById('user-button');
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        !userButton?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      case 'dashboard':
        return <DashboardPage />;
      case 'medicine':
        return <MedicinePage />;
      case 'brands':
        return <BrandsPage />;
      case 'category':
        return <CategoryPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </h1>

            <div className="flex items-center gap-2">
              {/* User Profile Button */}
              <div className="relative">
                <button
                  id="user-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, {user?.username || 'Admin'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar activePage={page} />
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
} 