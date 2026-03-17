// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Your project credentials
const supabaseUrl = 'https://kvqcehrghuemasgfyrnq.supabase.co'
const supabaseKey = 'sb_publishable_5PbFak5diEMd4AA9anUKcg_ZAz6TmJr' // Ensure this is the "anon" key from API settings

export const supabase = createClient(supabaseUrl, supabaseKey)