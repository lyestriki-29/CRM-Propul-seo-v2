import { motion } from 'framer-motion';

interface MetricRingProps {
  progress: number;
  color: string;
  size?: number;
}

const colorMap: Record<string, { stroke: string; glow: string }> = {
  emerald: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  cyan: { stroke: '#764AC9', glow: 'rgba(118, 74, 201, 0.4)' },
  amber: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  rose: { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  violet: { stroke: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
};

export function MetricRing({ progress, color, size = 120 }: MetricRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const colors = colorMap[color] || colorMap.violet;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-3"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
        />
      </svg>
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: colors.stroke }}
      />
    </div>
  );
}
