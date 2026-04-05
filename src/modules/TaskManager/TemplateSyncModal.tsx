import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useTemplateSync } from './hooks/useTemplateSync';
import { TemplateSyncInfo } from './components/template-sync/TemplateSyncInfo';
import { SyncProjectList } from './components/template-sync/SyncProjectList';

interface TemplateSyncModalProps {
  open: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export function TemplateSyncModal({ open, onClose, onSyncComplete }: TemplateSyncModalProps) {
  const sync = useTemplateSync({ onClose, onSyncComplete });

  if (!sync.currentTemplate) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Aucun template disponible</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Aucun template n'est configuré. Veuillez d'abord créer et sauvegarder un template.
            </p>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Synchroniser les Templates</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <TemplateSyncInfo template={sync.currentTemplate} />

          <SyncProjectList
            projects={sync.projectsWithoutTemplate}
            selectedProjects={sync.selectedProjects}
            loading={sync.projectsLoading}
            onToggle={sync.handleProjectToggle}
            onSelectAll={sync.handleSelectAll}
          />

          {sync.syncing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Synchronisation en cours...</span>
                    <span>{Math.round(sync.syncProgress)}%</span>
                  </div>
                  <div className="w-full bg-surface-3 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sync.syncProgress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={sync.syncing}>
              Annuler
            </Button>
            <Button
              onClick={sync.handleSync}
              disabled={sync.syncing || sync.selectedProjects.size === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {sync.syncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Synchronisation...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchroniser ({sync.selectedProjects.size} projet{sync.selectedProjects.size !== 1 ? 's' : ''})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
