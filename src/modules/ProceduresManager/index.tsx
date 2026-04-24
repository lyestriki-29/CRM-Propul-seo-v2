import { useMemo, useState } from 'react'
import { ProceduresList } from './components/ProceduresList'
import { ProcedureDetail } from './components/ProcedureDetail'
import { ProcedureEditor } from './components/ProcedureEditor'
import { ProcedureRevisions } from './components/ProcedureRevisions'
import { useProcedures } from './hooks/useProcedures'
import type { Procedure, ProcedureView } from './types'

export function ProceduresManager() {
  const { procedures, getById } = useProcedures()

  const [view, setView] = useState<ProcedureView>('list')
  const [activeProcedure, setActiveProcedure] = useState<Procedure | null>(null)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    procedures.forEach((p) => p.tags.forEach((t) => s.add(t)))
    return Array.from(s).sort()
  }, [procedures])

  const handleOpen = (p: Procedure) => {
    setActiveProcedure(p)
    setView('detail')
  }

  const handleCreate = () => {
    setActiveProcedure(null)
    setView('edit')
  }

  const handleEdit = () => {
    setView('edit')
  }

  const handleOpenRevisions = () => {
    setView('revisions')
  }

  const handleBackToList = () => {
    setActiveProcedure(null)
    setView('list')
  }

  const handleBackToDetail = () => {
    setView('detail')
  }

  const handleSaved = (p: Procedure) => {
    setActiveProcedure(p)
    setView('detail')
  }

  const handleRestored = (p: Procedure) => {
    setActiveProcedure(p)
    setView('detail')
  }

  if (view === 'edit') {
    return (
      <ProcedureEditor
        procedure={activeProcedure}
        onBack={activeProcedure ? handleBackToDetail : handleBackToList}
        onSaved={handleSaved}
        allTags={allTags}
      />
    )
  }

  if (view === 'detail' && activeProcedure) {
    return (
      <ProcedureDetail
        procedure={activeProcedure}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onOpenRevisions={handleOpenRevisions}
        onRefresh={getById}
      />
    )
  }

  if (view === 'revisions' && activeProcedure) {
    return (
      <ProcedureRevisions
        procedure={activeProcedure}
        onBack={handleBackToDetail}
        onRestored={handleRestored}
      />
    )
  }

  return <ProceduresList onOpen={handleOpen} onCreate={handleCreate} />
}

export default ProceduresManager
