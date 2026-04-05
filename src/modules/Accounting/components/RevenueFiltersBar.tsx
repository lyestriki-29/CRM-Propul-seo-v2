import { Filter, Search } from 'lucide-react';
import type { RevenueCategory, RevenuePeriodFilter } from '../constants';

interface RevenueFiltersBarProps {
  period: RevenuePeriodFilter;
  categoryFilter: 'all' | RevenueCategory;
  clientSearch: string;
  onPeriodChange: (v: RevenuePeriodFilter) => void;
  onCategoryFilterChange: (v: 'all' | RevenueCategory) => void;
  onClientSearchChange: (v: string) => void;
}

export function RevenueFiltersBar({
  period,
  categoryFilter,
  clientSearch,
  onPeriodChange,
  onCategoryFilterChange,
  onClientSearchChange,
}: RevenueFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-surface-2/50 border border-border/30">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filtres
      </div>

      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value as RevenuePeriodFilter)}
        className="h-9 px-3 rounded-md border border-border bg-surface-2 text-foreground text-sm"
      >
        <option value="month">Ce mois</option>
        <option value="quarter">Ce trimestre</option>
        <option value="year">Cette année</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value as 'all' | RevenueCategory)}
        className="h-9 px-3 rounded-md border border-border bg-surface-2 text-foreground text-sm"
      >
        <option value="all">Toutes catégories</option>
        <option value="site_internet">Site Internet</option>
        <option value="erp">ERP</option>
        <option value="communication">Communication</option>
      </select>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={clientSearch}
          onChange={(e) => onClientSearchChange(e.target.value)}
          placeholder="Rechercher client..."
          className="h-9 pl-8 pr-3 rounded-md border border-border bg-surface-2 text-foreground text-sm w-[180px] placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
