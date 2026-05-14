import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { itemVariants } from '../lib/animations';

interface QuickStatsCardProps {
  isPrivacyMode: boolean;
  isMobile: boolean;
}

export function QuickStatsCard({ isPrivacyMode, isMobile }: QuickStatsCardProps) {
  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-1" : "col-span-12 lg:col-span-4")}>
      <div className={cn(
        "h-full rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50",
        isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-surface-3">
            <Zap className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-white">Activité rapide</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Taux de conversion</span>
            <span className="text-sm font-medium text-white">
              {isPrivacyMode ? '\u2022\u2022%' : '24%'}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-neon-glow rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '24%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Projets livrés</span>
            <span className="text-sm font-medium text-white">
              {isPrivacyMode ? '\u2022\u2022' : '8'}/12
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-neon rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '66%' }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
