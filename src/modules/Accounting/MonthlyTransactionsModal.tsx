import { X, Plus, DollarSign } from 'lucide-react';
import type { AccountingEntry } from '../../hooks/useMonthlyAccounting';
import { useMonthlyTransactions } from './hooks/useMonthlyTransactions';
import { TransactionAddForm } from './components/monthly-transactions/TransactionAddForm';
import { TransactionItem } from './components/monthly-transactions/TransactionItem';
import { DeleteConfirmDialog } from './components/monthly-transactions/DeleteConfirmDialog';

interface MonthlyTransactionsModalProps {
  open: boolean;
  onClose: () => void;
  month: Date;
  accounting_entries: AccountingEntry[];
  onAdd: (entry: Omit<AccountingEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>;
  onUpdate: (id: string, updates: Partial<AccountingEntry>) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export function MonthlyTransactionsModal({
  open,
  onClose,
  month,
  accounting_entries,
  onAdd,
  onUpdate,
  onDelete,
  loading = false
}: MonthlyTransactionsModalProps) {
  const tx = useMonthlyTransactions({ month, onAdd, onUpdate, onDelete });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-2 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Transactions - {month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!tx.showAddForm && (
            <button
              onClick={() => tx.setShowAddForm(true)}
              className="mb-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une transaction</span>
            </button>
          )}

          {tx.showAddForm && (
            <TransactionAddForm
              formData={tx.formData}
              setFormData={tx.setFormData}
              onSubmit={tx.handleAdd}
              onCancel={() => { tx.setShowAddForm(false); tx.resetForm(); }}
              loading={loading}
            />
          )}

          <div className="space-y-4">
            {accounting_entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>Aucune transaction pour ce mois</p>
              </div>
            ) : (
              accounting_entries.map((entry) => (
                <TransactionItem
                  key={entry.id}
                  entry={entry}
                  isEditing={tx.editingId === entry.id}
                  editData={tx.editData}
                  setEditData={tx.setEditData}
                  onEdit={tx.handleEdit}
                  onSaveEdit={tx.handleSaveEdit}
                  onCancelEdit={tx.handleCancelEdit}
                  onDelete={(id) => tx.setDeleteConfirmId(id)}
                  loading={loading}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {tx.deleteConfirmId && (
        <DeleteConfirmDialog
          onConfirm={() => tx.handleDelete(tx.deleteConfirmId!)}
          onCancel={() => tx.setDeleteConfirmId(null)}
          loading={loading}
        />
      )}
    </div>
  );
}
