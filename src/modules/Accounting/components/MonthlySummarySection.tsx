import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Receipt, PieChart, Activity, Settings } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { cn } from '../../../lib/utils';

export function MonthlySummarySection({
  selectedMonth,
  currentMonthStats,
  isMobile,
  onManageTransactions
}: {
  selectedMonth: Date;
  currentMonthStats: {
    revenue: number;
    expenses: number;
    result: number;
    transactionCount: number;
  };
  isMobile: boolean;
  onManageTransactions?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className={cn("text-muted-foreground", isMobile ? "h-4 w-4" : "h-5 w-5")} />
          <h2 className={cn("font-semibold text-white", isMobile ? "text-base" : "text-lg")}>
            {selectedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        {onManageTransactions && (
          <button
            onClick={onManageTransactions}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Gérer les transactions</span>
          </button>
        )}
      </div>

      <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4 gap-4")}>
        <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm text-muted-foreground">Revenus</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            <AnimatedCounter value={currentMonthStats.revenue} suffix="€" />
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10">
              <ArrowDownRight className="h-4 w-4 text-rose-400" />
            </div>
            <span className="text-sm text-muted-foreground">Dépenses</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">
            <AnimatedCounter value={currentMonthStats.expenses} suffix="€" />
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${currentMonthStats.result >= 0 ? 'bg-cyan-500/10' : 'bg-rose-500/10'}`}>
              <PieChart className={`h-4 w-4 ${currentMonthStats.result >= 0 ? 'text-cyan-400' : 'text-rose-400'}`} />
            </div>
            <span className="text-sm text-muted-foreground">Résultat</span>
          </div>
          <p className={`text-2xl font-bold ${currentMonthStats.result >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            <AnimatedCounter value={currentMonthStats.result} suffix="€" />
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-violet-500/10">
              <Activity className="h-4 w-4 text-violet-400" />
            </div>
            <span className="text-sm text-muted-foreground">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-violet-400">
            <AnimatedCounter value={currentMonthStats.transactionCount} />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
