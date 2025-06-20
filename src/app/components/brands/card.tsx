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
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-4">
          {brand.logo ? (
            <div className="relative w-16 h-16 mr-4 rounded-full overflow-hidden border">
              <Image 
                src={brand.logo} 
                alt={brand.name} 
                fill 
                className="object-cover" 
              />
            </div>
          ) : (
            <div className="w-16 h-16 mr-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {brand.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium">{brand.name}</h3>
            {brand.country && (
              <p className="text-sm text-gray-600">{brand.country}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => onEdit(brand)}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}