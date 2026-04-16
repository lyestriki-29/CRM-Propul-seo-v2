// src/modules/ClientPortal/useClientPortal.ts
import { useState, useCallback } from 'react'
import { supabaseAnon, v2, v2Anon } from '@/lib/supabase'
import { generateShortCode } from '@/lib/shortCode'
import type { ProjectV2, ChecklistItemV2 } from '@/types/project-v2'

export interface PortalInvoice {
  id: string
  label: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  date: string | null
  due_date: string | null
}

export interface PortalClientContact {
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  sector: string | null
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
    | 'budget'
    | 'ai_summary'
  >
  checklist: Pick<ChecklistItemV2, 'id' | 'title' | 'phase' | 'status'>[]
  invoices: PortalInvoice[]
  contact: PortalClientContact | null
}

export function useClientPortal() {
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lecture publique via token (client anon)
  const fetchPortalData = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)
    setData(null)

    // 1. Projet par token
    const { data: project, error: projectError } = await v2Anon
      .from('projects')
      .select('id, name, client_name, client_id, status, progress, completion_score, next_action_label, next_action_due, presta_type, start_date, end_date, budget, ai_summary')
      .eq('portal_token', token)
      .eq('portal_enabled', true)
      .single()

    if (projectError || !project) {
      setError('Lien invalide ou expiré.')
      setLoading(false)
      return
    }

    // 2. Checklist (tâches principales seulement)
    const { data: checklist } = await v2Anon
      .from('checklist_items')
      .select('id, title, phase, status')
      .eq('project_id', project.id)
      .is('parent_task_id', null)
      .order('sort_order', { ascending: true })

    // 3. Factures (envoyées, payées, en retard)
    const { data: invoices } = await v2Anon
      .from('invoices')
      .select('id, label, amount, status, date, due_date')
      .eq('project_id', project.id)
      .in('status', ['sent', 'paid', 'overdue'])
      .order('date', { ascending: false })

    // 4. Contact client (si client_id présent)
    let contact: PortalClientContact | null = null
    if (project.client_id) {
      const { data: clientData, error: contactError } = await supabaseAnon
        .from('clients')
        .select('name, email, phone, address, sector')
        .eq('id', project.client_id)
        .single()
      if (contactError) {
        console.error('[ClientPortal] contact fetch failed:', contactError.message)
      }
      if (clientData) {
        contact = {
          name: clientData.name ?? null,
          email: clientData.email ?? null,
          phone: clientData.phone ?? null,
          address: clientData.address ?? null,
          sector: clientData.sector ?? null,
        }
      }
    }

    setData({
      project: project as PortalData['project'],
      checklist: (checklist ?? []) as PortalData['checklist'],
      invoices: (invoices ?? []) as PortalInvoice[],
      contact,
    })
    setLoading(false)
  }, [])

  // Génère un token et active le portail (client authentifié)
  const generateToken = useCallback(async (projectId: string): Promise<string | null> => {
    const token = crypto.randomUUID()
    const shortCode = generateShortCode()
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await v2
      .from('projects')
      .update({
        portal_token: token,
        portal_enabled: true,
        portal_short_code: shortCode,
        portal_expires_at: expiresAt,
      })
      .eq('id', projectId)

    if (error) return null
    return shortCode
  }, [])

  // Désactive le portail et efface le token (client authentifié)
  const revokeToken = useCallback(async (projectId: string): Promise<boolean> => {
    const { error } = await v2
      .from('projects')
      .update({ portal_token: null, portal_enabled: false, portal_short_code: null, portal_expires_at: null })
      .eq('id', projectId)

    return !error
  }, [])

  return { data, loading, error, fetchPortalData, generateToken, revokeToken }
}
