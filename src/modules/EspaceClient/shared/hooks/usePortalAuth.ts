import { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface PortalProject {
  id: string;
  name: string | null;
  client_name: string | null;
  status: string | null;
  portal_client_email: string | null;
}

// État de l'auth portail. Source de vérité : projects_v2.portal_client_email
// matche l'email de la session Supabase Auth. Le client n'a JAMAIS besoin
// d'une row dans public.users (réservée aux internes Propul'SEO).
export type PortalAuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'no-project';  session: Session; email: string }
  | { status: 'ready';       session: Session; email: string; project: PortalProject };

export interface UsePortalAuthResult {
  state: PortalAuthState;
  signInWithMagicLink: (email: string, redirectTo?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

async function loadAuthState(session: Session | null): Promise<PortalAuthState> {
  if (!session) return { status: 'unauthenticated' };
  const email = session.user.email;
  if (!email) return { status: 'no-project', session, email: '' };

  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, name, client_name, status, portal_client_email')
    .eq('portal_client_email', email)
    .maybeSingle();

  if (error || !data) return { status: 'no-project', session, email };
  return { status: 'ready', session, email, project: data as PortalProject };
}

export function usePortalAuth(): UsePortalAuthResult {
  const [state, setState] = useState<PortalAuthState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const next = await loadAuthState(data.session);
    setState(next);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const next = await loadAuthState(data.session);
      if (!cancelled) setState(next);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      const next = await loadAuthState(session);
      if (!cancelled) setState(next);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // shouldCreateUser: true — les clients externes n'ont pas de row préexistante
  // dans auth.users. Supabase la crée automatiquement à la 1re connexion.
  const signInWithMagicLink = useCallback<UsePortalAuthResult['signInWithMagicLink']>(
    async (email, redirectTo) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo ?? `${window.location.origin}/espace-client`,
          shouldCreateUser: true,
        },
      });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { state, signInWithMagicLink, signOut, refresh };
}
