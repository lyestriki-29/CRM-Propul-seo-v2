import { Globe, Server, Megaphone } from 'lucide-react';
import { FinancialCard } from './FinancialCard';
import { cn } from '../../../lib/utils';

interface RevenueCategoryCardsProps {
  categoryTotals: { site_internet: number; erp: number; communication: number };
  categoryPercentages: { site_internet: number; erp: number; communication: number };
  isMobile: boolean;
}

export function RevenueCategoryCards({ categoryTotals, categoryPercentages, isMobile }: RevenueCategoryCardsProps) {
  return (
    <div className={cn('grid gap-4', isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3')}>
      <FinancialCard
        icon={Globe}
        label="Site Internet"
        value={categoryTotals.site_internet}
        subtitle={`${categoryPercentages.site_internet}% du CA total`}
        color="cyan"
        delay={0.1}
      />
      <FinancialCard
        icon={Server}
        label="ERP"
        value={categoryTotals.erp}
        subtitle={`${categoryPercentages.erp}% du CA total`}
        color="violet"
        delay={0.15}
      />
      <FinancialCard
        icon={Megaphone}
        label="Communication"
        value={categoryTotals.communication}
        subtitle={`${categoryPercentages.communication}% du CA total`}
        color="amber"
        delay={0.2}
      />
    </div>
  );
}
