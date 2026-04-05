import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { CRMERPLeadFormData, CRMERPStatus } from '../types';

export function useCRMERPActions(refetch: () => Promise<void>) {
  const createLead = useCallback(async (form: CRMERPLeadFormData) => {
    const { error } = await supabase.from('crmerp_leads').insert({
      company_name: form.company_name || null,
      contact_name: form.contact_name || null,
      email: form.email || null,
      phone: form.phone || null,
      source: form.source || null,
      status: form.status,
      assignee_id: form.assignee_id || null,
      notes: form.notes || null,
    });
    if (error) throw error;
    await refetch();
  }, [refetch]);

  const updateLead = useCallback(async (id: string, updates: Partial<CRMERPLeadFormData>) => {
    const payload: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(updates)) {
      payload[key] = val === '' ? null : val;
    }
    const { error } = await supabase.from('crmerp_leads').update(payload).eq('id', id);
    if (error) throw error;
    await refetch();
  }, [refetch]);

  const deleteLead = useCallback(async (id: string) => {
    const { error } = await supabase.from('crmerp_leads').delete().eq('id', id);
    if (error) throw error;
    await refetch();
  }, [refetch]);

  const updateStatus = useCallback(async (id: string, status: CRMERPStatus) => {
    const { error } = await supabase.from('crmerp_leads').update({ status }).eq('id', id);
    if (error) throw error;
    await refetch();
  }, [refetch]);

  const assignLead = useCallback(async (id: string, userId: string | null) => {
    const { error } = await supabase
      .from('crmerp_leads')
      .update({ assignee_id: userId || null })
      .eq('id', id);
    if (error) throw error;
    await refetch();
  }, [refetch]);

  return { createLead, updateLead, deleteLead, updateStatus, assignLead };
}
