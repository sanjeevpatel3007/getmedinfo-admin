'use client';

import { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { Brand, BrandInput } from '@/action/brands.action';

interface BrandFormProps {
  initialData?: Brand;
  onSubmit: (data: BrandInput) => Promise<void>;
  onCancel: () => void;
}

export default function BrandForm({ initialData, onSubmit, onCancel }: BrandFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [logo, setLogo] = useState<string | null>(initialData?.logo || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.logo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Brand name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const brandData: BrandInput = {
        name: name.trim(),
        country: country.trim() || null,
        logo: logo,
        logoFile: logoFile || undefined,
      };

      await onSubmit(brandData);
    } catch (error: any) {
      console.error('Error submitting brand:', error);
      setError(error.message || 'Failed to save brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? 'Edit Brand' : 'Add New Brand'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <div className="mt-1 flex items-center">
            {previewUrl ? (
              <div className="relative w-24 h-24 mr-4 rounded-md overflow-hidden border">
                <Image
                  src={previewUrl}
                  alt="Brand logo preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 mr-4 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <input
              type="file"
              id="logo"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
            >
              {previewUrl ? 'Change Logo' : 'Upload Logo'}
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Brand'}
          </button>
        </div>
      </form>
    </div>
  );
}