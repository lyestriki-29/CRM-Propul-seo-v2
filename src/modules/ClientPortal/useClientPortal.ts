// src/modules/ClientPortal/useClientPortal.ts
import { useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { ProjectV2, ChecklistItemV2 } from '@/types/project-v2'

// Client anon explicite — pas de session utilisateur
const supabaseAnon = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export interface PortalInvoice {
  id: string
  label: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  date: string | null
  due_date: string | null
}

export interface PortalData {
  project: Pick<
    ProjectV2,
    | 'id'
    | 'name'
    | 'client_name'
    | 'status'
    | 'progress'
    | 'completion_score'
    | 'next_action_label'
    | 'next_action_due'
    | 'presta_type'
    | 'start_date'
    | 'end_date'
  >
  checklist: Pick<ChecklistItemV2, 'id' | 'title' | 'phase' | 'status'>[]
  invoices: PortalInvoice[]
}

export function useClientPortal() {
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lecture publique via token (client anon)
  const fetchPortalData = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)

    // 1. Récupérer le projet par token
    const { data: project, error: projectError } = await supabaseAnon
      .from('projects_v2')
      .select('id, name, client_name, status, progress, completion_score, next_action_label, next_action_due, presta_type, start_date, end_date')
      .eq('portal_token', token)
      .eq('portal_enabled', true)
      .single()

    if (projectError || !project) {
      setError('Lien invalide ou expiré.')
      setLoading(false)
      return
    }

    // 2. Checklist (tâches principales seulement)
    const { data: checklist } = await supabaseAnon
      .from('checklist_items_v2')
      .select('id, title, phase, status')
      .eq('project_id', project.id)
      .is('parent_task_id', null)
      .order('sort_order', { ascending: true })

    // 3. Factures (envoyées et payées uniquement)
    const { data: invoices } = await supabaseAnon
      .from('project_invoices_v2')
      .select('id, label, amount, status, date, due_date')
      .eq('project_id', project.id)
      .in('status', ['sent', 'paid', 'overdue'])
      .order('date', { ascending: false })

    setData({
      project: project as PortalData['project'],
      checklist: (checklist ?? []) as PortalData['checklist'],
      invoices: (invoices ?? []) as PortalInvoice[],
    })
    setLoading(false)
  }, [])

  // Génère un token et active le portail (client authentifié)
  const generateToken = useCallback(async (projectId: string): Promise<string | null> => {
    const token = crypto.randomUUID()
    const { error } = await supabase
      .from('projects_v2')
      .update({ portal_token: token, portal_enabled: true })
      .eq('id', projectId)

    if (error) return null
    return token
  }, [])

  // Désactive le portail et efface le token (client authentifié)
  const revokeToken = useCallback(async (projectId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('projects_v2')
      .update({ portal_token: null, portal_enabled: false })
      .eq('id', projectId)

    return !error
  }, [])

  return { data, loading, error, fetchPortalData, generateToken, revokeToken }
}
