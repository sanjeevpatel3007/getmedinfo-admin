import { supabase } from '@/utils/supabase';

export type ContactError = {
  message: string;
  status: number;
};

export type ContactResponse = {
  error: ContactError | null;
  data: any | null;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'pending' | 'resolved';
};

// Get all contacts
export async function getContacts(): Promise<ContactResponse> {
  try {
    const { data, error } = await supabase
      .from('contact_us')
      .select('*')
      .order('created_at', { ascending: false });

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

// Get a single contact by ID
export async function getContactById(id: string): Promise<ContactResponse> {
  try {
    const { data, error } = await supabase
      .from('contact_us')
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

// Update contact status
export async function updateContactStatus(id: string, status: 'pending' | 'resolved'): Promise<ContactResponse> {
  try {
    const { data, error } = await supabase
      .from('contact_us')
      .update({ status })
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