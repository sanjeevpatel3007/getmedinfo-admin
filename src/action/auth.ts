//add supabase auth action

import { supabase } from '@/utils/supabase';

export type AuthError = {
  message: string;
  status: number;
};

export type AuthResponse = {
  error: AuthError | null;
  data: any | null;
};

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: 400,
        },
        data: null,
      };
    }

    // Check if user has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      await supabase.auth.signOut();
      return {
        error: {
          message: 'Unauthorized access. Admin privileges required.',
          status: 403,
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

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

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
      data: { message: 'Signed out successfully' },
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

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return {
        error: {
          message: error.message,
          status: 400,
        },
        data: null,
      };
    }

    if (!user) {
      return {
        error: {
          message: 'No user found',
          status: 404,
        },
        data: null,
      };
    }

    // Check if user has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      return {
        error: {
          message: 'Unauthorized access. Admin privileges required.',
          status: 403,
        },
        data: null,
      };
    }

    return {
      error: null,
      data: user,
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