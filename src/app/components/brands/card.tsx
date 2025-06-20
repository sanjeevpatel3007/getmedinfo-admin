'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Brand } from '@/action/brands.action';

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

export default function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this brand?')) {
      setIsDeleting(true);
      try {
        await onDelete(brand.id);
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="border  border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white p-4 flex  justify-between">
      <div>
      <div className="flex items-center gap-4">
        {brand.logo ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl border">
            {brand.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800">{brand.name}</h3>
          {brand.country && (
            <p className="text-sm text-gray-500 mt-1">{brand.country}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {brand.medicine_count} {brand.medicine_count === 1 ? 'Medicine' : 'Medicines'}
        </span>
      </div>
   
      </div>

   <div>
   <div className="flex flex-col justify-end items-center gap-2 mt-6  pt-4">
        <button
          onClick={() => onEdit(brand)}
          className="px-6 py-1.5 text-sm text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded-md transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
   </div>
     
    </div>
  );
}
