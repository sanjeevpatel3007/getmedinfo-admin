'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  ShoppingBag,
  Activity,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Package,
  FileText,
  Pill,
  ShieldCheck
} from 'lucide-react';
import { getDashboardStats, getRecentUsers, getRecentContacts } from '@/action/dashboard.action';
import type { DashboardStats, RecentUser, ContactQuery } from '@/action/dashboard.action';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [statsChange, setStatsChange] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [statsRes, usersRes, contactsRes] = await Promise.all([
          getDashboardStats(),
          getRecentUsers(),
          getRecentContacts()
        ]);

        if (statsRes.data) setStats(statsRes.data);
        if (usersRes.data) setRecentUsers(usersRes.data);
        if (contactsRes.data) setContactQueries(contactsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Registered Users',
      value: stats.totalUsers.toString(),
      change: '+6%',
      isIncrease: true,
      icon: Users,
    },
    {
      title: 'Total Medicines',
      value: stats.totalMedicines.toString(),
      change: '+4%',
      isIncrease: true,
      icon: Pill,
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories.toString(),
      change: '0%',
      isIncrease: false,
      icon: FileText,
    },
    {
      title: 'Total Brands',
      value: stats.totalBrands.toString(),
      change: '+2%',
      isIncrease: true,
      icon: Package,
    },
    {
      title: 'Pending Contacts',
      value: stats.pendingContacts.toString(),
      change: '-5%',
      isIncrease: false,
      icon: ShieldCheck,
    },
    {
      title: 'Total Contacts',
      value: stats.totalContacts.toString(),
      change: '-5%',
      isIncrease: false,
      icon: ShieldCheck,
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockMedicines.toString(),
      change: '+1%',
      isIncrease: true,
      icon: Activity,
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins.toString(),
      change: '+1%',
      isIncrease: true,
      icon: Activity,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-md">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className={`text-sm ${stat.isIncrease ? 'text-green-600' : 'text-red-600'}`}> 
                  {stat.isIncrease ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />} {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
        <h2 className="text-lg font-semibold mb-4">Recently Registered Users</h2>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(user => (
              <tr key={user.id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                <td className="py-2 px-3">{user.full_name}</td>
                <td className="py-2 px-3">{user.email}</td>
                <td className="py-2 px-3 capitalize">{user.role}</td>
                <td className="py-2 px-3">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact Queries */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Contact Queries</h2>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Subject</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {contactQueries.map(query => (
              <tr key={query.id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                <td className="py-2 px-3">{query.name}</td>
                <td className="py-2 px-3">{query.subject}</td>
                <td className="py-2 px-3 capitalize">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {query.status}
                  </span>
                </td>
                <td className="py-2 px-3">{new Date(query.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
