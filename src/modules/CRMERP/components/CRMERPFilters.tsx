import { UserPlus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EnhancedSearchBar from '@/components/ui/EnhancedSearchBar';

interface Props {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  filteredCount: number;
  totalItems: number;
  leadFilter: string;
  onLeadFilterChange: (v: string) => void;
  users: Array<{ id: string; name: string }>;
  onNewLead: () => void;
  onRefresh: () => void;
}

export function CRMERPFilters({
  searchTerm, onSearchChange, filteredCount, totalItems,
  leadFilter, onLeadFilterChange, users,
  onNewLead, onRefresh,
}: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <EnhancedSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Rechercher leads par nom, entreprise, email..."
              className="w-full"
            />
            {searchTerm && (
              <div className="mt-4 mb-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border">
                <span className="font-medium">{filteredCount}</span> résultat(s)
                pour "<span className="font-medium text-primary">{searchTerm}</span>"
                {filteredCount !== totalItems && (
                  <span> sur {totalItems} leads total</span>
                )}
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onNewLead}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau Lead
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant={leadFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLeadFilterChange('all')}
              className="text-xs"
            >
              Tous les leads
            </Button>
            {users.map((user) => (
              <Button
                key={user.id}
                variant={leadFilter === user.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLeadFilterChange(user.id)}
                className="text-xs"
              >
                {user.name}
              </Button>
            ))}
            <Button
              variant={leadFilter === 'unassigned' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLeadFilterChange('unassigned')}
              className="text-xs"
            >
              Non assignés
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
