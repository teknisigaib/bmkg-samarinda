import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Key dari file .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Buat client Supabase agar bisa dipakai di mana saja (Login, Upload, dll)
export const supabase = createClient(supabaseUrl, supabaseKey);