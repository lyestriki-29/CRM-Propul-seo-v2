interface CompletionScoreProps {
  score: number
  size?: number
  showLabel?: boolean
}

export function CompletionScore({ score, size = 36, showLabel = false }: CompletionScoreProps) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 60 ? '#22c55e'  // green-500
    : score >= 30 ? '#f97316' // orange-500
    : '#ef4444'               // red-500

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="-rotate-90">
        {/* Piste de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-white/10"
        />
        {/* Arc de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        {/* Texte centré (rotation inversée pour contrer le -rotate-90) */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size <= 32 ? 9 : 10}
          fontWeight="600"
          fill={color}
          style={{ transform: `rotate(90deg)`, transformOrigin: '50% 50%' }}
        >
          {score}
        </text>
      </svg>
      {showLabel && (
        <span className="text-[10px] text-muted-foreground">Score</span>
      )}
    </div>
  )
}
