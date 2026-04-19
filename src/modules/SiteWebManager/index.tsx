import React, { useMemo, useState } from 'react'
import { Globe, TrendingUp, FolderOpen, Award, DollarSign, ChevronDown, ChevronUp, LayoutGrid, FolderKanban, CalendarDays, CalendarRange, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useMockSiteWebProjects } from './hooks/useMockSiteWebProjects'
import { ProjectDetailsV2 } from '../ProjectDetailsV2'
import { SiteWebTaskBoard } from './components/SiteWebTaskBoard'
import { SiteWebNewProjectModal } from './components/SiteWebNewProjectModal'
import { SiteWebBriefTab } from './components/SiteWebBriefTab'
import type { StatusSiteWeb } from '../../types/project-v2'
import type { ProjectV2 } from '../../types/project-v2'

type SiteWebProject = ProjectV2 & { sw_status: StatusSiteWeb }

const SITEWEB_COLUMNS = [
  { id: 'prospect' as StatusSiteWeb,      label: 'Prospect',       color: 'bg-slate-500' },
  { id: 'devis_envoye' as StatusSiteWeb,  label: 'Devis envoye',   color: 'bg-blue-500' },
  { id: 'signe' as StatusSiteWeb,         label: 'Signe',           color: 'bg-violet-500' },
  { id: 'en_production' as StatusSiteWeb, label: 'En production',   color: 'bg-amber-500' },
  { id: 'livre' as StatusSiteWeb,         label: 'Livre',           color: 'bg-green-500' },
  { id: 'perdu' as StatusSiteWeb,         label: 'Perdu',           color: 'bg-red-500' },
]

const ACTIVE_STATUSES: StatusSiteWeb[] = ['prospect', 'devis_envoye', 'signe', 'en_production']
const SIGNED_STATUSES: StatusSiteWeb[] = ['signe', 'en_production', 'livre']

type MainView = 'pipeline' | 'project' | 'month' | 'week'
const NAV_ITEMS: { id: MainView; label: string; icon: React.ReactNode }[] = [
  { id: 'pipeline', label: 'Pipeline',  icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: 'project',  label: 'Projets',   icon: <FolderKanban className="w-3.5 h-3.5" /> },
  { id: 'month',    label: 'Mois',      icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { id: 'week',     label: 'Semaine',   icon: <CalendarRange className="w-3.5 h-3.5" /> },
]

export function SiteWebManager() {
  const { projects, updateStatus, addProject, deleteProject, refetch } = useMockSiteWebProjects()
  const [selectedProject, setSelectedProject] = useState<SiteWebProject | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [mainView, setMainView] = useState<MainView>('pipeline')
  const [showKpi, setShowKpi] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)

  const kpis = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    // CA signe : somme des budgets signes ce mois (filtre sur end_date, seul champ disponible en mock)
    const caSign = projects
      .filter(p => SIGNED_STATUSES.includes(p.sw_status))
      .filter(p => {
        const d = p.end_date ? new Date(p.end_date) : null
        return d ? d.getMonth() === month && d.getFullYear() === year : false
      })
      .reduce((sum, p) => sum + (p.budget ?? 0), 0)

    // CA livre : projets avec statut livre dont end_date est ce mois
    const caLivre = projects
      .filter(p => p.sw_status === 'livre')
      .filter(p => {
        const d = p.end_date ? new Date(p.end_date) : null
        return d ? d.getMonth() === month && d.getFullYear() === year : false
      })
      .reduce((sum, p) => sum + (p.budget ?? 0), 0)

    const actifs = projects.filter(p => ACTIVE_STATUSES.includes(p.sw_status)).length

    const packCount: Record<string, number> = {}
    for (const p of projects) {
      const b = p.budget
      const pack = b === 1480 ? 'Starter' : b === 1980 ? 'Pro' : b === 2980 ? 'Entreprise' : 'Sur mesure'
      packCount[pack] = (packCount[pack] ?? 0) + 1
    }
    const topPack = Object.entries(packCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    return { caSign, caLivre, actifs, topPack }
  }, [projects])

  if (showDetails && selectedProject) {
    return (
      <ProjectDetailsV2
        projectId={selectedProject.id}
        project={selectedProject}
        backLabel="Site Web & SEO"
        onBack={() => { setShowDetails(false); setSelectedProject(null); refetch() }}
      />
    )
  }

  const handleViewProject = (project: SiteWebProject) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const handleDeleteProject = (project: SiteWebProject) => {
    if (confirm(`Supprimer "${project.name}" ?`)) {
      deleteProject(project.id)
      toast.success('Projet supprime')
      if (selectedProject?.id === project.id) setSelectedProject(null)
    }
  }

  const handleStatusChange = (project: SiteWebProject, status: StatusSiteWeb) => {
    updateStatus(project.id, status)
    if (selectedProject?.id === project.id) {
      setSelectedProject(prev => prev ? { ...prev, sw_status: status } : prev)
    }
    toast.success(`Statut mis a jour : ${SITEWEB_COLUMNS.find(c => c.id === status)?.label}`)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header : titre | onglets centrés | boutons */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">Site Web & SEO</h1>
            <p className="text-xs text-muted-foreground">{projects.length} projet{projects.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Navigation 4 vues — centrée */}
        <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-0.5 border border-border">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setMainView(item.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                mainView === item.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-3'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {mainView === 'pipeline' ? (
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau projet
          </button>
        ) : <div />}
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
        <div className="flex gap-4 px-6 pb-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-muted-foreground">CA signe ce mois</span>
            <span className="font-semibold text-foreground">{kpis.caSign.toLocaleString('fr-FR')}EUR</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-muted-foreground">CA livre</span>
            <span className="font-semibold text-foreground">{kpis.caLivre.toLocaleString('fr-FR')}EUR</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-muted-foreground">Projets actifs</span>
            <span className="font-semibold text-foreground">{kpis.actifs}</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-muted-foreground">Pack le + vendu</span>
            <span className="font-semibold text-foreground">{kpis.topPack}</span>
          </div>
        </div>
      )}
      </div>

      {/* Main content - Pipeline view */}
      {mainView === 'pipeline' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Kanban */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid gap-3 pb-4" style={{ gridTemplateColumns: `repeat(${SITEWEB_COLUMNS.length}, minmax(0, 1fr))` }}>
              {SITEWEB_COLUMNS.map(col => {
                const colProjects = projects.filter(p => p.sw_status === col.id)
                return (
                  <div key={col.id} className="min-w-0">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${col.color} text-white`}>
                      <span className="text-sm font-semibold">{col.label}</span>
                      <span className="text-xs opacity-80 ml-auto">{colProjects.length}</span>
                    </div>
                    <div className="bg-surface-2 rounded-b-lg p-2 space-y-2 min-h-24">
                      {colProjects.map(project => (
                        <div key={project.id}
                          onClick={() => handleViewProject(project)}
                          className={`bg-surface-1 rounded-lg p-3 cursor-pointer hover:bg-surface-3 transition-colors border ${
                            selectedProject?.id === project.id ? 'border-primary' : 'border-border'
                          }`}>
                          <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                          {project.client_name && <p className="text-xs text-muted-foreground mt-0.5">{project.client_name}</p>}
                          {project.budget != null && <p className="text-xs text-primary mt-1 font-medium">{project.budget.toLocaleString('fr-FR')}EUR</p>}
                        </div>
                      ))}
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
                <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">x</button>
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
                  {SITEWEB_COLUMNS.map(col => (
                    <button key={col.id}
                      onClick={() => handleStatusChange(selectedProject, col.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedProject.sw_status === col.id
                          ? `${col.color} text-white`
                          : 'bg-surface-2 text-muted-foreground border border-border hover:border-primary/50'
                      }`}>
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget / dates */}
              <div className="px-4 py-3 border-b border-border grid grid-cols-2 gap-3">
                {selectedProject.budget != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-semibold text-primary">{selectedProject.budget.toLocaleString('fr-FR')}EUR</p>
                  </div>
                )}
                {selectedProject.end_date && (
                  <div>
                    <p className="text-xs text-muted-foreground">Echeance</p>
                    <p className="text-sm text-foreground">{new Date(selectedProject.end_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>

              {/* Brief tab */}
              <div className="flex-1 overflow-auto">
                <SiteWebBriefTab key={selectedProject.id} projectId={selectedProject.id} />
              </div>

              {/* Actions */}
              <div className="px-4 py-3 border-t border-border">
                <button onClick={() => handleDeleteProject(selectedProject)}
                  className="w-full text-xs text-red-500 hover:text-red-600 py-1.5 rounded border border-red-200 hover:border-red-400 transition-colors">
                  Supprimer le projet
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task board views (project / month / week) */}
      {mainView !== 'pipeline' && (
        <div className="flex flex-col flex-1">
          <SiteWebTaskBoard projects={projects} initialView={mainView === 'pipeline' ? 'project' : mainView} />
        </div>
      )}

      {/* Modal nouveau projet */}
      <SiteWebNewProjectModal
        open={showNewProject}
        onSave={(data) => {
          addProject(data)
          toast.success(`Projet "${data.name}" cree`)
        }}
        onClose={() => setShowNewProject(false)}
      />
    </div>
  )
}
