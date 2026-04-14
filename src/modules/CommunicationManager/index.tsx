import React, { useMemo, useState } from 'react'
import { Megaphone, TrendingUp, Users, Award, DollarSign } from 'lucide-react'
import { useMockCommProjects } from './hooks/useMockCommProjects'
import { ProjectDetailsV2 } from '../ProjectDetailsV2'
import { CommTaskBoard } from './components/CommTaskBoard'
import { MOCK_COMM_BRIEFS } from './mocks'
import type { StatusComm, ProjectV2 } from '../../types/project-v2'

type CommProject = ProjectV2 & { comm_status: StatusComm }

const COMM_COLUMNS: { id: StatusComm; label: string; color: string }[] = [
  { id: 'prospect',      label: 'Prospect',      color: 'bg-slate-500' },
  { id: 'brief_creatif', label: 'Brief créatif', color: 'bg-sky-500' },
  { id: 'devis_envoye',  label: 'Devis envoyé',  color: 'bg-blue-500' },
  { id: 'signe',         label: 'Signé',         color: 'bg-violet-500' },
  { id: 'en_production', label: 'En production', color: 'bg-amber-500' },
  { id: 'actif',         label: 'Actif',         color: 'bg-emerald-500' },
  { id: 'termine',       label: 'Terminé',       color: 'bg-green-500' },
  { id: 'perdu',         label: 'Perdu',         color: 'bg-red-500' },
]

type DetailTab = 'brief' | 'suivi'

export function CommunicationManager() {
  const { projects, updateStatus } = useMockCommProjects()
  const [selectedProject, setSelectedProject] = useState<CommProject | null>(null)
  const [activeTab, setActiveTab] = useState<DetailTab>('brief')
  const [showDetails, setShowDetails] = useState(false)

  const kpis = useMemo(() => {
    const mrr = MOCK_COMM_BRIEFS
      .filter(b => b.type_contrat === 'abonnement' && b.mrr != null)
      .reduce((sum, b) => sum + (b.mrr ?? 0), 0)

    const nbAbonnes = projects.filter(p => p.comm_status === 'actif').length

    const packCount: Record<string, number> = {}
    for (const b of MOCK_COMM_BRIEFS) {
      if (b.pack) packCount[b.pack] = (packCount[b.pack] ?? 0) + 1
    }
    const topPack = Object.entries(packCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
    const topPackLabel = topPack === 'starter' ? 'Starter' : topPack === 'premium' ? 'Premium' : topPack === 'excellence' ? 'Excellence' : '—'

    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const caOneShot = projects
      .filter(p => ['en_production', 'termine'].includes(p.comm_status))
      .filter(p => {
        const d = p.end_date ? new Date(p.end_date) : null
        return d ? d.getMonth() === month && d.getFullYear() === year : false
      })
      .reduce((sum, p) => sum + (p.budget ?? 0), 0)

    return { mrr, nbAbonnes, topPackLabel, caOneShot }
  }, [projects])

  if (showDetails && selectedProject) {
    return (
      <ProjectDetailsV2
        projectId={selectedProject.id}
        project={selectedProject}
        backLabel="Communication"
        onBack={() => { setShowDetails(false); setSelectedProject(null) }}
      />
    )
  }

  const handleProjectClick = (project: CommProject) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const handleStatusChange = (project: CommProject, status: StatusComm) => {
    updateStatus(project.id, status)
    if (selectedProject?.id === project.id) {
      setSelectedProject(prev => prev ? { ...prev, comm_status: status } : prev)
    }
  }

  // Determine si l'onglet "Suivi mensuel" est disponible pour le projet sélectionné
  const selectedBrief = selectedProject
    ? MOCK_COMM_BRIEFS.find(b => b.project_id === selectedProject.id)
    : null
  const hasMonthlyTracking = selectedBrief?.type_contrat === 'abonnement'

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Megaphone className="w-5 h-5 text-rose-400" />
        <h1 className="text-lg font-semibold text-foreground">Communication</h1>
      </div>

      {/* KPI bandeau */}
      <div className="flex gap-4 px-6 py-3 border-b border-border bg-surface-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-muted-foreground">MRR</span>
          <span className="font-semibold text-foreground">{kpis.mrr.toLocaleString('fr-FR')}€/mois</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-muted-foreground">Abonnés actifs</span>
          <span className="font-semibold text-foreground">{kpis.nbAbonnes}</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-muted-foreground">Pack le + vendu</span>
          <span className="font-semibold text-foreground">{kpis.topPackLabel}</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-violet-500" />
          <span className="text-muted-foreground">CA one-shot ce mois</span>
          <span className="font-semibold text-foreground">{kpis.caOneShot.toLocaleString('fr-FR')}€</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Kanban + panneau de détail (côte à côte) */}
        <div className="flex overflow-hidden" style={{ minHeight: '350px' }}>
        {/* Kanban */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minWidth: `${COMM_COLUMNS.length * 220}px` }}>
            {COMM_COLUMNS.map(col => {
              const colProjects = projects.filter(p => p.comm_status === col.id)
              return (
                <div key={col.id} className="flex-shrink-0 w-52">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${col.color} text-white`}>
                    <span className="text-xs font-semibold truncate">{col.label}</span>
                    <span className="text-xs opacity-80 ml-auto">{colProjects.length}</span>
                  </div>
                  <div className="bg-surface-2 rounded-b-lg p-2 space-y-2 min-h-20">
                    {colProjects.map(project => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        className={`bg-surface-1 rounded-lg p-3 cursor-pointer hover:bg-surface-3 transition-colors border ${
                          selectedProject?.id === project.id ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <p className="text-xs font-medium text-foreground truncate">{project.name}</p>
                        {project.client_name && (
                          <p className="text-xs text-muted-foreground mt-0.5">{project.client_name}</p>
                        )}
                        {project.budget != null && (
                          <p className="text-xs text-primary mt-1 font-medium">
                            {project.budget.toLocaleString('fr-FR')}€
                          </p>
                        )}
                      </div>
                    ))}
                    {colProjects.length === 0 && (
                      <div className="flex items-center justify-center min-h-16">
                        <span className="text-xs text-muted-foreground/50">—</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selectedProject && (
          <div className="w-80 border-l border-border bg-surface-1 flex flex-col overflow-hidden flex-shrink-0">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground truncate">{selectedProject.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-muted-foreground hover:text-foreground text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Client */}
            {selectedProject.client_name && (
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="text-sm font-medium text-foreground">{selectedProject.client_name}</p>
              </div>
            )}

            {/* Status changer */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2">Statut</p>
              <div className="flex flex-wrap gap-1.5">
                {COMM_COLUMNS.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleStatusChange(selectedProject, col.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedProject.comm_status === col.id
                        ? `${col.color} text-white`
                        : 'bg-surface-2 text-muted-foreground border border-border hover:border-primary/50'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            {selectedProject.budget != null && (
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-semibold text-primary">
                  {selectedProject.budget.toLocaleString('fr-FR')}€
                  {selectedBrief?.type_contrat === 'abonnement' ? '/mois' : ''}
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-border flex-shrink-0">
              <button
                onClick={() => setActiveTab('brief')}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'brief'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Brief
              </button>
              {hasMonthlyTracking && (
                <button
                  onClick={() => setActiveTab('suivi')}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'suivi'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Suivi mensuel
                </button>
              )}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'brief' && (
                <CommBriefTab key={selectedProject.id} projectId={selectedProject.id} />
              )}
              {activeTab === 'suivi' && hasMonthlyTracking && (
                <CommMonthlyCycles key={selectedProject.id} projectId={selectedProject.id} />
              )}
            </div>
          </div>
        )}
        </div>{/* fin ligne kanban */}

        {/* Tableau des tâches communication */}
        <CommTaskBoard projects={projects} />
      </div>
    </div>
  )
}
