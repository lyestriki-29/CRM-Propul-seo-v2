import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  WEB_PROJECT_TEMPLATE,
  type ProjectTemplate,
  type TemplateTask
} from '../projectTemplates';
import { useTemplateStorage } from '../../../hooks/useTemplateStorage';

interface UseTemplateEditorParams {
  onSave?: (template: ProjectTemplate) => void;
  onCancel?: () => void;
}

export function useTemplateEditor({ onSave }: UseTemplateEditorParams) {
  const { getDefaultTemplate, saveTemplate, resetDefaultTemplate } = useTemplateStorage();
  const [template, setTemplate] = useState<ProjectTemplate>(WEB_PROJECT_TEMPLATE);
  const [editingTask, setEditingTask] = useState<TemplateTask | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TemplateTask>>({
    title: '',
    description: '',
    category: 'Préparation',
    priority: 'medium',
    estimatedHours: 1
  });

  useEffect(() => {
    const savedTemplate = getDefaultTemplate();
    if (savedTemplate) {
      setTemplate(savedTemplate);
    }
  }, [getDefaultTemplate]);

  const groupedTasks = useMemo(() => {
    return template.tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, TemplateTask[]>);
  }, [template.tasks]);

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      category: 'Préparation',
      priority: 'medium',
      estimatedHours: 1
    });
  };

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.description) {
      toast.error('Le titre et la description sont obligatoires');
      return;
    }

    if (editingTask) {
      const updatedTasks = template.tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...newTask } as TemplateTask : task
      );
      setTemplate({ ...template, tasks: updatedTasks });
      setEditingTask(null);
      toast.success('Tâche modifiée avec succès');
    } else {
      const taskId = `task-${Date.now()}`;
      const newTaskComplete: TemplateTask = {
        id: taskId,
        title: newTask.title!,
        description: newTask.description!,
        category: newTask.category!,
        priority: newTask.priority as 'high' | 'medium' | 'low',
        estimatedHours: newTask.estimatedHours
      };
      setTemplate({ ...template, tasks: [...template.tasks, newTaskComplete] });
      setShowAddTask(false);
      toast.success('Tâche ajoutée avec succès');
    }

    resetNewTask();
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      const updatedTasks = template.tasks.filter(task => task.id !== taskId);
      setTemplate({ ...template, tasks: updatedTasks });
      toast.success('Tâche supprimée');
    }
  };

  const handleEditTask = (task: TemplateTask) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      estimatedHours: task.estimatedHours
    });
  };

  const handleSaveTemplate = () => {
    if (template.tasks.length === 0) {
      toast.error('Le template doit contenir au moins une tâche');
      return;
    }

    const success = saveTemplate(template);
    if (success) {
      onSave?.(template);
      toast.success('Template sauvegardé avec succès');
    } else {
      toast.error('Erreur lors de la sauvegarde du template');
    }
  };

  const handleResetTemplate = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le template aux valeurs par défaut ?')) {
      resetDefaultTemplate(WEB_PROJECT_TEMPLATE);
      setTemplate(WEB_PROJECT_TEMPLATE);
      toast.success('Template réinitialisé');
    }
  };

  const handleCancelForm = () => {
    setShowAddTask(false);
    setEditingTask(null);
    resetNewTask();
  };

  return {
    template,
    editingTask,
    showAddTask,
    setShowAddTask,
    newTask,
    setNewTask,
    groupedTasks,
    handleSaveTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveTemplate,
    handleResetTemplate,
    handleCancelForm
  };
}
