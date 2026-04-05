import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTasks, Task, TaskFormData } from '../../../hooks/useTasks';
import { useUsers } from '../../../hooks/useUsers';
import { useProjects } from '../../../hooks/useProjects';
import { useTasksCRUD } from '../../../hooks/useSupabaseData';

export function useTaskManagerData() {
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    updateTask,
    deleteTask,
    completeTask,
    clearError: clearTasksError,
    loadTasks
  } = useTasks();

  const { createTask } = useTasksCRUD();

  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();

  const loading = tasksLoading || usersLoading || projectsLoading;
  const error = tasksError || usersError || projectsError;

  const clearError = () => {
    clearTasksError();
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    assigned_to: 'none',
    project_id: 'none'
  });

  const filteredTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: '',
      assigned_to: '',
      project_id: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Le titre est obligatoire');
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData as any);
        toast.success('Tâche mise à jour avec succès !');
        setEditingTask(null);
      } else {
        const result = await createTask(formData as any);
        if (result.success) {
          toast.success('Tâche créée avec succès !');
          resetForm();
          await loadTasks();
        } else {
          toast.error(result.error || 'Erreur lors de la création');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'opération: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || '',
      assigned_to: task.assigned_to || 'none',
      project_id: task.project_id || 'none'
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask(taskId);
        toast.success('Tâche supprimée avec succès !');
      } catch (error) {
        console.error('Erreur suppression:', error);
        toast.error('Erreur lors de la suppression: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
      }
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
      toast.success('Tâche marquée comme terminée avec succès !');
    } catch (error) {
      console.error('Erreur marquage comme terminée:', error);
      toast.error('Erreur lors du marquage comme terminée: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    resetForm();
    setShowCreateForm(false);
  };

  const getTasksForUser = (userId: string) => {
    return filteredTasks.filter(task => task.assigned_to === userId);
  };

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    clearError,
    users,
    usersLoading,
    usersError,
    projects,
    projectsLoading,
    projectsError,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    showCreateForm,
    setShowCreateForm,
    editingTask,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleComplete,
    handleCancelEdit,
    getTasksForUser,
  };
}
