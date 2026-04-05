import { ContactRow } from '../../../types/supabase-types';
import { toast } from 'sonner';
import { createProjectFromContact, createProjectFromContactId, syncContactTasksToProject } from './contractHelpers';

interface ContractActionsDeps {
  contacts: ContactRow[] | null;
  updateContact: (id: string, data: any) => Promise<any>;
  createProject: (data: any) => Promise<any>;
  refetchContacts: () => Promise<void>;
  refetchRevenue: () => Promise<void>;
}

export function useContractActions({
  contacts, updateContact, createProject, refetchContacts, refetchRevenue
}: ContractActionsDeps) {

  const handleSignContract = async (contactId: string) => {
    console.log('Signer le contrat appelé pour:', contactId);
    const result = await updateContact(contactId, { status: 'signe' });
    if (result.success) {
      refetchContacts();
      await refetchRevenue();
      console.log('Contact signé, création automatique du projet et entrée comptable...');
      await new Promise(resolve => setTimeout(resolve, 500));
      await refetchContacts();
      const contact = contacts?.find(c => c.id === contactId);
      console.log('Contact trouvé par ID:', contact);
      let projectId = null;
      if (contact) {
        console.log('Contact trouvé:', contact);
        const project = await createProjectFromContact(contact, createProject);
        projectId = project?.id;
      } else {
        console.log('Contact non trouvé pour ID:', contactId);
        console.log('Tous les contacts:', contacts);
        console.log('Tentative de récupération directe du contact...');
        const project = await createProjectFromContactId(contactId, createProject);
        projectId = project?.id;
      }
      if (projectId) {
        try {
          console.log('Synchronisation des tâches vers le projet...');
          const syncedTasks = await syncContactTasksToProject(contactId, projectId);
          if (syncedTasks.length > 0) {
            toast.success(`Projet créé et ${syncedTasks.length} tâches synchronisées !`);
          } else {
            toast.success('Projet créé avec succès !');
          }
        } catch (syncError) {
          console.error('Erreur synchronisation tâches:', syncError);
          toast.success('Projet créé, mais erreur lors de la synchronisation des tâches');
        }
      }
    } else {
      console.error('Erreur lors de la signature du contrat:', result.error);
    }
  };

  return { handleSignContract };
}
