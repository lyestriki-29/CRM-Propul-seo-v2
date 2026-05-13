import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ProjectV2, PrestaType, ProjectStatusV2 } from '@/types/project-v2'

interface Props {
  open: boolean
  users: { id: string; name: string }[]
  onClose: () => void
  onCreate: (
    data: Omit<ProjectV2, 'id' | 'created_at' | 'updated_at'>,
  ) => Promise<ProjectV2 | null>
}

interface FormState {
  name: string
  description: string
  presta_type: PrestaType[]
  status: ProjectStatusV2
  assigned_to: string
  budget: string
  start_date: string
  end_date: string
}

const EMPTY: FormState = {
  name: '',
  description: '',
  presta_type: [],
  status: 'brief_received',
  assigned_to: '',
  budget: '',
  start_date: '',
  end_date: '',
}

const PRESTA_TYPES: PrestaType[] = ['web', 'seo', 'erp', 'saas']

export function NewProjectModalV3({ open, users, onClose, onCreate }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  const togglePresta = (type: PrestaType) => {
    setForm(prev => ({
      ...prev,
      presta_type: prev.presta_type.includes(type)
        ? prev.presta_type.filter(t => t !== type)
        : [...prev.presta_type, type],
    }))
  }

  const handleClose = () => {
    if (saving) return
    setForm(EMPTY)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Le nom du projet est obligatoire')
      return
    }
    setSaving(true)
    const assignedUser = users.find(u => u.id === form.assigned_to)
    try {
      const res = await onCreate({
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: 'medium',
        presta_type: form.presta_type.length > 0 ? form.presta_type : ['web'],
        category: form.presta_type[0] ?? 'web',
        assigned_to: form.assigned_to || null,
        assigned_name: assignedUser?.name ?? null,
        budget: form.budget ? parseFloat(form.budget) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        progress: 0,
        is_archived: false,
      } as Omit<ProjectV2, 'id' | 'created_at' | 'updated_at'>)
      if (!res) {
        toast.error('La création du projet a échoué')
        return
      }
      toast.success(`Projet "${res.name}" créé`)
      setForm(EMPTY)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#070512] border border-[rgba(139,92,246,0.25)] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#ede9fe]">Nouveau projet</h3>
          <button
            type="button"
            onClick={handleClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#ede9fe] hover:bg-[rgba(139,92,246,0.15)] transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nom *">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
              placeholder="Nom du projet"
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Description rapide (optionnel)"
              className={inputCls}
            />
          </Field>

          <Field label="Type de prestation">
            <div className="flex gap-2 flex-wrap">
              {PRESTA_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => togglePresta(type)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium border transition-colors',
                    form.presta_type.includes(type)
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#A78BFA]'
                      : 'bg-[#0f0b1e] border-[rgba(139,92,246,0.2)] text-[#9ca3af] hover:border-[#8B5CF6]/50',
                  )}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Statut">
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as ProjectStatusV2 })}
                className={inputCls}
              >
                <option value="prospect">Prospect</option>
                <option value="brief_received">Brief reçu</option>
                <option value="quote_sent">Devis envoyé</option>
                <option value="in_progress">En cours</option>
                <option value="review">Recette</option>
                <option value="on_hold">En pause</option>
              </select>
            </Field>
            <Field label="Responsable">
              <select
                value={form.assigned_to}
                onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                className={inputCls}
              >
                <option value="">Non assigné</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Budget (€)">
              <input
                type="number"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                placeholder="0"
                className={inputCls}
              />
            </Field>
            <Field label="Échéance">
              <input
                type="date"
                value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-md text-sm text-[#9ca3af] bg-[#0f0b1e] border border-[rgba(139,92,246,0.2)] hover:bg-[#1a1430] transition-colors disabled:opacity-40"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#8B5CF6] hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
            >
              {saving ? 'Création…' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputCls =
  'w-full p-2 rounded-md text-sm bg-[#0f0b1e] border border-[rgba(139,92,246,0.2)] text-[#ede9fe] placeholder:text-[#6b7280] focus:outline-none focus:border-[#8B5CF6]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#9ca3af] mb-1">{label}</label>
      {children}
    </div>
  )
}
