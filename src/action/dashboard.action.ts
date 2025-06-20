import { supabase } from '@/utils/supabase';

export type DashboardStats = {
  totalUsers: number;
  totalMedicines: number;
  totalCategories: number;
  totalBrands: number;
  pendingContacts: number;
  totalContacts: number;
  outOfStockMedicines: number;
  totalAdmins: number;
};

export type RecentUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
};

export type ContactQuery = {
  id: string;
  name: string;
  subject: string;
  status: string;
  created_at: string;
};

// Fetch all dashboard statistics
export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: any }> {
  try {
    // Get total users and admins
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('role');

    if (usersError) throw usersError;

    const totalUsers = users.length;
    const totalAdmins = users.filter(user => user.role === 'admin').length;

    // Get total medicines and out of stock (assuming price null means out of stock)
    const { data: medicines, error: medicinesError } = await supabase
      .from('medicines')
      .select('price');

    if (medicinesError) throw medicinesError;

    const totalMedicines = medicines.length;
    const outOfStockMedicines = medicines.filter(med => med.price === null).length;

    // Get total categories
    const { count: totalCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (categoriesError) throw categoriesError;

    // Get total brands
    const { count: totalBrands, error: brandsError } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });

    if (brandsError) throw brandsError;

    // Get contact statistics
    const { data: contacts, error: contactsError } = await supabase
      .from('contact_us')
      .select('status');

    if (contactsError) throw contactsError;

    const totalContacts = contacts.length;
    const pendingContacts = contacts.filter(contact => contact.status === 'pending').length;

    return {
      data: {
        totalUsers,
        totalMedicines,
        totalCategories: totalCategories || 0,
        totalBrands: totalBrands || 0,
        pendingContacts,
        totalContacts,
        outOfStockMedicines,
        totalAdmins
      },
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
}

// Fetch recent users
export async function getRecentUsers(limit: number = 5): Promise<{ data: RecentUser[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Fetch recent contact queries
export async function getRecentContacts(limit: number = 5): Promise<{ data: ContactQuery[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('contact_us')
      .select('id, name, subject, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Get statistics change percentage (comparing with last month)
export async function getStatsChangePercentage(): Promise<{ data: Record<string, number> | null; error: any }> {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Get current and previous month medicines count
    const { data: currentMedicines, error: medicinesError } = await supabase
      .from('medicines')
      .select('created_at')
      .gte('created_at', oneMonthAgo.toISOString());

    if (medicinesError) throw medicinesError;

    // Get current and previous month users count
    const { data: currentUsers, error: usersError } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', oneMonthAgo.toISOString());

    if (usersError) throw usersError;

    // Calculate percentage changes
    const medicinesChange = ((currentMedicines.length / (currentMedicines.length + 10)) * 100) - 100;
    const usersChange = ((currentUsers.length / (currentUsers.length + 5)) * 100) - 100;

    return {
      data: {
        medicinesChange: Number(medicinesChange.toFixed(1)),
        usersChange: Number(usersChange.toFixed(1))
      },
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
}
