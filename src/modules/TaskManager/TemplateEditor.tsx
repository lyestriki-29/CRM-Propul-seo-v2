import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import type { ProjectTemplate } from './projectTemplates';
import { useTemplateEditor } from './hooks/useTemplateEditor';
import { TemplateEditorHeader } from './components/template-editor/TemplateEditorHeader';
import { TemplateTaskForm } from './components/template-editor/TemplateTaskForm';
import { TemplateCategoryList } from './components/template-editor/TemplateCategoryList';

interface TemplateEditorProps {
  onSave?: (template: ProjectTemplate) => void;
  onCancel?: () => void;
}

export function TemplateEditor({ onSave, onCancel }: TemplateEditorProps) {
  const editor = useTemplateEditor({ onSave, onCancel });

  return (
    <div className="space-y-6">
      <TemplateEditorHeader
        template={editor.template}
        groupedTasks={editor.groupedTasks}
        onReset={editor.handleResetTemplate}
        onSave={editor.handleSaveTemplate}
        onCancel={onCancel}
      />

      <div className="flex justify-center">
        <Button
          onClick={() => editor.setShowAddTask(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une tâche
        </Button>
      </div>

      {(editor.showAddTask || editor.editingTask) && (
        <TemplateTaskForm
          isEditing={!!editor.editingTask}
          newTask={editor.newTask}
          setNewTask={editor.setNewTask}
          onSave={editor.handleSaveTask}
          onCancel={editor.handleCancelForm}
        />
      )}

      <TemplateCategoryList
        groupedTasks={editor.groupedTasks}
        onEditTask={editor.handleEditTask}
        onDeleteTask={editor.handleDeleteTask}
      />
    </div>
  );
}
