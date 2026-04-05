import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { Task, TaskFormData } from '../../../hooks/useTasks';

export function TaskForm({
  editingTask,
  formData,
  setFormData,
  loading,
  users,
  usersLoading,
  usersError,
  projects,
  projectsLoading,
  projectsError,
  onSubmit,
  onCancel,
  isMobile
}: {
  editingTask: Task | null;
  formData: TaskFormData;
  setFormData: (data: TaskFormData) => void;
  loading: boolean;
  users: any[] | undefined;
  usersLoading: boolean;
  usersError: string | null;
  projects: any[] | undefined;
  projectsLoading: boolean;
  projectsError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isMobile: boolean;
}) {
  const inputHeight = isMobile ? 'h-11' : '';
  const labelClass = isMobile ? 'text-sm font-medium mb-1.5 block' : '';

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        <div>
          <Label htmlFor="title" className={labelClass}>Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputHeight}
            required
          />
        </div>
        <div>
          <Label htmlFor="status" className={labelClass}>Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Task['status'] })}
          >
            <SelectTrigger className={inputHeight}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority" className={labelClass}>Priorité</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
          >
            <SelectTrigger className={inputHeight}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="due_date" className={labelClass}>Date limite</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date || ''}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className={inputHeight}
          />
        </div>
        <div>
          <Label htmlFor="assigned_to" className={labelClass}>Assignée à</Label>
          <Select
            value={formData.assigned_to || 'none'}
            onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
          >
            <SelectTrigger className={inputHeight}>
              <SelectValue placeholder="Sélectionner un utilisateur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun utilisateur assigné</SelectItem>
              {usersLoading ? (
                <SelectItem value="loading" disabled>Chargement des utilisateurs...</SelectItem>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-users" disabled>Aucun utilisateur disponible</SelectItem>
              )}
            </SelectContent>
          </Select>
          {usersError && (
            <p className="text-sm text-red-400 mt-1">Erreur chargement utilisateurs</p>
          )}
        </div>
        <div>
          <Label htmlFor="project_id" className={labelClass}>Projet</Label>
          <Select
            value={formData.project_id || 'none'}
            onValueChange={(value) => setFormData({ ...formData, project_id: value })}
          >
            <SelectTrigger className={inputHeight}>
              <SelectValue placeholder="Sélectionner un projet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun projet</SelectItem>
              {projectsLoading ? (
                <SelectItem value="loading" disabled>Chargement des projets...</SelectItem>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-projects" disabled>Aucun projet disponible</SelectItem>
              )}
            </SelectContent>
          </Select>
          {projectsError && (
            <p className="text-sm text-red-400 mt-1">Erreur chargement projets</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className={labelClass}>Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={isMobile ? 3 : 3}
        />
      </div>

      <div className={isMobile ? 'flex flex-col gap-2 pt-2' : 'flex gap-2'}>
        <Button
          type="submit"
          disabled={loading}
          className={isMobile ? 'w-full h-12 text-base' : ''}
        >
          {loading ? 'Chargement...' : editingTask ? 'Mettre à jour' : 'Créer'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className={isMobile ? 'w-full h-12 text-base' : ''}
        >
          Annuler
        </Button>
      </div>
    </form>
  );

  // On mobile, form is rendered inside BottomSheet (no Card wrapper needed)
  if (isMobile) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
