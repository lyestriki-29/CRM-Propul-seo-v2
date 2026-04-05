import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

export function MetricCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  color,
  delay = 0
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  color: 'emerald' | 'cyan' | 'amber' | 'violet';
  delay?: number;
}) {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'hover:shadow-emerald-500/10',
      gradient: 'from-emerald-500/10',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'hover:shadow-cyan-500/10',
      gradient: 'from-cyan-500/10',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'hover:shadow-amber-500/10',
      gradient: 'from-amber-500/10',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      glow: 'hover:shadow-violet-500/10',
      gradient: 'from-violet-500/10',
    },
  };

  const c = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative overflow-hidden rounded-2xl
        glass-surface-static p-5
        transition-all duration-300 hover:shadow-xl ${c.glow} hover:-translate-y-0.5
      `}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${c.gradient} to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />

      <div className="relative z-10">
        <div className={`inline-flex p-2.5 rounded-xl ${c.bg} ${c.border} border mb-3`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-2xl font-bold ${c.text}`}>
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
      </div>
    </motion.div>
  );
}
