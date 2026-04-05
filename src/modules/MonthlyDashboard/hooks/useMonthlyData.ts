// src/modules/MonthlyDashboard/hooks/useMonthlyData.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabase'
import { startOfMonth, endOfMonth, subDays, addDays } from 'date-fns'
import type { ProjectV2 } from '../../../types/project-v2'
import type { InvoiceV2 } from '../../ProjectsManagerV2/hooks/useBillingV2'

export interface MonthlyMetrics {
  caEncaisse: number        // Factures status='paid' du mois en cours
  caEnAttente: number       // Factures status='sent' ou 'overdue'
  projetsUrgents: ProjectV2[]  // priority='urgent' ou 'high' + status actif
  projetsInactifs: ProjectV2[] // last_activity_at > 7j et status actif
  aLivrerBientot: ProjectV2[]  // end_date dans les 14 prochains jours
  loading: boolean
}

const ACTIVE_STATUSES = ['in_progress', 'review', 'maintenance'] as const

export function useMonthlyData(): MonthlyMetrics & { refetch: () => void } {
  const [metrics, setMetrics] = useState<MonthlyMetrics>({
    caEncaisse: 0,
    caEnAttente: 0,
    projetsUrgents: [],
    projetsInactifs: [],
    aLivrerBientot: [],
    loading: true,
  })

  const fetchData = useCallback(async () => {
    setMetrics(prev => ({ ...prev, loading: true }))

    const now = new Date()
    const monthStart = startOfMonth(now).toISOString()
    const monthEnd = endOfMonth(now).toISOString()
    const inactivityThreshold = subDays(now, 7).toISOString()
    const in14days = addDays(now, 14).toISOString()

    // Projets actifs
    const { data: projects } = await supabase
      .from('projects_v2')
      .select('*')
      .eq('is_archived', false)
      .in('status', ACTIVE_STATUSES)
      .order('last_activity_at', { ascending: false })

    // Factures (payées ou en attente)
    const { data: invoices } = await supabase
      .from('project_invoices_v2')
      .select('amount, status, date')
      .or(`status.eq.paid,status.eq.sent,status.eq.overdue`)

    const activeProjects = (projects ?? []) as ProjectV2[]
    const allInvoices = (invoices ?? []) as Pick<InvoiceV2, 'amount' | 'status' | 'date'>[]

    // CA encaissé : factures paid dans le mois en cours
    const caEncaisse = allInvoices
      .filter(inv => inv.status === 'paid' && inv.date &&
        inv.date.slice(0, 10) >= monthStart.slice(0, 10) &&
        inv.date.slice(0, 10) <= monthEnd.slice(0, 10))
      .reduce((sum, inv) => sum + (inv.amount ?? 0), 0)

    // CA en attente : toutes factures sent ou overdue
    const caEnAttente = allInvoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + (inv.amount ?? 0), 0)

    // Projets urgents : priority urgent ou high
    const projetsUrgents = activeProjects.filter(
      p => p.priority === 'urgent' || p.priority === 'high'
    )

    // Projets inactifs : last_activity_at vide ou > 7j
    const projetsInactifs = activeProjects.filter(p =>
      !p.last_activity_at || p.last_activity_at < inactivityThreshold
    )

    // À livrer dans 14j : end_date entre maintenant et +14j
    const aLivrerBientot = activeProjects.filter(p =>
      p.end_date && p.end_date >= now.toISOString().slice(0, 10) && p.end_date <= in14days.slice(0, 10)
    )

    setMetrics({
      caEncaisse,
      caEnAttente,
      projetsUrgents,
      projetsInactifs,
      aLivrerBientot,
      loading: false,
    })
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh auto toutes les 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  return { ...metrics, refetch: fetchData }
}
