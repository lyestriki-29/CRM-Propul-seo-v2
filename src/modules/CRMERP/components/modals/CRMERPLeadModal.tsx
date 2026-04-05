import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CRMERP_STATUSES, CRMERP_STATUS_LABELS, INITIAL_LEAD_FORM } from '../../types';
import type { CRMERPLeadFormData, CRMERPLead } from '../../types';

interface User { id: string; name: string; email: string }

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CRMERPLeadFormData) => Promise<void>;
  lead?: CRMERPLead | null;
  users: User[];
}

export function CRMERPLeadModal({ open, onClose, onSubmit, lead, users }: Props) {
  const [form, setForm] = useState<CRMERPLeadFormData>(INITIAL_LEAD_FORM);
  const [saving, setSaving] = useState(false);
  const isEdit = !!lead;

  useEffect(() => {
    if (lead) {
      setForm({
        company_name: lead.company_name ?? '',
        contact_name: lead.contact_name ?? '',
        email: lead.email ?? '',
        phone: lead.phone ?? '',
        source: lead.source ?? '',
        status: lead.status,
        assignee_id: lead.assignee_id ?? '',
        notes: lead.notes ?? '',
      });
    } else {
      setForm(INITIAL_LEAD_FORM);
    }
  }, [lead, open]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      console.error('Erreur sauvegarde lead:', e);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof CRMERPLeadFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le lead' : 'Nouveau lead ERP'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Entreprise</Label>
              <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="Nom entreprise" />
            </div>
            <div>
              <Label>Contact</Label>
              <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} placeholder="Nom du contact" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="06 12 34 56 78" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Source</Label>
              <Input value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="Site web, salon, LinkedIn..." />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRMERP_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{CRMERP_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Assigné à</Label>
            <Select value={form.assignee_id || 'none'} onValueChange={(v) => set('assignee_id', v === 'none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Non assigné" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Non assigné</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notes sur le lead..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
