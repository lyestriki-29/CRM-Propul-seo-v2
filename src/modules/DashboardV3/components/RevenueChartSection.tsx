import { motion } from 'framer-motion';
import { BarChart3, EyeOff, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { RevenueChart } from '../../../components/charts/RevenueChart';
import { EmptyState } from '../../../components/common/EmptyState';
import { cn } from '../../../lib/utils';
import { itemVariants } from '../lib/animations';

interface RevenueChartSectionProps {
  isPrivacyMode: boolean;
  isMobile: boolean;
  accountingLoading: boolean;
  accountingEntries: unknown[] | null | undefined;
  onNavigateToAccounting: () => void;
}

export function RevenueChartSection({ isPrivacyMode, isMobile, accountingLoading, accountingEntries, onNavigateToAccounting }: RevenueChartSectionProps) {
  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-2" : "col-span-12 lg:col-span-8")}>
      <div className={cn(
        "rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50",
        isMobile ? "p-4" : "p-6 lg:p-8"
      )}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-surface-3">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Évolution du chiffre d'affaires</h3>
              <p className="text-xs text-muted-foreground">Comparaison mensuelle</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onNavigateToAccounting} className="text-muted-foreground hover:text-white">
            Voir détails
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className={cn(isMobile ? "h-60" : "h-80")}>
          {isPrivacyMode ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <EyeOff className="h-12 w-12 text-surface-3 mx-auto mb-3" />
                <p className="text-muted-foreground">Données masquées</p>
              </div>
            </div>
          ) : accountingLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-border border-t-neon rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Chargement des données...</p>
              </div>
            </div>
          ) : accountingEntries && (accountingEntries as unknown[]).length > 0 ? (
            <RevenueChart isPrivacyMode={false} />
          ) : (
            <EmptyState
              icon={<BarChart3 className="h-8 w-8" />}
              title="Aucune donnée comptable"
              description="Ajoutez des entrées pour visualiser l'évolution."
              actionLabel="Ajouter une entrée"
              onAction={onNavigateToAccounting}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
