import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { project_id, siret } = await req.json()

    if (!project_id || !siret) {
      return new Response(
        JSON.stringify({ error: 'project_id et siret sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validation format SIRET : 14 chiffres
    const cleanSiret = siret.replace(/\s/g, '')
    if (!/^\d{14}$/.test(cleanSiret)) {
      return new Response(
        JSON.stringify({ error: 'SIRET invalide — doit contenir 14 chiffres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pappersKey = Deno.env.get('PAPPERS_API_KEY')
    if (!pappersKey) {
      return new Response(
        JSON.stringify({ error: 'PAPPERS_API_KEY non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Appel API Pappers
    const pappersUrl = `https://api.pappers.fr/v2/entreprise?siret=${cleanSiret}&api_token=${pappersKey}`
    const pappersRes = await fetch(pappersUrl)

    if (!pappersRes.ok) {
      const errBody = await pappersRes.text()
      return new Response(
        JSON.stringify({ error: `Pappers API error ${pappersRes.status}`, detail: errBody }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const companyData = await pappersRes.json()

    // Persister dans Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: updateError } = await supabase
      .from('projects_v2')
      .update({
        siret: cleanSiret,
        company_data: companyData,
        company_enriched_at: new Date().toISOString(),
      })
      .eq('id', project_id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Erreur mise à jour base', detail: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        company_name: companyData.nom_entreprise ?? companyData.denomination,
        siret: cleanSiret,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Erreur interne', detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
