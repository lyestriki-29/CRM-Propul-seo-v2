import { Receipt, TrendingUp, AlertCircle } from 'lucide-react'

const MOCK_INVOICES = [
  { id: 'inv-001', label: 'Acompte 30%', amount: 6600,  status: 'paid',    date: '2026-03-05' },
  { id: 'inv-002', label: 'Situation 50%', amount: 11000, status: 'sent',    date: '2026-04-01' },
  { id: 'inv-003', label: 'Solde 20%',  amount: 4400,  status: 'draft',   date: null },
]

const STATUS_CONFIG = {
  draft:    { label: 'Brouillon', color: 'bg-gray-500/20 text-gray-400' },
  sent:     { label: 'Envoyée',   color: 'bg-blue-500/20 text-blue-300' },
  paid:     { label: 'Payée',     color: 'bg-green-500/20 text-green-300' },
  overdue:  { label: 'En retard', color: 'bg-red-500/20 text-red-300' },
}

export function ProjectBilling() {
  const total   = MOCK_INVOICES.reduce((s, i) => s + i.amount, 0)
  const paid    = MOCK_INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const pending = total - paid

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Facturation</h3>

      {/* Métriques */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',     value: total,   color: 'text-foreground' },
          { label: 'Encaissé',  value: paid,    color: 'text-green-400' },
          { label: 'Restant',   value: pending, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface-2 border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className={`text-lg font-bold ${color}`}>{value.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Barre de paiement */}
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

      {/* Liste des factures */}
      <div className="space-y-2">
        {MOCK_INVOICES.map(inv => {
          const conf = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG]
          return (
            <div key={inv.id} className="flex items-center justify-between bg-surface-2 border border-border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{inv.label}</p>
                {inv.date && (
                  <p className="text-xs text-muted-foreground">{inv.date}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {inv.amount.toLocaleString('fr-FR')} €
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${conf.color}`}>
                  {conf.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-2 border border-border rounded-lg p-3">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Connexion avec le module Comptabilité — Sprint 4
      </div>
    </div>
  )
}
