import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CommTask, CommTaskStatus, CommTaskPriority, ProjectV2, StatusERP } from '../../../../types/project-v2'

type ERPProject = ProjectV2 & { erp_status: StatusERP }

interface ERPTaskModalProps {
  open: boolean
  task: CommTask | null
  projects: ERPProject[]
  defaultDate?: string
  onSave: (data: Omit<CommTask, 'id' | 'created_at' | 'updated_at'>) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

const PRIORITIES: { value: CommTaskPriority; label: string; color: string }[] = [
  { value: 'faible',   label: 'Faible',   color: '#4ade80' },
  { value: 'moyenne',  label: 'Moyenne',  color: '#facc15' },
  { value: 'haute',    label: 'Haute',    color: '#fb923c' },
  { value: 'critique', label: 'Critique', color: '#f87171' },
]

const STATUSES: { value: CommTaskStatus; label: string }[] = [
  { value: 'todo',        label: 'A faire'  },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done',        label: 'Termine'  },
]

const PROJECT_COLORS: Record<string, string> = {
  'erp-001': '#f59e0b',
  'erp-002': '#8b5cf6',
}

export function ERPTaskModal({ open, task, projects, defaultDate, onSave, onDelete, onClose }: ERPTaskModalProps) {
  const [title, setTitle]         = useState('')
  const [projectId, setProjectId] = useState('')
  const [dueDate, setDueDate]     = useState('')
  const [dueHour, setDueHour]     = useState<number | ''>('')
  const [priority, setPriority]   = useState<CommTaskPriority>('moyenne')
  const [status, setStatus]       = useState<CommTaskStatus>('todo')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setProjectId(task.project_id)
      setDueDate(task.due_date)
      setDueHour(task.due_hour ?? '')
      setPriority(task.priority)
      setStatus(task.status)
    } else {
      setTitle('')
      setProjectId(projects[0]?.id ?? '')
      setDueDate(defaultDate ?? '')
      setDueHour('')
      setPriority('moyenne')
      setStatus('todo')
    }
  }, [task, defaultDate, projects, open])

  if (!open) return null

  const handleSave = () => {
    if (!title.trim()) return
    const proj = projects.find(p => p.id === projectId) ?? projects[0]
    onSave({
      title: title.trim(),
      project_id: proj?.id ?? projectId,
      project_name: proj?.name ?? projectId,
      project_color: PROJECT_COLORS[proj?.id ?? ''] ?? '#6366f1',
      status, priority, due_date: dueDate,
      ...(dueHour !== '' ? { due_hour: dueHour } : {}),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">{task ? 'Modifier la tache' : 'Nouvelle tache'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          {/* Titre */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Titre *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Nom de la tache..."
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Projet */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Projet</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Date + Horaire */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Heure</label>
              <select
                value={dueHour}
                onChange={e => setDueHour(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">--</option>
                {Array.from({ length: 10 }, (_, i) => i + 9).map(h => (
                  <option key={h} value={h}>{h}h00</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priorite */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Priorite</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                    priority === p.value
                      ? 'bg-surface-3 border-current shadow-sm'
                      : 'bg-surface-2 border-border text-muted-foreground hover:border-current'
                  )}
                  style={{ color: p.color, borderColor: priority === p.value ? p.color : undefined }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Statut</label>
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    status === s.value
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {task && onDelete && (
              <button
                onClick={() => { onDelete(task.id); onClose() }}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border hover:border-border-subtle transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              {task ? 'Enregistrer' : 'Creer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
