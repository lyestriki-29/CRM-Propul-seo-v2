export function FilterChip({
  label,
  active,
  onClick,
  count
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
        transition-all duration-200
        ${active
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-surface-2/50 text-muted-foreground border border-border/50 hover:bg-surface-2 hover:text-foreground'
        }
      `}
    >
      {label}
      {count !== undefined && (
        <span className={`
          px-1.5 py-0.5 rounded-md text-xs
          ${active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-surface-3 text-muted-foreground'}
        `}>
          {count}
        </span>
      )}
    </button>
  );
}
