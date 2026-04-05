import React from 'react';
import { Save } from 'lucide-react';

interface TransactionAddFormProps {
  formData: {
    type: 'revenue' | 'expense';
    amount: string;
    description: string;
    category: string;
    entry_date: string;
    revenue_category: string;
    revenue_sous_categorie: string;
  };
  setFormData: (data: TransactionAddFormProps['formData']) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
}

export function TransactionAddForm({ formData, setFormData, onSubmit, onCancel, loading }: TransactionAddFormProps) {
  return (
    <div className="mb-6 p-4 border border-border rounded-lg">
      <h3 className="text-lg font-medium text-foreground mb-4">
        Nouvelle transaction
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'revenue' | 'expense' })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
            >
              <option value="revenue">Revenu</option>
              <option value="expense">Dépense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Montant (€) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
              placeholder="Description de la transaction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
            >
              <option value="services">Services</option>
              <option value="products">Produits</option>
              <option value="marketing">Marketing</option>
              <option value="office">Bureau</option>
              <option value="travel">Voyages</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.entry_date}
              onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
            />
          </div>

          {formData.type === 'revenue' && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Type de prestation
              </label>
              <select
                value={formData.revenue_category}
                onChange={(e) => setFormData({ ...formData, revenue_category: e.target.value, revenue_sous_categorie: '' })}
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
              >
                <option value="">-- Sélectionner --</option>
                <option value="site_internet">Site Internet</option>
                <option value="erp">ERP</option>
                <option value="communication">Communication</option>
              </select>
            </div>
          )}

          {formData.type === 'revenue' && formData.revenue_category === 'communication' && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Sous-catégorie
              </label>
              <select
                value={formData.revenue_sous_categorie}
                onChange={(e) => setFormData({ ...formData, revenue_sous_categorie: e.target.value })}
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
              >
                <option value="">-- Sélectionner --</option>
                <option value="chatbot">Chatbot</option>
                <option value="cm">Community Management</option>
                <option value="newsletter">Newsletter</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-surface-3 text-foreground px-4 py-2 rounded-lg hover:bg-surface-3"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
