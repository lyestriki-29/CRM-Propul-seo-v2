import { useState } from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { BottomSheet } from '../../components/mobile/BottomSheet';
import { useTaskManagerData } from './hooks/useTaskManagerData';
import { TaskManagerHeader } from './components/TaskManagerHeader';
import { TaskFiltersBar } from './components/TaskFiltersBar';
import { TaskForm } from './components/TaskForm';
import { TaskColumns } from './components/TaskColumns';

export default function TaskManager() {
  const isMobile = useIsMobile();
  const {
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
    handleComplete,
    handleCancelEdit,
    getTasksForUser,
  } = useTaskManagerData();

  const isFormOpen = showCreateForm || !!editingTask;

  const taskFormProps = {
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
    onSubmit: handleSubmit,
    onCancel: editingTask ? handleCancelEdit : () => setShowCreateForm(false),
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-8 min-h-screen pb-24 md:pb-6">
      <TaskManagerHeader
        filteredTasksCount={filteredTasks.length}
        error={error}
        clearError={clearError}
        onNewTask={() => setShowCreateForm(true)}
        isMobile={isMobile}
      />

      <TaskFiltersBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        isMobile={isMobile}
      />

      {/* Info banner - compact on mobile */}
      <div className="flex items-center gap-2 p-2 md:p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
        <span className="text-xs md:text-sm text-green-400">
          {isMobile
            ? 'Tâches terminées = archivées automatiquement'
            : 'Les tâches terminées sont automatiquement archivées et ne sont plus visibles dans cette liste'
          }
        </span>
      </div>

      {/* Form - BottomSheet on mobile, inline on desktop */}
      {isMobile ? (
        <BottomSheet
          isOpen={isFormOpen}
          onClose={editingTask ? handleCancelEdit : () => setShowCreateForm(false)}
          title={editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          height="full"
        >
          <div className="p-4">
            <TaskForm {...taskFormProps} isMobile={isMobile} />
          </div>
        </BottomSheet>
      ) : (
        isFormOpen && <TaskForm {...taskFormProps} isMobile={false} />
      )}

      <TaskColumns
        users={users}
        getTasksForUser={getTasksForUser}
        onEdit={handleEdit}
        onComplete={handleComplete}
        isMobile={isMobile}
      />

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-8 md:py-12">
          <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-medium text-foreground mb-2">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Aucune tâche trouvée'
              : 'Aucune tâche disponible'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Essayez de modifier vos critères de recherche'
              : 'Les tâches seront chargées depuis Supabase une fois la connexion établie'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && !isMobile && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une tâche
            </Button>
          )}
        </div>
      )}

      {/* FAB - mobile only */}
      {isMobile && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
