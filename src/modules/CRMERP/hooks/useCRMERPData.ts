import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { CRMERPLead } from '../types';

export function useCRMERPData() {
  const [leads, setLeads] = useState<CRMERPLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('crmerp_leads')
        .select('*, assignee:users!assignee_id(id, name, email)')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setLeads(data ?? []);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('crmerp-leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crmerp_leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
}
