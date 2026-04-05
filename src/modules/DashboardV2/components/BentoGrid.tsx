// src/modules/DashboardV2/components/BentoGrid.tsx
import type { ReactNode } from 'react'

interface BentoGridProps {
  left: ReactNode
  right: ReactNode
}

export function BentoGrid({ left, right }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 h-full">
      {/* order-2 mobile → apparaît après right ; order-1 desktop → première colonne */}
      <div className="flex flex-col gap-4 order-2 md:order-1">{left}</div>
      {/* order-1 mobile → apparaît en premier ; order-2 desktop → deuxième colonne */}
      <div className="flex flex-col gap-4 order-1 md:order-2">{right}</div>
    </div>
  )
}
