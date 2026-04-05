// src/modules/DashboardV2/components/BentoGrid.tsx
import type { ReactNode } from 'react'

interface BentoGridProps {
  left: ReactNode
  right: ReactNode
}

export function BentoGrid({ left, right }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 h-full">
      {/* Mobile : colonne droite (KPIs + agenda) en premier */}
      <div className="md:hidden flex flex-col gap-4">{right}</div>
      {/* Colonne gauche — actions + IA + graphique */}
      <div className="flex flex-col gap-4">{left}</div>
      {/* Colonne droite — KPIs + agenda + tâches (cachée mobile, déjà au-dessus) */}
      <div className="hidden md:flex flex-col gap-4">{right}</div>
    </div>
  )
}
