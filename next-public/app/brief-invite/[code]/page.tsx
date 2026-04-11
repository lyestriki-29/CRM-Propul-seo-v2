import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase-server'
import { PageShell } from '@/components/PageShell'
import { Logo } from '@/components/Logo'
import { BriefInviteForm } from './BriefInviteForm'

type Props = { params: Promise<{ code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const supabase = createSupabaseServer()
  const { data } = await supabase
    .from('brief_invitations')
    .select('company_name')
    .eq('short_code', code)
    .single()
  return {
    title: `Brief projet — ${data?.company_name ?? 'Propulseo'}`,
    description: 'Complétez votre brief projet en quelques minutes.',
    robots: 'noindex, nofollow',
  }
}

export default async function BriefInvitePage({ params }: Props) {
  const { code } = await params
  const supabase = createSupabaseServer()

  const { data: invitation } = await supabase
    .from('brief_invitations')
    .select('id, short_code, company_name, status')
    .eq('short_code', code)
    .single()

  if (!invitation) notFound()

  if (invitation.status === 'submitted') {
    return (
      <PageShell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, padding: 24 }}>
          <Logo size={56} />
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 600, textAlign: 'center' }}>
            Brief déjà envoyé
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', maxWidth: 320 }}>
            Votre brief a bien été reçu par l&apos;équipe Propulseo.<br />
            Nous reviendrons vers vous très prochainement.
          </p>
        </div>
      </PageShell>
    )
  }

  return (
    <BriefInviteForm
      code={code}
      companyName={invitation.company_name ?? ''}
    />
  )
}
