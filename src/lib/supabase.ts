import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwjmallpepktxkkxtyvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3am1hbGxwZXBrdHhra3h0eXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDQyNzAsImV4cCI6MjA5ODMyMDI3MH0.dku8eyz6PyolXiAMGSVdWpHYfwAKmztXxF-noiihKzA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbFoodItem = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  expiry_date: string;
  quantity: number;
  unit: string;
  notes?: string;
  status: 'active' | 'consumed' | 'wasted';
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  is_premium: boolean;
  premium_expires_at?: string;
  created_at: string;
};
