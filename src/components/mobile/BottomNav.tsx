import { memo, useState } from 'react';
import {
  Home,
  Users,
  Briefcase,
  CheckSquare,
  Menu,
  Calculator,
  Settings,
  Bot,
  Archive,
  X
} from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: Home, label: 'Accueil' },
  { id: 'crm', icon: Users, label: 'CRM' },
  { id: 'projects', icon: Briefcase, label: 'Projets' },
  { id: 'accounting', icon: Calculator, label: 'Compta' },
];

const MORE_NAV_ITEMS: NavItem[] = [
  { id: 'crm-bot-one', icon: Bot, label: 'CRM Bot One' },
  { id: 'crm-erp', icon: Briefcase, label: 'CRM ERP' },
  { id: 'completed-projects', icon: Archive, label: 'Projets termines' },
  { id: 'settings', icon: Settings, label: 'Parametres' },
];

export const BottomNav = memo(function BottomNav() {
  const { activeModule, setActiveModule } = useStore();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleNavClick = (moduleId: string) => {
    setActiveModule(moduleId);
    setIsMoreOpen(false);
  };

  const isItemActive = (itemId: string) => activeModule === itemId;
  const isMoreActive = MORE_NAV_ITEMS.some(item => activeModule === item.id);

  return (
    <>
      {/* Overlay */}
      {isMoreOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* More menu - Bottom Sheet */}
      {isMoreOpen && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-50 bg-surface-1 rounded-t-2xl shadow-2xl animate-slide-up pb-safe">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-surface-3 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border/30">
            <h3 className="text-lg font-semibold text-foreground">
              Plus d'options
            </h3>
            <button
              onClick={() => setIsMoreOpen(false)}
              className="p-2 -mr-2 rounded-full hover:bg-surface-3 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Items */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {MORE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-neon/10 text-neon-glow"
                      : "bg-surface-2 text-muted-foreground active:bg-surface-3"
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 mb-2",
                    isActive ? "text-neon-glow" : ""
                  )} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-0/95 backdrop-blur-md border-t border-border/30 pb-safe">
        <div className="flex items-center justify-around h-16">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full transition-colors duration-200 touch-feedback",
                  isActive
                    ? "text-neon-glow"
                    : "text-muted-foreground"
                )}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs mt-1",
                  isActive ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors duration-200 touch-feedback",
              isMoreOpen || isMoreActive
                ? "text-neon-glow"
                : "text-muted-foreground"
            )}
          >
            <Menu
              className="w-6 h-6"
              strokeWidth={isMoreOpen || isMoreActive ? 2.5 : 2}
            />
            <span className={cn(
              "text-xs mt-1",
              isMoreOpen || isMoreActive ? "font-semibold" : "font-medium"
            )}>
              Plus
            </span>
          </button>
        </div>
      </nav>
    </>
  );
});

export default BottomNav;
