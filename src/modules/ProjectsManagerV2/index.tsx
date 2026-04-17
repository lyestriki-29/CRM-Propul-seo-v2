import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Briefcase, ChevronRight, Users, Link } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '../../components/common/EmptyState'
import { ProjectDetailsV2 } from '../ProjectDetailsV2'
import { ProjectKanbanV2 } from './components/ProjectKanbanV2'
import { ProjectStatusBadge } from './components/ProjectStatusBadge'
import { PrestaList } from './components/PrestaBadge'
import { ProjectsV2Provider } from './context/ProjectsV2Context'
import { useMockProjects } from './hooks/useMockProjects'
import { useStore } from '../../store/useStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { MobileHeader } from '../../components/mobile/MobileHeader'
import { FAB } from '../../components/mobile/FAB'
import { cn } from '../../lib/utils'
import type { ProjectV2, ProjectStatusV2, PrestaType } from '../../types/project-v2'
import { EditProjectModal } from './components/EditProjectModal'
import { GmailConnectButton } from './components/GmailConnectButton'
import { BriefInviteModal } from './components/BriefInviteModal'
import { supabase } from '../../lib/supabase'

const EMPTY_FORM = {
  name: '',
  description: '',
  status: 'prospect' as ProjectStatusV2,
  presta_type: [] as PrestaType[],
  budget: '',
  end_date: '',
  assigned_to: '',
}

export function ProjectsManagerV2() {
  return (
    <ProjectsV2Provider>
      <ProjectsManagerV2Inner />
    </ProjectsV2Provider>
  )
}

function ProjectsManagerV2Inner() {
  const { projects, updateProjectStatus, updateProject, addProject, deleteProject } = useMockProjects()
  const isMobile = useIsMobile()
  const { navigationContext } = useStore()

  const [showAddProject, setShowAddProject]         = useState(false)
  const [showProjectDetails, setShowProjectDetails] = useState(false)
  const [selectedProjectId, setSelectedProjectId]   = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingProject, setEditingProject] = useState<ProjectV2 | null>(null)
  const [filterUser, setFilterUser] = useState<string>('')
  const [dbUsers, setDbUsers] = useState<{ id: string; name: string }[]>([])
  const [showBriefInvite, setShowBriefInvite] = useState(false)

  useEffect(() => {
    supabase.from('users').select('id, name').order('name').then(({ data }) => {
      if (data) setDbUsers(data as { id: string; name: string }[])
    })
  }, [])

  useEffect(() => {
    if (navigationContext?.projectId) {
      setSelectedProjectId(navigationContext.projectId)
      setShowProjectDetails(true)
    }
  }, [navigationContext?.projectId])

  const handleViewProject = (project: ProjectV2) => {
    setSelectedProjectId(project.id)
    setShowProjectDetails(true)
  }

  const handleEditProject = (project: ProjectV2) => {
    setEditingProject(project)
  }

  const handleSaveEdit = (updates: Partial<ProjectV2>) => {
    if (!editingProject) return
    updateProject(editingProject.id, updates)
    toast.success('Projet mis à jour')
    setEditingProject(null)
  }

  const handleDeleteProject = (project: ProjectV2) => {
    if (confirm(`Supprimer "${project.name}" ?`)) {
      deleteProject(project.id)
      toast.success('Projet supprimé')
    }
  }

  const handleBackToList = () => {
    setShowProjectDetails(false)
    setSelectedProjectId(null)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { toast.error('Le nom est obligatoire'); return }
    const user = dbUsers.find(u => u.id === form.assigned_to)
    const result = await addProject({
      user_id: null, client_id: null, client_name: '',
      name: form.name, description: form.description || null,
      status: form.status, priority: 'medium',
      presta_type: form.presta_type,
      assigned_to: form.assigned_to || null, assigned_name: user?.name ?? null,
      start_date: new Date().toISOString().split('T')[0],
      end_date: form.end_date || null,
      budget: form.budget ? parseFloat(form.budget) : null,
      progress: 0, category: form.presta_type[0] ?? 'web',
      completion_score: 0, last_activity_at: null,
      completed_at: null, is_archived: false,
    })
    if (result) {
      toast.success('Projet créé')
      setShowAddProject(false)
      setForm(EMPTY_FORM)
    } else {
      toast.error('Erreur lors de la création du projet')
    }
  }

  const togglePrestaType = (type: PrestaType) => {
    setForm(prev => ({
      ...prev,
      presta_type: prev.presta_type.includes(type)
        ? prev.presta_type.filter(t => t !== type)
        : [...prev.presta_type, type],
    }))
  }

  const projectsFiltered = useMemo(
    () => filterUser ? projects.filter(p => p.assigned_to === filterUser) : projects,
    [projects, filterUser]
  )

  if (showProjectDetails && selectedProjectId) {
    return <ProjectDetailsV2 projectId={selectedProjectId} onBack={handleBackToList} />
  }

  return (
    <div className={cn('min-h-screen', isMobile ? 'pb-20' : 'p-6 space-y-4')}>
      {isMobile && <MobileHeader title="Projets V2" />}

      {!isMobile && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">Projets V2</h1>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/30">
                  Beta
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {projectsFiltered.length} projet{projectsFiltered.length !== 1 ? 's' : ''} · Kanban 9 colonnes · Fiche 7 onglets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <GmailConnectButton />
              <button
                onClick={() => setShowBriefInvite(true)}
                className="flex items-center gap-2 border border-primary/40 text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
              >
                <Link className="h-4 w-4" />
                Via brief client
              </button>
              <button
                onClick={() => setShowAddProject(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Nouveau Projet
              </button>
            </div>
          </div>

          {/* Barre de filtre */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="bg-surface-2 border border-border rounded-md px-3 py-1.5 text-sm text-foreground"
            >
              <option value="">Tous les responsables</option>
              {dbUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {filterUser && (
              <button
                onClick={() => setFilterUser('')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Effacer
              </button>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {projectsFiltered.length} projet{projectsFiltered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </>
      )}

      {/* Vue mobile */}
      {isMobile && (
        <div className="p-4 space-y-2">
          {projects.map(project => (
            <div key={project.id} onClick={() => handleViewProject(project)}
              className="glass-card rounded-lg p-4 active:bg-surface-3/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{project.name}</h3>
                  {project.client_name && <p className="text-xs text-muted-foreground">{project.client_name}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <ProjectStatusBadge status={project.status} size="sm" />
                    {(project.presta_type?.length ?? 0) > 0 && <PrestaList types={project.presta_type} size="sm" />}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <EmptyState icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
              title="Aucun projet" description="Créez votre premier projet"
              onAction={() => setShowAddProject(true)} />
          )}
        </div>
      )}

      {/* Kanban desktop */}
      {!isMobile && (
        projectsFiltered.length > 0 ? (
          <ProjectKanbanV2
            projects={projectsFiltered}
            onStatusChange={updateProjectStatus}
            onViewProject={handleViewProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : (
          <EmptyState icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
            title="Aucun projet" description="Créez votre premier projet"
            onAction={() => setShowAddProject(true)} />
        )
      )}

      {/* Modal création */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass-surface-static rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-5 text-foreground">Nouveau Projet V2</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Nom *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Type de prestation</label>
                <div className="flex gap-2 flex-wrap">
                  {(['web', 'seo', 'erp', 'saas'] as PrestaType[]).map(type => (
                    <button key={type} type="button" onClick={() => togglePrestaType(type)}
                      className={cn('px-3 py-1 rounded-md text-xs font-medium border transition-colors',
                        form.presta_type.includes(type)
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
                      )}>
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Statut</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ProjectStatusV2 })}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm">
                    <option value="prospect">Prospect</option>
                    <option value="brief_received">Brief reçu</option>
                    <option value="quote_sent">Devis envoyé</option>
                    <option value="in_progress">En cours</option>
                    <option value="review">Recette</option>
                    <option value="delivered">Livré</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="on_hold">En pause</option>
                    <option value="closed">Clôturé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Responsable</label>
                  <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm">
                    <option value="">Non assigné</option>
                    {dbUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Budget (€)</label>
                  <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Échéance</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddProject(false); setForm(EMPTY_FORM) }}
                  className="flex-1 px-4 py-2 border border-border rounded-md text-muted-foreground bg-surface-2 hover:bg-surface-3 text-sm">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onSave={handleSaveEdit}
          onClose={() => setEditingProject(null)}
        />
      )}

      {isMobile && <FAB icon={Plus} onClick={() => setShowAddProject(true)} label="Nouveau projet" color="purple" />}

      {showBriefInvite && <BriefInviteModal onClose={() => setShowBriefInvite(false)} />}
    </div>
  )
}
