import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  GripVertical, 
  Trash2, 
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Textarea } from '../../ui/textarea';
import { 
  CRMBotOneColumn, 
  CRMBotOneColumnForm 
} from '../../../types/crmBotOne';

interface ColumnManagerProps {
  columns: CRMBotOneColumn[];
  onCreateColumn: (column: CRMBotOneColumnForm) => Promise<void>;
  onUpdateColumn: (id: string, updates: Partial<CRMBotOneColumnForm>) => Promise<void>;
  onDeleteColumn: (id: string) => Promise<void>;
  onReorderColumns: (columnIds: string[]) => Promise<void>;
}

export function ColumnManager({
  columns,
  onCreateColumn,
  onUpdateColumn,
  onDeleteColumn,
  onReorderColumns
}: ColumnManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CRMBotOneColumn | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnForm, setColumnForm] = useState<CRMBotOneColumnForm>({
    column_name: '',
    column_type: 'text',
    is_required: false,
    default_value: '',
    options: {},
    validation_rules: {}
  });

  const columnTypes = [
    { value: 'text', label: 'Texte' },
    { value: 'number', label: 'Nombre' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
    { value: 'boolean', label: 'Oui/Non' },
    { value: 'select', label: 'Sélection' }
  ];

  const handleCreateColumn = async () => {
    try {
      await onCreateColumn(columnForm);
      setShowCreateDialog(false);
      setColumnForm({
        column_name: '',
        column_type: 'text',
        is_required: false,
        default_value: '',
        options: {},
        validation_rules: {}
      });
    } catch (error) {
      console.error('Erreur lors de la création de la colonne:', error);
    }
  };

  const handleUpdateColumn = async () => {
    if (!editingColumn) return;
    
    try {
      await onUpdateColumn(editingColumn.id, columnForm);
      setEditingColumn(null);
      setColumnForm({
        column_name: '',
        column_type: 'text',
        is_required: false,
        default_value: '',
        options: {},
        validation_rules: {}
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la colonne:', error);
    }
  };

  const handleEditColumn = (column: CRMBotOneColumn) => {
    setEditingColumn(column);
    setColumnForm({
      column_name: column.column_name,
      column_type: column.column_type,
      is_required: column.is_required,
      default_value: column.default_value || '',
      options: column.options || {},
      validation_rules: column.validation_rules || {}
    });
  };

  const handleDeleteColumn = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette colonne ?')) {
      try {
        await onDeleteColumn(id);
      } catch (error) {
        console.error('Erreur lors de la suppression de la colonne:', error);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const newOrder = columns.map(col => col.id);
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    onReorderColumns(newOrder);
    setDraggedColumn(null);
  };

  const renderColumnOptions = () => {
    if (columnForm.column_type !== 'select') return null;

    return (
      <div className="space-y-2">
        <Label>Options de sélection</Label>
        <Textarea
          placeholder="Option 1&#10;Option 2&#10;Option 3"
          value={columnForm.options?.options?.join('\n') || ''}
          onChange={(e) => {
            const options = e.target.value.split('\n').filter(opt => opt.trim());
            setColumnForm(prev => ({
              ...prev,
              options: { ...prev.options, options }
            }));
          }}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          Une option par ligne
        </p>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gestion des colonnes
            </CardTitle>
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une colonne
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {columns.map((column, index) => (
              <div
                key={column.id}
                draggable
                onDragStart={(e) => handleDragStart(e, column.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-surface-3 cursor-move"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{column.column_name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({column.column_type})
                    </span>
                    {column.is_required && (
                      <span className="text-red-500 text-sm">*</span>
                    )}
                    {column.is_default && (
                      <span className="text-blue-500 text-sm">Par défaut</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditColumn(column)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!column.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteColumn(column.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de création/modification */}
      <Dialog 
        open={showCreateDialog || !!editingColumn} 
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingColumn(null);
            setColumnForm({
              column_name: '',
              column_type: 'text',
              is_required: false,
              default_value: '',
              options: {},
              validation_rules: {}
            });
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingColumn ? 'Modifier la colonne' : 'Créer une nouvelle colonne'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="column_name">Nom de la colonne *</Label>
              <Input
                id="column_name"
                value={columnForm.column_name}
                onChange={(e) => setColumnForm(prev => ({
                  ...prev,
                  column_name: e.target.value
                }))}
                placeholder="Ex: Nom du client"
              />
            </div>

            <div>
              <Label htmlFor="column_type">Type de données *</Label>
              <Select
                value={columnForm.column_type}
                onValueChange={(value: CRMBotOneColumnForm['column_type']) => setColumnForm(prev => ({
                  ...prev,
                  column_type: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderColumnOptions()}

            <div>
              <Label htmlFor="default_value">Valeur par défaut</Label>
              <Input
                id="default_value"
                value={columnForm.default_value}
                onChange={(e) => setColumnForm(prev => ({
                  ...prev,
                  default_value: e.target.value
                }))}
                placeholder="Valeur par défaut"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_required"
                checked={columnForm.is_required}
                onCheckedChange={(checked) => setColumnForm(prev => ({
                  ...prev,
                  is_required: checked
                }))}
              />
              <Label htmlFor="is_required">Champ obligatoire</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setEditingColumn(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={editingColumn ? handleUpdateColumn : handleCreateColumn}
              disabled={!columnForm.column_name}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingColumn ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
