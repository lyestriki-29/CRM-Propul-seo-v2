import { ContactRow } from '../../../types/supabase-types';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

interface StatusHandlersDeps {
  contacts: ContactRow[] | null;
  projects: any[] | null;
  accountingEntries: any[] | null;
  updateContact: (id: string, data: any) => Promise<any>;
  deleteContact: (id: string) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  refetchContacts: () => Promise<void>;
  refetchRevenue: () => Promise<void>;
}

export function useCRMStatusHandlers(deps: StatusHandlersDeps) {
  const {
    contacts, projects, accountingEntries,
    updateContact, deleteContact, deleteProject,
    refetchContacts, refetchRevenue
  } = deps;

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    console.log('handleStatusChange appelé avec:', { contactId, newStatus });
    console.log('Contacts disponibles:', contacts);
    const result = await updateContact(contactId, { status: newStatus });
    console.log('Résultat updateContact:', result);
    if (result.success) {
      refetchContacts();
      await refetchRevenue();
      console.log('Statut mis à jour:', newStatus);
    } else {
      console.error('Erreur lors de la mise à jour du contact:', result.error);
    }
  };

  const forceRefreshContacts = async () => {
    console.log('Force refresh des contacts...');
    await new Promise(resolve => setTimeout(resolve, 100));
    await refetchContacts();
    await new Promise(resolve => setTimeout(resolve, 500));
    await refetchContacts();
    console.log('Force refresh terminé');
  };

  const handleAssignUser = async (contactId: string, userId: string) => {
    console.log('handleAssignUser appelé avec:', { contactId, userId });
    console.log('Contact ID:', contactId);
    console.log('User ID:', userId);
    console.log('Type de userId:', typeof userId);
    console.log('userId.trim():', userId?.trim());
    const assignedTo = userId && userId.trim() !== '' ? userId : null;
    console.log('assignedTo final:', assignedTo);
    console.log('Type de assignedTo:', typeof assignedTo);
    console.log('Appel de updateContact...');
    const result = await updateContact(contactId, { assigned_to: assignedTo });
    console.log('Résultat assignation:', result);
    console.log('Type de result:', typeof result);
    console.log('result.success:', result?.success);
    console.log('result.error:', result?.error);
    if (result.success) {
      toast.success(assignedTo ? 'Utilisateur assigné avec succès' : 'Assignation supprimée');
      console.log('Force refresh des contacts...');
      await forceRefreshContacts();
      console.log('Rechargement des revenus...');
      await refetchRevenue();
      console.log('Assignation mise à jour:', assignedTo);
      console.log('Contacts après rafraîchissement:', contacts);
    } else {
      const errorMsg = 'Erreur lors de l\'assignation: ' + (result.error || 'Erreur inconnue');
      console.error(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeleteContactCascade = async (contactId: string) => {
    try {
      const contact = contacts?.find(c => c.id === contactId);
      if (!contact) {
        toast.error('Contact non trouvé');
        return;
      }
      const projectsToDelete = projects?.filter(project =>
        project.name && project.name.includes(contact.company || contact.name)
      ) || [];
      for (const project of projectsToDelete) {
        await deleteProject(project.id);
      }
      const accountingEntriesToDelete = accountingEntries?.filter(entry =>
        entry.description && entry.description.includes(contact.company || contact.name)
      ) || [];
      for (const entry of accountingEntriesToDelete) {
        await supabase
          .from('accounting_entries')
          .delete()
          .eq('id', entry.id);
      }
      await deleteContact(contactId);
      toast.success('Contact et données associées supprimés');
      await refetchContacts();
      await refetchRevenue();
    } catch (error) {
      console.error('Erreur lors de la suppression en cascade:', error);
      toast.error('Erreur lors de la suppression en cascade');
    }
  };

  return {
    handleStatusChange, forceRefreshContacts,
    handleAssignUser, handleDeleteContactCascade,
  };
}
