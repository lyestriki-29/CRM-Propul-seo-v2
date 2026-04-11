import { useState, useEffect } from 'react'
import { Link2, Link2Off, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useBriefV2 } from '@/modules/ProjectsManagerV2/hooks/useBriefV2'

interface ShareBriefButtonProps {
  projectId: string
}

export function ShareBriefButton({ projectId }: ShareBriefButtonProps) {
  const { enableBriefToken, disableBriefToken } = useBriefV2(projectId)
  const [briefToken, setBriefToken] = useState<string | null>(null)
  const [tokenEnabled, setTokenEnabled] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from('projects_v2')
      .select('brief_token, brief_token_enabled')
      .eq('id', projectId)
      .single()
      .then(({ data }) => {
        if (data) {
          setBriefToken(data.brief_token ?? null)
          setTokenEnabled(data.brief_token_enabled ?? false)
        }
        setInitialLoading(false)
      })
  }, [projectId])

  const briefUrl = briefToken && tokenEnabled
    ? `${window.location.origin}/brief/${briefToken}`
    : null

  const handleGenerate = async () => {
    setLoading(true)
    const token = await enableBriefToken()
    setLoading(false)
    if (token) {
      setBriefToken(token)
      setTokenEnabled(true)
      toast.success('Lien de brief généré')
    } else {
      toast.error('Erreur lors de la génération du lien')
    }
  }

  const handleRevoke = async () => {
    setLoading(true)
    const ok = await disableBriefToken()
    setLoading(false)
    if (ok) {
      setBriefToken(null)
      setTokenEnabled(false)
      toast.success('Lien désactivé')
    } else {
      toast.error('Erreur lors de la désactivation')
    }
  }

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    if (!briefUrl) return
    try {
      await navigator.clipboard.writeText(briefUrl)
      setCopied(true)
      toast.success('Lien copié !')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  if (initialLoading) return null

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Chargement…
      </Button>
    )
  }

  if (briefUrl) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copié !' : 'Copier le lien'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRevoke}
          className="text-red-400 hover:text-red-300"
          title="Désactiver le lien de brief"
        >
          <Link2Off className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleGenerate} className="flex items-center gap-2">
      <Link2 className="w-4 h-4" />
      Partager le formulaire
    </Button>
  )
}
