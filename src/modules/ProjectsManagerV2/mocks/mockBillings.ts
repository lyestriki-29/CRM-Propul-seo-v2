export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface MockInvoice {
  id: string
  project_id: string
  label: string
  amount: number
  status: InvoiceStatus
  date: string | null
  due_date: string | null
  notes: string | null
}

const d = (daysOffset: number): string => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString().split('T')[0]
}

export const MOCK_BILLINGS: Record<string, MockInvoice[]> = {
  'proj-001': [],
  'proj-002': [
    { id: 'inv-002a', project_id: 'proj-002', label: 'Acompte démarrage 30%', amount: 540, status: 'paid', date: d(-9), due_date: d(-9), notes: null },
  ],
  'proj-003': [
    { id: 'inv-003a', project_id: 'proj-003', label: 'Acompte 30% à la signature', amount: 5400, status: 'draft', date: null, due_date: d(5), notes: 'À envoyer après signature contrat' },
  ],
  'proj-004': [
    { id: 'inv-004a', project_id: 'proj-004', label: 'Acompte 30%', amount: 1560, status: 'paid', date: d(-20), due_date: d(-18), notes: null },
    { id: 'inv-004b', project_id: 'proj-004', label: 'Situation 50%', amount: 2600, status: 'sent', date: d(-2), due_date: d(15), notes: null },
    { id: 'inv-004c', project_id: 'proj-004', label: 'Solde 20%', amount: 1040, status: 'draft', date: null, due_date: null, notes: 'À émettre après recette client' },
  ],
  'proj-005': [
    { id: 'inv-005a', project_id: 'proj-005', label: 'Acompte 30%', amount: 6600, status: 'paid', date: d(-28), due_date: d(-25), notes: null },
    { id: 'inv-005b', project_id: 'proj-005', label: 'Situation 50% — Sprint 1 + 2', amount: 11000, status: 'sent', date: d(-3), due_date: d(14), notes: null },
    { id: 'inv-005c', project_id: 'proj-005', label: 'Solde 20%', amount: 4400, status: 'draft', date: null, due_date: null, notes: 'À émettre après recette finale' },
  ],
  'proj-006': [
    { id: 'inv-006a', project_id: 'proj-006', label: 'Acompte 30%', amount: 840, status: 'paid', date: d(-40), due_date: d(-38), notes: null },
    { id: 'inv-006b', project_id: 'proj-006', label: 'Situation 50%', amount: 1400, status: 'sent', date: d(-2), due_date: d(10), notes: null },
    { id: 'inv-006c', project_id: 'proj-006', label: 'Solde 20%', amount: 560, status: 'draft', date: null, due_date: null, notes: null },
  ],
  'proj-007': [
    { id: 'inv-007a', project_id: 'proj-007', label: 'Acompte 30%', amount: 1230, status: 'paid', date: d(-60), due_date: d(-58), notes: null },
    { id: 'inv-007b', project_id: 'proj-007', label: 'Situation 50%', amount: 2050, status: 'paid', date: d(-30), due_date: d(-28), notes: null },
    { id: 'inv-007c', project_id: 'proj-007', label: 'Solde 20%', amount: 820, status: 'paid', date: d(-15), due_date: d(-12), notes: null },
  ],
  'proj-008': [
    { id: 'inv-008a', project_id: 'proj-008', label: 'Maintenance mensuelle — mois 1', amount: 300, status: 'paid', date: d(-90), due_date: d(-88), notes: null },
    { id: 'inv-008b', project_id: 'proj-008', label: 'Maintenance mensuelle — mois 2', amount: 300, status: 'paid', date: d(-60), due_date: d(-58), notes: null },
    { id: 'inv-008c', project_id: 'proj-008', label: 'Maintenance mensuelle — mois 3', amount: 300, status: 'paid', date: d(-30), due_date: d(-28), notes: null },
    { id: 'inv-008d', project_id: 'proj-008', label: 'Maintenance mensuelle — mois 4', amount: 300, status: 'sent', date: d(-2), due_date: d(8), notes: null },
  ],
  'proj-009': [
    { id: 'inv-009a', project_id: 'proj-009', label: 'Acompte 30%', amount: 1950, status: 'paid', date: d(-14), due_date: d(-12), notes: null },
    { id: 'inv-009b', project_id: 'proj-009', label: 'Situation 50% (en attente)', amount: 3250, status: 'draft', date: null, due_date: null, notes: 'En pause — reprendre après retour client' },
  ],
  'proj-010': [
    { id: 'inv-010a', project_id: 'proj-010', label: 'Acompte 30%', amount: 2550, status: 'paid', date: d(-120), due_date: d(-118), notes: null },
    { id: 'inv-010b', project_id: 'proj-010', label: 'Situation 50%', amount: 4250, status: 'paid', date: d(-90), due_date: d(-88), notes: null },
    { id: 'inv-010c', project_id: 'proj-010', label: 'Solde 20%', amount: 1700, status: 'paid', date: d(-60), due_date: d(-58), notes: null },
  ],
}
