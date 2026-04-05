// src/modules/ProjectDetailsV2/components/AiSummaryCard.tsx
import { useState } from 'react'
import { Sparkles, RefreshCw, Clock, AlertCircle } from 'lucide-react'
import { formatDistanceToNow, parseISO, differenceInHours } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { useAiSummary } from '../hooks/useAiSummary'
import type { ProjectV2 } from '../../../types/project-v2'

interface AiSummaryCardProps {
  project: ProjectV2
  onRefresh: () => void
}

const BLOCKS = [
  { key: 'situation' as const, label: 'Situation actuelle', color: 'text-blue-400' },
  { key: 'action' as const, label: 'Action en cours', color: 'text-amber-400' },
  { key: 'milestone' as const, label: 'Prochain jalon', color: 'text-green-400' },
]

export function AiSummaryCard({ project, onRefresh }: AiSummaryCardProps) {
  const { generating, error, generate } = useAiSummary(onRefresh)
  const [forceRegen, setForceRegen] = useState(false)

  const summary = project.ai_summary
  const generatedAt = project.ai_summary_generated_at
  const hoursSince = generatedAt ? differenceInHours(new Date(), parseISO(generatedAt)) : null
  const isFresh = hoursSince !== null && hoursSince < 24

  const handleGenerate = async () => {
    await generate(project.id)
    setForceRegen(false)
  }

  return (
    <Card className="bg-surface-2 border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            Résumé IA
          </CardTitle>
          <div className="flex items-center gap-2">
            {generatedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatDistanceToNow(parseISO(generatedAt), { locale: fr, addSuffix: true })}
              </span>
            )}
            {isFresh && !forceRegen ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-muted-foreground"
                onClick={() => setForceRegen(true)}
              >
                Régénérer
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {summary ? 'Régénérer' : 'Résumer avec IA'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive mb-3 p-2 bg-destructive/10 rounded">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        {generating && !summary && (
          <div className="space-y-3 animate-pulse">
            {BLOCKS.map((b) => (
              <div key={b.key}>
                <div className="h-3 w-24 bg-muted rounded mb-1" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-4/5 bg-muted rounded mt-1" />
              </div>
            ))}
          </div>
        )}

        {!generating && !summary && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun résumé généré — cliquez sur "Résumer avec IA" pour démarrer.
          </p>
        )}

        {summary && (
          <div className="space-y-3">
            {BLOCKS.map((block) => (
              <div key={block.key}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${block.color}`}>
                  {block.label}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {summary[block.key]}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
