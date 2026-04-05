import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import ContactDetails from '../ContactDetails';
import { ContactRow } from '../../types/supabase-types';
import { ContactFormData } from './types';
import { MobileHeader } from '../../components/mobile/MobileHeader';
import { MobileContactList } from '../../components/mobile/MobileContactList';
import { MobileContactPreview } from '../../components/mobile/MobileContactPreview';
import { FAB } from '../../components/mobile/FAB';
import { CRMHeader } from './components/CRMHeader';
import { CRMFilters } from './components/CRMFilters';
import { LeadModal } from './components/modals/LeadModal';
import { QuickEditModal } from './components/modals/QuickEditModal';
import { CRMKanbanBoard } from './components/CRMKanban';
import type { CRMData } from './hooks/useCRMData';
import type { CRMFilters as CRMFiltersType } from './hooks/useCRMFilters';

interface CRMPageProps {
  data: CRMData;
  filters: CRMFiltersType;
  actions: {
    handleCreateContact: (e: React.FormEvent) => Promise<void>;
    handleUpdateContact: (e: React.FormEvent) => Promise<void>;
    handleEditContact: (contact: ContactRow) => void;
    handleStatusChange: (id: string, status: string) => Promise<void>;
    handleSignContract: (id: string) => Promise<void>;
    handleDeleteContactCascade: (id: string) => Promise<void>;
    forceRefreshContacts: () => Promise<void>;
  };
  isMobile: boolean;
  contactForm: ContactFormData;
  setContactForm: React.Dispatch<React.SetStateAction<ContactFormData>>;
  contactDialogOpen: boolean;
  setContactDialogOpen: (v: boolean) => void;
  editContactDialogOpen: boolean;
  setEditContactDialogOpen: (v: boolean) => void;
  selectedContact: ContactRow | null;
  setSelectedContact: (c: ContactRow | null) => void;
  showContactDetails: boolean;
  setShowContactDetails: (v: boolean) => void;
  showColumnManager: boolean;
  setShowColumnManager: (v: boolean) => void;
  mobilePreviewContact: ContactRow | null;
  setMobilePreviewContact: (c: ContactRow | null) => void;
  showMobilePreview: boolean;
  setShowMobilePreview: (v: boolean) => void;
  fromDashboard: boolean;
  onBackToDashboard: () => void;
  onContactClick: (contact: ContactRow) => void;
  onRefresh: () => Promise<void>;
}

export function CRMPage(props: CRMPageProps) {
  const {
    data, filters, actions, isMobile, contactForm, setContactForm,
    contactDialogOpen, setContactDialogOpen, editContactDialogOpen, setEditContactDialogOpen,
    selectedContact, setSelectedContact, showContactDetails, setShowContactDetails,
    showColumnManager, setShowColumnManager,
    mobilePreviewContact, setMobilePreviewContact, showMobilePreview, setShowMobilePreview,
    fromDashboard, onBackToDashboard, onContactClick, onRefresh,
  } = props;

  return (
    <div className="min-h-screen">
      {isMobile && !showContactDetails && (
        <>
          <MobileHeader title="CRM" />
          <MobileContactList contacts={filters.filteredContacts || []} loading={data.contactsLoading} onRefresh={onRefresh} onContactClick={onContactClick} onContactCall={(c) => { if (c.phone) window.location.href = `tel:${c.phone}`; }} onContactEmail={(c) => { if (c.email) window.location.href = `mailto:${c.email}`; }} onQuickView={(c) => { setMobilePreviewContact(c); setShowMobilePreview(true); }} searchTerm={filters.searchTerm} onSearchChange={filters.setSearchTerm} users={data.crmUsers} selectedUserId={filters.leadFilter} onUserFilterChange={filters.setLeadFilter} />
          <MobileContactPreview contact={mobilePreviewContact} isOpen={showMobilePreview} onClose={() => { setShowMobilePreview(false); setMobilePreviewContact(null); }} onViewDetails={() => { setShowMobilePreview(false); if (mobilePreviewContact) onContactClick(mobilePreviewContact); }} onEdit={() => { setShowMobilePreview(false); if (mobilePreviewContact) actions.handleEditContact(mobilePreviewContact); }} onStatusChange={async (newStatus) => { if (mobilePreviewContact) { if (newStatus === 'signe') { await actions.handleSignContract(mobilePreviewContact.id); } else { await actions.handleStatusChange(mobilePreviewContact.id, newStatus); } setShowMobilePreview(false); setMobilePreviewContact(null); } }} />
          <FAB icon={Plus} onClick={() => setContactDialogOpen(true)} label="Nouveau contact" color="blue" />
        </>
      )}
      {!isMobile && <CRMHeader fromDashboard={fromDashboard} onBackToDashboard={onBackToDashboard} onNewContact={() => setContactDialogOpen(true)} />}
      <div className={cn("space-y-4 min-h-screen overflow-x-hidden crm-main-container", isMobile ? "p-4 pb-20" : "p-6 space-y-8")}>
        <LeadModal open={contactDialogOpen} onOpenChange={setContactDialogOpen} onSubmit={actions.handleCreateContact} contactForm={contactForm} setContactForm={setContactForm} crmUsers={data.crmUsers} usersLoading={data.usersLoading} crudLoading={data.crudLoading} mode="create" />
        <LeadModal open={editContactDialogOpen} onOpenChange={setEditContactDialogOpen} onSubmit={actions.handleUpdateContact} contactForm={contactForm} setContactForm={setContactForm} crmUsers={data.crmUsers} usersLoading={data.usersLoading} crudLoading={data.crudLoading} mode="edit" />
        {showContactDetails && selectedContact ? (
          <ContactDetails contactId={selectedContact.id} onBack={() => { setShowContactDetails(false); setSelectedContact(null); }} />
        ) : (
          <>
            {fromDashboard && (
              <div className="mb-6"><Button variant="outline" onClick={onBackToDashboard}><ArrowLeft className="w-4 h-4 mr-2" />Retour au Dashboard</Button></div>
            )}
            <CRMFilters searchTerm={filters.searchTerm} onSearchChange={filters.setSearchTerm} filteredCount={filters.filteredCount} totalItems={filters.totalItems} leadFilter={filters.leadFilter} onLeadFilterChange={filters.setLeadFilter} crmUsers={data.crmUsers} onNewContact={() => setContactDialogOpen(true)} onRefresh={onRefresh} onManageColumns={() => setShowColumnManager(true)} />
            <CRMKanbanBoard customColumns={data.customColumns} getContactsForColumn={filters.getContactsForColumn} allContacts={data.contacts} contactsLoading={data.contactsLoading} searchTerm={filters.searchTerm} onContactClick={onContactClick} onDeleteCascade={actions.handleDeleteContactCascade} />
          </>
        )}
        {showColumnManager && (
          <QuickEditModal open={showColumnManager} onOpenChange={setShowColumnManager} customColumns={data.customColumns} columnsLoading={data.columnsLoading} updateColumn={data.updateColumn} deleteColumn={data.deleteColumn} addColumn={data.addColumn} refetchColumns={data.refetchColumns} />
        )}
      </div>
    </div>
  );
}
