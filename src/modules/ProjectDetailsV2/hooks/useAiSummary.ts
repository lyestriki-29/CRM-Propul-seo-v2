// src/modules/ProjectDetailsV2/hooks/useAiSummary.ts
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

interface UseAiSummaryResult {
  generating: boolean
  error: string | null
  generate: (projectId: string) => Promise<void>
}

export function useAiSummary(onSuccess: () => void): UseAiSummaryResult {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (projectId: string) => {
    setGenerating(true)
    setError(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-ai-summary', {
        body: { project_id: projectId },
      })

      if (fnError) {
        // Extraire le détail depuis le body de la réponse si disponible
        let detail = fnError.message ?? 'Erreur lors de la génération du résumé'
        try {
          const ctx = (fnError as any).context
          if (ctx instanceof Response) {
            const body = await ctx.json()
            if (body?.detail) detail = `${body.error} — ${body.detail}`
            else if (body?.error) detail = body.error
          }
        } catch { /* ignore */ }
        setError(detail)
        return
      }

      if (!data?.success) {
        setError(data?.error ?? 'Réponse inattendue')
        return
      }

      onSuccess()
    } catch (err) {
      setError('Erreur réseau — réessayez')
    } finally {
      setGenerating(false)
    }
  }

  return { generating, error, generate }
}
