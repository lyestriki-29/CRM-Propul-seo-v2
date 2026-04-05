import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { AnimatedNumber } from './AnimatedNumber';
import { MetricRing } from './MetricRing';
import { StatusDot } from './StatusDot';
import { itemVariants } from '../lib/animations';

interface ContactsCardProps {
  contactsCount: number | undefined;
  leadsCount: number | undefined;
  isPrivacyMode: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export function ContactsCard({ contactsCount, leadsCount, isPrivacyMode, isMobile, onClick }: ContactsCardProps) {
  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-1" : "col-span-6 lg:col-span-4")}>
      <div
        onClick={onClick}
        className={cn(
          "group relative h-full rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 cursor-pointer overflow-hidden transition-all duration-300 hover:border-neon/30 hover:shadow-lg hover:shadow-neon/5",
          isMobile ? "min-h-[160px] p-4" : "min-h-[280px] p-6"
        )}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon/10 to-transparent rounded-full blur-2xl" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-neon/10 border border-neon/20">
              <Users className="h-5 w-5 text-neon-light" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Contacts CRM</h3>
              <p className="text-xs text-muted-foreground">Base de données</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-end justify-between">
              <div>
                {isPrivacyMode ? (
                  <div className="text-4xl font-bold text-muted-foreground font-mono">{'\u2022\u2022\u2022\u2022'}</div>
                ) : (
                  <div className="text-4xl font-bold text-white">
                    <AnimatedNumber value={contactsCount || 0} />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">contacts actifs</p>
              </div>
              <div className="flex items-center justify-center w-16 h-16">
                <MetricRing progress={75} color="violet" size={64} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <StatusDot status="active" />
              <span className="text-xs text-muted-foreground">{leadsCount || 0} leads</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-neon-light group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
