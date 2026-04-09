import React, { useState } from 'react'
import { Settings2, Plus, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useMockERPProjects } from './hooks/useMockERPProjects'
import { ERPBriefTab } from './components/ERPBriefTab'
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
  const [activeTab, setActiveTab] = useState<'brief' | 'checklist'>('brief')

  const selectedProject = projects.find(p => p.id === selectedId) ?? null

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

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kanban */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 p-4 h-full" style={{ minWidth: `${ERP_COLUMNS.length * 220}px` }}>
            {ERP_COLUMNS.map(col => {
              const cards = projects.filter(p => p.erp_status === col.id)
              return (
                <div key={col.id} className="flex flex-col w-52 shrink-0">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className={cn('w-2 h-2 rounded-full', col.color)} />
                    <span className="text-xs font-medium text-foreground truncate">{col.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{cards.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                    {cards.map(project => (
                      <button
                        key={project.id}
                        onClick={() => setSelectedId(project.id === selectedId ? null : project.id)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-all',
                          selectedId === project.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-surface-2 hover:border-primary/40 hover:shadow-sm'
                        )}
                      >
                        <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">
                          {project.name}
                        </p>
                        {project.client_name && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.client_name}</p>
                        )}
                        {project.budget && (
                          <p className="text-xs text-primary mt-1 font-medium">
                            {project.budget.toLocaleString('fr-FR')} €
                          </p>
                        )}
                        {project.next_action_label && (
                          <p className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            {project.next_action_label}
                          </p>
                        )}
                        {/* Status change select */}
                        <select
                          value={project.erp_status}
                          onChange={e => {
                            e.stopPropagation()
                            updateStatus(project.id, e.target.value as StatusERP)
                          }}
                          onClick={e => e.stopPropagation()}
                          className="mt-2 w-full text-xs border border-border rounded bg-surface-1 text-muted-foreground py-0.5 px-1"
                        >
                          {ERP_COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </button>
                    ))}
                    {cards.length === 0 && (
                      <div className="flex-1 border border-dashed border-border rounded-lg flex items-center justify-center min-h-16">
                        <span className="text-xs text-muted-foreground">Vide</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Side panel */}
        {selectedProject && (
          <div className="w-80 shrink-0 border-l border-border bg-surface-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-foreground truncate">{selectedProject.name}</p>
              <p className="text-xs text-muted-foreground truncate">{selectedProject.client_name}</p>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-border">
              {(['brief', 'checklist'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-1 py-2 text-xs font-medium transition-colors',
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                  {tab === 'brief' ? 'Brief' : 'Checklist'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'brief' && <ERPBriefTab projectId={selectedProject.id} />}
              {activeTab === 'checklist' && (
                <div className="p-4 text-xs text-muted-foreground">Checklist à venir.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
