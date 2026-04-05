import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { MobileHeader } from '../../components/mobile/MobileHeader';
import { cn } from '../../lib/utils';
import { useAccountingData } from './hooks/useAccountingData';
import { StatusDot } from './components/StatusDot';
import { MonthSelector } from './components/MonthSelector';
import { AnnualStatsSection } from './components/AnnualStatsSection';
import { RevenueBreakdownSection } from './components/RevenueBreakdownSection';
import { MonthlySummarySection } from './components/MonthlySummarySection';
import { MonthlyTransactionsModal } from './MonthlyTransactionsModal';
import type { AccountingEntry } from '../../hooks/useMonthlyAccounting';

export function Accounting() {
  const {
    selectedMonth,
    mounted,
    currentYear,
    isMobile,
    annualStats,
    accounting_entries,
    currentMonthStats,
    navigateMonth,
    canGoPrev,
    canGoNext,
    generateSparklineData,
    loading,
    containerVariants,
    refreshAnnualData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useAccountingData();

  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  const handleAdd = async (entry: Omit<AccountingEntry, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await addTransaction(entry);
    if (result.success) {
      refreshAnnualData();
    }
    return result;
  };

  const handleUpdate = async (id: string, updates: Partial<AccountingEntry>) => {
    const result = await updateTransaction(id, updates);
    if (result.success) {
      refreshAnnualData();
    }
    return result;
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTransaction(id);
    if (result.success) {
      refreshAnnualData();
    }
    return result;
  };

  return (
    <div className={cn(
      "min-h-screen text-white relative overflow-hidden",
      isMobile && "pb-20"
    )}>
      {isMobile && <MobileHeader title="Comptabilité" />}

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-surface-1 to-surface-1" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        {!isMobile && (
          <>
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <div className={cn(
        "relative z-10 max-w-[1600px] mx-auto",
        isMobile ? "p-4" : "p-6 lg:p-8"
      )}>
        {isMobile && (
          <div className="mb-4">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={navigateMonth}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
            />
          </div>
        )}

        {!isMobile && (
          <motion.header
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <StatusDot color="emerald" />
                    <span className="text-xs font-medium text-emerald-400">Temps réel</span>
                  </div>
                  <Badge className="bg-surface-2 text-foreground border-border">
                    {currentYear}
                  </Badge>
                </div>
                <h1
                  className="text-3xl lg:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="text-white">Comptabilité</span>
                  <span className="ml-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Financière
                  </span>
                </h1>
                <p className="mt-2 text-muted-foreground text-sm lg:text-base">
                  Suivi en temps réel de vos revenus et dépenses
                </p>
              </div>

              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={navigateMonth}
                canGoPrev={canGoPrev}
                canGoNext={canGoNext}
              />
            </div>
          </motion.header>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-border border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des données financières...</p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            className="space-y-8"
          >
            <AnnualStatsSection
              annualStats={annualStats}
              generateSparklineData={generateSparklineData}
              currentYear={currentYear}
              isMobile={isMobile}
            />

            <RevenueBreakdownSection isMobile={isMobile} />

            <MonthlySummarySection
              selectedMonth={selectedMonth}
              currentMonthStats={currentMonthStats}
              isMobile={isMobile}
              onManageTransactions={() => setShowTransactionsModal(true)}
            />
          </motion.div>
        )}
      </div>

      <MonthlyTransactionsModal
        open={showTransactionsModal}
        onClose={() => setShowTransactionsModal(false)}
        month={selectedMonth}
        accounting_entries={(accounting_entries || []) as AccountingEntry[]}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
