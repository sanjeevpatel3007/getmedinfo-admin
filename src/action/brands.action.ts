'use server';

import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';

// Define types for brand data
export type Brand = {
  id: string;
  name: string;
  country: string | null;
  logo: string | null;
};

export type BrandInput = Omit<Brand, 'id'> & { logoFile?: File };

// Fetch all brands
export async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBrands:', error);
    throw error;
  }
}

// Fetch a single brand by ID
export async function getBrandById(id: string): Promise<Brand | null> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching brand:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in getBrandById:', error);
    throw error;
  }
}

// Upload logo to Supabase storage
async function uploadLogo(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('brands')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading logo:', error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from('brands').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadLogo:', error);
    throw error;
  }
}

// Create a new brand
export async function createBrand(brandData: BrandInput): Promise<Brand> {
  try {
    let logoUrl = brandData.logo;

    // Upload logo if provided
    if (brandData.logoFile) {
      logoUrl = await uploadLogo(brandData.logoFile);
    }

    const newBrand = {
      name: brandData.name,
      country: brandData.country,
      logo: logoUrl,
    };

    const { data, error } = await supabase
      .from('brands')
      .insert([newBrand])
      .select()
      .single();

    if (error) {
      console.error('Error creating brand:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in createBrand:', error);
    throw error;
  }
}

// Update an existing brand
export async function updateBrand(id: string, brandData: BrandInput): Promise<Brand> {
  try {
    // First check if the brand exists
    const { data: existingBrand, error: checkError } = await supabase
      .from('brands')
      .select()
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking brand existence:', checkError);
      throw new Error(checkError.message);
    }

    if (!existingBrand) {
      throw new Error(`Brand with ID ${id} not found`);
    }

    let logoUrl = brandData.logo;

    // Upload logo if provided
    if (brandData.logoFile) {
      logoUrl = await uploadLogo(brandData.logoFile);
    }

    const updatedBrand = {
      name: brandData.name,
      country: brandData.country,
      logo: logoUrl,
    };

    const { data, error } = await supabase
      .from('brands')
      .update(updatedBrand)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating brand:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Brand was not updated successfully');
    }

    return data;
  } catch (error) {
    console.error('Error in updateBrand:', error);
    throw error;
  }
}

// Delete a brand
export async function deleteBrand(id: string): Promise<void> {
  try {
    // First get the brand to check if it has a logo
    const brand = await getBrandById(id);
    
    // Delete the brand from the database
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting brand:', error);
      throw new Error(error.message);
    }

    // If the brand had a logo, delete it from storage
    if (brand?.logo) {
      // Extract the filename from the URL
      const logoPath = brand.logo.split('/').pop() || '';
      
      const { error: storageError } = await supabase.storage
        .from('brands')
        .remove([logoPath]);

      if (storageError) {
        console.error('Error deleting logo:', storageError);
        // Don't throw here, as the brand is already deleted
      }
    }
  } catch (error) {
    console.error('Error in deleteBrand:', error);
    throw error;
  }
}