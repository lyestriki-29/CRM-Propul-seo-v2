import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useRevenueBreakdown } from '../hooks/useRevenueBreakdown';
import { RevenueCategoryCards } from './RevenueCategoryCards';
import { RevenueDistributionChart } from './RevenueDistributionChart';
import { RevenueFiltersBar } from './RevenueFiltersBar';
import { RevenueDetailTable } from './RevenueDetailTable';

interface RevenueBreakdownSectionProps {
  isMobile: boolean;
}

export function RevenueBreakdownSection({ isMobile }: RevenueBreakdownSectionProps) {
  const {
    filteredRows,
    loading,
    period,
    setPeriod,
    categoryFilter,
    setCategoryFilter,
    clientSearch,
    setClientSearch,
    categoryTotals,
    categoryPercentages,
    chartData,
    communicationChartData,
  } = useRevenueBreakdown();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-8 h-8 border-2 border-border border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <PieChart className={cn('text-muted-foreground', isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
        <h2 className={cn('font-semibold text-white', isMobile ? 'text-base' : 'text-lg')}>
          Répartition du Chiffre d'Affaires
        </h2>
      </div>

      <RevenueFiltersBar
        period={period}
        categoryFilter={categoryFilter}
        clientSearch={clientSearch}
        onPeriodChange={setPeriod}
        onCategoryFilterChange={setCategoryFilter}
        onClientSearchChange={setClientSearch}
      />

      <RevenueCategoryCards
        categoryTotals={categoryTotals}
        categoryPercentages={categoryPercentages}
        isMobile={isMobile}
      />

      <div className={cn('grid gap-4', isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2')}>
        <RevenueDistributionChart
          chartData={chartData}
          communicationChartData={communicationChartData}
          categoryFilter={categoryFilter}
        />
        <RevenueDetailTable
          rows={filteredRows}
          categoryFilter={categoryFilter}
        />
      </div>
    </motion.div>
  );
}
