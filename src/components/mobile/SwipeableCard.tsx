import { memo, useRef, useState, useCallback, ReactNode } from 'react';
import { Phone, Mail, Trash2, Edit, Archive } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SwipeAction {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color: 'green' | 'blue' | 'orange' | 'red' | 'gray';
  label?: string;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
}

const colorClasses = {
  green: 'bg-green-500',
  blue: 'bg-primary',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  gray: 'bg-muted-foreground',
};

export const SwipeableCard = memo(function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  className,
  disabled = false,
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);

  const ACTION_WIDTH = 70;
  const LEFT_MAX = leftActions.length * ACTION_WIDTH;
  const RIGHT_MAX = rightActions.length * ACTION_WIDTH;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    isSwiping.current = true;
    setIsAnimating(false);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current || disabled) return;

    currentX.current = e.touches[0].clientX;
    const diff = startX.current - currentX.current;

    // Limiter le swipe avec résistance
    let newOffset = diff;

    // Swipe vers la gauche (révèle actions droite)
    if (diff > 0 && rightActions.length > 0) {
      if (diff > RIGHT_MAX) {
        newOffset = RIGHT_MAX + (diff - RIGHT_MAX) * 0.2; // Résistance
      }
    }
    // Swipe vers la droite (révèle actions gauche)
    else if (diff < 0 && leftActions.length > 0) {
      if (Math.abs(diff) > LEFT_MAX) {
        newOffset = -(LEFT_MAX + (Math.abs(diff) - LEFT_MAX) * 0.2); // Résistance
      }
    }
    // Aucune action de ce côté - résistance forte
    else {
      newOffset = diff * 0.1;
    }

    setSwipeOffset(newOffset);
  }, [disabled, leftActions.length, rightActions.length, LEFT_MAX, RIGHT_MAX]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current || disabled) return;

    isSwiping.current = false;
    setIsAnimating(true);

    // Snap aux positions
    const threshold = ACTION_WIDTH * 0.5;

    if (swipeOffset > threshold && rightActions.length > 0) {
      // Snap à droite - montrer actions droite
      setSwipeOffset(RIGHT_MAX);
    } else if (swipeOffset < -threshold && leftActions.length > 0) {
      // Snap à gauche - montrer actions gauche
      setSwipeOffset(-LEFT_MAX);
    } else {
      // Reset
      setSwipeOffset(0);
    }
  }, [disabled, swipeOffset, rightActions.length, leftActions.length, LEFT_MAX, RIGHT_MAX]);

  const resetSwipe = useCallback(() => {
    setIsAnimating(true);
    setSwipeOffset(0);
  }, []);

  const handleActionClick = useCallback((action: SwipeAction) => {
    action.onClick();
    resetSwipe();
  }, [resetSwipe]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Actions gauche (swipe vers la droite) */}
      {leftActions.length > 0 && (
        <div
          className="absolute inset-y-0 left-0 flex items-stretch"
          style={{ width: LEFT_MAX }}
        >
          {leftActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={cn(
                  "flex flex-col items-center justify-center transition-opacity",
                  colorClasses[action.color]
                )}
                style={{ width: ACTION_WIDTH }}
              >
                <Icon className="w-6 h-6 text-white" />
                {action.label && (
                  <span className="text-xs text-white mt-1">{action.label}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Actions droite (swipe vers la gauche) */}
      {rightActions.length > 0 && (
        <div
          className="absolute inset-y-0 right-0 flex items-stretch"
          style={{ width: RIGHT_MAX }}
        >
          {rightActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={cn(
                  "flex flex-col items-center justify-center transition-opacity",
                  colorClasses[action.color]
                )}
                style={{ width: ACTION_WIDTH }}
              >
                <Icon className="w-6 h-6 text-white" />
                {action.label && (
                  <span className="text-xs text-white mt-1">{action.label}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Contenu principal */}
      <div
        className={cn(
          "relative bg-surface-2",
          isAnimating && "transition-transform duration-200 ease-out"
        )}
        style={{ transform: `translateX(${-swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={swipeOffset !== 0 ? resetSwipe : undefined}
      >
        {children}
      </div>
    </div>
  );
});

/**
 * Preset d'actions communes pour les contacts
 */
export const useContactSwipeActions = (contact: {
  phone?: string;
  email?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const leftActions: SwipeAction[] = [];
  const rightActions: SwipeAction[] = [];

  if (contact.phone) {
    leftActions.push({
      icon: Phone,
      onClick: () => window.open(`tel:${contact.phone}`),
      color: 'green',
      label: 'Appeler',
    });
  }

  if (contact.email) {
    leftActions.push({
      icon: Mail,
      onClick: () => window.open(`mailto:${contact.email}`),
      color: 'blue',
      label: 'Email',
    });
  }

  if (contact.onEdit) {
    rightActions.push({
      icon: Edit,
      onClick: contact.onEdit,
      color: 'orange',
      label: 'Modifier',
    });
  }

  if (contact.onDelete) {
    rightActions.push({
      icon: Trash2,
      onClick: contact.onDelete,
      color: 'red',
      label: 'Suppr.',
    });
  }

  return { leftActions, rightActions };
};

export default SwipeableCard;
