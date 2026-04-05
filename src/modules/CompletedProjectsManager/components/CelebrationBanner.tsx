import { motion } from 'framer-motion';
import { Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export function CelebrationBanner({
  completedCount,
  totalRevenue,
  onContinue
}: {
  completedCount: number;
  totalRevenue: number;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 border border-emerald-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 justify-center lg:justify-start">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Félicitations pour votre succès !
            </h3>
            <p className="text-muted-foreground">
              Vous avez terminé <span className="font-semibold text-emerald-400">{completedCount} projets</span> avec succès,
              générant un total de <span className="font-semibold text-amber-400">{totalRevenue.toLocaleString()}€</span> de chiffre d'affaires.
            </p>
          </div>
          <Button
            onClick={onContinue}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
          >
            Continuer sur cette lancée
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
