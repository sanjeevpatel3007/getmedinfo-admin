import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';

export type Medicine = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  prescription_required: boolean;
  category_id: string | null;
  brand_id: string | null;
  dosages: string[] | null;
  ingredients: string[] | null;
  side_effects: string[] | null;
  usage_instructions: string[] | null;
  warnings: string[] | null;
  alternatives: string[] | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
  slug: string | null;
  category?: { name: string } | null;
  brand?: { name: string } | null;
};

export type MedicineInput = Omit<Medicine, 'id' | 'created_at' | 'updated_at' | 'category' | 'brand'> & {
  imageFiles?: File[];
};

// Generate slug from medicine name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Upload images to 'brands' bucket in 'medicine' folder
async function uploadImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `medicine/${fileName}`; // Add medicine folder prefix

    const { error: uploadError } = await supabase.storage
      .from('brands') // Using brands bucket
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('brands').getPublicUrl(filePath);
    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
}

// Delete image files from 'brands' bucket
async function deleteImages(imageUrls: string[]) {
  const filePaths = imageUrls.map(url => {
    const fileName = url.split('/').pop() || '';
    return `medicine/${fileName}`; // Add medicine folder prefix
  });

  for (const path of filePaths) {
    const { error } = await supabase.storage
      .from('brands') // Using brands bucket
      .remove([path]);

    if (error) {
      console.error(`Error deleting image ${path}:`, error);
    }
  }
}

// Get all medicines
export async function getMedicines() {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        *,
        category:categories(name),
        brand:brands(name)
      `)
      .order('name');

    if (error) throw new Error(error.message);

    return { data, error: null };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Get medicine by ID
export async function getMedicineById(id: string) {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        *,
        category:categories(name),
        brand:brands(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return { data, error: null };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Create new medicine
export async function createMedicine(medicineData: MedicineInput) {
  try {
    let imageUrls: string[] = [];

    if (medicineData.imageFiles?.length) {
      imageUrls = await uploadImages(medicineData.imageFiles);
    }

    const { imageFiles, ...restData } = medicineData;
    const newMedicine = {
      ...restData,
      images: imageUrls,
      slug: generateSlug(medicineData.name)
    };

    const { data, error } = await supabase
      .from('medicines')
      .insert([newMedicine])
      .select(`
        *,
        category:categories(name),
        brand:brands(name)
      `)
      .single();

    if (error) {
      if (imageUrls.length > 0) await deleteImages(imageUrls);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Update medicine by ID
export async function updateMedicine(id: string, medicineData: MedicineInput) {
  try {
    const { data: existingMedicine } = await getMedicineById(id);
    if (!existingMedicine) throw new Error(`Medicine with ID ${id} not found`);

    let imageUrls = medicineData.images || [];

    if (medicineData.imageFiles?.length) {
      const newImageUrls = await uploadImages(medicineData.imageFiles);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    const { imageFiles, ...restData } = medicineData;
    const updatedMedicine = {
      ...restData,
      images: imageUrls,
      slug: generateSlug(medicineData.name)
    };

    const { data, error } = await supabase
      .from('medicines')
      .update(updatedMedicine)
      .eq('id', id)
      .select(`
        *,
        category:categories(name),
        brand:brands(name)
      `)
      .single();

    if (error) throw new Error(error.message);

    return { data, error: null };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Delete medicine by ID
export async function deleteMedicine(id: string) {
  try {
    const { data: medicine } = await getMedicineById(id);

    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    if (medicine?.images?.length) {
      await deleteImages(medicine.images);
    }

    return { error: null, data: true };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Remove a single image from a medicine
export async function removeMedicineImage(medicineId: string, imageUrl: string) {
  try {
    const { data: medicine } = await getMedicineById(medicineId);
    if (!medicine) throw new Error('Medicine not found');

    const updatedImages = medicine.images?.filter((img: string) => img !== imageUrl) || [];

    const { error: updateError } = await supabase
      .from('medicines') // ✅ table is 'medicines'
      .update({ images: updatedImages })
      .eq('id', medicineId);

    if (updateError) throw new Error(updateError.message);

    await deleteImages([imageUrl]);

    return { error: null, data: true };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}
