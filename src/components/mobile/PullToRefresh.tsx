import { memo, useRef, useState, useCallback, ReactNode } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh = memo(function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;

    // Vérifier si on est en haut du conteneur
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing || disabled) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    // Ne pull que vers le bas et si on est en haut
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      // Résistance progressive (plus on tire, plus c'est dur)
      const resistance = Math.min(diff * 0.4, 120);
      setPullDistance(resistance);

      // Empêcher le scroll par défaut si on pull
      if (diff > 10) {
        e.preventDefault();
      }
    }
  }, [isRefreshing, disabled]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || disabled) return;

    isPulling.current = false;

    if (pullDistance > threshold && !isRefreshing) {
      // Déclencher le refresh
      setIsRefreshing(true);
      setPullDistance(60); // Position de chargement

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Reset
      setPullDistance(0);
    }

    startY.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh, disabled]);

  const progress = Math.min(pullDistance / threshold, 1);
  const readyToRefresh = pullDistance >= threshold;

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full overflow-y-auto overscroll-contain relative",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicateur de pull */}
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-200",
          "absolute left-0 right-0 z-10",
          isRefreshing ? "opacity-100" : "opacity-0"
        )}
        style={{
          height: pullDistance,
          top: 0,
          opacity: progress,
        }}
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            "bg-surface-2 shadow-lg",
            "transition-transform duration-200"
          )}
          style={{
            transform: `scale(${Math.min(progress, 1)})`,
          }}
        >
          {isRefreshing ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <RefreshCw
              className={cn(
                "w-5 h-5 transition-all duration-200",
                readyToRefresh
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              style={{
                transform: `rotate(${pullDistance * 2}deg)`,
              }}
            />
          )}
        </div>
      </div>

      {/* Contenu avec décalage */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default PullToRefresh;
