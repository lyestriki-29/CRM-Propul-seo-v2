import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import { BriefInviteFormV2 } from '../../brief-invite/[code]/BriefInviteFormV2'

type Props = { params: Promise<{ code: string }> }

export default async function BriefInviteV2Page({ params }: Props) {
  const { code } = await params
  const supabase = createSupabaseServer()
  const { data: invitation } = await supabase
    .from('brief_invitations')
    .select('id, short_code, company_name, status')
    .eq('short_code', code)
    .single()
  if (!invitation) notFound()
  return <BriefInviteFormV2 code={code} companyName={invitation.company_name ?? ''} />
}
