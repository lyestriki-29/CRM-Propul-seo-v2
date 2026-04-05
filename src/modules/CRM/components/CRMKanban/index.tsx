import React from 'react';
import { ContactRow } from '../../../../types/supabase-types';
import { KanbanColumn } from './KanbanColumn';

interface CRMKanbanBoardProps {
  customColumns: Array<{ id: string; title: string; color: string; headerColor: string; count: number }>;
  getContactsForColumn: (columnId: string) => ContactRow[];
  allContacts: ContactRow[] | null;
  contactsLoading: boolean;
  searchTerm: string;
  onContactClick: (contact: ContactRow) => void;
  onDeleteCascade: (id: string) => void;
}

export function CRMKanbanBoard({
  customColumns, getContactsForColumn, allContacts, contactsLoading,
  searchTerm, onContactClick, onDeleteCascade
}: CRMKanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-hidden pb-4 crm-kanban-board" style={{ minHeight: 'calc(100vh - 300px)' }}>
      {customColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          contacts={getContactsForColumn(column.id)}
          allContacts={allContacts}
          loading={contactsLoading}
          searchTerm={searchTerm}
          onContactClick={onContactClick}
          onDeleteCascade={onDeleteCascade}
        />
      ))}
    </div>
  );
}
