import React from 'react';
import { UserPlus, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import EnhancedSearchBar from '../../../components/ui/EnhancedSearchBar';

interface CRMFiltersProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  filteredCount: number;
  totalItems: number;
  leadFilter: string;
  onLeadFilterChange: (v: string) => void;
  crmUsers: Array<{ id: string; name: string }>;
  onNewContact: () => void;
  onRefresh: () => void;
  onManageColumns: () => void;
}

export function CRMFilters({
  searchTerm, onSearchChange, filteredCount, totalItems,
  leadFilter, onLeadFilterChange, crmUsers,
  onNewContact, onRefresh, onManageColumns
}: CRMFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <EnhancedSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Rechercher contacts par nom, entreprise, email... (sans accents requis)"
              className="w-full"
            />
            {searchTerm && (
              <div className="mt-4 mb-2 text-sm text-muted-foreground glass-surface-static px-3 py-2 rounded-lg">
                <span className="font-medium">{filteredCount}</span> résultat(s)
                pour "<span className="font-medium text-primary">{searchTerm}</span>"
                {filteredCount !== totalItems && (
                  <span> sur {totalItems} contacts total</span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onNewContact}
            className="border-border text-muted-foreground bg-surface-2/50 hover:bg-surface-3/50"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau Contact
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
            {crmUsers.map(user => (
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
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onManageColumns}
            className="flex items-center gap-2"
          >
            <SettingsIcon className="w-4 h-4" />
            Gérer les colonnes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
