'use client';

import { useEffect, useState } from 'react';
import { Medicine, MedicineInput } from '@/action/medicine.action';
import { getCategories } from '@/action/category.action';
import { getBrands } from '@/action/brands.action';
import Image from 'next/image';

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicineInput) => Promise<void>;
  initialData?: Medicine;
  mode: 'create' | 'edit' | 'view';
  isLoading: boolean;
}

type ModalMode = 'create' | 'edit' | 'view';

export default function MedicineModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading
}: MedicineModalProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<MedicineInput>({
    name: '',
    description: '',
    price: null,
    prescription_required: false,
    category_id: null,
    brand_id: null,
    dosages: [],
    ingredients: [],
    side_effects: [],
    usage_instructions: [],
    warnings: [],
    alternatives: [],
    images: [],
    slug: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadBrands();
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description || '',
          price: initialData.price,
          prescription_required: initialData.prescription_required,
          category_id: initialData.category_id,
          brand_id: initialData.brand_id,
          dosages: initialData.dosages || [],
          ingredients: initialData.ingredients || [],
          side_effects: initialData.side_effects || [],
          usage_instructions: initialData.usage_instructions || [],
          warnings: initialData.warnings || [],
          alternatives: initialData.alternatives || [],
          images: initialData.images || [],
          slug: initialData.slug || ''
        });
      }
    }
  }, [isOpen, initialData]);

  const loadCategories = async () => {
    const { data } = await getCategories();
    if (data) {
      setCategories(data);
    }
  };

  const loadBrands = async () => {
    const brands = await getBrands();
    setBrands(brands);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseFloat(value) : null
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayInputChange = (name: string, value: string) => {
    // Split by comma, trim whitespace, and filter out empty values
    const arrayValues = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({
      ...prev,
      [name]: arrayValues
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const name = input.name;
      const value = input.value.trim();
      
      if (value) {
        setFormData(prev => ({
          ...prev,
          [name]: [...(prev[name as keyof MedicineInput] as string[] || []), value]
        }));
        input.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      imageFiles: selectedFiles
    });
  };

  if (!isOpen) return null;

  const renderArrayData = (items: string[] | null | undefined, title: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (mode as ModalMode === 'view') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{formData.description || 'No description available'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="mt-1 text-sm text-gray-900">{formData.price ? `$${formData.price.toFixed(2)}` : 'Not set'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prescription Required</label>
                      <p className="mt-1 text-sm text-gray-900">{formData.prescription_required ? 'Yes' : 'No'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {categories.find(c => c.id === formData.category_id)?.name || 'Not set'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {brands.find(b => b.id === formData.brand_id)?.name || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative w-full h-48">
                        <Image
                          src={image}
                          alt={`${formData.name} image ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Additional Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              
              {renderArrayData(formData.dosages, 'Dosages')}
              {renderArrayData(formData.ingredients, 'Ingredients')}
              {renderArrayData(formData.side_effects, 'Side Effects')}
              {renderArrayData(formData.usage_instructions, 'Usage Instructions')}
              {renderArrayData(formData.warnings, 'Warnings')}
              {renderArrayData(formData.alternatives, 'Alternatives')}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Add New Medicine' : mode === 'edit' ? 'Edit Medicine' : 'View Medicine'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="prescription_required"
                    checked={formData.prescription_required}
                    onChange={handleInputChange}
                    disabled={mode as ModalMode === 'view'}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Prescription Required</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleInputChange}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select
                  name="brand_id"
                  value={formData.brand_id || ''}
                  onChange={handleInputChange}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dosages</label>
                <input
                  type="text"
                  name="dosages"
                  placeholder="Type and press Enter or comma to add"
                  onKeyDown={handleKeyDown}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {formData.dosages && formData.dosages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.dosages.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              dosages: prev.dosages?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                <input
                  type="text"
                  name="ingredients"
                  placeholder="Type and press Enter or comma to add"
                  onKeyDown={handleKeyDown}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {formData.ingredients && formData.ingredients.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.ingredients.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              ingredients: prev.ingredients?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Side Effects</label>
                <input
                  type="text"
                  name="side_effects"
                  placeholder="Type and press Enter or comma to add"
                  onKeyDown={handleKeyDown}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {formData.side_effects && formData.side_effects.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.side_effects.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              side_effects: prev.side_effects?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Usage Instructions</label>
                <input
                  type="text"
                  name="usage_instructions"
                  placeholder="Type and press Enter or comma to add"
                  onKeyDown={handleKeyDown}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {formData.usage_instructions && formData.usage_instructions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.usage_instructions.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              usage_instructions: prev.usage_instructions?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Warnings</label>
                <input
                  type="text"
                  name="warnings"
                  placeholder="Type and press Enter or comma to add"
                  onKeyDown={handleKeyDown}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {formData.warnings && formData.warnings.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.warnings.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              warnings: prev.warnings?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alternatives</label>
                <input
                  type="text"
                  name="alternatives"
                  placeholder="Type and press Enter or comma to add"
                  onKeyDown={handleKeyDown}
                  disabled={mode as ModalMode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {formData.alternatives && formData.alternatives.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.alternatives.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              alternatives: prev.alternatives?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {mode !== 'view' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
              )}

              {/* Display existing images */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative w-full h-48">
                        <Image
                          src={image}
                          alt={`Medicine image ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 