import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { ContactFormData } from '../../types';

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  contactForm: ContactFormData;
  setContactForm: React.Dispatch<React.SetStateAction<ContactFormData>>;
  crmUsers: Array<{ id: string; name: string }>;
  usersLoading: boolean;
  crudLoading: boolean;
  mode: 'create' | 'edit';
}

export function LeadModal({
  open, onOpenChange, onSubmit, contactForm, setContactForm,
  crmUsers, usersLoading, crudLoading, mode
}: LeadModalProps) {
  const prefix = mode === 'edit' ? 'edit_' : '';
  const title = mode === 'create' ? 'Nouveau Contact' : 'Modifier le Contact';
  const submitText = mode === 'create' ? 'Créer le contact' : 'Modifier le contact';
  const loadingText = mode === 'create' ? 'Création...' : 'Modification...';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${prefix}company_name`} className="text-foreground">Nom de l'entreprise *</Label>
              <Input id={`${prefix}company_name`} value={contactForm.company_name} onChange={(e) => setContactForm(prev => ({ ...prev, company_name: e.target.value }))} placeholder="Nom de l'entreprise" required className="bg-background text-foreground border-input placeholder:text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor={`${prefix}contact_name`} className="text-foreground">Nom du contact *</Label>
              <Input id={`${prefix}contact_name`} value={contactForm.contact_name} onChange={(e) => setContactForm(prev => ({ ...prev, contact_name: e.target.value }))} placeholder="Jean Dupont" required className="bg-background text-foreground border-input placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${prefix}email`} className="text-foreground">Email *</Label>
              <Input id={`${prefix}email`} type="email" value={contactForm.email} onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))} placeholder="jean@exemple.com" required className="bg-background text-foreground border-input placeholder:text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor={`${prefix}phone`} className="text-foreground">Téléphone</Label>
              <Input id={`${prefix}phone`} value={contactForm.phone} onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="01 23 45 67 89" className="bg-background text-foreground border-input placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${prefix}website`} className="text-foreground">Site Web</Label>
              <Input id={`${prefix}website`} value={contactForm.website} onChange={(e) => setContactForm(prev => ({ ...prev, website: e.target.value }))} placeholder="https://www.exemple.com" className="bg-background text-foreground border-input placeholder:text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor={`${prefix}status`} className="text-foreground">Statut</Label>
              <select id={`${prefix}status`} value={contactForm.no_show === 'Oui' ? '__no_show__' : (contactForm.status || 'prospect')} onChange={(e) => { const value = e.target.value; setContactForm(prev => value === '__no_show__' ? { ...prev, no_show: 'Oui' } : { ...prev, status: value, no_show: 'Non' }); }} className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="prospect">Prospect</option>
                <option value="presentation_envoyee">Présentation Envoyée</option>
                <option value="meeting_booke">Meeting Booké</option>
                <option value="offre_envoyee">Offre Envoyée</option>
                <option value="en_attente">En Attente</option>
                <option value="signe">Signé</option>
                <option value="__no_show__">No Show</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${prefix}project_price`} className="text-foreground">Prix du projet (€)</Label>
              <Input id={`${prefix}project_price`} type="number" min="0" step="0.01" value={contactForm.project_price || ''} onChange={(e) => setContactForm(prev => ({ ...prev, project_price: e.target.value ? parseFloat(e.target.value) : undefined }))} placeholder="5000" className="bg-background text-foreground border-input placeholder:text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor={`${prefix}assigned_to`} className="text-foreground">Assigné à</Label>
              <select id={`${prefix}assigned_to`} value={contactForm.assigned_to} onChange={(e) => setContactForm(prev => ({ ...prev, assigned_to: e.target.value }))} className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Aucun</option>
                {crmUsers.length > 0 ? (
                  crmUsers.map(user => (<option key={user.id} value={user.id}>{user.name}</option>))
                ) : (
                  <option value="" disabled>{usersLoading ? 'Chargement...' : 'Aucun utilisateur disponible'}</option>
                )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${prefix}no_show`} className="text-foreground">No Show</Label>
              <select id={`${prefix}no_show`} value={contactForm.no_show} onChange={(e) => setContactForm(prev => ({ ...prev, no_show: e.target.value }))} className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="Non">Non</option>
                <option value="Oui">Oui</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={crudLoading} className="bg-primary hover:bg-primary/90 text-white">{crudLoading ? loadingText : submitText}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
