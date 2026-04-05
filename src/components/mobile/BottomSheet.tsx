import { memo, useEffect, useRef, ReactNode, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: 'auto' | 'half' | 'full';
  showHandle?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const BottomSheet = memo(function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  showHandle = true,
  showCloseButton = true,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Gestion du drag pour fermer
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    // Permettre uniquement le drag vers le bas
    if (diff > 0) {
      setDragOffset(diff);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    // Fermer si drag > 100px
    if (dragOffset > 100) {
      onClose();
    }

    setDragOffset(0);
  }, [dragOffset, onClose]);

  if (!isOpen) return null;

  const heightClasses = {
    auto: 'max-h-[85vh]',
    half: 'h-[50vh]',
    full: 'h-[95vh]',
  };

  const content = (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "bg-surface-2",
          "rounded-t-2xl shadow-xl",
          heightClasses[height],
          "flex flex-col",
          !isDragging && "animate-slide-up transition-transform duration-200",
          className
        )}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
        }}
      >
        {/* Handle - zone de drag */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-1 bg-foreground/70 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {title || ''}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-surface-3 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
          {children}
        </div>
      </div>
    </div>
  );

  // Utiliser portal pour render en dehors du DOM parent
  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
});

/**
 * Actions Sheet - Bottom sheet avec liste d'actions
 */
interface ActionItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionItem[];
}

export const ActionsSheet = memo(function ActionsSheet({
  isOpen,
  onClose,
  title,
  actions,
}: ActionsSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      height="auto"
    >
      <div className="p-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              disabled={action.disabled}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl transition-colors",
                "active:bg-surface-3",
                action.disabled && "opacity-50 cursor-not-allowed",
                action.destructive
                  ? "text-red-600 dark:text-red-400"
                  : "text-foreground"
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span className="font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
});

export default BottomSheet;
