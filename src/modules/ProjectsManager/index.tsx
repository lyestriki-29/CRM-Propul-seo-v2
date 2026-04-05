import React, { useState, useMemo } from 'react';
import { Plus, Briefcase, ChevronRight, Users } from 'lucide-react';
import { useSupabaseProjects, useSupabaseUsers } from '../../hooks/useSupabaseData';
import { useProjectsCRUD } from '../../hooks/useSupabaseData';
import { EmptyState } from '../../components/common/EmptyState';
import { toast } from 'sonner';
import { ProjectEditDialog } from '../../components/dialogs/ProjectEditDialog';
import { ProjectDetails } from '../ProjectDetails';
import { ProjectKanban } from './components/ProjectKanban';
import { Badge } from '../../components/ui/badge';
import { NativeSelect } from '../../components/ui/native-select';
import { ProjectRow } from '../../types/supabase-types';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { MobileHeader } from '../../components/mobile/MobileHeader';
import { FAB } from '../../components/mobile/FAB';
import { cn } from '../../lib/utils';

export function ProjectsManager() {
  const { data: projects, loading, refetch } = useSupabaseProjects();
  const { data: users } = useSupabaseUsers();
  const { createProject, deleteProject, loading: crudLoading } = useProjectsCRUD();
  const isMobile = useIsMobile();

  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    status: 'planning',
    budget: '',
    start_date: '',
    end_date: '',
    assigned_to: ''
  });

  // Build user map for display
  const userMap = useMemo(() => {
    const map: Record<string, string> = {};
    users?.forEach(u => { map[u.id] = u.name; });
    return map;
  }, [users]);

  // Filter out completed projects (they are in the dedicated page) + apply assigned_to filter
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => {
      if (p.status === 'completed') return false;
      if (assignedFilter !== 'all' && p.assigned_to !== assignedFilter) return false;
      return true;
    });
  }, [projects, assignedFilter]);

  // Handle add project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProjectData.name || !newProjectData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const result = await createProject({
        name: newProjectData.name,
        description: newProjectData.description,
        status: newProjectData.status,
        budget: newProjectData.budget ? parseFloat(newProjectData.budget) : null,
        start_date: newProjectData.start_date || null,
        end_date: newProjectData.end_date || null,
        assigned_to: newProjectData.assigned_to || null
      });

      if (result.success) {
        toast.success('Projet cree avec succes');
        setShowAddProject(false);
        setNewProjectData({
          name: '',
          description: '',
          status: 'planning',
          budget: '',
          start_date: '',
          end_date: '',
          assigned_to: ''
        });
        refetch();
      } else {
        toast.error(result.error || 'Erreur lors de la creation');
      }
    } catch (error) {
      toast.error('Erreur lors de la creation du projet');
    }
  };

  // Project actions
  const handleViewProject = (project: ProjectRow) => {
    setSelectedProjectId(project.id);
    setShowProjectDetails(true);
  };

  const handleEditProject = (project: ProjectRow) => {
    setSelectedProject(project);
    setShowEditProject(true);
  };

  const handleDeleteProject = async (project: ProjectRow) => {
    if (confirm('Etes-vous sur de vouloir supprimer ce projet ?')) {
      try {
        const result = await deleteProject(project.id);
        if (result.success) {
          toast.success('Projet supprime');
          refetch();
        } else {
          toast.error(result.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleBackToList = () => {
    setShowProjectDetails(false);
    setSelectedProjectId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show project details if selected
  if (showProjectDetails && selectedProjectId) {
    return (
      <ProjectDetails
        projectId={selectedProjectId}
        onBack={handleBackToList}
      />
    );
  }

  // Status labels for display
  const statusLabels: Record<string, string> = {
    planning: 'Planification',
    in_progress: 'En cours',
    on_hold: 'En pause'
  };

  // Status colors for badges
  const statusColors: Record<string, string> = {
    planning: 'bg-primary/20 text-primary',
    in_progress: 'bg-yellow-100 text-yellow-800',
    on_hold: 'bg-surface-2 text-muted-foreground'
  };

  return (
    <div className={cn(
      "min-h-screen",
      isMobile ? "pb-20" : "p-6 space-y-6"
    )}>
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader title="Projets" />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Gestion de Projets</h1>
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Projet</span>
          </button>
        </div>
      )}

      {/* Mobile Project List */}
      {isMobile && (
        <div className="p-4 space-y-3">
          {/* Stats summary */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(statusLabels).map(([status, label]) => {
              const count = filteredProjects.filter(p => p.status === status || (status === 'on_hold' && p.status === 'paused')).length;
              return (
                <div
                  key={status}
                  className={cn(
                    "flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[100px]",
                    statusColors[status]
                  )}
                >
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs">{label}</div>
                </div>
              );
            })}
          </div>

          {/* Project list */}
          <div className="space-y-2">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => handleViewProject(project)}
                className="glass-card rounded-lg p-4 active:bg-surface-3/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description || 'Aucune description'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full",
                        statusColors[project.status || 'planning']
                      )}>
                        {statusLabels[project.status || 'planning']}
                      </span>
                      {project.budget && (
                        <span className="text-xs text-muted-foreground">
                          {project.budget.toLocaleString('fr-FR')} EUR
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <EmptyState
              icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
              title="Aucun projet"
              description="Creez votre premier projet"
              onAction={() => setShowAddProject(true)}
            />
          )}
        </div>
      )}

      {/* Desktop Filters and info */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <NativeSelect
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="h-8 text-sm w-auto"
              >
                <option value="all">Tous les responsables</option>
                {users?.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </NativeSelect>
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Glissez-deposez les projets pour changer leur statut
          </p>
        </div>
      )}

      {/* Kanban board with drag & drop - Desktop only */}
      {!isMobile && (
        <>
          {filteredProjects.length > 0 ? (
            <ProjectKanban
              projects={filteredProjects}
              userMap={userMap}
              onRefresh={refetch}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          ) : (
            <div className="text-center py-12">
              <EmptyState
                icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
                title="Aucun projet trouve"
                description="Commencez par creer votre premier projet pour organiser vos travaux."
                onAction={() => setShowAddProject(true)}
              />
            </div>
          )}
        </>
      )}

      {/* Add project modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-surface-static rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Nouveau Projet</h3>

            {/* Creation form */}
            <form onSubmit={handleAddProject} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})}
                  className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground placeholder-muted-foreground"
                  placeholder="Nom du projet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Description *
                </label>
                <textarea
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
                  className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground placeholder-muted-foreground"
                  placeholder="Description du projet"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Statut
                  </label>
                  <select
                    value={newProjectData.status}
                    onChange={(e) => setNewProjectData({...newProjectData, status: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
                  >
                    <option value="planning">Planification</option>
                    <option value="in_progress">En cours</option>
                    <option value="on_hold">En pause</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Responsable
                  </label>
                  <select
                    value={newProjectData.assigned_to}
                    onChange={(e) => setNewProjectData({...newProjectData, assigned_to: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
                  >
                    <option value="">Non assigne</option>
                    {users?.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Budget (EUR)
                  </label>
                  <input
                    type="number"
                    value={newProjectData.budget}
                    onChange={(e) => setNewProjectData({...newProjectData, budget: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground placeholder-muted-foreground"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Date de debut
                  </label>
                  <input
                    type="date"
                    value={newProjectData.start_date}
                    onChange={(e) => setNewProjectData({...newProjectData, start_date: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={newProjectData.end_date}
                    onChange={(e) => setNewProjectData({...newProjectData, end_date: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-md text-muted-foreground bg-surface-2 hover:bg-surface-3 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={crudLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200"
                >
                  {crudLoading ? 'Creation...' : 'Creer le projet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit project dialog */}
      <ProjectEditDialog
        open={showEditProject}
        onOpenChange={setShowEditProject}
        project={selectedProject}
        onSuccess={refetch}
      />

      {/* Mobile FAB */}
      {isMobile && !showProjectDetails && (
        <FAB
          icon={Plus}
          onClick={() => setShowAddProject(true)}
          label="Nouveau projet"
          color="purple"
        />
      )}
    </div>
  );
}
