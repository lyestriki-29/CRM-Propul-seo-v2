import React, { useState, useEffect, useCallback } from 'react';
import { useAccentInsensitiveSearch } from '../../../hooks/useAccentInsensitiveSearch';
import { ContactRow } from '../../../types/supabase-types';
import { STATUS_MAPPING } from '../types';

const SEARCH_FIELDS = ['name', 'company', 'email', 'phone', 'notes'];

export function useCRMFilters(
  contacts: ContactRow[] | null,
  customColumns: Array<{ id: string; title: string; color: string; headerColor: string; count: number }>,
  updateColumnCounts: () => void
) {
  const [leadFilter, setLeadFilter] = useState<'all' | 'unassigned' | string>('all');

  const {
    searchTerm, setSearchTerm,
    filteredItems: searchFilteredContacts,
    totalItems, filteredCount
  } = useAccentInsensitiveSearch(contacts || [], SEARCH_FIELDS);

  const filteredContacts = React.useMemo(() => {
    let filtered = searchFilteredContacts;
    if (leadFilter === 'unassigned') {
      filtered = filtered.filter(contact => !contact.assigned_to);
    } else if (leadFilter !== 'all') {
      filtered = filtered.filter(contact => contact.assigned_to === leadFilter);
    }
    return filtered;
  }, [searchFilteredContacts, leadFilter]);

  const updateColumnCountsCallback = React.useCallback(() => {
    if (contacts && customColumns.length > 0) {
      updateColumnCounts();
    }
  }, [contacts, customColumns.length, updateColumnCounts]);

  useEffect(() => {
    updateColumnCountsCallback();
  }, [updateColumnCountsCallback]);

  const getContactsForColumn = useCallback((columnId: string) => {
    console.log(`getContactsForColumn appelé pour columnId: ${columnId}`);
    console.log(`filteredContacts disponibles: ${filteredContacts?.length || 0}`);
    console.log(`Premier contact:`, filteredContacts?.[0]);
    if (!filteredContacts) {
      console.log(`Aucun filteredContacts disponible`);
      return [];
    }
    const column = customColumns.find(col => col.id === columnId);
    if (!column) {
      console.log(`Colonne avec ID ${columnId} non trouvée`);
      return [];
    }
    console.log(`Colonne trouvée: "${column.title}" (${column.id})`);
    if (column.title === 'No Show') {
      return filteredContacts.filter(contact => contact.no_show === 'Oui');
    }
    const contactsExcludingNoShow = filteredContacts.filter(contact => contact.no_show !== 'Oui');
    const possibleStatuses = STATUS_MAPPING[column.title];
    if (!possibleStatuses) {
      console.log(`Pas de mapping pour "${column.title}", recherche directe...`);
      return contactsExcludingNoShow.filter(contact => contact.status === column.title.toLowerCase());
    }
    console.log(`Recherche de contacts avec statuts: ${possibleStatuses.join(', ')}`);
    console.log(`Contacts disponibles (excluant No Show): ${contactsExcludingNoShow.length}`);
    const sampleStatuses = contactsExcludingNoShow.slice(0, 5).map(c => ({ name: c.name, status: c.status }));
    console.log(`Exemples de statuts:`, sampleStatuses);
    const result = contactsExcludingNoShow.filter(contact =>
      possibleStatuses.includes(contact.status)
    );
    console.log(`Colonne "${column.title}": ${result.length} contacts trouvés`);
    console.log(`Contacts trouvés:`, result.slice(0, 3).map(c => ({ name: c.name, status: c.status })));
    return result;
  }, [filteredContacts, customColumns]);

  const debugContactDistribution = useCallback(() => {
    if (!filteredContacts) return;
    const contactStatuses = filteredContacts.map(c => ({ id: c.id, name: c.name, status: c.status }));
    const statusCounts: { [key: string]: number } = {};
    contactStatuses.forEach(contact => {
      statusCounts[contact.status] = (statusCounts[contact.status] || 0) + 1;
    });
    console.log('Distribution des contacts par statut:', statusCounts);
    console.log('Contacts avec statuts:', contactStatuses);
    console.log('Colonnes disponibles:', customColumns.map(c => ({ id: c.id, title: c.title })));
    const duplicateStatuses = Object.entries(statusCounts).filter(([, count]) => count > 1);
    if (duplicateStatuses.length > 0) {
      console.warn('Statuts avec plusieurs contacts:', duplicateStatuses);
    }
  }, [filteredContacts, customColumns]);

  useEffect(() => {
    if (filteredContacts && filteredContacts.length > 0) {
      debugContactDistribution();
    }
  }, [filteredContacts, customColumns, debugContactDistribution]);

  return {
    searchTerm, setSearchTerm,
    leadFilter, setLeadFilter,
    filteredContacts,
    totalItems, filteredCount,
    getContactsForColumn,
  };
}

export type CRMFilters = ReturnType<typeof useCRMFilters>;
