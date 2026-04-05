import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  CheckSquare,
  Trash2,
  Edit2,
  Plus,
  Save,
  X
} from 'lucide-react';
import { useSupabaseProjects } from '../../hooks/useSupabaseData';
import { useProjectChecklists } from '../../hooks/useProjectChecklists';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface ProjectDetailsProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetails({ projectId, onBack }: ProjectDetailsProps) {
  const { data: projects } = useSupabaseProjects();
  const project = projects?.find(p => p.id === projectId);

  const {
    checklistItems,
    loading: checklistLoading,
    progress,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
  } = useProjectChecklists(projectId);

  const [activeTab, setActiveTab] = useState<'checklist' | 'progress'>('checklist');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
  });

  const handleAddChecklistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItem.trim()) return;

    await addChecklistItem({
      project_id: projectId,
      title: newChecklistItem,
      completed: false,
      priority: 'medium',
    });
    setNewChecklistItem('');
  };

  const handleStartEdit = (task: any) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      due_date: task.due_date || '',
    });
  };

  const handleSaveEdit = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('project_checklists')
        .update({
          title: editForm.title,
          description: editForm.description || null,
          priority: editForm.priority,
          due_date: editForm.due_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) {
        logger.error('Erreur mise a jour tache', 'ProjectDetails', { error: error.message });
        toast.error('Erreur lors de la mise a jour');
        return;
      }

      toast.success('Tache mise a jour');
      setEditingTask(null);
      window.location.reload();
    } catch (err) {
      logger.exception(err as Error, 'ProjectDetails');
      toast.error('Erreur inattendue');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  if (!project) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
        <p className="text-muted-foreground">Projet non trouvé.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-300',
      in_progress: 'bg-blue-500/20 text-blue-300',
      planning: 'bg-gray-500/20 text-gray-300',
      on_hold: 'bg-yellow-500/20 text-yellow-300',
    };
    const labels = {
      completed: 'Terminé',
      in_progress: 'En cours',
      planning: 'Planification',
      on_hold: 'En pause',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-300'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'checklist'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Checklist
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'progress'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Avancement
        </button>
      </div>

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {/* Add item form */}
          <form onSubmit={handleAddChecklistItem} className="flex gap-2">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Ajouter une tâche..."
              className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </form>

          {/* Progress bar */}
          <div className="bg-surface-2 rounded-lg p-4 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progression</span>
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist items */}
          {checklistLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : checklistItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Aucune tâche pour ce projet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-2 border border-border rounded-lg p-4"
                >
                  {editingTask === item.id ? (
                    /* Edit form */
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-3 border border-border rounded-md text-sm text-foreground"
                        placeholder="Titre de la tâche"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-3 border border-border rounded-md text-sm text-foreground resize-none"
                        placeholder="Description (optionnel)"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <select
                          value={editForm.priority}
                          onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                          className="flex-1 px-3 py-2 bg-surface-3 border border-border rounded-md text-sm text-foreground"
                        >
                          <option value="low">Basse</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Haute</option>
                        </select>
                        <input
                          type="date"
                          value={editForm.due_date}
                          onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                          className="flex-1 px-3 py-2 bg-surface-3 border border-border rounded-md text-sm text-foreground"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
                        >
                          <Save className="h-3.5 w-3.5" />
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-md text-sm text-muted-foreground hover:bg-surface-3"
                        >
                          <X className="h-3.5 w-3.5" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display mode */
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`mt-0.5 flex-shrink-0 ${item.completed ? 'text-green-400' : 'text-muted-foreground hover:text-primary'} transition-colors`}
                      >
                        {item.completed
                          ? <CheckCircle className="h-5 w-5" />
                          : <Clock className="h-5 w-5" />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.title}
                          </p>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteChecklistItem(item.id)}
                              className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {item.priority && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </span>
                          )}
                          {item.due_date && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {new Date(item.due_date).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="bg-surface-2 border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Progression globale</h3>
              <span className="text-2xl font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-4 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-2 border border-border rounded-xl p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Tâches terminées</h4>
              <div className="space-y-2">
                {checklistItems.filter(i => i.completed).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
                {checklistItems.filter(i => i.completed).length === 0 && (
                  <p className="text-xs text-muted-foreground">Aucune tâche terminée</p>
                )}
              </div>
            </div>

            <div className="bg-surface-2 border border-border rounded-xl p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">En cours</h4>
              <div className="space-y-2">
                {checklistItems.filter(i => !i.completed).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-yellow-400">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
                {checklistItems.filter(i => !i.completed).length === 0 && (
                  <p className="text-xs text-muted-foreground">Toutes les tâches sont terminées !</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
