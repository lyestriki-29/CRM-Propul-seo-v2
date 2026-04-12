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
    backgroundColor: '#0e0b1e',
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#16122e',
    padding: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#2d2654',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoP: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  headerBrand: {
    color: '#ede9fe',
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  headerTagline: {
    color: '#a78bfa',
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginTop: 6,
  },
  headerMeta: {
    textAlign: 'right',
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#6b5fa0',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#a78bfa',
  },
  content: {
    padding: 30,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -10,
  },
  bentoBox: {
    width: '100%',
    padding: 10,
  },
  bentoBoxHalf: {
    width: '50%',
    padding: 10,
  },
  card: {
    backgroundColor: '#16122e',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#2d2654',
    minHeight: 120,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6b5fa0',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sectionValue: {
    fontSize: 13,
    color: '#ede9fe',
    lineHeight: 1.6,
  },
  footer: {
    padding: 30,
    textAlign: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#2d2654',
    backgroundColor: '#16122e',
  },
  footerText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6b5fa0',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
})

type BriefFieldKey = 'objective' | 'target_audience' | 'pages' | 'techno' | 'design_references' | 'notes'

const FIELDS: Array<{ key: BriefFieldKey; label: string; required: boolean; half?: boolean; minHeight?: number }> = [
  { key: 'objective',         label: '01 — Vision & Objectif',         required: true,  half: false, minHeight: 160 },
  { key: 'target_audience',   label: '02 — Audience Cible',           required: false, half: true,  minHeight: 120 },
  { key: 'techno',            label: '03 — Environnement Techno',     required: false, half: true,  minHeight: 120 },
  { key: 'pages',             label: '04 — Structure & Fonctions',    required: false, half: false, minHeight: 160 },
  { key: 'design_references', label: '05 — Références Visuelles',     required: false, half: true,  minHeight: 120 },
  { key: 'notes',             label: '06 — Notes Libres',             required: false, half: true,  minHeight: 120 },
]

export function BriefPDFDocument({ projectName, brief, mode, submittedAt }: BriefPDFDocumentProps) {
  const today = new Date().toLocaleDateString('fr-FR')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoP}>P</Text>
              </View>
              <Text style={styles.headerBrand}>PROPULSEO STUDIO</Text>
            </View>
            <Text style={styles.headerTagline}>{projectName.toUpperCase()}</Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.metaLabel}>Généré le</Text>
            <Text style={styles.metaValue}>{today}</Text>
            {mode === 'filled' && submittedAt && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.metaLabel}>Brief Reçu le</Text>
                <Text style={styles.metaValue}>
                  {new Date(submittedAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.grid}>
            {FIELDS.map(field => {
              const value = brief?.[field.key] as string | undefined
              return (
                <View key={field.key} style={field.half ? styles.bentoBoxHalf : styles.bentoBox}>
                  <View style={[styles.card, { minHeight: field.minHeight }]}>
                    <Text style={styles.sectionLabel}>{field.label}</Text>
                    {mode === 'blank' ? (
                      <View style={{ flex: 1 }} />
                    ) : value ? (
                      <Text style={styles.sectionValue}>{value}</Text>
                    ) : (
                      <Text style={[styles.sectionValue, { color: '#3d3168', fontStyle: 'italic' }]}>Non renseigné par le client</Text>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Propulseo Studio · Excellence Digitale</Text>
        </View>
      </Page>
    </Document>
  )
}
