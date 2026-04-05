// src/modules/ClientPortal/ClientPortalPage.tsx
import React, { useEffect } from 'react'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { useClientPortal } from './useClientPortal'
import type { ChecklistItemV2 } from '@/types/project-v2'

const STATUS_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  brief_received: 'Brief reçu',
  quote_sent: 'Devis envoyé',
  in_progress: 'En cours',
  review: 'En révision',
  delivered: 'Livré',
  maintenance: 'Maintenance',
  on_hold: 'En pause',
  closed: 'Clôturé',
}

const STATUS_COLORS: Record<string, string> = {
  prospect: 'bg-gray-500',
  brief_received: 'bg-blue-500',
  quote_sent: 'bg-yellow-500',
  in_progress: 'bg-indigo-500',
  review: 'bg-purple-500',
  delivered: 'bg-green-500',
  maintenance: 'bg-teal-500',
  on_hold: 'bg-orange-500',
  closed: 'bg-gray-400',
}

const CHECKLIST_STATUS_ICON: Record<ChecklistItemV2['status'], React.ReactElement> = {
  done: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  in_progress: <Clock className="w-4 h-4 text-yellow-400" />,
  todo: <Circle className="w-4 h-4 text-gray-500" />,
}

const INVOICE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  sent: { label: 'Envoyée', color: 'text-blue-400' },
  paid: { label: 'Payée', color: 'text-green-400' },
  overdue: { label: 'En retard', color: 'text-red-400' },
}

interface ClientPortalPageProps {
  token: string
}

export function ClientPortalPage({ token }: ClientPortalPageProps) {
  const { data, loading, error, fetchPortalData } = useClientPortal()

  useEffect(() => {
    // Light mode pour le portail client (pas de dark forcé)
    document.documentElement.classList.remove('dark')
    fetchPortalData(token)
    return () => {
      document.documentElement.classList.add('dark')
    }
  }, [token, fetchPortalData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Chargement de votre espace projet…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Lien invalide</h1>
          <p className="text-gray-500">{error ?? 'Ce lien est invalide ou a été désactivé.'}</p>
        </div>
      </div>
    )
  }

  const { project, checklist, invoices } = data
  const doneTasks = checklist.filter(c => c.status === 'done').length
  const totalTasks = checklist.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Espace client</p>
            <h1 className="text-lg font-bold text-gray-900">{project.name}</h1>
            {project.client_name && (
              <p className="text-sm text-gray-500">{project.client_name}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${STATUS_COLORS[project.status] ?? 'bg-gray-500'}`}>
            {STATUS_LABELS[project.status] ?? project.status}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Progression */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Avancement</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progression globale</span>
                <span className="font-semibold">{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Score de complétude</span>
                <span className="font-semibold">{project.completion_score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${project.completion_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prochaine action */}
        {project.next_action_label && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-indigo-700 mb-1">Prochaine étape</h2>
            <p className="text-gray-800 font-medium">{project.next_action_label}</p>
            {project.next_action_due && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Avant le {new Date(project.next_action_due).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Checklist projet</h2>
              <span className="text-xs text-gray-400">{doneTasks}/{totalTasks} tâches</span>
            </div>
            <ul className="space-y-2">
              {checklist.map(item => (
                <li key={item.id} className="flex items-center gap-3 text-sm">
                  {CHECKLIST_STATUS_ICON[item.status]}
                  <span className={item.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}>
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Factures */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Factures</h2>
            <ul className="space-y-3">
              {invoices.map(inv => (
                <li key={inv.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{inv.label}</p>
                    {inv.date && (
                      <p className="text-xs text-gray-400">
                        {new Date(inv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {inv.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                    <p className={`text-xs font-medium ${INVOICE_STATUS_LABELS[inv.status]?.color ?? 'text-gray-400'}`}>
                      {INVOICE_STATUS_LABELS[inv.status]?.label ?? inv.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Vue partagée en lecture seule · Propul'SEO
        </p>
      </main>
    </div>
  )
}
