import React, { useState } from 'react'
import { Settings2, Plus } from 'lucide-react'
import { useMockERPProjects } from './hooks/useMockERPProjects'
import { ProjectDetailsV2 } from '../ProjectDetailsV2'
import { MOCK_ERP_BRIEFS } from './mocks'
import type { StatusERP } from '../../types/project-v2'

const ERP_COLUMNS: { id: StatusERP; label: string; color: string }[] = [
  { id: 'prospect',         label: 'Prospect',           color: 'bg-slate-500' },
  { id: 'analyse_besoins',  label: 'Analyse besoins',    color: 'bg-sky-500' },
  { id: 'devis_envoye',     label: 'Devis envoyé',       color: 'bg-blue-500' },
  { id: 'signe',            label: 'Signé',              color: 'bg-violet-500' },
  { id: 'en_developpement', label: 'En développement',   color: 'bg-amber-500' },
  { id: 'recette',          label: 'Recette',            color: 'bg-orange-500' },
  { id: 'livre',            label: 'Livré',              color: 'bg-green-500' },
  { id: 'perdu',            label: 'Perdu',              color: 'bg-red-500' },
]

export function ERPManager() {
  const { projects, updateStatus } = useMockERPProjects()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const selectedProject = projects.find(p => p.id === selectedId) ?? null

  if (showDetails && selectedProject) {
    return (
      <ProjectDetailsV2
        projectId={selectedProject.id}
        project={selectedProject}
        backLabel="ERP Sur Mesure"
        onBack={() => { setShowDetails(false); setSelectedId(null) }}
      />
    )
  }

  // KPIs
  const caSigne = projects
    .filter(p => ['signe', 'en_developpement', 'recette', 'livre'].includes(p.erp_status) && p.budget)
    .reduce((acc, p) => acc + (p.budget ?? 0), 0)

  const caLivre = projects
    .filter(p => p.erp_status === 'livre' && p.budget)
    .reduce((acc, p) => acc + (p.budget ?? 0), 0)

  const nbEnDev = projects.filter(p => p.erp_status === 'en_developpement').length

  const nbModulesMoyen = (() => {
    const briefs = Object.values(MOCK_ERP_BRIEFS)
    const total = briefs.reduce((acc, b) => acc + (b.modules?.length ?? 0), 0)
    return briefs.length > 0 ? Math.round(total / briefs.length) : 0
  })()

  return (
    <div className="flex flex-col h-full bg-surface-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">ERP Sur Mesure</h1>
            <p className="text-xs text-muted-foreground">{projects.length} projet{projects.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Nouveau projet
        </button>
      </div>

      {/* KPIs */}
      <div className="flex gap-4 px-6 py-3 border-b border-border bg-surface-1 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">CA signé</span>
          <span className="text-sm font-semibold text-foreground">
            {caSigne.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">CA livré</span>
          <span className="text-sm font-semibold text-foreground">
            {caLivre.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Modules moyen/projet</span>
          <span className="text-sm font-semibold text-foreground">{nbModulesMoyen}</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">En développement</span>
          <span className="text-sm font-semibold text-foreground">{nbEnDev}</span>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minWidth: `${ERP_COLUMNS.length * 220}px` }}>
          {ERP_COLUMNS.map(col => {
            const colProjects = projects.filter(p => p.erp_status === col.id)
            return (
              <div key={col.id} className="flex-shrink-0 w-56">
                {/* Header coloré — même style que SiteWeb */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${col.color} text-white`}>
                  <span className="text-xs font-semibold truncate">{col.label}</span>
                  <span className="text-xs opacity-80 ml-auto">{colProjects.length}</span>
                </div>

                {/* Cartes */}
                <div className="bg-surface-2 rounded-b-lg p-2 space-y-2 min-h-20">
                  {colProjects.map(project => (
                    <div
                      key={project.id}
                      onClick={() => { setSelectedId(project.id); setShowDetails(true) }}
                      className={`bg-surface-1 rounded-lg p-3 cursor-pointer hover:bg-surface-3 transition-colors border ${
                        selectedId === project.id ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <p className="text-xs font-medium text-foreground truncate">{project.name}</p>
                      {project.client_name && (
                        <p className="text-xs text-muted-foreground mt-0.5">{project.client_name}</p>
                      )}
                      {project.budget != null && (
                        <p className="text-xs text-primary mt-1 font-medium">
                          {project.budget.toLocaleString('fr-FR')} €
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
    </div>
  )
}
