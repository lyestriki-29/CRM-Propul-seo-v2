import type { ProjectV2, StatusSiteWeb } from '../../../../types/project-v2'
import { useSiteWebTasks, type SiteWebTaskView } from './useSiteWebTasks'
import { SiteWebTaskFilters } from './SiteWebTaskFilters'
import { SiteWebTaskBoardProject } from './SiteWebTaskBoardProject'
import { SiteWebTaskBoardMonth } from './SiteWebTaskBoardMonth'
import { SiteWebTaskBoardWeek } from './SiteWebTaskBoardWeek'
import { SiteWebTaskModal } from './SiteWebTaskModal'

type SiteWebProject = ProjectV2 & { sw_status: StatusSiteWeb }

interface SiteWebTaskBoardProps {
  projects: SiteWebProject[]
  initialView?: SiteWebTaskView
}

export function SiteWebTaskBoard({ projects, initialView = 'project' }: SiteWebTaskBoardProps) {
  const {
    tasks, view, setView, filters, setFilters,
    currentDate, setCurrentDate,
    modalOpen, editingTask, defaultDate,
    createTask, updateTask, deleteTask, moveTask,
    openCreate, openEdit, closeModal,
  } = useSiteWebTasks(initialView)

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
      <SiteWebTaskFilters
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
        <SiteWebTaskBoardProject
          tasks={tasks}
          projects={projects}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onAddTask={() => openCreate()}
        />
      )}
      {view === 'month' && (
        <SiteWebTaskBoardMonth
          tasks={tasks}
          currentDate={currentDate}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}
      {view === 'week' && (
        <SiteWebTaskBoardWeek
          tasks={tasks}
          currentDate={currentDate}
          onMoveTask={(id, patch) => moveTask(id, patch)}
          onClickTask={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}

      {/* Modal */}
      <SiteWebTaskModal
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
