import { useState, useEffect } from 'react'
import { Mail, RefreshCw, CheckCircle2, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

interface GmailConnection {
  id: string
  gmail_email: string
  last_sync_at: string | null
}

export function GmailConnectButton() {
  const [connection, setConnection] = useState<GmailConnection | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchConnection = async () => {
    const { data } = await supabase
      .from('gmail_connections')
      .select('id, gmail_email, last_sync_at')
      .limit(1)
      .maybeSingle()
    setConnection(data ?? null)
    setLoading(false)
  }

  useEffect(() => {
    fetchConnection()
  }, [])

  const connectGmail = () => {
    const clientId    = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const redirectUri = `${supabaseUrl}/functions/v1/gmail-oauth-callback`
    const scope       = 'https://www.googleapis.com/auth/gmail.readonly email'
    const url = [
      'https://accounts.google.com/o/oauth2/v2/auth',
      `?response_type=code`,
      `&client_id=${clientId}`,
      `&redirect_uri=${encodeURIComponent(redirectUri)}`,
      `&scope=${encodeURIComponent(scope)}`,
      `&state=dev-user`,
      `&access_type=offline`,
      `&prompt=consent`,
    ].join('')

    const popup = window.open(url, 'gmail-oauth', 'width=520,height=640,left=400,top=100')

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GMAIL_CONNECTED') {
        window.removeEventListener('message', onMessage)
        popup?.close()
        fetchConnection().then(() => toast.success('Gmail connecté avec succès !'))
      }
    }
    window.addEventListener('message', onMessage)
  }

  const disconnect = async () => {
    if (!connection) return
    if (!confirm(`Déconnecter ${connection.gmail_email} ?`)) return
    await supabase.from('gmail_connections').delete().eq('id', connection.id)
    setConnection(null)
    toast.success('Gmail déconnecté')
  }

  const triggerSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-sync`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        }
      )
      if (res.ok) {
        toast.success('Synchronisation Gmail lancée')
        fetchConnection()
      } else {
        toast.error('Erreur lors de la synchronisation')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return null

  if (connection) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{connection.gmail_email}</span>
        </div>
        <button
          onClick={triggerSync}
          disabled={syncing}
          title="Synchroniser Gmail"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded border border-border hover:border-border/80"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>
        <button
          onClick={disconnect}
          title="Déconnecter Gmail"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors px-2 py-1.5 rounded border border-border hover:border-red-400/50"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connectGmail}
      className="flex items-center gap-1.5 text-xs bg-surface-2 border border-border text-muted-foreground px-3 py-1.5 rounded-lg hover:border-primary/50 hover:text-foreground transition-colors"
    >
      <Mail className="h-3.5 w-3.5" />
      Connecter Gmail
    </button>
  )
}
