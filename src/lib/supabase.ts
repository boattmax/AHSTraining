import { createClient } from '@supabase/supabase-js';

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';

  // Ensure it starts with http or https to prevent crashes if user misconfigured it
  const validUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;

  return createClient(validUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
