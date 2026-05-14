import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { AnimatedNumber } from './AnimatedNumber';
import { itemVariants } from '../lib/animations';

interface RevenueCardProps {
  currentYear: number;
  currentYearRevenue: number;
  accountingLoading: boolean;
  isPrivacyMode: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export function RevenueCard({ currentYear, currentYearRevenue, accountingLoading, isPrivacyMode, isMobile, onClick }: RevenueCardProps) {
  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-2" : "col-span-12 lg:col-span-8")}>
      <div
        onClick={onClick}
        className={cn(
          "group relative h-full rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 cursor-pointer overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5",
          isMobile ? "min-h-[180px] p-4" : "min-h-[280px] p-6 lg:p-8"
        )}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:from-emerald-500/15 transition-all duration-500" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Chiffre d'affaires</h3>
                <p className="text-sm text-muted-foreground">Année {currentYear}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">+12.5%</span>
            </div>
          </div>

          <div className="flex-1 flex items-center">
            <div className="flex-1">
              <div className={cn(isMobile ? "mb-2" : "mb-4")}>
                {isPrivacyMode ? (
                  <div className={cn("font-bold text-muted-foreground font-mono", isMobile ? "text-3xl" : "text-5xl lg:text-6xl")}>
                    {'\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                  </div>
                ) : (
                  <div className={cn("font-bold bg-gradient-to-r from-emerald-400 to-neon-light bg-clip-text text-transparent", isMobile ? "text-3xl" : "text-5xl lg:text-6xl")}>
                    <AnimatedNumber value={currentYearRevenue} suffix={'\u20AC'} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">
                    {accountingLoading ? 'Chargement...' : 'Données temps réel'}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            <div className="hidden lg:block w-48 h-24 opacity-50 group-hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 Q30,50 50,55 T100,40 T150,45 T200,20" fill="none" stroke="#10b981" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <path d="M0,60 Q30,50 50,55 T100,40 T150,45 T200,20 V80 H0 Z" fill="url(#chartGradient)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
