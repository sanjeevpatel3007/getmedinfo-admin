export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          role: 'admin' | 'user';
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          role?: 'admin' | 'user';
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          role?: 'admin' | 'user';
        };
      };
      contact_us: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at: string;
          status: 'pending' | 'resolved';
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at?: string;
          status?: 'pending' | 'resolved';
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          created_at?: string;
          status?: 'pending' | 'resolved';
        };
      };
    };
  };
};
