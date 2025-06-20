import { Suspense } from 'react';
import AdminPanelClient from './components/AdminPanelClient';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we load the dashboard</p>
        </div>
      </div>
    }>
      <AdminPanelClient />
    </Suspense>
  );
}