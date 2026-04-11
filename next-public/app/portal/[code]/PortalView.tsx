'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle, Euro, User, Briefcase } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Logo } from '@/components/Logo'
import { GlassCard } from '@/components/GlassCard'
import { formatDate } from '@/lib/utils'

export interface PortalData {
  project: {
    id: string; name: string; client_name: string | null; client_id: string | null
    status: string | null; progress: number | null; completion_score: number | null
    next_action_label: string | null; next_action_due: string | null
    presta_type: string | null; start_date: string | null; end_date: string | null
    budget: number | null; ai_summary: string | null; portal_expires_at: string | null
  }
  checklist: { id: string; title: string; phase: string | null; status: string }[]
  invoices: { id: string; label: string; amount: number; status: string; date: string | null; due_date: string | null }[]
  contact: { name: string | null; email: string | null; phone: string | null; address: string | null; sector: string | null } | null
}

const INVOICE_BADGE: Record<string, { label: string; color: string }> = {
  sent:    { label: 'Envoyée',   color: '#93c5fd' },
  paid:    { label: 'Payée',     color: '#6ee7b7' },
  overdue: { label: 'En retard', color: '#fca5a5' },
  draft:   { label: 'Brouillon', color: 'rgba(255,255,255,0.3)' },
}

export function PortalView({ data }: { data: PortalData }) {
  const { project, checklist, invoices, contact } = data
  const progress = project.progress ?? 0

  return (
    <PageShell>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Logo size={48} />
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, textAlign: 'center' }}>{project.name}</h1>
          {project.client_name && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{project.client_name}</p>}
        </motion.div>

        {/* Progression */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard style={{ padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>Avancement global</span>
              <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', borderRadius: 3 }}
              />
            </div>
            {project.next_action_label && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                <Clock size={12} />
                <span>Prochaine étape : {project.next_action_label}</span>
                {project.next_action_due && <span>· {formatDate(project.next_action_due)}</span>}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Checklist */}
        {checklist.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard style={{ padding: '20px 24px', marginBottom: 16 }}>
              <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Briefcase size={12} />Étapes du projet
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checklist.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {item.status === 'done'
                      ? <CheckCircle2 size={14} style={{ color: '#6ee7b7', flexShrink: 0 }} />
                      : item.status === 'blocked'
                      ? <AlertCircle size={14} style={{ color: '#fca5a5', flexShrink: 0 }} />
                      : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: 13, color: item.status === 'done' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>
                      {item.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Factures */}
        {invoices.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard style={{ padding: '20px 24px', marginBottom: 16 }}>
              <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Euro size={12} />Facturation
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {invoices.map(inv => {
                  const badge = INVOICE_BADGE[inv.status] ?? INVOICE_BADGE.draft
                  return (
                    <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{inv.label}</p>
                        {inv.date && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{formatDate(inv.date)}</p>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{inv.amount.toLocaleString('fr-FR')} €</span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: badge.color, background: `${badge.color}18`, padding: '2px 8px', borderRadius: 20 }}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Contact */}
        {contact && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard style={{ padding: '20px 24px' }}>
              <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={12} />Votre contact
              </h2>
              {contact.name && <p style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{contact.name}</p>}
              {contact.email && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{contact.email}</p>}
              {contact.phone && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{contact.phone}</p>}
            </GlassCard>
          </motion.div>
        )}

      </div>
    </PageShell>
  )
}
