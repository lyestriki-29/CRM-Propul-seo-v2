import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCRMERPData } from './hooks/useCRMERPData';
import { useCRMERPActions } from './hooks/useCRMERPActions';
import { useCRMERPColumns } from './hooks/useCRMERPColumns';
import { useCRMUsers } from '@/hooks/useCRMUsers';
import { routes } from '@/lib/routes';
import { CRMERPPage } from './CRMERPPage';
import type { CRMERPLead, CRMERPLeadFormData } from './types';

function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function CRMERP() {
  const { leads, loading, error, refetch } = useCRMERPData();
  const { createLead, updateLead, deleteLead, updateStatus } = useCRMERPActions(refetch);
  const { users: crmUsers } = useCRMUsers();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<CRMERPLead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leadFilter, setLeadFilter] = useState('all');

  // Demande d'édition depuis la page détail via ?edit=:leadId
  useEffect(() => {
    const editLeadId = searchParams.get('edit');
    if (editLeadId && leads.length > 0) {
      const lead = leads.find((l) => l.id === editLeadId);
      if (lead) {
        setEditingLead(lead);
        setModalOpen(true);
        // Nettoyer le param pour éviter de rouvrir au refresh
        const next = new URLSearchParams(searchParams);
        next.delete('edit');
        setSearchParams(next, { replace: true });
      }
    }
  }, [searchParams, leads, setSearchParams]);

  const users = (crmUsers ?? []).map((u: { id: string; name: string; email: string }) => ({
    id: u.id, name: u.name, email: u.email,
  }));

  const filteredLeads = useMemo(() => {
    let result = leads;

    // Filter by assignee
    if (leadFilter === 'unassigned') {
      result = result.filter((l) => !l.assignee_id);
    } else if (leadFilter !== 'all') {
      result = result.filter((l) => l.assignee_id === leadFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = normalize(searchTerm.trim());
      result = result.filter((l) => {
        const fields = [l.company_name, l.contact_name, l.email, l.phone].filter(Boolean) as string[];
        return fields.some((f) => normalize(f).includes(term));
      });
    }

    return result;
  }, [leads, leadFilter, searchTerm]);

  const columns = useCRMERPColumns(filteredLeads);

  const handleAddLead = useCallback(() => {
    setEditingLead(null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingLead(null);
  }, []);

  const handleSubmitLead = useCallback(async (form: CRMERPLeadFormData) => {
    if (editingLead) {
      await updateLead(editingLead.id, form);
    } else {
      await createLead(form);
    }
  }, [editingLead, updateLead, createLead]);

  const handleCardClick = useCallback((leadId: string) => {
    navigate(routes.crmErpLead(leadId));
  }, [navigate]);

  const handleDeleteLead = useCallback(async (leadId: string) => {
    if (!window.confirm('Supprimer ce lead définitivement ?')) return;
    await deleteLead(leadId);
  }, [deleteLead]);

  // Listen for edit events from detail page
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const lead = leads.find((l) => l.id === e.detail?.leadId);
      if (lead) {
        setEditingLead(lead);
        setModalOpen(true);
      }
    };
    window.addEventListener('crmerp-edit-lead', handler as EventListener);
    return () => window.removeEventListener('crmerp-edit-lead', handler as EventListener);
  }, [leads]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Erreur: {error}</p>
        <button className="mt-2 underline" onClick={refetch}>Réessayer</button>
      </div>
    );
  }

  return (
    <CRMERPPage
      columns={columns}
      leads={leads}
      filteredCount={filteredLeads.length}
      loading={loading}
      users={users}
      modalOpen={modalOpen}
      editingLead={editingLead}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      leadFilter={leadFilter}
      onLeadFilterChange={setLeadFilter}
      onAddLead={handleAddLead}
      onCloseModal={handleCloseModal}
      onSubmitLead={handleSubmitLead}
      onStatusChange={updateStatus}
      onCardClick={handleCardClick}
      onDeleteLead={handleDeleteLead}
      onRefresh={refetch}
    />
  );
}
