'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/action/auth';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getCurrentUser();
      
      if (!response.error) {
        // User is authenticated, redirect to admin panel
        setIsAuthenticated(true);
        router.push('/admin');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we check your authentication status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">GetMedInfo Admin</h1>
        <p className="mt-2 text-gray-600">Welcome to the GetMedInfo Admin Portal</p>
        
        <div className="mt-8 space-y-4">
          <Link href="/login" className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Sign In
          </Link>
          
          <Link href="/register" className="block w-full rounded-md bg-white px-4 py-2 text-center text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
