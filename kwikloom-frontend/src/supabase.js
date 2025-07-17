// src/supabase.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Optional Safety Check
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables:");
  if (!supabaseUrl) console.error("→ VITE_SUPABASE_URL is missing");
  if (!supabaseKey) console.error("→ VITE_SUPABASE_ANON_KEY is missing");
  // You can optionally throw an error or show a fallback UI
  // throw new Error("Missing Supabase configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
