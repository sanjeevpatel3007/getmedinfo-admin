'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Pill, 
  Tags, 
  Building2, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activePage: string;
}

export default function Sidebar({ activePage }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/admin?page=dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      id: 'dashboard'
    },
    {
      path: '/admin?page=medicine',
      name: 'Medicines',
      icon: Pill,
      id: 'medicine'
    },
    {
      path: '/admin?page=category',
      name: 'Categories',
      icon: Tags,
      id: 'category'
    },
    {
      path: '/admin?page=brands',
      name: 'Brands',
      icon: Building2,
      id: 'brands'
    },
    {
      path: '/admin?page=contact',
      name: 'Contacts',
      icon: MessageSquare,
      id: 'contact'
    }
  ];

  return (
    <div 
      className={`h-full bg-gradient-to-b from-indigo-700 to-indigo-900 text-white transition-all duration-300 ease-in-out min-h-screen max-h-full ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-600">
        <h1 className={`font-bold text-xl transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
        }`}>
          Admin Panel
        </h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-indigo-700 shadow-lg' 
                      : 'hover:bg-indigo-600'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isActive ? 'text-indigo-700' : ''}`} />
                  <span className={`transition-opacity duration-200 ${
                    isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}