'use client';

import { useState } from 'react';
import Link from 'next/link';

type NavItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

const navigation: NavItem[] = [
  { name: 'Medicine', href: '/admin?page=medicine' },
  { name: 'Brands', href: '/admin?page=brands' },
  { name: 'Category', href: '/admin?page=category' },
  { name: 'Contact', href: '/admin?page=contact' },
];

export default function Sidebar({ activePage }: { activePage: string }) {
  return (
    <div className="h-full w-64 bg-white shadow-md">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">GetMedInfo Admin</h2>
      </div>
      <nav className="mt-5 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = activePage === item.name.toLowerCase();
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}