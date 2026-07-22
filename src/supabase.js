import { createClient } from "@supabase/supabase-js";

// These come from .env locally and from Cloudflare Pages env vars in production.
// Only the *anon* key belongs here — it is safe to ship to the browser because
// Row Level Security decides what it is actually allowed to do.
// Never put the service_role key in front-end code.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

if (!isConfigured) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing — " +
      "the contact form will fall back to demo mode."
  );
}

export const supabase = isConfigured ? createClient(url, anonKey) : null;
