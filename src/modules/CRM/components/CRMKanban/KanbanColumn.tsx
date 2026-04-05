import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { ContactRow } from '../../../../types/supabase-types';
import { sortContacts } from './KanbanDragContext';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: { id: string; title: string; color: string; headerColor: string; count: number };
  contacts: ContactRow[];
  allContacts: ContactRow[] | null;
  loading: boolean;
  searchTerm: string;
  onContactClick: (contact: ContactRow) => void;
  onDeleteCascade: (id: string) => void;
}

export function KanbanColumn({
  column, contacts, allContacts, loading, searchTerm,
  onContactClick, onDeleteCascade
}: KanbanColumnProps) {
  const columnContacts = allContacts?.filter(contact => contact.status === column.id) || [];
  const assignedCount = columnContacts.filter(contact => contact.assigned_user_name).length;
  const unassignedCount = columnContacts.length - assignedCount;

  return (
    <div className={`glass-surface-static rounded-xl p-3 flex flex-col w-[260px] h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-glow`}>
      <div className={`${column.headerColor} text-white rounded-t-xl p-2 -mt-3 -mx-3 mb-3 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs truncate">{column.title}</h3>
          <div className="flex flex-col items-end">
            <Badge variant="secondary" className="bg-white/90 text-foreground text-xs mb-1">
              {column.count}
            </Badge>
            {columnContacts.length > 0 && (
              <div className="text-xs text-white/80">
                <span className="text-green-200">{assignedCount} assignés</span>
                {unassignedCount > 0 && (
                  <span className="text-yellow-200 ml-2">{unassignedCount} non assignés</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1 overflow-y-auto overflow-x-hidden min-h-0 crm-column-content">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs">Aucun contact</p>
          </div>
        ) : (
          sortContacts(contacts).map((contact) => (
            <KanbanCard
              key={contact.id}
              contact={contact}
              searchTerm={searchTerm}
              onContactClick={onContactClick}
              onDeleteCascade={onDeleteCascade}
            />
          ))
        )}
      </div>
    </div>
  );
}
