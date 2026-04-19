import React, { useState } from 'react'
import { Settings2, Plus, X, ChevronDown, ChevronUp, Trash2, ExternalLink, Kanban, FolderOpen, CalendarDays, CalendarClock } from 'lucide-react'
import { useMockERPProjects } from './hooks/useMockERPProjects'
import { ProjectDetailsV2 } from '../ProjectDetailsV2'
import { MOCK_ERP_BRIEFS } from './mocks'
import { ERPTaskBoard } from './components/ERPTaskBoard'
import { ERPBriefTab } from './components/ERPBriefTab'
import { ERPNewProjectModal } from './components/ERPNewProjectModal'
import type { StatusERP } from '../../types/project-v2'
import { cn } from '@/lib/utils'

type MainView = 'pipeline' | 'project' | 'month' | 'week'

const ERP_COLUMNS: { id: StatusERP; label: string; color: string; bgClass: string }[] = [
  { id: 'prospect',         label: 'Prospect',           color: '#64748b', bgClass: 'bg-slate-500' },
  { id: 'analyse_besoins',  label: 'Analyse besoins',    color: '#0ea5e9', bgClass: 'bg-sky-500' },
  { id: 'devis_envoye',     label: 'Devis envoye',       color: '#3b82f6', bgClass: 'bg-blue-500' },
  { id: 'signe',            label: 'Signe',              color: '#8b5cf6', bgClass: 'bg-violet-500' },
  { id: 'en_developpement', label: 'En developpement',   color: '#f59e0b', bgClass: 'bg-amber-500' },
  { id: 'recette',          label: 'Recette',            color: '#f97316', bgClass: 'bg-orange-500' },
  { id: 'livre',            label: 'Livre',              color: '#22c55e', bgClass: 'bg-green-500' },
  { id: 'perdu',            label: 'Perdu',              color: '#ef4444', bgClass: 'bg-red-500' },
]

const VIEW_TABS: { id: MainView; label: string; icon: React.ReactNode }[] = [
  { id: 'pipeline', label: 'Pipeline',  icon: <Kanban className="w-3.5 h-3.5" /> },
  { id: 'project',  label: 'Projets',   icon: <FolderOpen className="w-3.5 h-3.5" /> },
  { id: 'month',    label: 'Mois',      icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { id: 'week',     label: 'Semaine',   icon: <CalendarClock className="w-3.5 h-3.5" /> },
]

export function ERPManager() {
  const { projects, updateStatus, addProject, deleteProject, refetch } = useMockERPProjects()
  const [mainView, setMainView] = useState<MainView>('pipeline')
  const [showKpi, setShowKpi] = useState(true)
  const [showNewProject, setShowNewProject] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const selectedProject = projects.find(p => p.id === selectedId) ?? null

  // Vue detail projet complet
  if (showDetails && selectedProject) {
    return (
      <ProjectDetailsV2
        projectId={selectedProject.id}
        project={selectedProject}
        backLabel="ERP Sur Mesure"
        onBack={() => { setShowDetails(false); setSelectedId(null); refetch() }}
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

        {/* Navigation 4 vues */}
        <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-0.5 border border-border">
          {VIEW_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMainView(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                mainView === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-3'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {mainView === 'pipeline' && (
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau projet
          </button>
        )}
        {mainView !== 'pipeline' && <div />}
      </div>

      {/* KPIs repliables */}
      <div className="border-b border-border bg-surface-1 shrink-0">
        <button
          onClick={() => setShowKpi(v => !v)}
          className="flex items-center gap-1.5 px-6 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {showKpi ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          KPIs
        </button>
        {showKpi && (
          <div className="flex gap-4 px-6 pb-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">CA signe</span>
              <span className="text-sm font-semibold text-foreground">{caSigne.toLocaleString('fr-FR')} EUR</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">CA livre</span>
              <span className="text-sm font-semibold text-foreground">{caLivre.toLocaleString('fr-FR')} EUR</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Modules moyen/projet</span>
              <span className="text-sm font-semibold text-foreground">{nbModulesMoyen}</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">En developpement</span>
              <span className="text-sm font-semibold text-foreground">{nbEnDev}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      {mainView === 'pipeline' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Kanban */}
          <div className={cn('flex-1 overflow-auto p-4', selectedId && 'pr-0')}>
            <div className="grid gap-3 pb-4" style={{ gridTemplateColumns: `repeat(${ERP_COLUMNS.length}, minmax(0, 1fr))` }}>
              {ERP_COLUMNS.map(col => {
                const colProjects = projects.filter(p => p.erp_status === col.id)
                return (
                  <div key={col.id} className="min-w-0">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${col.bgClass} text-white`}>
                      <span className="text-xs font-semibold truncate">{col.label}</span>
                      <span className="text-xs opacity-80 ml-auto">{colProjects.length}</span>
                    </div>
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
                              {project.budget.toLocaleString('fr-FR')} EUR
                            </p>
                          )}
                        </div>
                      ))}
                      {colProjects.length === 0 && (
                        <div className="flex items-center justify-center min-h-16">
                          <span className="text-xs text-muted-foreground/50">--</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panneau lateral */}
          {selectedId && selectedProject && (
            <div className="w-80 border-l border-border bg-surface-1 overflow-y-auto shrink-0 flex flex-col">
              {/* Header panneau */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground truncate">{selectedProject.name}</h2>
                <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4 flex-1">
                {/* Infos */}
                {selectedProject.client_name && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Client</span>
                    <p className="text-sm text-foreground">{selectedProject.client_name}</p>
                  </div>
                )}
                {selectedProject.budget != null && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</span>
                    <p className="text-sm font-semibold text-foreground">{selectedProject.budget.toLocaleString('fr-FR')} EUR</p>
                  </div>
                )}
                {selectedProject.start_date && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Date debut</span>
                    <p className="text-sm text-foreground">{new Date(selectedProject.start_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                {selectedProject.end_date && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Date fin</span>
                    <p className="text-sm text-foreground">{new Date(selectedProject.end_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}

                {/* Changeur de statut */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">Statut</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ERP_COLUMNS.map(col => (
                      <button
                        key={col.id}
                        onClick={() => updateStatus(selectedProject.id, col.id)}
                        className={cn(
                          'px-2 py-1 rounded-md text-[10px] font-medium border transition-all',
                          selectedProject.erp_status === col.id
                            ? 'text-white border-transparent'
                            : 'text-muted-foreground border-border hover:border-current'
                        )}
                        style={{
                          background: selectedProject.erp_status === col.id ? col.color : undefined,
                          color: selectedProject.erp_status !== col.id ? col.color : undefined,
                        }}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brief ERP */}
                <div className="border-t border-border pt-3">
                  <ERPBriefTab projectId={selectedProject.id} />
                </div>
              </div>

              {/* Actions bas de panneau */}
              <div className="border-t border-border p-4 space-y-2">
                <button
                  onClick={() => setShowDetails(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Voir fiche complete
                </button>
                <button
                  onClick={() => {
                    if (confirm('Supprimer ce projet ?')) {
                      deleteProject(selectedProject.id)
                      setSelectedId(null)
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 border border-red-900/50 hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vues task board (project / month / week) */}
      {mainView !== 'pipeline' && (
        <div className="flex-1 overflow-auto">
          <ERPTaskBoard projects={projects} initialView={mainView as 'project' | 'month' | 'week'} />
        </div>
      )}

      {/* Modal nouveau projet */}
      <ERPNewProjectModal
        open={showNewProject}
        onSave={(data) => addProject(data)}
        onClose={() => setShowNewProject(false)}
      />
    </div>
  )
}
