import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://ftnwyltwkujcwhrurncs.supabase.co"
const supabasePublishableKey = "sb_publishable_tKvafKclNVSkB5FvmWrRRA_VYwKyTqs"
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})