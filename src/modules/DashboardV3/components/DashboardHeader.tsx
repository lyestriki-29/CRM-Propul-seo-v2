import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { StatusDot } from './StatusDot';

interface DashboardHeaderProps {
  mounted: boolean;
  formattedDate: string;
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
}

export function DashboardHeader({ mounted, formattedDate, isPrivacyMode, onTogglePrivacy }: DashboardHeaderProps) {
  return (
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
              <StatusDot status="active" />
              <span className="text-xs font-medium text-emerald-400">Système opérationnel</span>
            </div>
            <span className="text-xs text-muted-foreground capitalize">{formattedDate}</span>
          </div>
          <h1
            className="text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="text-white">Tableau de bord</span>
            <span className="ml-3 bg-gradient-to-r from-neon-light to-neon-glow bg-clip-text text-transparent">
              Propul'SEO
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm lg:text-base">
            Vue d'ensemble de votre activité en temps réel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePrivacy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
              ${isPrivacyMode
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                : 'bg-surface-2/50 text-muted-foreground border border-border/50 hover:bg-surface-3 hover:text-foreground'
              }
            `}
          >
            {isPrivacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="text-sm">{isPrivacyMode ? 'Masqué' : 'Masquer'}</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
