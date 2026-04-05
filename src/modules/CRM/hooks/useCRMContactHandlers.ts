import React from 'react';
import { ContactRow } from '../../../types/supabase-types';
import { toast } from 'sonner';
import { ContactFormData, INITIAL_CONTACT_FORM, isValidStatus } from '../types';

interface ContactHandlersDeps {
  contacts: ContactRow[] | null;
  createContact: (data: any) => Promise<any>;
  updateContact: (id: string, data: any) => Promise<any>;
  refetchContacts: () => Promise<void>;
  refetchRevenue: () => Promise<void>;
  contactForm: ContactFormData;
  setContactForm: React.Dispatch<React.SetStateAction<ContactFormData>>;
  selectedContact: ContactRow | null;
  setSelectedContact: (c: ContactRow | null) => void;
  setShowContactDetails: (v: boolean) => void;
  setContactDialogOpen: (v: boolean) => void;
  setEditContactDialogOpen: (v: boolean) => void;
}

export function useCRMContactHandlers(deps: ContactHandlersDeps) {
  const {
    contacts, createContact, updateContact, refetchContacts, refetchRevenue,
    contactForm, setContactForm, selectedContact,
    setSelectedContact, setShowContactDetails, setContactDialogOpen, setEditContactDialogOpen
  } = deps;

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeStatus = isValidStatus(contactForm.status) ? contactForm.status : 'prospect';
    const result = await createContact({
      ...contactForm,
      status: safeStatus,
      website: contactForm.website || undefined,
      no_show: contactForm.no_show || 'Non'
    });
    if (result.success) {
      await refetchContacts();
      if (result.data && result.data.id) {
        const fresh = (contacts || []).find(c => c.id === result.data.id) || result.data;
        setSelectedContact(fresh);
        setShowContactDetails(true);
      }
      setContactForm({ ...INITIAL_CONTACT_FORM });
      setContactDialogOpen(false);
      await refetchRevenue();
      toast.success('Lead créé avec succès ! Redirection vers la fiche client...');
    } else {
      toast.error('Erreur lors de la création du lead');
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    console.log('handleUpdateContact appelé');
    console.log('selectedContact:', selectedContact);
    console.log('contactForm:', contactForm);
    const safeStatus = isValidStatus(contactForm.status) ? contactForm.status : 'prospect';
    const updateData = {
      name: contactForm.contact_name || '',
      company: contactForm.company_name || '',
      email: contactForm.email || '',
      phone: contactForm.phone || '',
      website: contactForm.website || undefined,
      status: safeStatus,
      project_price: contactForm.project_price && contactForm.project_price > 0
        ? Number(contactForm.project_price) : null,
      source: contactForm.source || 'website',
      notes: contactForm.notes || '',
      assigned_to: contactForm.assigned_to && contactForm.assigned_to.trim() !== ''
        ? contactForm.assigned_to : null,
      no_show: contactForm.no_show || 'Non'
    };
    console.log('updateData envoyé:', updateData);
    const result = await updateContact(selectedContact.id, updateData);
    console.log('result reçu:', result);
    if (result.success) {
      console.log('Mise à jour réussie');
      setContactForm({ ...INITIAL_CONTACT_FORM, status: 'presentation_envoyee' });
      setEditContactDialogOpen(false);
      setSelectedContact(null);
      refetchContacts();
      await refetchRevenue();
    } else {
      console.error('Échec de la mise à jour:', result.error);
    }
  };

  const handleEditContact = (contact: ContactRow) => {
    setSelectedContact(contact);
    setContactForm({
      company_name: contact.company || '',
      contact_name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      website: contact.website || '',
      status: contact.status || 'presentation_envoyee',
      project_price: contact.project_price || undefined,
      source: contact.source || 'website',
      notes: Array.isArray(contact.notes) ? contact.notes.join('\n') : (contact.notes || ''),
      assigned_to: contact.assigned_to || '',
      no_show: 'Non'
    });
    setEditContactDialogOpen(true);
  };

  return { handleCreateContact, handleUpdateContact, handleEditContact };
}
