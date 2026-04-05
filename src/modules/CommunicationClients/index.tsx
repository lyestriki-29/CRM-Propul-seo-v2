import { useCommunicationClientsData } from './hooks/useCommunicationClientsData';
import { useCommunicationClientsFilters } from './hooks/useCommunicationClientsFilters';
import { CommunicationClientsPage } from './CommunicationClientsPage';
import { Loader2 } from 'lucide-react';

export function CommunicationClients() {
  const data = useCommunicationClientsData();
  const filters = useCommunicationClientsFilters(data.posts);

  if (data.postsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <CommunicationClientsPage
      data={data}
      filteredPosts={filters.filteredPosts}
      typeFilter={filters.typeFilter}
      platformFilter={filters.platformFilter}
      responsibleFilter={filters.responsibleFilter}
      statusFilter={filters.statusFilter}
      searchQuery={filters.searchQuery}
      sortOrder={filters.sortOrder}
      setTypeFilter={filters.setTypeFilter}
      setPlatformFilter={filters.setPlatformFilter}
      setResponsibleFilter={filters.setResponsibleFilter}
      setStatusFilter={filters.setStatusFilter}
      setSearchQuery={filters.setSearchQuery}
      setSortOrder={filters.setSortOrder}
      resetFilters={filters.resetFilters}
    />
  );
}
