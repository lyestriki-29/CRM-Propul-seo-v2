import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, CheckCircle2, Circle, Clock, Trash2, X } from 'lucide-react'
import { useMockChecklist } from '../../ProjectsManagerV2/hooks/useMockChecklist'
import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'
import { toast } from 'sonner'
import type { ChecklistPhase, ChecklistStatus, PrestaType, ProjectV2 } from '../../../types/project-v2'

const PHASE_LABELS: Record<ChecklistPhase, string> = {
  onboarding:     'Onboarding',
  conception:     'Conception',
  developpement:  'Développement',
  recette:        'Recette',
  post_livraison: 'Post-livraison',
  general:        'Général',
}

const PHASE_ORDER: ChecklistPhase[] = [
  'onboarding', 'conception', 'developpement', 'recette', 'post_livraison', 'general',
]

const STATUS_CONFIG: Record<ChecklistStatus, { label: string; icon: typeof Circle; color: string }> = {
  todo:        { label: 'À faire',  icon: Circle,       color: 'text-muted-foreground' },
  in_progress: { label: 'En cours', icon: Clock,        color: 'text-blue-400' },
  done:        { label: 'Terminé',  icon: CheckCircle2, color: 'text-green-400' },
}

const PRIORITY_CLASS: Record<string, string> = {
  high:   'bg-red-500/20 text-red-300 border-red-600',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-600',
  low:    'bg-gray-500/20 text-gray-400 border-gray-600',
}

const MOCK_USERS = [
  { id: 'user-alice', name: 'Alice Martin' },
  { id: 'user-bob',   name: 'Bob Lefèvre' },
  { id: 'user-carol', name: 'Carol Petit' },
]

type TemplateTask = { phase: ChecklistPhase; title: string }

const TEMPLATES: Record<PrestaType, TemplateTask[]> = {
  web: [
    { phase: 'onboarding',     title: 'Réunion de lancement' },
    { phase: 'onboarding',     title: 'Collecte des accès' },
    { phase: 'onboarding',     title: 'Validation du brief' },
    { phase: 'conception',     title: 'Maquettes wireframes' },
    { phase: 'conception',     title: 'Maquettes graphiques' },
    { phase: 'conception',     title: 'Validation design client' },
    { phase: 'developpement',  title: 'Intégration HTML/CSS' },
    { phase: 'developpement',  title: 'Développement fonctionnalités' },
    { phase: 'developpement',  title: 'Mise en place CMS' },
    { phase: 'developpement',  title: 'Tests internes' },
    { phase: 'recette',        title: 'Tests utilisateurs' },
    { phase: 'recette',        title: 'Corrections retours client' },
    { phase: 'recette',        title: 'Validation finale' },
    { phase: 'post_livraison', title: 'Mise en ligne' },
    { phase: 'post_livraison', title: 'Formation client' },
    { phase: 'post_livraison', title: 'Garantie 30j' },
  ],
  seo: [
    { phase: 'onboarding',     title: 'Audit technique SEO' },
    { phase: 'onboarding',     title: 'Accès GA/GSC/Search Console' },
    { phase: 'onboarding',     title: 'Réunion stratégie' },
    { phase: 'conception',     title: 'Analyse mots-clés' },
    { phase: 'conception',     title: 'Stratégie de contenu' },
    { phase: 'conception',     title: 'Audit concurrentiel' },
    { phase: 'developpement',  title: 'Optimisations on-page' },
    { phase: 'developpement',  title: 'Création/optimisation contenu' },
    { phase: 'developpement',  title: 'Stratégie netlinking' },
    { phase: 'recette',        title: 'Rapport de performance' },
    { phase: 'recette',        title: 'Validation objectifs KPI' },
    { phase: 'post_livraison', title: 'Suivi mensuel KPIs' },
    { phase: 'post_livraison', title: 'Rapport final' },
  ],
  erp: [
    { phase: 'onboarding',     title: 'Analyse des processus métier' },
    { phase: 'onboarding',     title: 'Cartographie fonctionnelle' },
    { phase: 'onboarding',     title: 'Réunion cadrage' },
    { phase: 'conception',     title: 'Architecture des modules' },
    { phase: 'conception',     title: 'Paramétrage système' },
    { phase: 'developpement',  title: 'Développement personnalisations' },
    { phase: 'developpement',  title: 'Migration des données' },
    { phase: 'developpement',  title: 'Tests unitaires' },
    { phase: 'recette',        title: 'Formation des équipes' },
    { phase: 'recette',        title: 'Recette fonctionnelle' },
    { phase: 'recette',        title: 'Corrections' },
    { phase: 'post_livraison', title: 'Go-live' },
    { phase: 'post_livraison', title: 'Support post-déploiement J+30' },
  ],
  saas: [
    { phase: 'onboarding',     title: 'Discovery & product roadmap' },
    { phase: 'onboarding',     title: 'Architecture technique' },
    { phase: 'onboarding',     title: 'Setup environnements' },
    { phase: 'conception',     title: 'Maquettes UI/UX' },
    { phase: 'conception',     title: 'Spécifications fonctionnelles' },
    { phase: 'developpement',  title: 'MVP développement' },
    { phase: 'developpement',  title: 'Tests automatisés' },
    { phase: 'developpement',  title: 'CI/CD pipeline' },
    { phase: 'recette',        title: 'Beta testing' },
    { phase: 'recette',        title: 'Corrections et optimisations' },
    { phase: 'post_livraison', title: 'Lancement production' },
    { phase: 'post_livraison', title: 'Monitoring & analytics' },
  ],
}

const PRESTA_LABELS: Record<PrestaType, string> = {
  web:  'Web',
  seo:  'SEO',
  erp:  'ERP',
  saas: 'SaaS',
}

interface ProjectChecklistProps {
  project: ProjectV2
}

export function ProjectChecklist({ project }: ProjectChecklistProps) {
  const { items, loading, progress, progressByPhase, setItemStatus, addItem, deleteItem } =
    useMockChecklist(project.id)

  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false)
  const [collapsed, setCollapsed]           = useState<Partial<Record<ChecklistPhase, boolean>>>({})
  const [newTitle, setNewTitle]             = useState('')
  const [newPhase, setNewPhase]             = useState<ChecklistPhase>('general')
  const [newAssignedTo, setNewAssignedTo]   = useState('')
  const [showAdd, setShowAdd]               = useState(false)
  const [subTaskOpen, setSubTaskOpen]       = useState<string | null>(null)
  const [subTaskTitle, setSubTaskTitle]     = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const togglePhase = (phase: ChecklistPhase) =>
    setCollapsed(prev => ({ ...prev, [phase]: !prev[phase] }))

  const cycleStatus = (id: string, current: ChecklistStatus) => {
    const next: Record<ChecklistStatus, ChecklistStatus> = {
      todo: 'in_progress', in_progress: 'done', done: 'todo',
    }
    setItemStatus(id, next[current])
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const user = MOCK_USERS.find(u => u.id === newAssignedTo)
    addItem({
      project_id:     project.id,
      parent_task_id: null,
      title:          newTitle.trim(),
      phase:          newPhase,
      status:         'todo',
      priority:       'medium',
      assigned_to:    user?.id ?? null,
      assigned_name:  user?.name ?? null,
      due_date:       null,
      sort_order:     items.length + 1,
    })
    setNewTitle('')
    setNewAssignedTo('')
    setShowAdd(false)
    toast.success('Tâche ajoutée')
  }

  const handleAddSubTask = (parentId: string) => {
    if (!subTaskTitle.trim()) return
    const parent = items.find(i => i.id === parentId)
    if (!parent) return
    addItem({
      project_id:     project.id,
      parent_task_id: parentId,
      title:          subTaskTitle.trim(),
      phase:          parent.phase,
      status:         'todo',
      priority:       parent.priority,
      assigned_to:    null,
      assigned_name:  null,
      due_date:       null,
      sort_order:     items.length + 1,
    })
    setSubTaskTitle('')
    setSubTaskOpen(null)
    toast.success('Sous-tâche ajoutée')
  }

  const handleDelete = (id: string) => {
    deleteItem(id)
    setConfirmDeleteId(null)
    toast.success('Tâche supprimée')
  }

  const applyTemplate = (type: PrestaType) => {
    if (isApplyingTemplate) return
    setIsApplyingTemplate(true)
    const tasks = TEMPLATES[type]
    tasks.forEach((t, idx) => {
      addItem({
        project_id:     project.id,
        parent_task_id: null,
        title:          t.title,
        phase:          t.phase,
        status:         'todo',
        priority:       'medium',
        assigned_to:    null,
        assigned_name:  null,
        due_date:       null,
        sort_order:     idx + 1,
      })
    })
    Promise.resolve().then(() => setIsApplyingTemplate(false))
    toast.success(`Template ${PRESTA_LABELS[type]} appliqué (${tasks.length} tâches)`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    )
  }

  const rootItems = items.filter(i => i.parent_task_id === null)
  const activePhases = PHASE_ORDER.filter(phase => progressByPhase[phase].total > 0)

  return (
    <div className="space-y-4">
      <div className="bg-surface-2 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Progression globale</span>
          <span className="text-sm font-bold text-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {rootItems.filter(i => i.status === 'done').length} / {rootItems.length} tâches terminées
        </p>
      </div>

      {items.length === 0 && project.presta_type.length > 0 && (
        <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Appliquer un template</p>
          <p className="text-xs text-muted-foreground">
            Initialise la checklist à partir du type de prestation du projet.
          </p>
          <div className="flex flex-wrap gap-2">
            {project.presta_type.map(type => (
              <button
                key={type}
                onClick={() => applyTemplate(type)}
                disabled={isApplyingTemplate}
                className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-md text-sm hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Template {PRESTA_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une tâche
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddItem} className="bg-surface-2 border border-primary/30 rounded-lg p-3 space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Titre de la tâche..."
            className="w-full bg-surface-3 border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground"
            autoFocus
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={newPhase}
              onChange={e => setNewPhase(e.target.value as ChecklistPhase)}
              className="bg-surface-3 border border-border rounded-md px-2 py-1 text-sm text-foreground"
            >
              {PHASE_ORDER.map(p => (
                <option key={p} value={p}>{PHASE_LABELS[p]}</option>
              ))}
            </select>
            <select
              value={newAssignedTo}
              onChange={e => setNewAssignedTo(e.target.value)}
              className="bg-surface-3 border border-border rounded-md px-2 py-1 text-sm text-foreground"
            >
              <option value="">Non assigné</option>
              {MOCK_USERS.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <button type="submit" className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors">
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 border border-border rounded-md text-sm text-muted-foreground hover:bg-surface-3 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {activePhases.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune tâche pour ce projet.</p>
          <p className="text-xs mt-1">Ajoutez des tâches ou appliquez un template selon le type de prestation.</p>
        </div>
      ) : (
        activePhases.map(phase => {
          const phaseRootItems = rootItems.filter(i => i.phase === phase)
          const { percent, done, total } = progressByPhase[phase]
          const isCollapsed = collapsed[phase]

          return (
            <div key={phase} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => togglePhase(phase)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-3/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed
                    ? <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                  <span className="text-sm font-semibold text-foreground">{PHASE_LABELS[phase]}</span>
                  <span className="text-xs text-muted-foreground">{done}/{total}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        percent === 100 ? 'bg-green-500' : 'bg-primary'
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{percent}%</span>
                </div>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-border/50">
                  {phaseRootItems.map(item => {
                    const subItems = items.filter(i => i.parent_task_id === item.id)
                    const statusConf = STATUS_CONFIG[item.status]
                    const StatusIcon = statusConf.icon

                    return (
                      <div key={item.id}>
                        <div className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-3/30 transition-colors group">
                          <button
                            onClick={() => cycleStatus(item.id, item.status)}
                            className={cn('mt-0.5 shrink-0 transition-colors hover:scale-110', statusConf.color)}
                            title={`Statut : ${statusConf.label}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm leading-tight',
                              item.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                            )}>
                              {item.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {item.assigned_name && (
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                                    {item.assigned_name.charAt(0)}
                                  </span>
                                  {item.assigned_name}
                                </span>
                              )}
                              {item.due_date && (
                                <span className="text-[10px] text-muted-foreground">{item.due_date}</span>
                              )}
                              {subItems.length > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  {subItems.filter(s => s.status === 'done').length}/{subItems.length} sous-tâches
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSubTaskOpen(subTaskOpen === item.id ? null : item.id)
                                setSubTaskTitle('')
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                              title="Ajouter une sous-tâche"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="text-muted-foreground hover:text-red-400 transition-colors p-0.5"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <Badge
                            variant="outline"
                            className={cn('text-[10px] px-1.5 py-0 border shrink-0', PRIORITY_CLASS[item.priority])}
                          >
                            {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moy.' : 'Basse'}
                          </Badge>
                        </div>

                        {confirmDeleteId === item.id && (
                          <div className="flex items-center justify-between gap-2 px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                            <p className="text-xs text-red-300">Supprimer cette tâche ?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-2.5 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                              >
                                Supprimer
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1 border border-border rounded text-xs text-muted-foreground hover:bg-surface-3 transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}

                        {subItems.map(sub => {
                          const subStatusConf = STATUS_CONFIG[sub.status]
                          const SubStatusIcon = subStatusConf.icon
                          return (
                            <div
                              key={sub.id}
                              className="flex items-start gap-3 pl-8 pr-4 py-2 bg-surface-3/20 border-t border-border/30 hover:bg-surface-3/40 transition-colors group"
                            >
                              <button
                                onClick={() => cycleStatus(sub.id, sub.status)}
                                className={cn('mt-0.5 shrink-0 transition-colors hover:scale-110', subStatusConf.color)}
                                title={`Statut : ${subStatusConf.label}`}
                              >
                                <SubStatusIcon className="h-3.5 w-3.5" />
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'text-xs leading-tight',
                                  sub.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground/80'
                                )}>
                                  {sub.title}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-0.5 shrink-0"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )
                        })}

                        {subTaskOpen === item.id && (
                          <div className="flex items-center gap-2 pl-8 pr-4 py-2 bg-surface-3/30 border-t border-border/30">
                            <input
                              type="text"
                              value={subTaskTitle}
                              onChange={e => setSubTaskTitle(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') { e.preventDefault(); handleAddSubTask(item.id) }
                                if (e.key === 'Escape') { setSubTaskOpen(null); setSubTaskTitle('') }
                              }}
                              placeholder="Titre de la sous-tâche..."
                              className="flex-1 bg-surface-3 border border-border rounded-md px-2 py-1 text-xs text-foreground placeholder-muted-foreground"
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddSubTask(item.id)}
                              className="px-2.5 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90 transition-colors shrink-0"
                            >
                              Ajouter
                            </button>
                            <button
                              onClick={() => { setSubTaskOpen(null); setSubTaskTitle('') }}
                              className="px-2 py-1 border border-border rounded text-xs text-muted-foreground hover:bg-surface-3 transition-colors shrink-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
