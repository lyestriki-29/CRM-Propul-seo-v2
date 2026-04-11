// supabase/functions/send-brief-notification/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FIELD_LABELS: Record<string, string> = {
  objective: "Objectif du projet",
  target_audience: "Cible / utilisateurs",
  pages: "Pages / Fonctionnalités attendues",
  techno: "Technologie / stack",
  design_references: "Références design",
  notes: "Notes complémentaires",
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectName, fields } = await req.json() as {
      projectName: string;
      fields: Record<string, string | null>;
    };

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY manquante");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer les emails supplémentaires actifs
    const { data: extraEmails } = await supabase
      .from("notification_emails")
      .select("email")
      .eq("active", true);

    const to = [
      "lyestriki@gmail.com",
      ...(extraEmails ?? [])
        .map((r: { email: string }) => r.email.trim())
        .filter(isValidEmail),
    ];
    console.log(`[send-brief-notification] project="${projectName}" recipients=${to.length}`);

    // Construire le corps HTML
    const fieldsHtml = Object.entries(fields)
      .filter(([, val]) => val && val.trim().length > 0)
      .map(([key, val]) => `
        <div style="margin-bottom:16px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:1px;">
            ${FIELD_LABELS[key] ?? key}
          </p>
          <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(val ?? '')}</p>
        </div>
      `).join("");

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:24px 28px;">
          <p style="margin:0;color:rgba(255,255,255,0.8);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Nouveau brief reçu</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:800;">${escapeHtml(projectName)}</h1>
        </div>
        <div style="padding:24px 28px;background:#fff;">
          ${fieldsHtml}
        </div>
        <div style="padding:16px 28px;background:#f8fafc;text-align:center;font-size:11px;color:#94a3b8;">
          Propul'SEO · Notification automatique
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Propul'SEO <no-reply@propulseo-site.com>",
        to,
        subject: `[Brief] Nouveau brief reçu — ${projectName}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-brief-notification] error:", (err as Error).message);
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
