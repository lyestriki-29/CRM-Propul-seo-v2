import { useState } from 'react'
import { CheckSquare, AlertTriangle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Skeleton } from '../../../../components/ui/skeleton'
import { useTasksCRUD } from '../../../../hooks/useSupabaseData'
import { cn } from '../../../../lib/utils'

interface Task {
  id: string
  title: string
  priority?: string
  status: string
  deadline?: string | null
  assigned_to?: string | null
}

interface QuickTasksWidgetProps {
  tasks: Task[]
  loading: boolean
}

export function QuickTasksWidget({ tasks, loading }: QuickTasksWidgetProps) {
  const { updateTask } = useTasksCRUD()
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const handleCheck = async (task: Task) => {
    if (doneIds.has(task.id) || pendingIds.has(task.id)) return

    // Optimistic update
    setDoneIds(prev => new Set(prev).add(task.id))
    setPendingIds(prev => new Set(prev).add(task.id))

    const result = await updateTask(task.id, { status: 'done' })

    setPendingIds(prev => {
      const next = new Set(prev)
      next.delete(task.id)
      return next
    })

    if (!result.success) {
      // Rollback
      setDoneIds(prev => {
        const next = new Set(prev)
        next.delete(task.id)
        return next
      })
      toast.error('Erreur lors de la mise à jour de la tâche')
    }
  }

  if (loading) return <Skeleton className="h-40 rounded-2xl" />

  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <CheckSquare className="h-4 w-4 text-green-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Tâches du jour</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {tasks.filter(t => !doneIds.has(t.id)).length} restante(s)
        </span>
      </div>

      {tasks.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">Aucune tâche pour aujourd'hui</p>
      )}

      <div className="space-y-2">
        {tasks.map(task => {
          const isDone = doneIds.has(task.id) || task.status === 'done'
          const isPending = pendingIds.has(task.id)

          return (
            <div
              key={task.id}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-xl border transition-all',
                isDone
                  ? 'bg-surface-1/20 border-border/20 opacity-50'
                  : 'bg-surface-1/50 border-border/30 hover:border-border'
              )}
            >
              <Checkbox
                checked={isDone}
                onCheckedChange={() => handleCheck(task)}
                disabled={isPending || isDone}
                className="shrink-0"
              />
              <span className={cn(
                'text-xs flex-1 text-white',
                isDone && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </span>
              {task.priority === 'urgent' && !isDone && (
                <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
              )}
              {isPending && (
                <RefreshCw className="h-3 w-3 text-muted-foreground animate-spin shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
