// src/modules/DashboardV2/hooks/useDashboardKpisV2.ts
import { useMemo } from 'react'
import { useProjectsV2 } from '../../ProjectsManagerV2/hooks/useProjectsV2'
import { useSupabaseAccountingEntries } from '../../../hooks/useSupabaseData'

export interface DashboardKpisV2 {
  totalCa: number
  caSiteWeb: number
  caErp: number
  caComm: number
  mrrComm: number
  swActive: number
  erpActive: number
  commActive: number
  loading: boolean
}

const SITEWEB_CATEGORIES = ['site_web', 'web']
const ERP_CATEGORIES = ['erp', 'erp_v2']
const COMM_CATEGORIES = ['communication', 'comm']

const INACTIVE_SW_STATUSES = ['livre', 'perdu', 'closed', 'delivered']
const INACTIVE_ERP_STATUSES = ['livre', 'perdu', 'closed', 'delivered']

export function useDashboardKpisV2(): DashboardKpisV2 {
  const { projects, loading: projectsLoading } = useProjectsV2()
  const { data: accountingEntries, loading: accountingLoading } = useSupabaseAccountingEntries()

  return useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonthKey = now.toISOString().slice(0, 7)

    // CA par catégorie pour l'année en cours (source : accounting_entries)
    const yearRevenues = (accountingEntries ?? []).filter(
      e => e.type === 'revenue' && e.entry_date?.startsWith(String(currentYear))
    )

    const sumByCategory = (category: string) =>
      yearRevenues
        .filter(e => e.revenue_category === category)
        .reduce((sum, e) => sum + Number(e.amount ?? 0), 0)

    const caSiteWeb = sumByCategory('site_internet')
    const caErp = sumByCategory('erp')
    const caComm = sumByCategory('communication')

    const totalCa = yearRevenues.reduce((sum, e) => sum + Number(e.amount ?? 0), 0)

    // MRR Communication = revenus comm du mois courant
    const mrrComm = (accountingEntries ?? [])
      .filter(
        e =>
          e.type === 'revenue' &&
          e.revenue_category === 'communication' &&
          e.month_key === currentMonthKey
      )
      .reduce((sum, e) => sum + Number(e.amount ?? 0), 0)

    // Projets actifs par catégorie
    const swActive = projects.filter(
      p =>
        SITEWEB_CATEGORIES.includes(p.category ?? '') &&
        !p.is_archived &&
        !INACTIVE_SW_STATUSES.includes(p.status)
    ).length

    const erpActive = projects.filter(
      p =>
        ERP_CATEGORIES.includes(p.category ?? '') &&
        !p.is_archived &&
        !INACTIVE_ERP_STATUSES.includes(p.status)
    ).length

    const commActive = projects.filter(
      p =>
        COMM_CATEGORIES.includes(p.category ?? '') &&
        !p.is_archived
    ).length

    return {
      totalCa,
      caSiteWeb,
      caErp,
      caComm,
      mrrComm,
      swActive,
      erpActive,
      commActive,
      loading: projectsLoading || accountingLoading,
    }
  }, [projects, accountingEntries, projectsLoading, accountingLoading])
}
