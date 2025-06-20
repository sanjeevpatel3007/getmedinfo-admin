'use server';

import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';

// Define types for brand data
export type Brand = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  logo: string | null;
  medicine_count: number;
};

// Simplified BrandInput to match form fields exactly
export type BrandInput = {
  name: string;
  country: string | null;
  logo: string | null;
  logoFile?: File;
};

// Fetch all brands
export async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        medicines:medicines(count)
      `);

    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error(error.message);
    }

    // Transform the data to include medicine count
    const brandsWithCount = data.map(brand => ({
      ...brand,
      medicine_count: brand.medicines[0]?.count || 0
    }));

    return brandsWithCount;
  } catch (error: any) {
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
export async function createBrand({ name, country, logo, logoFile }: BrandInput): Promise<Brand> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .insert([{ 
        name, 
        country, 
        logo,
        description: null,  // Set default values for optional fields
        logo_url: null
      }])
      .select('*')
      .single();

    if (error) throw error;

    return { ...data, medicine_count: 0 };
  } catch (error: any) {
    console.error('Error in createBrand:', error);
    throw error;
  }
}

// Update an existing brand
export async function updateBrand(id: string, { name, country, logo, logoFile }: BrandInput): Promise<Brand> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .update({ 
        name, 
        country, 
        logo,
        // Keep existing values for description and logo_url
      })
      .eq('id', id)
      .select(`
        *,
        medicines:medicines(count)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      medicine_count: data.medicines[0]?.count || 0
    };
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Error in deleteBrand:', error);
    throw error;
  }
}