import type { ProjectV2, StatusComm } from '../../../../types/project-v2'
import { useCommTasks, type CommTaskView } from './useCommTasks'
import { CommTaskFilters } from './CommTaskFilters'
import { CommTaskBoardProject } from './CommTaskBoardProject'
import { CommTaskBoardMonth } from './CommTaskBoardMonth'
import { CommTaskBoardWeek } from './CommTaskBoardWeek'
import { CommTaskModal } from './CommTaskModal'

type CommProject = ProjectV2 & { comm_status: StatusComm }

interface CommTaskBoardProps {
  projects: CommProject[]
  initialView?: CommTaskView
}

export function CommTaskBoard({ projects, initialView = 'project' }: CommTaskBoardProps) {
  const {
    tasks, view, setView, filters, setFilters,
    currentDate, setCurrentDate,
    modalOpen, editingTask, defaultDate,
    createTask, updateTask, deleteTask, moveTask,
    openCreate, openEdit, closeModal,
  } = useCommTasks(initialView)

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
      <CommTaskFilters
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
        <CommTaskBoardProject
          tasks={tasks}
          projects={projects}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onAddTask={() => openCreate()}
        />
      )}
      {view === 'month' && (
        <CommTaskBoardMonth
          tasks={tasks}
          currentDate={currentDate}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}
      {view === 'week' && (
        <CommTaskBoardWeek
          tasks={tasks}
          currentDate={currentDate}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}

      {/* Modal */}
      <CommTaskModal
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
