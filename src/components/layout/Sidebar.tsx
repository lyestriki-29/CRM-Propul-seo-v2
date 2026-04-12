import { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  Calculator,
  Settings,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  Shield,
  Bot,
  BarChart3,
  Archive,
  UserCheck,
  Database,
  MessageSquare,
  User,
  ListTodo,
  Megaphone,
  Users,
  DollarSign,
  Sparkles,
  LayoutDashboard,
  Globe,
  Settings2,
  type LucideIcon
} from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  permission: string;
}

interface NavSection {
  section: string;
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const {
    activeModule,
    setActiveModule,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useStore();

  const { user } = useAuth();
  const { getUserByAuthId } = useUsers();
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['finance', 'admin', 'perso', 'v2', 'en-cours'])
    // 'crm-v1' absent intentionnellement → replié par défaut
  );

  const isCollapsed = sidebarCollapsed;

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        const userData = await getUserByAuthId(user.id);
        setCurrentUserData(userData);
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      }
    };
    loadUserData();
  }, [user, getUserByAuthId]);

  const isAdmin = currentUserData?.email === 'team@propulseo-site.com';

  const canAccessPage = (pagePermission: string) => {
    if (!currentUserData) return true;
    if (isAdmin) return true;
    return currentUserData[pagePermission] === true;
  };

  const toggleSection = (section: string) => {
    const next = new Set(expandedSections);
    if (next.has(section)) next.delete(section);
    else next.add(section);
    setExpandedSections(next);
  };

  const persoSection: NavSection[] = isAdmin ? [{
    section: 'perso',
    title: 'Personnel',
    items: [
      { id: 'personal-tasks', label: 'Mes Tâches', icon: ListTodo, permission: 'can_view_dashboard' }
    ]
  }] : [];

  const v2Section: NavSection = {
    section: 'v2',
    title: '✦ V2 Beta',
    items: [
      { id: 'dashboard-v2',      label: 'Dashboard V2',        icon: LayoutDashboard, permission: 'can_view_dashboard' },
      { id: 'projects-v2',       label: 'Gestion des projets', icon: Sparkles,        permission: 'can_view_projects' },
      { id: 'monthly-dashboard', label: 'Mois en cours',       icon: BarChart3,       permission: 'can_view_projects' },
    ]
  };

  const enCoursSection: NavSection = {
    section: 'en-cours',
    title: 'En cours',
    items: [
      { id: 'comm-manager', label: 'Communication',  icon: Megaphone, permission: 'can_view_projects' },
      { id: 'erp-manager',  label: 'ERP Sur Mesure', icon: Settings2, permission: 'can_view_projects' },
      { id: 'site-web',     label: 'Site Web & SEO', icon: Globe,     permission: 'can_view_projects' },
    ]
  };

  const navigationItems: NavSection[] = [
    ...persoSection,
    v2Section,
    enCoursSection,
    {
      section: 'crm-v1',
      title: 'CRM v1',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: Home, permission: 'can_view_dashboard' },
        { id: 'crm', label: 'CRM Principal', icon: Database, permission: 'can_view_leads' },
        { id: 'crm-bot-one', label: 'Bot One', icon: Bot, permission: 'can_view_crm_bot_one' },
        { id: 'crm-erp', label: 'CRM ERP', icon: UserCheck, permission: 'can_view_crm_erp' },
        { id: 'projects', label: 'Projets actifs', icon: Briefcase, permission: 'can_view_projects' },
        { id: 'completed-projects', label: 'Terminés', icon: Archive, permission: 'can_view_projects' },
        { id: 'communication', label: 'Production', icon: Megaphone, permission: 'can_view_communication' },
        { id: 'communication-kpi', label: 'KPI', icon: BarChart3, permission: 'can_view_communication' },
        { id: 'communication-clients', label: 'Clients', icon: Users, permission: 'can_view_communication' }
      ]
    },
    {
      section: 'finance',
      title: 'Finance',
      items: [
        { id: 'accounting', label: 'Comptabilité', icon: Calculator, permission: 'can_view_finance' }
      ]
    },
    {
      section: 'admin',
      title: 'Système',
      items: [
        { id: 'settings', label: 'Paramètres', icon: Settings, permission: 'can_view_settings' }
      ]
    }
  ];

  const userInitial = currentUserData?.name?.charAt(0)?.toUpperCase()
    || currentUserData?.email?.charAt(0)?.toUpperCase()
    || 'U';

  const userName = currentUserData?.name
    || currentUserData?.email?.split('@')[0]
    || 'Utilisateur';

  const roleLabel = (() => {
    switch (currentUserData?.role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      case 'developer': return 'Dev';
      case 'sales': return 'Commercial';
      case 'marketing': return 'Marketing';
      case 'ops': return 'Ops';
      default: return 'Membre';
    }
  })();

  return (
    <div className={cn(
      "flex flex-col h-full bg-surface-0 border-r border-border/40 transition-all duration-200 flex-shrink-0",
      isCollapsed ? "w-[60px]" : "w-[240px]"
    )}>
      {/* Logo + collapse */}
      <div className={cn(
        "flex items-center border-b border-border/40 h-14 flex-shrink-0",
        isCollapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczMGXPCETWb8Ku6HzhVzgsxXTD-sXOEX3Lfc_keK6tw8fMlO8lU4RTpdz_NjflmQzSofysQR96H9mTrHbKGx8EZwe7xEyJ9cfgiTWbuO7EA1dKduQas5wycF99B6evargb4Ao8Dv6KKWDIoia3q_M4zf=w510-h489-s-no-gm?authuser=0"
              alt="Propul'SEO"
              className="h-8 w-8 rounded-lg"
            />
            <span className="font-semibold text-foreground text-sm tracking-tight">Propul'SEO</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden py-2",
        isCollapsed ? "px-1.5" : "px-2.5"
      )}>
        {navigationItems.map((section, sectionIndex) => {
          const hasAccessibleItems = section.items.some(item => canAccessPage(item.permission));
          if (!hasAccessibleItems) return null;

          const isExpanded = expandedSections.has(section.section);

          return (
            <div key={section.section} className={cn(sectionIndex > 0 && "mt-3")}>
              {/* Section label */}
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.section)}
                  className="flex items-center justify-between w-full px-2 py-1 mb-0.5 group"
                >
                  <span className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                    {section.title}
                  </span>
                  <ChevronRight className={cn(
                    "h-3 w-3 text-muted-foreground/50 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )} />
                </button>
              )}

              {/* Items */}
              {(isExpanded || isCollapsed) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    if (!canAccessPage(item.permission)) return null;

                    const isActive = activeModule === item.id;
                    const Icon = item.icon;

                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => setActiveModule(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 rounded-md transition-colors duration-150",
                            isCollapsed ? "justify-center p-2" : "px-2.5 py-1.5",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                          )}
                        >
                          <Icon className={cn(
                            "h-4 w-4 flex-shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )} />
                          {!isCollapsed && (
                            <span className={cn(
                              "text-[13px] truncate",
                              isActive ? "font-semibold" : "font-medium"
                            )}>
                              {item.label}
                            </span>
                          )}
                        </button>

                        {/* Tooltip (collapsed) */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-surface-3 text-foreground text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap shadow-md border border-border/50">
                            {item.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={cn(
        "border-t border-border/40 flex-shrink-0",
        isCollapsed ? "p-2" : "px-3 py-3"
      )}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">{userInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">{userName}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">{roleLabel}</span>
                {isAdmin && (
                  <Shield className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative group">
              <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{userInitial}</span>
              </div>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-surface-3 text-foreground text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap shadow-md border border-border/50">
                <div className="font-medium">{userName}</div>
                <div className="text-muted-foreground">{roleLabel}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
