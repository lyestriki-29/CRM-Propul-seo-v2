import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { FilterChip } from './FilterChip';

export function SearchFiltersBar({
  mounted,
  searchTerm,
  setSearchTerm,
  filterPeriod,
  setFilterPeriod,
  completedProjectsCount,
  thisMonthCount,
  thisQuarterCount
}: {
  mounted: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterPeriod: 'all' | 'month' | 'quarter' | 'year';
  setFilterPeriod: (period: 'all' | 'month' | 'quarter' | 'year') => void;
  completedProjectsCount: number;
  thisMonthCount: number;
  thisQuarterCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un projet terminé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full h-12 pl-12 pr-4
              bg-surface-2/50 border border-border/50
              text-white placeholder:text-muted-foreground
              rounded-xl
              focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20
              transition-all duration-200
            "
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip
            label="Tous"
            active={filterPeriod === 'all'}
            onClick={() => setFilterPeriod('all')}
            count={completedProjectsCount}
          />
          <FilterChip
            label="Ce mois"
            active={filterPeriod === 'month'}
            onClick={() => setFilterPeriod('month')}
            count={thisMonthCount}
          />
          <FilterChip
            label="Ce trimestre"
            active={filterPeriod === 'quarter'}
            onClick={() => setFilterPeriod('quarter')}
            count={thisQuarterCount}
          />
          <FilterChip
            label="Cette année"
            active={filterPeriod === 'year'}
            onClick={() => setFilterPeriod('year')}
          />
        </div>
      </div>
    </motion.div>
  );
}
