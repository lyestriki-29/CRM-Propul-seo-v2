// src/modules/ProjectsManagerV2/components/BriefInviteModal.tsx
import { useState } from 'react'
import { Copy, Check, Link, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { generateShortCode } from '@/lib/shortCode'

interface BriefInviteModalProps {
  onClose: () => void
}

export function BriefInviteModal({ onClose }: BriefInviteModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    const shortCode = generateShortCode()
    const { data, error } = await supabase
      .from('brief_invitations')
      .insert({ company_name: companyName.trim() || null, short_code: shortCode })
      .select('token, short_code')
      .single()

    setGenerating(false)
    if (!error && data) {
      const base = window.location.origin
      setLink(`${base}/brief-invite/${data.short_code ?? data.token}`)
    }
  }

  const handleCopy = () => {
    if (!link) return
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-surface-static rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Créer via brief client</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!link ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Nom de l'entreprise <span className="text-xs text-muted-foreground/60">(optionnel — pré-rempli pour le client)</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Ex: Boulangerie Martin…"
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
                onKeyDown={e => e.key === 'Enter' && !generating && handleGenerate()}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Un lien unique sera généré. Le client le remplira et un projet sera créé automatiquement dans votre CRM.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link className="h-4 w-4" />}
              {generating ? 'Génération…' : 'Générer le lien'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs font-medium text-green-600 mb-2">Lien généré ✓</p>
              <p className="text-xs text-foreground break-all font-mono">{link}</p>
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copié !' : 'Copier le lien'}
            </button>
            <button
              onClick={() => { setLink(null); setCompanyName('') }}
              className="w-full px-4 py-2 border border-border rounded-lg text-muted-foreground text-sm hover:bg-surface-2 transition-colors"
            >
              Générer un autre lien
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
