import { createClient } from '@supabase/supabase-js'

// Le portail client est 100 % SSR : la clé service_role ne quitte jamais le serveur.
// On l'utilise pour contourner la RLS de project_documents (qui n'expose pas anon).
// La sécurité d'accès reste assurée par la validation portal_short_code + portal_enabled
// + portal_expires_at en amont de chaque query.
export function createSupabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
