import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, UserCheck, AlertTriangle, Clock, MoreVertical, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { CRMERPLead } from '../../types';
import { formatDateRelative, getDateColor } from './DragContext';

interface Props {
  lead: CRMERPLead;
  onClick: () => void;
  onDelete: () => void;
}

export function KanbanCard({ lead, onClick, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const lastActivity = formatDateRelative(lead.last_activity_at);
  const dateColor = getDateColor(lead.last_activity_at);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm truncate mb-1">
              {lead.contact_name || lead.company_name || 'Sans nom'}
            </h4>
            {lead.company_name && lead.contact_name && (
              <p className="text-xs text-muted-foreground mb-1.5 truncate flex items-center gap-1">
                <Building2 className="h-3 w-3 shrink-0" />
                {lead.company_name}
              </p>
            )}

            {lead.assignee ? (
              <div className="mb-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 truncate">
                  <UserCheck className="h-3 w-3 mr-1 shrink-0" />
                  {lead.assignee.name}
                </span>
              </div>
            ) : (
              <div className="mb-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-surface-2/50 text-muted-foreground border border-border/50">
                  <AlertTriangle className="h-3 w-3 mr-1 shrink-0" />
                  Non assigné
                </span>
              </div>
            )}

            {lead.email && (
              <div className="flex items-center gap-1 mb-1">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-1 mb-1">
                <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground truncate">{lead.phone}</p>
              </div>
            )}

            {lastActivity && (
              <div className={`flex items-center gap-1 ${dateColor}`}>
                <Clock className="h-3 w-3 shrink-0" />
                <p className="text-xs font-medium">{lastActivity}</p>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
