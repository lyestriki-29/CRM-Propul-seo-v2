import { useState, useEffect } from 'react'
import { Mail, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

interface EmailRule {
  id: string
  project_id: string
  client_email: string
  created_at: string
}

interface Props {
  projectId: string
}

export function ProjectEmailRules({ projectId }: Props) {
  const [rules, setRules] = useState<EmailRule[]>([])
  const [newEmail, setNewEmail] = useState('')

  useEffect(() => {
    supabase.from('project_email_rules').select('*').eq('project_id', projectId)
      .then(({ data }) => { if (data) setRules(data) })
  }, [projectId])

  const addRule = async () => {
    const email = newEmail.trim().toLowerCase()
    if (!email.includes('@')) { toast.error('Email invalide'); return }
    const { data, error } = await supabase
      .from('project_email_rules')
      .insert({ project_id: projectId, client_email: email })
      .select()
      .single()
    if (!error && data) {
      setRules(prev => [...prev, data])
      setNewEmail('')
      toast.success('Adresse ajoutée')
    }
  }

  const deleteRule = async (id: string) => {
    await supabase.from('project_email_rules').delete().eq('id', id)
    setRules(prev => prev.filter(r => r.id !== id))
    toast.success('Adresse supprimée')
  }

  return (
    <div className="space-y-5">
      {/* Règles de matching */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Adresses à surveiller</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Les emails reçus depuis ces adresses seront automatiquement ajoutés au journal d'activité.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addRule()}
            placeholder="email@client.com"
            className="flex-1 bg-surface-2 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            onClick={addRule}
            className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </button>
        </div>

        <div className="space-y-2">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between bg-surface-2 border border-border rounded px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">{rule.client_email}</span>
              </div>
              <button
                onClick={() => deleteRule(rule.id)}
                className="text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
              <Mail className="h-8 w-8 opacity-30" />
              <p className="text-sm">Aucune adresse configurée.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
