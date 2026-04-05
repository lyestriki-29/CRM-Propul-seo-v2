import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Checkbox } from '../../../../components/ui/checkbox';
import { CheckCircle, Users } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
}

interface SyncProjectListProps {
  projects: Project[];
  selectedProjects: Set<string>;
  loading: boolean;
  onToggle: (projectId: string) => void;
  onSelectAll: () => void;
}

export function SyncProjectList({ projects, selectedProjects, loading, onToggle, onSelectAll }: SyncProjectListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Projets à synchroniser</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
          >
            {selectedProjects.size === projects.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>Tous les projets sont déjà synchronisés</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {projects.map(project => (
              <div
                key={project.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onCheckedChange={() => onToggle(project.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground">{project.description}</div>
                </div>
                <Badge variant="outline">{project.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
