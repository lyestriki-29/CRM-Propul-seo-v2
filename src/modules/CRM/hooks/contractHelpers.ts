import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { ContactRow } from '../../../types/supabase-types';

export async function createProjectFromContact(
  contact: ContactRow,
  createProject: (data: any) => Promise<any>
) {
  try {
    console.log('Creation du projet pour le contact:', contact);
    const projectData = {
      name: `Projet - ${contact.company || contact.name}`,
      description: `Projet créé automatiquement depuis le contact signé: ${contact.company || contact.name}. Contact: ${contact.name} (${contact.email})`,
      status: 'planning',
      budget: null,
      progress: 0
    };
    console.log('Données du projet à créer:', projectData);
    const result = await createProject(projectData);
    console.log('Résultat de la création:', result);
    if (result.success) {
      toast.success(`Projet créé automatiquement pour ${contact.company || contact.name}`);
      if (contact.project_price && contact.project_price > 0) {
        console.log('Création automatique de l\'entrée comptable pour:', contact.project_price);
        try {
          const currentDate = new Date();
          const currentMonth = currentDate.toISOString().slice(0, 7) + '-01';
          const accountingEntry = {
            type: 'revenue',
            description: `Projet signé - ${contact.company || contact.name}`,
            amount: contact.project_price,
            category: 'projet_signé',
            entry_date: currentMonth,
            month_key: currentDate.toISOString().slice(0, 7)
          };
          console.log('Entrée comptable à créer:', accountingEntry);
          const { data: accountingData, error: accountingError } = await supabase
            .from('accounting_entries')
            .insert([accountingEntry])
            .select()
            .single();
          if (accountingError) {
            console.error('Erreur création entrée comptable:', accountingError);
            toast.error('Erreur lors de la création de l\'entrée comptable');
          } else {
            console.log('Entrée comptable créée avec succès:', accountingData);
            toast.success(`Entrée comptable de ${contact.project_price.toLocaleString('fr-FR')}€ créée automatiquement`);
          }
        } catch (accountingError) {
          console.error('Erreur lors de la création de l\'entrée comptable:', accountingError);
          toast.error('Erreur lors de la création de l\'entrée comptable');
        }
      } else {
        console.log('Pas de prix de projet, pas d\'entrée comptable créée');
      }
      return result.data;
    } else {
      console.error('Erreur création projet:', result.error);
      toast.error('Erreur lors de la création automatique du projet');
      return null;
    }
  } catch (error) {
    console.error('Error creating project from contact:', error);
    toast.error('Erreur lors de la création automatique du projet');
  }
}

export async function createProjectFromContactId(
  contactId: string,
  createProject: (data: any) => Promise<any>
) {
  try {
    console.log('Création du projet pour le contact ID:', contactId);
    const { data: contact, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    if (error) {
      console.error('Erreur récupération contact:', error);
      toast.error('Erreur lors de la récupération du contact');
      return;
    }
    if (!contact) {
      console.error('Contact non trouvé pour ID:', contactId);
      toast.error('Contact non trouvé');
      return;
    }
    console.log('Contact récupéré:', contact);
    return await createProjectFromContact(contact, createProject);
  } catch (error) {
    console.error('Error creating project from contact ID:', error);
    toast.error('Erreur lors de la création automatique du projet');
  }
}

export async function syncContactTasksToProject(contactId: string, projectId: string) {
  try {
    console.log('Synchronisation des tâches du contact vers le projet...');
    const { data: contactTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', contactId)
      .or('assigned_to.eq.' + contactId);
    if (tasksError) {
      console.error('Erreur récupération tâches contact:', tasksError);
      throw tasksError;
    }
    if (!contactTasks || contactTasks.length === 0) {
      console.log('Aucune tâche trouvée pour ce contact');
      return [];
    }
    console.log(`${contactTasks.length} tâches trouvées pour le contact`);
    const syncedTasks = [];
    for (const task of contactTasks) {
      try {
        const projectTaskData = {
          project_id: projectId,
          title: task.title,
          description: task.description || '',
          priority: task.priority || 'medium',
          completed: false,
          assigned_to: task.assigned_to,
          due_date: task.due_date
        };
        const { data: projectTask, error: projectTaskError } = await supabase
          .from('project_checklists')
          .insert([projectTaskData])
          .select()
          .single();
        if (projectTaskError) {
          console.error(`Erreur création tâche projet "${task.title}":`, projectTaskError);
        } else {
          syncedTasks.push(projectTask);
          console.log(`Tâche synchronisée: ${task.title}`);
        }
      } catch (error) {
        console.error(`Erreur synchronisation tâche "${task.title}":`, error);
      }
    }
    console.log(`${syncedTasks.length}/${contactTasks.length} tâches synchronisées avec succès !`);
    return syncedTasks;
  } catch (error) {
    console.error('Erreur synchronisation tâches contact vers projet:', error);
    throw error;
  }
}
