import React, { useState } from 'react';
import { Trash2, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { toast } from 'sonner';

interface QuickEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customColumns: Array<{ id: string; title: string; color: string; headerColor: string; count: number }>;
  columnsLoading: boolean;
  updateColumn: (id: string, data: any) => void;
  deleteColumn: (id: string) => Promise<void>;
  addColumn: (data: any) => Promise<void>;
  refetchColumns: () => void;
}

export function QuickEditModal({
  open, onOpenChange, customColumns, columnsLoading,
  updateColumn, deleteColumn, addColumn, refetchColumns
}: QuickEditModalProps) {
  const [showDeletedColumns, setShowDeletedColumns] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gérer les colonnes du CRM</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Colonnes actuelles</h3>
            <div className="space-y-2">
              {customColumns.map((column) => (
                <div key={column.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <input type="text" value={column.title} onChange={(e) => { updateColumn(column.id, { title: e.target.value }); }} className="w-full p-2 border border-input bg-background text-foreground rounded focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded">{column.id}</span>
                    <Button variant="outline" size="sm" onClick={async () => {
                      try {
                        console.log('Tentative de suppression de la colonne:', column.title, 'ID:', column.id);
                        await deleteColumn(column.id);
                        console.log('Colonne supprimée avec succès');
                      } catch (error) {
                        console.error('Erreur lors de la suppression:', error);
                        toast.error('Erreur lors de la suppression de la colonne');
                      }
                    }} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Button variant="outline" size="sm" onClick={() => setShowDeletedColumns(!showDeletedColumns)} className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              Colonnes supprimées
            </Button>
            {showDeletedColumns && (
              <div className="mt-3 p-3 border border-border rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-2">Colonnes supprimées</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Utilisez la base de données pour réactiver les colonnes supprimées</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">Ajouter une colonne</h3>
            <div className="flex items-center space-x-3">
              <input type="text" placeholder="Nom de la colonne" className="flex-1 p-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded focus:outline-none focus:ring-1 focus:ring-ring" id="newColumnTitle" />
              <select className="p-2 border border-input bg-background text-foreground rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring" id="newColumnStatus">
                <option value="prospect">Prospect</option>
                <option value="presentation_envoyee">Présentation Envoyée</option>
                <option value="meeting_booke">Meeting Booké</option>
                <option value="offre_envoyee">Offre Envoyée</option>
                <option value="en_attente">En Attente</option>
                <option value="signe">Signé</option>
              </select>
              <Button variant="outline" size="sm" onClick={async () => {
                const titleInput = document.getElementById('newColumnTitle') as HTMLInputElement;
                const statusInput = document.getElementById('newColumnStatus') as HTMLSelectElement;
                if (titleInput.value.trim()) {
                  try {
                    await addColumn({
                      id: statusInput.value,
                      title: titleInput.value.trim(),
                      color: 'bg-blue-500/10 border-blue-500/20',
                      headerColor: 'bg-blue-500'
                    });
                    titleInput.value = '';
                  } catch (error) {
                    console.error('Erreur lors de l\'ajout de la colonne:', error);
                  }
                }
              }}>Ajouter</Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => refetchColumns()} disabled={columnsLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${columnsLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
