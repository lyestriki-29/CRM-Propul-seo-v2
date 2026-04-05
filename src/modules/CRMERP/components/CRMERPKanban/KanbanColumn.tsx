import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CRMERPColumn } from '../../hooks/useCRMERPColumns';
import { KanbanCard } from './KanbanCard';

interface Props {
  column: CRMERPColumn;
  onCardClick: (leadId: string) => void;
  onDelete: (leadId: string) => void;
}

export function KanbanColumn({ column, onCardClick, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  const assignedCount = column.leads.filter((l) => l.assignee_id).length;
  const unassignedCount = column.leads.length - assignedCount;

  return (
    <div
      className={`${column.bg} rounded-lg border flex flex-col flex-1 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isOver ? 'ring-2 ring-primary shadow-lg' : ''}`}
    >
      <div className={`${column.header} text-white rounded-t-lg p-3 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs truncate">{column.label}</h3>
          <Badge variant="secondary" className="bg-white/90 text-foreground text-xs">
            {column.leads.length}
          </Badge>
        </div>
        {column.leads.length > 0 && (
          <div className="flex gap-3 mt-1.5 text-[10px] text-white/75">
            <span className="text-green-200">{assignedCount} assigné{assignedCount !== 1 ? 's' : ''}</span>
            {unassignedCount > 0 && (
              <span className="text-yellow-200">{unassignedCount} non assigné{unassignedCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-2 space-y-2 overflow-y-auto overflow-x-hidden min-h-0"
      >
        <SortableContext items={column.leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {column.leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onClick={() => onCardClick(lead.id)}
              onDelete={() => onDelete(lead.id)}
            />
          ))}
        </SortableContext>

        {column.leads.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <p className="text-xs">Aucun lead</p>
          </div>
        )}
      </div>
    </div>
  );
}
