import { motion } from 'framer-motion';
import { Target, Settings, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { itemVariants } from '../lib/animations';

interface Objective {
  label: string;
  current: number;
  target: number;
  unit: string;
  type: string;
}

interface ObjectivesSectionProps {
  objectives: Objective[];
  isPrivacyMode: boolean;
  isMobile: boolean;
  onOpenModal: () => void;
}

export function ObjectivesSection({ objectives, isPrivacyMode, isMobile, onOpenModal }: ObjectivesSectionProps) {
  const colorNames = ['emerald', 'neon', 'amber', 'violet'];
  const colorClasses: Record<string, { text: string; bg: string; ring: string }> = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'from-emerald-500' },
    neon: { text: 'text-neon-light', bg: 'bg-neon', ring: 'from-neon' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500', ring: 'from-amber-500' },
    violet: { text: 'text-neon-glow', bg: 'bg-neon-deep', ring: 'from-neon-deep' },
  };

  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-2" : "col-span-12 lg:col-span-4")}>
      <div className={cn(
        "h-full rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50",
        isMobile ? "p-4" : "p-6 lg:p-8"
      )}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-surface-2">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-white">Objectifs</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onOpenModal} className="text-muted-foreground hover:text-white p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {objectives.map((objective, index) => {
            const progress = Math.min((objective.current / objective.target) * 100, 100);
            const color = colorNames[index % 4];

            return (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{objective.label}</span>
                  <span className={`text-sm font-semibold ${colorClasses[color].text}`}>
                    {isPrivacyMode ? '\u2022\u2022%' : `${Math.round(progress)}%`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${colorClasses[color].ring} to-transparent rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: isPrivacyMode ? '0%' : `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {isPrivacyMode ? '\u2022\u2022\u2022' : objective.current.toLocaleString()}{objective.unit}
                  </span>
                  <span>
                    {isPrivacyMode ? '\u2022\u2022\u2022' : objective.target.toLocaleString()}{objective.unit}
                  </span>
                </div>
                {progress >= 100 && !isPrivacyMode && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Objectif atteint !</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
