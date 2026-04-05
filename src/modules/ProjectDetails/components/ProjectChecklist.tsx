import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, CheckCircle2, Circle, Clock } from 'lucide-react'
import { useMockChecklist } from '../../ProjectsManager/hooks/useMockChecklist'
import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'
import type { ChecklistPhase, ChecklistStatus } from '../../../types/project-v2'

const PHASE_LABELS: Record<ChecklistPhase, string> = {
  onboarding:      'Onboarding',
  conception:      'Conception',
  developpement:   'Développement',
  recette:         'Recette',
  post_livraison:  'Post-livraison',
  general:         'Général',
}

const PHASE_ORDER: ChecklistPhase[] = [
  'onboarding', 'conception', 'developpement', 'recette', 'post_livraison', 'general',
]

const STATUS_CONFIG: Record<ChecklistStatus, { label: string; icon: typeof Circle; color: string }> = {
  todo:        { label: 'À faire',    icon: Circle,       color: 'text-muted-foreground' },
  in_progress: { label: 'En cours',   icon: Clock,        color: 'text-blue-400' },
  done:        { label: 'Terminé',    icon: CheckCircle2, color: 'text-green-400' },
}

const PRIORITY_CLASS: Record<string, string> = {
  high:   'bg-red-500/20 text-red-300 border-red-600',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-600',
  low:    'bg-gray-500/20 text-gray-400 border-gray-600',
}

interface ProjectChecklistProps {
  projectId: string
}

export function ProjectChecklist({ projectId }: ProjectChecklistProps) {
  const { items, loading, progress, progressByPhase, setItemStatus, addItem } = useMockChecklist(projectId)
  const [collapsed, setCollapsed] = useState<Partial<Record<ChecklistPhase, boolean>>>({})
  const [newTitle, setNewTitle]   = useState('')
  const [newPhase, setNewPhase]   = useState<ChecklistPhase>('general')
  const [showAdd, setShowAdd]     = useState(false)

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
    addItem({
      project_id: projectId,
      parent_task_id: null,
      title: newTitle.trim(),
      phase: newPhase,
      status: 'todo',
      priority: 'medium',
      assigned_to: null,
      assigned_name: null,
      due_date: null,
      sort_order: items.length + 1,
    })
    setNewTitle('')
    setShowAdd(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
  }

  const activePhases = PHASE_ORDER.filter(phase => progressByPhase[phase].total > 0)

  return (
    <div className="space-y-4">
      {/* Barre globale */}
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
          {items.filter(i => i.status === 'done').length} / {items.length} tâches terminées
        </p>
      </div>

      {/* Bouton ajout */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une tâche
        </button>
      </div>

      {/* Formulaire ajout */}
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
          <div className="flex gap-2">
            <select
              value={newPhase}
              onChange={e => setNewPhase(e.target.value as ChecklistPhase)}
              className="bg-surface-3 border border-border rounded-md px-2 py-1 text-sm text-foreground"
            >
              {PHASE_ORDER.map(p => (
                <option key={p} value={p}>{PHASE_LABELS[p]}</option>
              ))}
            </select>
            <button type="submit" className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
              Ajouter
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1 border border-border rounded-md text-sm text-muted-foreground hover:bg-surface-3">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Phases */}
      {activePhases.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune tâche pour ce projet.</p>
          <p className="text-xs mt-1">Ajoutez des tâches ou appliquez un template selon le type de prestation.</p>
        </div>
      ) : (
        activePhases.map(phase => {
          const phaseItems = items.filter(i => i.phase === phase)
          const { percent, done, total } = progressByPhase[phase]
          const isCollapsed = collapsed[phase]

          return (
            <div key={phase} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
              {/* Header phase */}
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

              {/* Items */}
              {!isCollapsed && (
                <div className="divide-y divide-border/50">
                  {phaseItems.map(item => {
                    const statusConf = STATUS_CONFIG[item.status]
                    const StatusIcon = statusConf.icon
                    return (
                      <div key={item.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-3/30 transition-colors">
                        {/* Toggle statut */}
                        <button
                          onClick={() => cycleStatus(item.id, item.status)}
                          className={cn('mt-0.5 shrink-0 transition-colors hover:scale-110', statusConf.color)}
                          title={`Statut : ${statusConf.label} — cliquer pour changer`}
                        >
                          <StatusIcon className="h-4 w-4" />
                        </button>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm leading-tight',
                            item.status === 'done'
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          )}>
                            {item.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.assigned_name && (
                              <span className="text-[10px] text-muted-foreground">{item.assigned_name}</span>
                            )}
                            {item.due_date && (
                              <span className="text-[10px] text-muted-foreground">{item.due_date}</span>
                            )}
                          </div>
                        </div>

                        {/* Priorité */}
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] px-1.5 py-0 border shrink-0', PRIORITY_CLASS[item.priority])}
                        >
                          {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moy.' : 'Basse'}
                        </Badge>
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
