import { memo, useState, useRef } from 'react';
import {
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';

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
  created_at?: string;
}

interface MobileContactCardProps {
  contact: Contact;
  onClick: () => void;
  onCall?: () => void;
  onEmail?: () => void;
  onStatusChange?: (newStatus: string) => void;
  onQuickView?: () => void;
  searchTerm?: string;
}

// Status configurations for visual styling
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  prospect: { label: 'Prospect', color: 'text-primary', bgColor: 'bg-blue-50' },
  presentation_envoyee: { label: 'Presentation', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  meeting_booke: { label: 'Meeting', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  offre_envoyee: { label: 'Offre', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  en_attente: { label: 'Attente', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  signe: { label: 'Signe', color: 'text-green-600', bgColor: 'bg-green-50' }
};

// Format date with context (Today, Yesterday, etc.)
const formatDateWithContext = (date: string): string => {
  const today = new Date();
  const activityDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  activityDate.setHours(0, 0, 0, 0);

  const diffTime = activityDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === -1) return "Hier";
  if (diffDays < -1) return `Il y a ${Math.abs(diffDays)}j`;
  if (diffDays === 1) return "Demain";
  return activityDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// Get date color based on urgency
const getDateColor = (date: string): string => {
  const today = new Date();
  const activityDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  activityDate.setHours(0, 0, 0, 0);

  const diffTime = activityDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-red-600 bg-red-50';
  if (diffDays === 0) return 'text-green-600 bg-green-50';
  return 'text-orange-600 bg-orange-50';
};

// Highlight search term in text
const HighlightText = ({ text, searchTerm }: { text: string; searchTerm?: string }) => {
  if (!searchTerm || !text) return <>{text}</>;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
        ) : part
      )}
    </>
  );
};

export const MobileContactCard = memo(function MobileContactCard({
  contact,
  onClick,
  onCall,
  onEmail,
  onQuickView,
  searchTerm
}: MobileContactCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const status = statusConfig[contact.status] || statusConfig.prospect;

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe.current === null && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // Only handle horizontal swipes
    if (isHorizontalSwipe.current) {
      e.preventDefault();
      // Limit swipe range
      const newSwipeX = Math.max(-100, Math.min(100, deltaX));
      setSwipeX(newSwipeX);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    // Trigger actions based on swipe distance
    if (swipeX > 60 && onCall && contact.phone) {
      // Swipe right - Call
      onCall();
    } else if (swipeX < -60 && onEmail && contact.email) {
      // Swipe left - Email
      onEmail();
    }

    // Reset swipe position with animation
    setSwipeX(0);
    isHorizontalSwipe.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-2">
      {/* Background actions revealed on swipe */}
      <div className="absolute inset-0 flex">
        {/* Left action (revealed on swipe right) - Call */}
        <div className={cn(
          "flex items-center justify-start pl-4 w-1/2 transition-opacity",
          swipeX > 20 ? "bg-green-500" : "bg-transparent"
        )}>
          {swipeX > 20 && contact.phone && (
            <div className="text-white flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-sm font-medium">Appeler</span>
            </div>
          )}
        </div>

        {/* Right action (revealed on swipe left) - Email */}
        <div className={cn(
          "flex items-center justify-end pr-4 w-1/2 transition-opacity",
          swipeX < -20 ? "bg-primary" : "bg-transparent"
        )}>
          {swipeX < -20 && contact.email && (
            <div className="text-white flex items-center gap-2">
              <span className="text-sm font-medium">Email</span>
              <Mail className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Main card content */}
      <div
        className={cn(
          "bg-surface-2 p-4 transition-transform",
          !isSwiping && "transition-all duration-300"
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => !isSwiping && onClick()}
      >
        <div className="flex items-start gap-3">
          {/* Avatar / Initial */}
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0",
            status.bgColor, status.color
          )}>
            {(contact.company || contact.name || '?')[0].toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Company name */}
            <h3 className="font-semibold text-foreground truncate text-base">
              <HighlightText text={contact.company || contact.name} searchTerm={searchTerm} />
            </h3>

            {/* Contact name */}
            {contact.company && contact.name && (
              <p className="text-sm text-muted-foreground truncate">
                <HighlightText text={contact.name} searchTerm={searchTerm} />
              </p>
            )}

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Status badge */}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                status.bgColor, status.color
              )}>
                {status.label}
              </span>

              {/* No Show badge */}
              {contact.no_show === 'Oui' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  No Show
                </span>
              )}

              {/* Assigned user */}
              {contact.assigned_user_name ? (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <UserCheck className="w-3 h-3" />
                  {contact.assigned_user_name}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertTriangle className="w-3 h-3" />
                  Non assigne
                </span>
              )}
            </div>

            {/* Price and date row */}
            <div className="flex items-center gap-3 mt-2">
              {/* Project price */}
              {contact.project_price && contact.project_price > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <DollarSign className="w-3.5 h-3.5" />
                  {contact.project_price.toLocaleString('fr-FR')}EUR
                </span>
              )}

              {/* Next activity date */}
              {contact.next_activity_date && (
                <span className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                  getDateColor(contact.next_activity_date)
                )}>
                  <Calendar className="w-3 h-3" />
                  {formatDateWithContext(contact.next_activity_date)}
                </span>
              )}
            </div>
          </div>

          {/* Right side - Quick actions */}
          <div className="flex flex-col items-center gap-2">
            {/* Quick view button */}
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView();
                }}
                className="p-2 rounded-full bg-surface-2 text-muted-foreground active:bg-surface-3"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Chevron indicator */}
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Quick contact actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          {contact.phone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCall?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-600 active:bg-green-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Appeler</span>
            </button>
          )}

          {contact.email && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmail?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 text-primary active:bg-blue-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email</span>
            </button>
          )}

          {contact.website && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(contact.website, '_blank');
              }}
              className="flex items-center justify-center p-2 rounded-lg bg-surface-1 text-muted-foreground active:bg-surface-2 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default MobileContactCard;
