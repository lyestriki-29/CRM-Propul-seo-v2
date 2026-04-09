import React, { useState } from 'react'
import { Plus, CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react'
import { useMockCommCycles } from '../hooks/useMockCommCycles'
import type { CommMonthlyCycle } from '../../../types/project-v2'
import { cn } from '../../../lib/utils'

interface Props { projectId: string }

export function CommMonthlyCycles({ projectId }: Props) {
  const { cycles, tasks, addCycle, toggleTask, addTask } = useMockCommCycles(projectId)
  const [expanded, setExpanded] = useState<string | null>(cycles[cycles.length - 1]?.id ?? null)
  const [newTaskInput, setNewTaskInput] = useState<Record<string, string>>({})

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Suivi mensuel</h3>
        <button
          onClick={addCycle}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouveau mois
        </button>
      </div>

      {cycles.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun cycle — cliquez sur "Nouveau mois" pour démarrer.
        </p>
      )}

      {[...cycles].reverse().map((cycle: CommMonthlyCycle) => {
        const cycleTasks = tasks[cycle.id] ?? []
        const doneCount = cycleTasks.filter(t => t.done).length
        const isExpanded = expanded === cycle.id
        const isPast = cycle.status === 'termine'

        return (
          <div key={cycle.id} className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setExpanded(isExpanded ? null : cycle.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-surface-2 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                {isExpanded
                  ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium text-foreground">{cycle.label}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  isPast ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                )}>
                  {isPast ? 'Terminé' : 'En cours'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{doneCount}/{cycleTasks.length}</span>
            </button>

            {/* Tasks */}
            {isExpanded && (
              <div className="border-t border-border p-3 space-y-1.5">
                {cycleTasks.map(task => (
                  <div
                    key={task.id}
                    className={cn('flex items-center gap-2 group', isPast && 'pointer-events-none opacity-60')}
                  >
                    <button onClick={() => toggleTask(cycle.id, task.id)} className="shrink-0">
                      {task.done
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                        : <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                    </button>
                    <span className={cn('text-sm text-foreground', task.done && 'line-through text-muted-foreground')}>
                      {task.title}
                    </span>
                  </div>
                ))}

                {/* Ajouter étape custom */}
                {!isPast && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                    <input
                      type="text"
                      value={newTaskInput[cycle.id] ?? ''}
                      onChange={e => setNewTaskInput(prev => ({ ...prev, [cycle.id]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newTaskInput[cycle.id]?.trim()) {
                          addTask(cycle.id, newTaskInput[cycle.id].trim())
                          setNewTaskInput(prev => ({ ...prev, [cycle.id]: '' }))
                        }
                      }}
                      placeholder="Ajouter une étape…"
                      className="flex-1 p-1.5 text-xs border border-border rounded-md bg-surface-2 text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={() => {
                        if (newTaskInput[cycle.id]?.trim()) {
                          addTask(cycle.id, newTaskInput[cycle.id].trim())
                          setNewTaskInput(prev => ({ ...prev, [cycle.id]: '' }))
                        }
                      }}
                      className="px-2 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
