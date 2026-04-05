import { memo, useState, useRef, useCallback, useMemo } from 'react';
import {
  Users,
  Search,
  X,
  Filter,
  ChevronDown,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MobileContactCard } from './MobileContactCard';
import { PullToRefresh } from './PullToRefresh';

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
  assigned_to?: string;
  no_show?: string;
  next_activity_date?: string;
  created_at?: string;
}

interface User {
  id: string;
  name: string;
}

interface StatusTab {
  id: string;
  label: string;
  icon?: string;
  color: string;
  count: number;
}

interface MobileContactListProps {
  contacts: Contact[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onContactClick: (contact: Contact) => void;
  onContactCall: (contact: Contact) => void;
  onContactEmail: (contact: Contact) => void;
  onQuickView: (contact: Contact) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  users?: User[];
  selectedUserId?: string;
  onUserFilterChange?: (userId: string) => void;
}

// Status configurations
const STATUS_TABS: StatusTab[] = [
  { id: 'all', label: 'Tous', color: 'bg-muted-foreground', count: 0 },
  { id: 'prospect', label: 'Prospects', icon: '🎯', color: 'bg-primary', count: 0 },
  { id: 'presentation_envoyee', label: 'Present.', icon: '📧', color: 'bg-purple-500', count: 0 },
  { id: 'meeting_booke', label: 'Meeting', icon: '📅', color: 'bg-primary', count: 0 },
  { id: 'offre_envoyee', label: 'Offre', icon: '💼', color: 'bg-orange-500', count: 0 },
  { id: 'en_attente', label: 'Attente', icon: '⏳', color: 'bg-yellow-500', count: 0 },
  { id: 'signe', label: 'Signes', icon: '✅', color: 'bg-green-500', count: 0 }
];

export const MobileContactList = memo(function MobileContactList({
  contacts,
  loading,
  onRefresh,
  onContactClick,
  onContactCall,
  onContactEmail,
  onQuickView,
  searchTerm,
  onSearchChange,
  users = [],
  selectedUserId = 'all',
  onUserFilterChange
}: MobileContactListProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: contacts.length };

    STATUS_TABS.forEach(tab => {
      if (tab.id !== 'all') {
        counts[tab.id] = contacts.filter(c => c.status === tab.id).length;
      }
    });

    return counts;
  }, [contacts]);

  // Filter contacts by active tab
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.status === activeTab);
    }

    // Sort by next activity date (earliest first), then by creation date
    filtered = [...filtered].sort((a, b) => {
      if (a.next_activity_date && b.next_activity_date) {
        return new Date(a.next_activity_date).getTime() - new Date(b.next_activity_date).getTime();
      }
      if (a.next_activity_date) return -1;
      if (b.next_activity_date) return 1;
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });

    return filtered;
  }, [contacts, activeTab]);

  // Handle call action
  const handleCall = useCallback((contact: Contact) => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
      onContactCall(contact);
    }
  }, [onContactCall]);

  // Handle email action
  const handleEmail = useCallback((contact: Contact) => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
      onContactEmail(contact);
    }
  }, [onContactEmail]);

  // Clear search
  const clearSearch = useCallback(() => {
    onSearchChange('');
    searchInputRef.current?.blur();
  }, [onSearchChange]);

  return (
    <div className="flex flex-col h-full bg-surface-1">
      {/* Search bar - Sticky */}
      <div className={cn(
        "sticky top-14 z-30 bg-surface-2 border-b border-border transition-all",
        isSearchFocused && "shadow-lg"
      )}>
        <div className="p-3">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Rechercher un contact..."
              className="w-full h-10 pl-10 pr-10 rounded-xl bg-surface-2 border-0 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-surface-3"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* User filter button */}
          {users.length > 0 && onUserFilterChange && (
            <button
              onClick={() => setShowUserFilter(!showUserFilter)}
              className={cn(
                "flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                selectedUserId !== 'all'
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "bg-surface-2 text-muted-foreground"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>
                {selectedUserId === 'all'
                  ? 'Tous les leads'
                  : selectedUserId === 'unassigned'
                    ? 'Non assignes'
                    : users.find(u => u.id === selectedUserId)?.name || 'Filtre'}
              </span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 transition-transform",
                showUserFilter && "rotate-180"
              )} />
            </button>
          )}

          {/* User filter dropdown */}
          {showUserFilter && onUserFilterChange && (
            <div className="mt-2 p-2 bg-surface-2 rounded-xl shadow-lg border border-border animate-fade-in">
              <button
                onClick={() => {
                  onUserFilterChange('all');
                  setShowUserFilter(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedUserId === 'all'
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30"
                    : "hover:bg-surface-3"
                )}
              >
                Tous les leads ({contacts.length})
              </button>
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    onUserFilterChange(user.id);
                    setShowUserFilter(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedUserId === user.id
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30"
                      : "hover:bg-surface-3"
                  )}
                >
                  {user.name} ({contacts.filter(c => c.assigned_to === user.id).length})
                </button>
              ))}
              <button
                onClick={() => {
                  onUserFilterChange('unassigned');
                  setShowUserFilter(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedUserId === 'unassigned'
                    ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30"
                    : "hover:bg-surface-3"
                )}
              >
                Non assignes ({contacts.filter(c => !c.assigned_to).length})
              </button>
            </div>
          )}
        </div>

        {/* Status tabs - Horizontal scroll */}
        <div className="flex overflow-x-auto scrollbar-hide px-3 pb-3 gap-2">
          {STATUS_TABS.map(tab => {
            const count = statusCounts[tab.id] || 0;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? `${tab.color} text-white shadow-lg scale-105`
                    : "bg-surface-2 text-muted-foreground border border-border"
                )}
              >
                {tab.icon && <span className="text-sm">{tab.icon}</span>}
                <span>{tab.label}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-surface-2 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact list with pull-to-refresh */}
      <PullToRefresh onRefresh={onRefresh}>
        <div className="flex-1 px-3 pb-24">
          {loading ? (
            // Loading skeleton
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-surface-2 rounded-xl p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-3" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-3 rounded w-3/4" />
                      <div className="h-3 bg-surface-3 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-5 bg-surface-3 rounded-full w-16" />
                        <div className="h-5 bg-surface-3 rounded-full w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                {searchTerm ? (
                  <Search className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {searchTerm ? 'Aucun resultat' : 'Aucun contact'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                {searchTerm
                  ? `Aucun contact ne correspond a "${searchTerm}"`
                  : activeTab !== 'all'
                    ? `Aucun contact avec le statut "${STATUS_TABS.find(t => t.id === activeTab)?.label}"`
                    : 'Creez votre premier contact'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            // Contact list
            <div className="space-y-2 pt-4">
              {/* Results count */}
              <div className="flex items-center justify-between px-1 pb-2">
                <span className="text-sm text-muted-foreground">
                  {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''}
                </span>
                {searchTerm && (
                  <span className="text-xs text-indigo-600">
                    pour "{searchTerm}"
                  </span>
                )}
              </div>

              {/* Contact cards */}
              {filteredContacts.map(contact => (
                <MobileContactCard
                  key={contact.id}
                  contact={contact}
                  onClick={() => onContactClick(contact)}
                  onCall={() => handleCall(contact)}
                  onEmail={() => handleEmail(contact)}
                  onQuickView={() => onQuickView(contact)}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </div>
      </PullToRefresh>
    </div>
  );
});

export default MobileContactList;
