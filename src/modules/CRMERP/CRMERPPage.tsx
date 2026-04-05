import { CRMERPHeader } from './components/CRMERPHeader';
import { CRMERPFilters } from './components/CRMERPFilters';
import { CRMERPKanban } from './components/CRMERPKanban';
import { CRMERPLeadModal } from './components/modals/CRMERPLeadModal';
import type { CRMERPColumn } from './hooks/useCRMERPColumns';
import type { CRMERPLeadFormData, CRMERPLead, CRMERPStatus } from './types';

interface User { id: string; name: string; email: string }

interface Props {
  columns: CRMERPColumn[];
  leads: CRMERPLead[];
  filteredCount: number;
  loading: boolean;
  users: User[];
  modalOpen: boolean;
  editingLead: CRMERPLead | null;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  leadFilter: string;
  onLeadFilterChange: (v: string) => void;
  onAddLead: () => void;
  onCloseModal: () => void;
  onSubmitLead: (form: CRMERPLeadFormData) => Promise<void>;
  onStatusChange: (leadId: string, status: CRMERPStatus) => void;
  onCardClick: (leadId: string) => void;
  onDeleteLead: (leadId: string) => void;
  onRefresh: () => void;
}

export function CRMERPPage({
  columns, leads, filteredCount, loading, users, modalOpen, editingLead,
  searchTerm, onSearchChange, leadFilter, onLeadFilterChange,
  onAddLead, onCloseModal, onSubmitLead, onStatusChange,
  onCardClick, onDeleteLead, onRefresh,
}: Props) {
  const totalLeads = leads.length;

  return (
    <div className="min-h-screen">
      <CRMERPHeader onAddLead={onAddLead} onRefresh={onRefresh} loading={loading} totalLeads={totalLeads} />
      <div className="p-6 space-y-6">
        <CRMERPFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filteredCount={filteredCount}
          totalItems={totalLeads}
          leadFilter={leadFilter}
          onLeadFilterChange={onLeadFilterChange}
          users={users}
          onNewLead={onAddLead}
          onRefresh={onRefresh}
        />
        <CRMERPKanban
          columns={columns}
          onStatusChange={onStatusChange}
          onCardClick={onCardClick}
          onDelete={onDeleteLead}
          loading={loading}
        />
      </div>
      <CRMERPLeadModal
        open={modalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmitLead}
        lead={editingLead}
        users={users}
      />
    </div>
  );
}
