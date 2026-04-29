// src/modules/MonthlyDashboard/index.tsx
import { Euro, Clock, AlertTriangle, Wifi } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMonthlyData } from './hooks/useMonthlyData'
import { MetricCard } from './components/MetricCard'
import { ProjectList } from './components/ProjectList'
import { routes } from '../../lib/routes'
import type { ProjectV2 } from '../../types/project-v2'

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

export function MonthlyDashboard() {
  const {
    caEncaisse,
    caEnAttente,
    projetsUrgents,
    projetsInactifs,
    aLivrerBientot,
    loading,
    refetch,
  } = useMonthlyData()

  const navigate = useNavigate()

  const handleProjectSelect = (_project: ProjectV2) => {
    navigate(routes.projects)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm animate-pulse">Chargement du tableau de bord...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mois en cours</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Actualisation automatique toutes les 5 min</p>
        </div>
        <button
          onClick={refetch}
          className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* 4 métriques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Euro}
          label="CA encaissé"
          value={formatEuro(caEncaisse)}
          sub="Factures payées ce mois"
          color="green"
        />
        <MetricCard
          icon={Clock}
          label="CA en attente"
          value={formatEuro(caEnAttente)}
          sub="Factures envoyées/échues"
          color="amber"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Projets urgents"
          value={String(projetsUrgents.length)}
          sub="Priorité haute ou urgente"
          color={projetsUrgents.length > 0 ? 'red' : 'default'}
        />
        <MetricCard
          icon={Wifi}
          label="Projets inactifs"
          value={String(projetsInactifs.length)}
          sub="Sans activité depuis 7j+"
          color={projetsInactifs.length > 0 ? 'amber' : 'default'}
        />
      </div>

      {/* Listes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectList
          title="À livrer dans 14 jours"
          projects={aLivrerBientot}
          emptyLabel="Aucune livraison prévue dans les 14 prochains jours"
          onSelect={handleProjectSelect}
        />
        <ProjectList
          title="Sans activité depuis 7j+"
          projects={projetsInactifs}
          emptyLabel="Tous les projets ont eu de l'activité récemment"
          onSelect={handleProjectSelect}
        />
      </div>

      {/* Liste urgents */}
      {projetsUrgents.length > 0 && (
        <ProjectList
          title="Projets urgents / haute priorité"
          projects={projetsUrgents}
          emptyLabel=""
          onSelect={handleProjectSelect}
        />
      )}
    </div>
  )
}
