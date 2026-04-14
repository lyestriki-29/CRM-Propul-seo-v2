import { Plus } from 'lucide-react'
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

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border flex-wrap bg-surface-1/50">
      {/* Navigation période */}
      {view !== 'project' && (
        <>
          <button onClick={onPrev} className="px-2.5 py-1.5 rounded-lg text-xs bg-surface-2 border border-border text-muted-foreground hover:text-foreground">←</button>
          <span className="text-xs font-semibold text-foreground px-1 capitalize">{periodLabel}</span>
          <button onClick={onNext} className="px-2.5 py-1.5 rounded-lg text-xs bg-surface-2 border border-border text-muted-foreground hover:text-foreground">→</button>
          <button onClick={onToday} className="px-2.5 py-1.5 rounded-lg text-xs bg-surface-2 border border-border text-muted-foreground hover:text-foreground">Auj.</button>
        </>
      )}
      {view === 'project' && <span className="text-xs font-semibold text-foreground capitalize">{periodLabel}</span>}

      <div className="w-px h-4 bg-border mx-1" />

      {/* Onglets de vue */}
      <div className="flex items-center gap-0.5 bg-surface-2 rounded-lg p-0.5">
        {(['project', 'month', 'week'] as CommTaskView[]).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              view === v ? 'bg-surface-3 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {v === 'project' ? '🗂️ Projets' : v === 'month' ? '📅 Mois' : '📋 Semaine'}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Filtres priorité */}
      {(['critique', 'haute', 'moyenne', 'faible'] as CommTaskPriority[]).map(p => (
        <button
          key={p}
          onClick={() => togglePriority(p)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
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

      <div className="w-px h-4 bg-border mx-1" />

      {/* Filtres statut */}
      {(['todo', 'in_progress', 'done'] as CommTaskStatus[]).map(s => (
        <button
          key={s}
          onClick={() => toggleStatus(s)}
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
            filters.statuses.includes(s)
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-border bg-surface-2 text-muted-foreground opacity-50'
          )}
        >
          {STATUS_CONFIG[s].label}
        </button>
      ))}

      <div className="w-px h-4 bg-border mx-1" />

      {/* Filtres projet */}
      {projects.slice(0, 5).map(p => {
        const color = PROJECT_COLORS[p.id] ?? '#6366f1'
        const active = filters.projectIds.length === 0 || filters.projectIds.includes(p.id)
        return (
          <button
            key={p.id}
            onClick={() => toggleProject(p.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
              active ? 'border-current bg-surface-3' : 'border-border bg-surface-2 text-muted-foreground opacity-40'
            )}
            style={{ color: active ? color : undefined }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {p.name.length > 8 ? p.name.slice(0, 8) + '…' : p.name}
          </button>
        )
      })}

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
