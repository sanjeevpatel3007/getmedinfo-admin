import { supabase } from '@/utils/supabase';

export type CategoryError = {
  message: string;
  status: number;
};

export type CategoryResponse = {
  error: CategoryError | null;
  data: any | null;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  medicine_count: number;
};

type MedicineCount = {
  category_id: string;
  count: string;
};

// Get all categories with medicine count
export async function getCategories(): Promise<CategoryResponse> {
  try {
    // Get categories with medicine counts using a join
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        medicines:medicines(count)
      `);

    if (error) throw error;

    // Transform the data to include medicine count
    const categoriesWithCount = data.map(category => ({
      ...category,
      medicine_count: category.medicines[0]?.count || 0
    }));

    return {
      data: categoriesWithCount,
      error: null
    };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Get a single category by ID
export async function getCategoryById(id: string): Promise<CategoryResponse> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return {
        error: {
          message: error.message,
          status: 400,
        },
        data: null,
      };
    }

    return {
      error: null,
      data,
    };
  } catch (error) {
    return {
      error: {
        message: 'An unexpected error occurred',
        status: 500,
      },
      data: null,
    };
  }
}

// Create a new category
export async function createCategory(name: string, description: string | null): Promise<CategoryResponse> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, description }])
      .select('*')
      .single();

    if (error) throw error;

    return { data: { ...data, medicine_count: 0 }, error: null };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Update a category
export async function updateCategory(id: string, name: string, description: string | null): Promise<CategoryResponse> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, description })
      .eq('id', id)
      .select(`
        *,
        medicines:medicines(count)
      `)
      .single();

    if (error) throw error;

    return {
      data: {
        ...data,
        medicine_count: data.medicines[0]?.count || 0
      },
      error: null
    };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}

// Delete a category
export async function deleteCategory(id: string): Promise<CategoryResponse> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null, data: true };
  } catch (error: any) {
    return {
      error: { message: error.message, status: 500 },
      data: null
    };
  }
}