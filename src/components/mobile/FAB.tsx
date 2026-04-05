import { memo, useState, ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FABProps {
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  label?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-center';
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

const colorClasses = {
  blue: 'bg-primary hover:bg-primary/90 active:bg-primary/80',
  green: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
  red: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
  orange: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
  purple: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
};

export const FAB = memo(function FAB({
  icon: Icon = Plus,
  onClick,
  label,
  className,
  position = 'bottom-right',
  color = 'blue',
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'right-4 bottom-20',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-20',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "md:hidden fixed z-40",
        "w-14 h-14 rounded-full shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-200",
        "active:scale-95 active:shadow-md",
        colorClasses[color],
        positionClasses[position],
        className
      )}
      aria-label={label}
    >
      <Icon className="w-6 h-6 text-white" />
    </button>
  );
});

/**
 * SpeedDial - FAB avec menu d'actions
 */
interface SpeedDialAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'gray';
}

interface SpeedDialProps {
  actions: SpeedDialAction[];
  className?: string;
  mainIcon?: React.ComponentType<{ className?: string }>;
  mainColor?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

export const SpeedDial = memo(function SpeedDial({
  actions,
  className,
  mainIcon: MainIcon = Plus,
  mainColor = 'blue',
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actionColorClasses = {
    blue: 'bg-primary',
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    gray: 'bg-muted-foreground',
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn("md:hidden fixed right-4 bottom-20 z-50", className)}>
        {/* Actions */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 mb-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-slide-up"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Label */}
                  <span className="bg-surface-1 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {action.label}
                  </span>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full shadow-lg",
                      "flex items-center justify-center",
                      "transition-all duration-200 active:scale-95",
                      actionColorClasses[action.color || 'gray']
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg",
            "flex items-center justify-center",
            "transition-all duration-200",
            "active:scale-95",
            colorClasses[mainColor]
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200" />
          ) : (
            <MainIcon className="w-6 h-6 text-white transition-transform duration-200" />
          )}
        </button>
      </div>
    </>
  );
});

export default FAB;
