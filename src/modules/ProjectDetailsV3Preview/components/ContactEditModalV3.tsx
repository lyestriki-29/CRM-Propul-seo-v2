import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { supabase, v2 } from '@/lib/supabase'
import { useContactsCRUD } from '@/hooks/supabase/useContactsCRUD'

interface ContactData {
  name: string
  email: string
  phone: string
  company: string
}

interface Props {
  /** ID du contact existant à éditer. Si null, on est en mode création + liaison. */
  contactId: string | null
  /** ID du projet pour lier le contact créé (mode création uniquement). */
  projectId: string
  /** Nom client suggéré comme valeur par défaut (mode création). */
  defaultClientName?: string | null
  onClose: () => void
  /** Appelée après save réussi. Le parent doit refetch. */
  onSaved: () => void | Promise<void>
}

export function ContactEditModalV3({ contactId, projectId, defaultClientName, onClose, onSaved }: Props) {
  const { createContact, updateContact } = useContactsCRUD()
  const [form, setForm] = useState<ContactData>({
    name: defaultClientName ?? '',
    email: '',
    phone: '',
    company: '',
  })
  const [loading, setLoading] = useState(contactId !== null)
  const [saving, setSaving] = useState(false)

  // Charger le contact existant en mode édition.
  // onClose volontairement absent des deps : il est inline dans le parent et changerait
  // à chaque render, ce qui re-déclencherait le fetch en boucle pendant la sauvegarde.
  useEffect(() => {
    if (!contactId) return
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('name, email, phone, company')
        .eq('id', contactId)
        .maybeSingle()
      if (cancelled) return
      if (error) {
        toast.error('Impossible de charger le contact')
        console.error('[contact-fetch]', error)
        onClose()
        return
      }
      if (data) {
        setForm({
          name: data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          company: data.company ?? '',
        })
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nom et email sont obligatoires')
      return
    }
    setSaving(true)
    try {
      if (contactId) {
        // Mode édition
        const res = await updateContact(contactId, {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
        })
        if (!res.success) return
      } else {
        // Mode création + liaison au projet
        const res = await createContact({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
        })
        if (!res.success || !res.data) return
        const { error: linkErr } = await v2
          .from('projects')
          .update({ client_id: res.data.id, client_name: res.data.name })
          .eq('id', projectId)
        if (linkErr) {
          // Rollback : on supprime le contact orphelin pour préserver l'intégrité.
          await supabase.from('contacts').delete().eq('id', res.data.id)
          toast.error('Impossible de lier le contact au projet — aucune donnée créée')
          console.error('[link-contact]', linkErr)
          return
        }
        // createContact toaste déjà "Contact créé avec succès" — pas de double toast.
      }
      await onSaved()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      data-state="open"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#070512] border border-[rgba(139,92,246,0.25)] rounded-xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#ede9fe]">
            {contactId ? 'Modifier le contact' : 'Ajouter un contact'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#ede9fe] hover:bg-[rgba(139,92,246,0.15)] transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-[#9ca3af] py-8 text-center">Chargement…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nom *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Email *">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Téléphone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Entreprise">
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls}
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
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
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}
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
