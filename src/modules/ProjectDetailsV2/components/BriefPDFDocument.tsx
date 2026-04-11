// src/modules/ProjectDetailsV2/components/BriefPDFDocument.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ProjectBrief } from '../../../types/project-v2'

export interface BriefPDFDocumentProps {
  projectName: string
  brief: Partial<ProjectBrief> | null
  mode: 'blank' | 'filled'
  submittedAt?: string | null
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingBottom: 36,
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 30,
    height: 30,
    backgroundColor: '#818cf8',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoLetter: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  headerCompany: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  headerSubtitle: {
    color: '#c7d2fe',
    fontSize: 9,
    marginTop: 2,
  },
  headerDate: {
    color: '#e0e7ff',
    fontSize: 9,
  },
  projectBand: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    color: '#4f46e5',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  submittedBadge: {
    color: '#6366f1',
    fontSize: 9,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  section: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 10,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 6,
  },
  emptyBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderRadius: 3,
    backgroundColor: '#f9fafb',
  },
  filledText: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 15,
  },
  emptyAnswer: {
    fontSize: 10,
    color: '#9ca3af',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    borderTopStyle: 'solid',
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
})

type BriefFieldKey = 'objective' | 'target_audience' | 'pages' | 'techno' | 'design_references' | 'notes'

const FIELDS: Array<{ key: BriefFieldKey; label: string; required: boolean }> = [
  { key: 'objective',         label: 'Objectif du projet',             required: true  },
  { key: 'target_audience',   label: 'Cible / utilisateurs',           required: false },
  { key: 'pages',             label: 'Pages / Fonctionnalités attendues', required: false },
  { key: 'techno',            label: 'Technologie / stack',            required: false },
  { key: 'design_references', label: 'Références design',              required: false },
  { key: 'notes',             label: 'Notes complémentaires',          required: false },
]

export function BriefPDFDocument({ projectName, brief, mode, submittedAt }: BriefPDFDocumentProps) {
  const today = new Date().toLocaleDateString('fr-FR')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>P</Text>
            </View>
            <View>
              <Text style={styles.headerCompany}>Propul'SEO</Text>
              <Text style={styles.headerSubtitle}>
                {mode === 'blank' ? 'Formulaire de brief client' : 'Récapitulatif brief client'}
              </Text>
            </View>
          </View>
          <Text style={styles.headerDate}>{today}</Text>
        </View>

        {/* Project band */}
        <View style={styles.projectBand}>
          <Text style={styles.projectName}>{projectName}</Text>
          {mode === 'filled' && submittedAt && (
            <Text style={styles.submittedBadge}>
              Brief reçu le {new Date(submittedAt).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>

        {/* Fields */}
        <View style={styles.content}>
          {FIELDS.map(field => {
            const value = brief?.[field.key] as string | undefined
            return (
              <View key={field.key} style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {field.label}{field.required ? ' *' : ''}
                </Text>
                {mode === 'blank' ? (
                  <View style={styles.emptyBox} />
                ) : value ? (
                  <Text style={styles.filledText}>{value}</Text>
                ) : (
                  <Text style={styles.emptyAnswer}>—</Text>
                )}
              </View>
            )
          })}
        </View>

        {/* Footer fixe */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>propulseo-site.com</Text>
          <Text style={styles.footerText}>contact@propulseo-site.com</Text>
        </View>
      </Page>
    </Document>
  )
}
