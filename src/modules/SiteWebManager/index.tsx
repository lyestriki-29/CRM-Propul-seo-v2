import React, { useMemo, useState } from 'react'
import { Globe, TrendingUp, FolderOpen, Award, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { useMockSiteWebProjects } from './hooks/useMockSiteWebProjects'
import { SiteWebBriefTab } from './components/SiteWebBriefTab'
import type { StatusSiteWeb } from '../../types/project-v2'
import type { ProjectV2 } from '../../types/project-v2'

type SiteWebProject = ProjectV2 & { sw_status: StatusSiteWeb }

const SITEWEB_COLUMNS = [
  { id: 'prospect' as StatusSiteWeb,      label: 'Prospect',       color: 'bg-slate-500' },
  { id: 'devis_envoye' as StatusSiteWeb,  label: 'Devis envoyé',   color: 'bg-blue-500' },
  { id: 'signe' as StatusSiteWeb,         label: 'Signé',           color: 'bg-violet-500' },
  { id: 'en_production' as StatusSiteWeb, label: 'En production',   color: 'bg-amber-500' },
  { id: 'livre' as StatusSiteWeb,         label: 'Livré',           color: 'bg-green-500' },
  { id: 'perdu' as StatusSiteWeb,         label: 'Perdu',           color: 'bg-red-500' },
]

const ACTIVE_STATUSES: StatusSiteWeb[] = ['prospect', 'devis_envoye', 'signe', 'en_production']
const SIGNED_STATUSES: StatusSiteWeb[] = ['signe', 'en_production', 'livre']

export function SiteWebManager() {
  const { projects, updateStatus, deleteProject } = useMockSiteWebProjects()
  const [selectedProject, setSelectedProject] = useState<SiteWebProject | null>(null)

  const kpis = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    const caSign = projects
      .filter(p => SIGNED_STATUSES.includes(p.sw_status))
      .filter(p => {
        const d = new Date(p.start_date)
        return d.getMonth() === month && d.getFullYear() === year
      })
      .reduce((sum, p) => sum + (p.budget ?? 0), 0)

    const caLivre = projects
      .filter(p => p.sw_status === 'livre')
      .filter(p => {
        const d = new Date(p.start_date)
        return d.getMonth() === month && d.getFullYear() === year
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

  const handleViewProject = (project: SiteWebProject) => {
    setSelectedProject(project)
  }

  const handleDeleteProject = (project: SiteWebProject) => {
    if (confirm(`Supprimer "${project.name}" ?`)) {
      deleteProject(project.id)
      toast.success('Projet supprimé')
      if (selectedProject?.id === project.id) setSelectedProject(null)
    }
  }

  const handleStatusChange = (project: SiteWebProject, status: StatusSiteWeb) => {
    updateStatus(project.id, status)
    if (selectedProject?.id === project.id) {
      setSelectedProject(prev => prev ? { ...prev, sw_status: status } : prev)
    }
    toast.success(`Statut mis à jour : ${SITEWEB_COLUMNS.find(c => c.id === status)?.label}`)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Site Web & SEO</h1>
        </div>
      </div>

      {/* KPI bandeau */}
      <div className="flex gap-4 px-6 py-3 border-b border-border bg-surface-2">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-muted-foreground">CA signé ce mois</span>
          <span className="font-semibold text-foreground">{kpis.caSign.toLocaleString('fr-FR')}€</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span className="text-muted-foreground">CA livré</span>
          <span className="font-semibold text-foreground">{kpis.caLivre.toLocaleString('fr-FR')}€</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <FolderOpen className="w-4 h-4 text-blue-500" />
          <span className="text-muted-foreground">Projets actifs</span>
          <span className="font-semibold text-foreground">{kpis.actifs}</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-muted-foreground">Pack le + vendu</span>
          <span className="font-semibold text-foreground">{kpis.topPack}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kanban */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {SITEWEB_COLUMNS.map(col => {
              const colProjects = projects.filter(p => p.sw_status === col.id)
              return (
                <div key={col.id} className="flex-shrink-0 w-72">
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
                        {project.budget != null && <p className="text-xs text-primary mt-1 font-medium">{project.budget.toLocaleString('fr-FR')}€</p>}
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
              <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
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
                  <p className="text-sm font-semibold text-primary">{selectedProject.budget.toLocaleString('fr-FR')}€</p>
                </div>
              )}
              {selectedProject.end_date && (
                <div>
                  <p className="text-xs text-muted-foreground">Échéance</p>
                  <p className="text-sm text-foreground">{new Date(selectedProject.end_date).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
            </div>

            {/* Brief tab */}
            <div className="flex-1 overflow-auto">
              <SiteWebBriefTab projectId={selectedProject.id} />
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
    </div>
  )
}
