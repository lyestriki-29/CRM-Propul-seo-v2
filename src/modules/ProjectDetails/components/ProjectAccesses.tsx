import { Key, Lock, Globe, Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { AccessCategory } from '../../../types/project-v2'

const CATEGORY_LABELS: Record<AccessCategory, string> = {
  hosting:   'Hébergement',
  cms:       'CMS',
  analytics: 'Analytics',
  social:    'Réseaux sociaux',
  tools:     'Outils',
  design:    'Design',
}

// Données mock statiques pour la démo
const MOCK_ACCESSES = [
  {
    id: 'acc-001', category: 'hosting' as AccessCategory,
    service_name: 'OVH Cloud', url: 'https://www.ovh.com',
    login: 'contact@client.fr', password: 'P@ssw0rd!2024',
    status: 'active' as const,
  },
  {
    id: 'acc-002', category: 'cms' as AccessCategory,
    service_name: 'WordPress Admin', url: 'https://client.fr/wp-admin',
    login: 'admin', password: 'wp-admin-2024',
    status: 'active' as const,
  },
  {
    id: 'acc-003', category: 'analytics' as AccessCategory,
    service_name: 'Google Analytics', url: 'https://analytics.google.com',
    login: 'analytics@client.fr', password: '',
    status: 'missing' as const,
  },
]

const STATUS_COLORS = {
  active:             'bg-green-500/20 text-green-300',
  missing:            'bg-red-500/20 text-red-300',
  broken:             'bg-orange-500/20 text-orange-300',
  expired:            'bg-gray-500/20 text-gray-400',
  pending_validation: 'bg-blue-500/20 text-blue-300',
}

const STATUS_LABELS = {
  active:             'Actif',
  missing:            'Manquant',
  broken:             'Non fonctionnel',
  expired:            'Expiré',
  pending_validation: 'À valider',
}

export function ProjectAccesses() {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())

  const togglePassword = (id: string) =>
    setVisiblePasswords(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copié`)
  }

  const byCategory = MOCK_ACCESSES.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<AccessCategory, typeof MOCK_ACCESSES>)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Coffre-fort accès</h3>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Chiffrement Sprint 2
        </span>
      </div>

      {Object.entries(byCategory).map(([cat, accesses]) => (
        <div key={cat} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-surface-3/30">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {CATEGORY_LABELS[cat as AccessCategory]}
            </span>
          </div>
          <div className="divide-y divide-border/30">
            {accesses.map(access => (
              <div key={access.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{access.service_name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${STATUS_COLORS[access.status]}`}>
                    {STATUS_LABELS[access.status]}
                  </span>
                </div>
                {access.url && (
                  <a href={access.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    <Globe className="h-3 w-3" />
                    {access.url}
                  </a>
                )}
                {access.login && (
                  <div className="flex items-center justify-between bg-surface-3 rounded px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">Login : </span>
                    <span className="text-xs text-foreground font-mono">{access.login}</span>
                    <button onClick={() => copyToClipboard(access.login, 'Login')}
                      className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {access.password && (
                  <div className="flex items-center justify-between bg-surface-3 rounded px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">Mdp : </span>
                    <span className="text-xs text-foreground font-mono flex-1 mx-2">
                      {visiblePasswords.has(access.id) ? access.password : '••••••••••'}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => togglePassword(access.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        {visiblePasswords.has(access.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button onClick={() => copyToClipboard(access.password, 'Mot de passe')}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
