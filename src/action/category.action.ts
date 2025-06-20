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
};

// Get all categories
export async function getCategories(): Promise<CategoryResponse> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

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
      .select()
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

// Update a category
export async function updateCategory(id: string, name: string, description: string | null): Promise<CategoryResponse> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, description })
      .eq('id', id)
      .select()
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

// Delete a category
export async function deleteCategory(id: string): Promise<CategoryResponse> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

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
      data: true,
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