'use client';

import { useState, useEffect } from 'react';
import { Brand, getBrands, createBrand, updateBrand, deleteBrand } from '@/action/brands.action';
import BrandCard from './brands/card';
import BrandForm from './brands/form';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Function to fetch all brands
  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle brand creation
  const handleCreateBrand = async (brandData: any) => {
    try {
      await createBrand(brandData);
      setShowForm(false);
      setError(null);
      await fetchBrands(); // Refresh the list
    } catch (err: any) {
      console.error('Error creating brand:', err);
      throw new Error(err.message || 'Failed to create brand. Please try again.');
    }
  };

  // Handle brand update
  const handleUpdateBrand = async (brandData: any) => {
    if (!editingBrand) return;
    
    try {
      await updateBrand(editingBrand.id, brandData);
      setShowForm(false);
      setEditingBrand(null);
      setError(null);
      await fetchBrands(); // Refresh the list
    } catch (err: any) {
      console.error('Error updating brand:', err);
      throw new Error(err.message || 'Failed to update brand. Please try again.');
    }
  };

  // Handle brand deletion
  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id);
      setError(null);
      await fetchBrands(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting brand:', err);
      throw new Error(err.message || 'Failed to delete brand. Please try again.');
    }
  };

  // Handle edit button click
  const handleEditClick = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
    setError(null);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Brands Management</h2>
      <p className="text-gray-700 mb-4">
        Manage all medicine brands in the GetMedInfo database. Add, edit, or remove brand information.
      </p>

      {/* Form or List View */}
      {showForm ? (
        <BrandForm 
          initialData={editingBrand || undefined}
          onSubmit={editingBrand ? handleUpdateBrand : handleCreateBrand}
          onCancel={handleFormCancel}
        />
      ) : (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Brands List</h3>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Add New Brand
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            // Empty State
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-500">No brands found. Add your first brand!</p>
            </div>
          ) : (
            // Brands Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteBrand}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}