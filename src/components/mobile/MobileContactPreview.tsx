import { memo, useState } from 'react';
import {
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  UserCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Building2,
  User,
  ArrowRight,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BottomSheet } from './BottomSheet';

interface Contact {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  status: string;
  project_price?: number;
  assigned_user_name?: string;
  no_show?: string;
  next_activity_date?: string;
  next_activity_type?: string;
  created_at?: string;
  notes?: string | string[];
  source?: string;
}

interface MobileContactPreviewProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (newStatus: string) => void;
}

// Status configurations
const statusConfig: Record<string, { label: string; color: string; bgColor: string; nextStatus?: string; nextLabel?: string }> = {
  prospect: {
    label: 'Prospect',
    color: 'text-primary',
    bgColor: 'bg-blue-100',
    nextStatus: 'presentation_envoyee',
    nextLabel: 'Envoyer presentation'
  },
  presentation_envoyee: {
    label: 'Presentation Envoyee',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    nextStatus: 'meeting_booke',
    nextLabel: 'Booker meeting'
  },
  meeting_booke: {
    label: 'Meeting Booke',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    nextStatus: 'offre_envoyee',
    nextLabel: 'Envoyer offre'
  },
  offre_envoyee: {
    label: 'Offre Envoyee',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    nextStatus: 'signe',
    nextLabel: 'Signer contrat'
  },
  en_attente: {
    label: 'En Attente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    nextStatus: 'signe',
    nextLabel: 'Signer contrat'
  },
  signe: {
    label: 'Signe',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
};

// Source labels
const sourceLabels: Record<string, string> = {
  website: 'Site web',
  referral: 'Recommandation',
  social: 'Reseaux sociaux',
  ads: 'Publicite',
  cold_call: 'Appel a froid',
  other: 'Autre'
};

// Format date
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const MobileContactPreview = memo(function MobileContactPreview({
  contact,
  isOpen,
  onClose,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange
}: MobileContactPreviewProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!contact) return null;

  const status = statusConfig[contact.status] || statusConfig.prospect;

  // Copy to clipboard
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle phone call
  const handleCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  // Handle email
  const handleEmail = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  // Handle website visit
  const handleWebsite = () => {
    if (contact.website) {
      window.open(contact.website, '_blank');
    }
  };

  // Handle status advancement
  const handleAdvanceStatus = () => {
    if (status.nextStatus && onStatusChange) {
      onStatusChange(status.nextStatus);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Apercu du contact">
      <div className="px-4 pb-8">
        {/* Header with avatar and name */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0",
            status.bgColor, status.color
          )}>
            {(contact.company || contact.name || '?')[0].toUpperCase()}
          </div>

          {/* Name and company */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">
              {contact.company || contact.name}
            </h2>
            {contact.company && contact.name && (
              <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                <User className="w-3.5 h-3.5" />
                {contact.name}
              </p>
            )}
            {/* Status badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                status.bgColor, status.color
              )}>
                {status.label}
              </span>
              {contact.no_show === 'Oui' && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  No Show
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={handleCall}
            disabled={!contact.phone}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors",
              contact.phone
                ? "bg-green-50 text-green-600 active:bg-green-100"
                : "bg-surface-2 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs font-medium">Appeler</span>
          </button>

          <button
            onClick={handleEmail}
            disabled={!contact.email}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors",
              contact.email
                ? "bg-blue-50 text-primary active:bg-blue-100"
                : "bg-surface-2 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Mail className="w-6 h-6" />
            <span className="text-xs font-medium">Email</span>
          </button>

          <button
            onClick={handleWebsite}
            disabled={!contact.website}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors",
              contact.website
                ? "bg-purple-50 text-purple-600 active:bg-purple-100"
                : "bg-surface-2 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Globe className="w-6 h-6" />
            <span className="text-xs font-medium">Site</span>
          </button>
        </div>

        {/* Contact details */}
        <div className="space-y-3 mb-6">
          {/* Phone */}
          {contact.phone && (
            <div className="flex items-center justify-between p-3 bg-surface-1 rounded-xl">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{contact.phone}</span>
              </div>
              <button
                onClick={() => copyToClipboard(contact.phone!, 'phone')}
                className="p-2 rounded-lg hover:bg-surface-3"
              >
                {copiedField === 'phone' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          )}

          {/* Email */}
          {contact.email && (
            <div className="flex items-center justify-between p-3 bg-surface-1 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate">{contact.email}</span>
              </div>
              <button
                onClick={() => copyToClipboard(contact.email!, 'email')}
                className="p-2 rounded-lg hover:bg-surface-3 flex-shrink-0"
              >
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          )}

          {/* Website */}
          {contact.website && (
            <div className="flex items-center justify-between p-3 bg-surface-1 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate">{contact.website}</span>
              </div>
              <button
                onClick={handleWebsite}
                className="p-2 rounded-lg hover:bg-surface-3 flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {/* Key info cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Project price */}
          {contact.project_price && contact.project_price > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Budget</span>
              </div>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {contact.project_price.toLocaleString('fr-FR')} EUR
              </p>
            </div>
          )}

          {/* Assigned user */}
          <div className={cn(
            "p-4 rounded-xl",
            contact.assigned_user_name
              ? "bg-blue-50 dark:bg-blue-900/20"
              : "bg-orange-50 dark:bg-orange-900/20"
          )}>
            <div className={cn(
              "flex items-center gap-2 mb-1",
              contact.assigned_user_name ? "text-primary" : "text-orange-600"
            )}>
              {contact.assigned_user_name ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">Assignation</span>
            </div>
            <p className={cn(
              "text-sm font-semibold",
              contact.assigned_user_name
                ? "text-primary"
                : "text-orange-700 dark:text-orange-400"
            )}>
              {contact.assigned_user_name || 'Non assigne'}
            </p>
          </div>

          {/* Next activity */}
          {contact.next_activity_date && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Prochaine activite</span>
              </div>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                {formatDate(contact.next_activity_date)}
              </p>
            </div>
          )}

          {/* Source */}
          {contact.source && (
            <div className="p-4 bg-surface-1 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium">Source</span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {sourceLabels[contact.source] || contact.source}
              </p>
            </div>
          )}

          {/* Created date */}
          {contact.created_at && (
            <div className="p-4 bg-surface-1 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Cree le</span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {formatDate(contact.created_at)}
              </p>
            </div>
          )}
        </div>

        {/* Notes preview */}
        {contact.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
            <div className="p-3 bg-surface-1 rounded-xl">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {Array.isArray(contact.notes) ? contact.notes.join('\n') : contact.notes}
              </p>
            </div>
          </div>
        )}

        {/* Advance status button */}
        {status.nextStatus && onStatusChange && (
          <button
            onClick={handleAdvanceStatus}
            className="w-full flex items-center justify-center gap-2 p-4 mb-4 bg-indigo-600 text-white rounded-xl font-semibold active:bg-indigo-700 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            {status.nextLabel}
          </button>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 p-3 bg-surface-2 text-muted-foreground rounded-xl font-medium active:bg-surface-3 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          )}

          <button
            onClick={onViewDetails}
            className="flex items-center justify-center gap-2 p-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium active:bg-indigo-200 transition-colors col-span-2"
          >
            Voir fiche complete
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </BottomSheet>
  );
});

export default MobileContactPreview;
