// src/modules/DashboardV2/components/BriefNotificationsModal.tsx
import { useState } from 'react'
import { Mail, Plus, Trash2, Power, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useNotificationEmails } from '../hooks/useNotificationEmails'

interface BriefNotificationsModalProps {
  open: boolean
  onClose: () => void
}

export function BriefNotificationsModal({ open, onClose }: BriefNotificationsModalProps) {
  const { emails, loading, addEmail, toggleEmail, deleteEmail } = useNotificationEmails()
  const [newEmail, setNewEmail] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newEmail.trim()) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail.trim())) {
      setError('Adresse email invalide.')
      return
    }
    setAdding(true)
    setError(null)
    const ok = await addEmail(newEmail, newLabel)
    setAdding(false)
    if (ok) {
      setNewEmail('')
      setNewLabel('')
    } else {
      setError('Cette adresse est déjà enregistrée ou une erreur est survenue.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Mail className="w-4 h-4 text-indigo-500" />
            Notifications brief
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Adresse fixe */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Adresse principale
            </p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium text-indigo-700 flex-1">team@propulseo-site.com</span>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">
                Toujours notifié
              </span>
            </div>
          </div>

          {/* Emails supplémentaires */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Destinataires supplémentaires
            </p>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Chargement…
              </div>
            ) : emails.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">Aucun destinataire supplémentaire.</p>
            ) : (
              <div className="space-y-2">
                {emails.map(e => (
                  <div
                    key={e.id}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors ${
                      e.active
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50 border-slate-100 opacity-60'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{e.email}</p>
                      {e.label && (
                        <p className="text-[10px] text-slate-400">{e.label}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleEmail(e.id, !e.active)}
                      className={`p-1 rounded-lg transition-colors ${
                        e.active
                          ? 'text-emerald-500 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={e.active ? 'Désactiver' : 'Activer'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEmail(e.id)}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulaire ajout */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Ajouter un destinataire
            </p>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="email@exemple.fr"
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Nom / libellé (optionnel)"
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <button
              onClick={handleAdd}
              disabled={adding || !newEmail.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              {adding
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Plus className="w-3.5 h-3.5" />
              }
              Ajouter
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
