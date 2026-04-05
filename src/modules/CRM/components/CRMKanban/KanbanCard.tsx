import React from 'react';
import { MoreVertical, Trash2, UserCheck, AlertTriangle, DollarSign, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu';
import HighlightText from '../../../../components/ui/HighlightText';
import { ContactRow } from '../../../../types/supabase-types';
import { getDateColor, formatDateWithContext } from './KanbanDragContext';

interface KanbanCardProps {
  contact: ContactRow;
  searchTerm: string;
  onContactClick: (contact: ContactRow) => void;
  onDeleteCascade: (id: string) => void;
}

export function KanbanCard({ contact, searchTerm, onContactClick, onDeleteCascade }: KanbanCardProps) {
  const nextActivity = contact?.next_activity_date;
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onContactClick(contact)}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground mb-1 text-sm truncate">
              <HighlightText text={contact?.name || 'Sans nom'} searchTerm={searchTerm} />
            </h4>
            <p className="text-xs text-muted-foreground mb-1 truncate">
              <HighlightText text={contact?.company || 'Entreprise non spécifiée'} searchTerm={searchTerm} />
            </p>
            {contact?.assigned_user_name ? (
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 truncate">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {contact.assigned_user_name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-surface-2/50 text-muted-foreground border border-border/50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Non assigné
                </span>
              </div>
            )}
            {contact?.no_show === 'Oui' && (
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  No Show
                </span>
              </div>
            )}
            {contact?.project_price && (
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-semibold">{contact.project_price.toLocaleString('fr-FR')}€</p>
              </div>
            )}
            {contact?.email && (
              <div className="flex items-center gap-1 mb-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">
                  <HighlightText text={contact.email} searchTerm={searchTerm} />
                </p>
              </div>
            )}
            {contact?.phone && (
              <div className="flex items-center gap-1 mb-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{contact.phone}</p>
              </div>
            )}
            {nextActivity && (
              <div className="flex items-center gap-1 mb-1">
                <Calendar className={`h-3 w-3 ${getDateColor(nextActivity)}`} />
                <p className={`text-xs font-medium ${getDateColor(nextActivity)}`}>{formatDateWithContext(nextActivity)}</p>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDeleteCascade(contact.id)} className="text-red-600 hover:text-red-700 font-medium">
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
