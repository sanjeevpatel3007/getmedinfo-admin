'use client';

import { useEffect, useState } from 'react';
import { Medicine, MedicineInput, createMedicine, deleteMedicine, getMedicines, updateMedicine } from '@/action/medicine.action';
import MedicineModal from './medicine/MedicineModal';

export default function MedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const { data, error } = await getMedicines();
      if (error) {
        setError(error.message);
      } else {
        setMedicines(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const { error } = await deleteMedicine(id);
      if (error) {
        setError(error.message);
      } else {
        await loadMedicines();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleModalSubmit = async (data: MedicineInput) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (modalMode === 'create') {
        const { error } = await createMedicine(data);
        if (error) {
          setError(error.message);
          return;
        }
      } else if (modalMode === 'edit' && selectedMedicine) {
        const { error } = await updateMedicine(selectedMedicine.id, data);
        if (error) {
          setError(error.message);
          return;
        }
      }

      await loadMedicines();
      setIsModalOpen(false);
      setSelectedMedicine(undefined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedMedicine(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (medicine: Medicine) => {
    setModalMode('edit');
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const openViewModal = (medicine: Medicine) => {
    setModalMode('view');
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
     

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Medicine List</h3>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Add New Medicine
          </button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button
                      onClick={() => openViewModal(medicine)}
                      className="hover:text-indigo-600"
                    >
                      {medicine.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.brand?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.price ? `$${medicine.price.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.prescription_required ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openViewModal(medicine)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(medicine)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {medicines.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No medicines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicine(undefined);
        }}
        onSubmit={handleModalSubmit}
        initialData={selectedMedicine}
        mode={modalMode}
        isLoading={isSubmitting}
      />
    </div>
  );
}