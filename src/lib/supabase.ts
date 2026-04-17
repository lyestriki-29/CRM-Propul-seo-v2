import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// ===== CONFIGURATION SECURISEE =====
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mode démo : bypass si variables manquantes ou invalides
const isDemoMode = !supabaseUrl || !supabaseAnonKey ||
  !supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co');

const effectiveUrl = isDemoMode ? 'https://demo.supabase.co' : supabaseUrl;
const effectiveKey = isDemoMode ? 'demo-key' : supabaseAnonKey;

export { isDemoMode };

// ===== CLIENT SUPABASE SINGLETON =====
export const supabase: SupabaseClient<Database> = createClient<Database>(
  effectiveUrl,
  effectiveKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-application-name': 'crm-propulseo',
      },
    },
    db: {
      schema: 'public',
    },
  }
);

// ===== HELPER POUR VERIFIER LA CONNEXION =====
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
};

// ===== HELPER POUR GERER LES ERREURS =====
export interface SupabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const handleSupabaseError = (error: unknown): SupabaseResult<never> => {
  // Log securise - pas de donnees sensibles en production
  if (import.meta.env.DEV) {
    console.error('[Supabase Error]', error);
  }

  // Gestion specifique des erreurs de reseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      success: false,
      error: 'Erreur de connexion reseau. Verifiez votre connexion internet.'
    };
  }

  const message = error instanceof Error ? error.message : 'Une erreur est survenue';
  return {
    success: false,
    error: message
  };
};

export const handleSupabaseSuccess = <T>(data: T): SupabaseResult<T> => {
  return {
    success: true,
    data
  };
};

// ===== CLIENT SUPABASE ANON (accès public, sans auth) =====
export const supabaseAnon = createClient(
  effectiveUrl,
  effectiveKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// ===== HELPERS SCHÉMA V2 =====
// Proxy qui mappe v2.from('table') → supabase.from('table_v2') dans le schéma public
// Contourne la limitation PostgREST de Supabase hébergé (schéma custom non exposable via SQL)
const V2_TABLE_MAP: Record<string, string> = {
  projects: 'projects_v2',
  project_briefs: 'project_briefs_v2',
  project_accesses: 'project_accesses_v2',
  project_activities: 'project_activities_v2',
  project_documents: 'project_documents_v2',
  follow_ups: 'project_follow_ups_v2',
  invoices: 'project_invoices_v2',
  checklist_items: 'checklist_items_v2',
  // Tables sans suffixe _v2 dans public
  comm_tasks: 'comm_tasks',
  brief_invitations: 'brief_invitations',
}

function createV2Proxy(client: SupabaseClient<Database>) {
  return {
    from: (table: string) => {
      const realTable = V2_TABLE_MAP[table] || `${table}_v2`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return client.from(realTable as any)
    },
  }
}

export const v2 = createV2Proxy(supabase);
export const v2Anon = createV2Proxy(supabaseAnon);

// ===== INFO DEBUG (dev only) =====
if (import.meta.env.DEV) {
  if (isDemoMode) {
    console.info('🟡 Mode démo actif — Supabase désactivé');
  } else {
    const maskedUrl = supabaseUrl.replace(/https:\/\/(.{8}).*/, 'https://$1...');
    console.info('🔌 Supabase connecte a:', maskedUrl);
  }
}
