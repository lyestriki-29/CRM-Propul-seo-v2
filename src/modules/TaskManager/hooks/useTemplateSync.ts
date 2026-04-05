import { useState } from 'react';
import { toast } from 'sonner';
import { useSupabaseProjects } from '../../../hooks/useSupabaseData';
import { useTemplateStorage } from '../../../hooks/useTemplateStorage';
import { createTasksFromTemplate } from '../projectTemplates';
import { supabase } from '../../../lib/supabase';

interface UseTemplateSyncParams {
  onClose: () => void;
  onSyncComplete?: () => void;
}

export function useTemplateSync({ onClose, onSyncComplete }: UseTemplateSyncParams) {
  const { data: projects, loading: projectsLoading } = useSupabaseProjects();
  const { getDefaultTemplate } = useTemplateStorage();
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const currentTemplate = getDefaultTemplate();

  const projectsWithoutTemplate = projects?.filter(project => {
    return project.status !== 'completed';
  }) || [];

  const handleProjectToggle = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === projectsWithoutTemplate.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projectsWithoutTemplate.map(p => p.id)));
    }
  };

  const handleSync = async () => {
    if (!currentTemplate || selectedProjects.size === 0) {
      toast.error('Veuillez sélectionner au moins un projet');
      return;
    }

    setSyncing(true);
    setSyncProgress(0);

    try {
      const selectedProjectsList = projectsWithoutTemplate.filter(p =>
        selectedProjects.has(p.id)
      );

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < selectedProjectsList.length; i++) {
        const project = selectedProjectsList[i];
        setSyncProgress((i / selectedProjectsList.length) * 100);

        try {
          const { data: existingTasks } = await supabase
            .from('tasks')
            .select('id')
            .eq('project_id', project.id)
            .limit(1);

          if (existingTasks && existingTasks.length > 0) {
            console.log(`Projet ${project.name} a déjà des tâches, ignoré`);
            continue;
          }

          const tasksToCreate = createTasksFromTemplate(project.id, project.name, currentTemplate);

          const { error } = await supabase
            .from('tasks')
            .insert(tasksToCreate);

          if (error) {
            console.error(`Erreur pour le projet ${project.name}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`Erreur pour le projet ${project.name}:`, error);
          errorCount++;
        }
      }

      setSyncProgress(100);

      if (successCount > 0) {
        toast.success(`${successCount} projet(s) synchronisé(s) avec succès`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} projet(s) ont rencontré des erreurs`);
      }

      onSyncComplete?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      toast.error('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
      setSyncProgress(0);
    }
  };

  return {
    currentTemplate,
    projectsLoading,
    projectsWithoutTemplate,
    selectedProjects,
    syncing,
    syncProgress,
    handleProjectToggle,
    handleSelectAll,
    handleSync
  };
}
