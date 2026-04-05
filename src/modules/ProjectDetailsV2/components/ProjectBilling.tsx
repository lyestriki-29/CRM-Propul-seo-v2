import { useState } from 'react'
import { Receipt, TrendingUp, Plus, Pencil, Trash2, Check, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../lib/utils'
import { useBillingV2, type InvoiceV2 as MockInvoice, type InvoiceStatus } from '../../ProjectsManagerV2/hooks/useBillingV2'

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string }> = {
  draft:     { label: 'Brouillon',  color: 'bg-gray-500/20 text-gray-400' },
  sent:      { label: 'Envoyée',    color: 'bg-blue-500/20 text-blue-300' },
  paid:      { label: 'Payée',      color: 'bg-green-500/20 text-green-300' },
  overdue:   { label: 'En retard',  color: 'bg-red-500/20 text-red-300' },
  cancelled: { label: 'Annulée',    color: 'bg-gray-500/10 text-gray-500' },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as InvoiceStatus[]

const EMPTY_FORM = {
  label: '',
  amount: '',
  status: 'draft' as InvoiceStatus,
  date: '',
  due_date: '',
  notes: '',
}

interface ProjectBillingProps {
  projectId: string
}

export function ProjectBilling({ projectId }: ProjectBillingProps) {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, setInvoiceStatus } = useBillingV2(projectId)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const activeInvoices = invoices.filter(i => i.status !== 'cancelled')
  const total   = activeInvoices.reduce((s, i) => s + i.amount, 0)
  const paid    = activeInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const pending = total - paid

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (inv: MockInvoice) => {
    setEditingId(inv.id)
    setForm({
      label:    inv.label,
      amount:   String(inv.amount),
      status:   inv.status,
      date:     inv.date ?? '',
      due_date: inv.due_date ?? '',
      notes:    inv.notes ?? '',
    })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async () => {
    if (!form.label.trim()) { toast.error('Le libellé est requis'); return }
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) { toast.error('Montant invalide'); return }

    if (editingId) {
      await updateInvoice(editingId, {
        label: form.label.trim(), amount, status: form.status,
        date: form.date || null, due_date: form.due_date || null, notes: form.notes.trim() || null,
      })
      toast.success('Facture mise à jour')
    } else {
      await addInvoice({
        project_id: projectId, label: form.label.trim(), amount, status: form.status,
        date: form.date || null, due_date: form.due_date || null, notes: form.notes.trim() || null,
      })
      toast.success('Facture créée')
    }
    cancelForm()
  }

  const markPaid = async (id: string) => {
    await setInvoiceStatus(id, 'paid')
    toast.success('Facture marquée payée')
  }

  const confirmDelete = async (id: string) => {
    await deleteInvoice(id)
    setDeletingId(null)
    toast.success('Facture supprimée')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Facturation</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvelle facture
        </button>
      </div>

      {total > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total',    value: total,   color: 'text-foreground' },
              { label: 'Encaissé', value: paid,    color: 'text-green-400' },
              { label: 'Restant',  value: pending, color: pending > 0 ? 'text-orange-400' : 'text-muted-foreground' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-surface-2 border border-border rounded-lg p-3 text-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                <p className={`text-lg font-bold ${color}`}>{value.toLocaleString('fr-FR')} €</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-2 border border-border rounded-lg p-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Avancement facturation</span>
              <span>{Math.round((paid / total) * 100)}%</span>
            </div>
            <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(paid / total) * 100}%` }}
              />
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {editingId ? 'Modifier la facture' : 'Nouvelle facture'}
            </span>
            <button onClick={cancelForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Libellé <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="ex : Acompte 30%"
              className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Montant (€) <span className="text-red-400">*</span></label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0"
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Statut</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as InvoiceStatus }))}
                  className="w-full appearance-none bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Date d'émission</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Échéance</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Notes (optionnel)</label>
            <input
              type="text"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Conditions particulières..."
              className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={cancelForm} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors font-medium flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              {editingId ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {invoices.map(inv => {
          const conf = STATUS_CONFIG[inv.status]
          return (
            <div key={inv.id} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
              {deletingId === inv.id && (
                <div className="flex items-center justify-between bg-red-500/10 border-b border-red-500/20 px-4 py-2">
                  <span className="text-xs text-red-300">Supprimer cette facture ?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setDeletingId(null)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5">Non</button>
                    <button onClick={() => confirmDelete(inv.id)} className="text-xs text-red-300 hover:text-red-200 font-medium px-2 py-0.5 bg-red-500/20 rounded">Oui</button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{inv.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {inv.date && <span className="text-xs text-muted-foreground">{inv.date}</span>}
                    {inv.due_date && inv.status !== 'paid' && (
                      <span className="text-xs text-muted-foreground">échéance {inv.due_date}</span>
                    )}
                    {inv.notes && <span className="text-xs text-muted-foreground italic truncate">{inv.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-sm font-semibold text-foreground">{inv.amount.toLocaleString('fr-FR')} €</span>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded', conf.color)}>{conf.label}</span>
                  {inv.status === 'sent' && (
                    <button
                      onClick={() => markPaid(inv.id)}
                      title="Marquer payée"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => openEdit(inv)} className="text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeletingId(inv.id)} className="text-muted-foreground hover:text-red-400 transition-colors" title="Supprimer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {invoices.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Receipt className="h-10 w-10 opacity-30" />
          <p className="text-sm">Aucune facture pour ce projet.</p>
          <button onClick={openAdd} className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            Créer la première facture
          </button>
        </div>
      )}
    </div>
  )
}
