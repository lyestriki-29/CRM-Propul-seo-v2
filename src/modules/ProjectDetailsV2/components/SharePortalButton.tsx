// src/modules/ProjectDetailsV2/components/SharePortalButton.tsx
import { useState, useEffect } from 'react'
import { Link2, Link2Off, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useClientPortal } from '@/modules/ClientPortal/useClientPortal'
import type { ProjectV2 } from '@/types/project-v2'

interface SharePortalButtonProps {
  project: ProjectV2
  onRefresh: () => void
}

export function SharePortalButton({ project, onRefresh }: SharePortalButtonProps) {
  const { generateToken, revokeToken } = useClientPortal()
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const portalUrl = project.portal_short_code && project.portal_enabled
    ? `https://brief-propulseo.vercel.app/portal/${project.portal_short_code}`
    : null

  const handleGenerate = async () => {
    setLoading(true)
    const token = await generateToken(project.id)
    setLoading(false)
    if (token) {
      toast.success('Lien client généré')
      onRefresh()
    } else {
      toast.error('Erreur lors de la génération du lien')
    }
  }

  const handleRevoke = async () => {
    setLoading(true)
    const ok = await revokeToken(project.id)
    setLoading(false)
    if (ok) {
      toast.success('Lien désactivé')
      onRefresh()
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
    if (!portalUrl) return
    try {
      await navigator.clipboard.writeText(portalUrl)
      setCopied(true)
      toast.success('Lien copié !')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Chargement…
      </Button>
    )
  }

  if (portalUrl) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copié !' : 'Copier le lien'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRevoke}
          className="text-red-400 hover:text-red-300"
          title="Désactiver le lien client"
        >
          <Link2Off className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      className="flex items-center gap-2"
    >
      <Link2 className="w-4 h-4" />
      Partager avec le client
    </Button>
  )
}
