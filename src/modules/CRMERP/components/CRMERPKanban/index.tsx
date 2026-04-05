import { useCallback } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { Loader2 } from 'lucide-react';
import type { CRMERPColumn } from '../../hooks/useCRMERPColumns';
import type { CRMERPStatus } from '../../types';
import { CRMERP_STATUSES } from '../../types';
import { KanbanColumn } from './KanbanColumn';

interface Props {
  columns: CRMERPColumn[];
  onStatusChange: (leadId: string, status: CRMERPStatus) => void;
  onCardClick: (leadId: string) => void;
  onDelete: (leadId: string) => void;
  loading: boolean;
}

export function CRMERPKanban({ columns, onStatusChange, onCardClick, onDelete, loading }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const leadId = active.id as string;

    let targetStatus: CRMERPStatus | undefined;
    if (CRMERP_STATUSES.includes(overId as CRMERPStatus)) {
      targetStatus = overId as CRMERPStatus;
    } else {
      const col = columns.find((c) => c.leads.some((l) => l.id === overId));
      targetStatus = col?.status;
    }

    if (!targetStatus) return;
    const currentCol = columns.find((c) => c.leads.some((l) => l.id === leadId));
    if (currentCol?.status === targetStatus) return;

    onStatusChange(leadId, targetStatus);
  }, [columns, onStatusChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-hidden" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            column={col}
            onCardClick={onCardClick}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DndContext>
  );
}
