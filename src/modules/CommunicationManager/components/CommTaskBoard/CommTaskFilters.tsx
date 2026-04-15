import { useState, useRef, useEffect } from 'react'
import { Plus, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CommTaskFiltersState, CommTaskView } from './useCommTasks'
import type { CommTaskPriority, CommTaskStatus, ProjectV2, StatusComm } from '../../../../types/project-v2'
import { PRIORITY_CONFIG, STATUS_CONFIG } from './commTaskConfig'

type CommProject = ProjectV2 & { comm_status: StatusComm }

interface CommTaskFiltersProps {
  filters: CommTaskFiltersState
  view: CommTaskView
  projects: CommProject[]
  currentDate: Date
  onFiltersChange: (f: CommTaskFiltersState) => void
  onViewChange: (v: CommTaskView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onNewTask: () => void
}

const PROJECT_COLORS: Record<string, string> = {
  'comm-001': '#e879f9',
  'comm-002': '#10b981',
  'comm-003': '#818cf8',
  'comm-004': '#f87171',
  'comm-005': '#34d399',
  'comm-006': '#38bdf8',
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}

export function CommTaskFilters({
  filters, view, projects, currentDate,
  onFiltersChange, onViewChange, onPrev, onNext, onToday, onNewTask,
}: CommTaskFiltersProps) {
  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)

  // Fermer le popover au clic extérieur
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const periodLabel = view === 'project'
    ? 'Tous projets actifs'
    : view === 'month'
    ? currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : `Sem. du ${getWeekStart(currentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`

  const togglePriority = (p: CommTaskPriority) =>
    onFiltersChange({ ...filters, priorities: toggleItem(filters.priorities, p) })
  const toggleStatus = (s: CommTaskStatus) =>
    onFiltersChange({ ...filters, statuses: toggleItem(filters.statuses, s) })
  const toggleProject = (id: string) =>
    onFiltersChange({ ...filters, projectIds: toggleItem(filters.projectIds, id) })

  // Nombre de filtres actifs (non par défaut)
  const allPriorities = 4
  const allStatuses = 3
  const activeFilterCount =
    (filters.priorities.length < allPriorities ? allPriorities - filters.priorities.length : 0) +
    (filters.statuses.length < allStatuses ? allStatuses - filters.statuses.length : 0) +
    filters.projectIds.length

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-surface-1/50">
      {/* Navigation période (mois / semaine seulement) */}
      {view !== 'project' && (
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-foreground px-1.5 capitalize min-w-[100px] text-center">{periodLabel}</span>
          <button onClick={onNext} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={onToday} className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors ml-1">
            Auj.
          </button>
        </div>
      )}
      {view === 'project' && <span className="text-xs font-semibold text-foreground capitalize">{periodLabel}</span>}

      {/* Bouton filtres */}
      <div className="relative ml-2" ref={popRef}>
        <button
          onClick={() => setOpen(v => !v)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
            open || activeFilterCount > 0
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtres
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Popover */}
        {open && (
          <div className="absolute top-full left-0 mt-1.5 w-72 bg-surface-1 border border-border rounded-xl shadow-xl z-50 p-3 space-y-3">
            {/* Priorité */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorité</p>
              <div className="flex flex-wrap gap-1.5">
                {(['critique', 'haute', 'moyenne', 'faible'] as CommTaskPriority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => togglePriority(p)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all',
                      filters.priorities.includes(p)
                        ? 'border-current bg-surface-3'
                        : 'border-border bg-surface-2 text-muted-foreground opacity-50'
                    )}
                    style={{ color: filters.priorities.includes(p) ? PRIORITY_CONFIG[p].dot : undefined }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: PRIORITY_CONFIG[p].dot }} />
                    {PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Statut</p>
              <div className="flex flex-wrap gap-1.5">
                {(['todo', 'in_progress', 'done'] as CommTaskStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium border transition-all',
                      filters.statuses.includes(s)
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border bg-surface-2 text-muted-foreground opacity-50'
                    )}
                  >
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Projets */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Projets</p>
              <div className="flex flex-wrap gap-1.5">
                {projects.slice(0, 6).map(p => {
                  const color = PROJECT_COLORS[p.id] ?? '#6366f1'
                  const active = filters.projectIds.length === 0 || filters.projectIds.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleProject(p.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all',
                        active ? 'border-current bg-surface-3' : 'border-border bg-surface-2 text-muted-foreground opacity-40'
                      )}
                      style={{ color: active ? color : undefined }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      {p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => onFiltersChange({
                  priorities: ['faible', 'moyenne', 'haute', 'critique'],
                  statuses: ['todo', 'in_progress', 'done'],
                  projectIds: [],
                })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bouton nouvelle tâche */}
      <button
        onClick={onNewTask}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Nouvelle tâche
      </button>
    </div>
  )
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}
