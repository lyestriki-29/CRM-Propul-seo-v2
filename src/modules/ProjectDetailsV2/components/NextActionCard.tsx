import { useState } from 'react'
import { CalendarClock, Pencil, Check, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { getActionDueColor } from '../../../utils/nextAction'
import type { ProjectV2 } from '../../../types/project-v2'

interface NextActionCardProps {
  project: ProjectV2
  onUpdate: (updates: { next_action_label: string | null; next_action_due: string | null }) => Promise<void>
}

export function NextActionCard({ project, onUpdate }: NextActionCardProps) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(project.next_action_label ?? '')
  const [due, setDue] = useState(project.next_action_due ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate({
      next_action_label: label.trim() || null,
      next_action_due: due || null,
    })
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setLabel(project.next_action_label ?? '')
    setDue(project.next_action_due ?? '')
    setEditing(false)
  }

  const colorClass = getActionDueColor(project.next_action_due)

  return (
    <Card className="bg-surface-2 border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            Prochaine action
          </CardTitle>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-1 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-2">
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Ex : Envoyer maquettes v2"
              className="w-full text-sm bg-surface-3 border border-border rounded px-2 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="date"
              value={due}
              onChange={e => setDue(e.target.value)}
              className="w-full text-sm bg-surface-3 border border-border rounded px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Check className="h-3 w-3" />
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />Annuler
              </button>
            </div>
          </div>
        ) : project.next_action_label ? (
          <div>
            <p className="text-sm text-foreground font-medium">{project.next_action_label}</p>
            {project.next_action_due && (
              <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
                {format(parseISO(project.next_action_due), 'd MMM yyyy', { locale: fr })}
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">— Aucune action définie</p>
        )}
      </CardContent>
    </Card>
  )
}
