import type { ProjectV2, StatusERP } from '../../../../types/project-v2'
import { useERPTasks, type ERPTaskView } from './useERPTasks'
import { ERPTaskFilters } from './ERPTaskFilters'
import { ERPTaskBoardProject } from './ERPTaskBoardProject'
import { ERPTaskBoardMonth } from './ERPTaskBoardMonth'
import { ERPTaskBoardWeek } from './ERPTaskBoardWeek'
import { ERPTaskModal } from './ERPTaskModal'

type ERPProject = ProjectV2 & { erp_status: StatusERP }

interface ERPTaskBoardProps {
  projects: ERPProject[]
  initialView?: ERPTaskView
}

export function ERPTaskBoard({ projects, initialView = 'project' }: ERPTaskBoardProps) {
  const {
    tasks, view, setView, filters, setFilters,
    currentDate, setCurrentDate,
    modalOpen, editingTask, defaultDate,
    createTask, updateTask, deleteTask, moveTask,
    openCreate, openEdit, closeModal,
  } = useERPTasks(initialView)

  const handlePrev = () => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const handleNext = () => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  return (
    <div className="flex flex-col">
      {/* Barre de filtres */}
      <ERPTaskFilters
        filters={filters}
        view={view}
        projects={projects}
        currentDate={currentDate}
        onFiltersChange={setFilters}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={() => setCurrentDate(new Date())}
        onNewTask={() => openCreate()}
      />

      {/* Vues */}
      {view === 'project' && (
        <ERPTaskBoardProject
          tasks={tasks}
          projects={projects}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onAddTask={() => openCreate()}
        />
      )}
      {view === 'month' && (
        <ERPTaskBoardMonth
          tasks={tasks}
          currentDate={currentDate}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}
      {view === 'week' && (
        <ERPTaskBoardWeek
          tasks={tasks}
          currentDate={currentDate}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}

      {/* Modal */}
      <ERPTaskModal
        open={modalOpen}
        task={editingTask}
        projects={projects}
        defaultDate={defaultDate}
        onSave={(data) => {
          if (editingTask) updateTask(editingTask.id, data)
          else createTask(data)
        }}
        onDelete={deleteTask}
        onClose={closeModal}
      />
    </div>
  )
}
