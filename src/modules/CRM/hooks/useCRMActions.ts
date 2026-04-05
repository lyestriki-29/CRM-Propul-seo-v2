import React from 'react';
import { ContactRow } from '../../../types/supabase-types';
import { ContactFormData } from '../types';
import { useCRMContactHandlers } from './useCRMContactHandlers';
import { useCRMStatusHandlers } from './useCRMStatusHandlers';
import { useContractActions } from './useContractActions';
import type { CRMData } from './useCRMData';

interface CRMActionsDeps {
  data: CRMData;
  contactForm: ContactFormData;
  setContactForm: React.Dispatch<React.SetStateAction<ContactFormData>>;
  selectedContact: ContactRow | null;
  setSelectedContact: (c: ContactRow | null) => void;
  setShowContactDetails: (v: boolean) => void;
  setContactDialogOpen: (v: boolean) => void;
  setEditContactDialogOpen: (v: boolean) => void;
}

export function useCRMActions(deps: CRMActionsDeps) {
  const { data } = deps;

  const contactHandlers = useCRMContactHandlers({
    contacts: data.contacts,
    createContact: data.createContact,
    updateContact: data.updateContact,
    refetchContacts: data.refetchContacts,
    refetchRevenue: data.refetchRevenue,
    contactForm: deps.contactForm,
    setContactForm: deps.setContactForm,
    selectedContact: deps.selectedContact,
    setSelectedContact: deps.setSelectedContact,
    setShowContactDetails: deps.setShowContactDetails,
    setContactDialogOpen: deps.setContactDialogOpen,
    setEditContactDialogOpen: deps.setEditContactDialogOpen,
  });

  const statusHandlers = useCRMStatusHandlers({
    contacts: data.contacts,
    projects: data.projects,
    accountingEntries: data.accountingEntries,
    updateContact: data.updateContact,
    deleteContact: data.deleteContact,
    deleteProject: data.deleteProject,
    refetchContacts: data.refetchContacts,
    refetchRevenue: data.refetchRevenue,
  });

  const contractActions = useContractActions({
    contacts: data.contacts,
    updateContact: data.updateContact,
    createProject: data.createProject,
    refetchContacts: data.refetchContacts,
    refetchRevenue: data.refetchRevenue,
  });

  return {
    ...contactHandlers,
    ...statusHandlers,
    ...contractActions,
  };
}
