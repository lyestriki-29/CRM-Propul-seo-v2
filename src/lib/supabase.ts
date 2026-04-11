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

// ===== INFO DEBUG (dev only) =====
if (import.meta.env.DEV) {
  if (isDemoMode) {
    console.info('🟡 Mode démo actif — Supabase désactivé');
  } else {
    const maskedUrl = supabaseUrl.replace(/https:\/\/(.{8}).*/, 'https://$1...');
    console.info('🔌 Supabase connecte a:', maskedUrl);
  }
}
