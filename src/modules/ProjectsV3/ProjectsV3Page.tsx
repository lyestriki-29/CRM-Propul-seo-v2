import { useState, useMemo, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProjectsV2 } from '@/modules/ProjectsManagerV2/hooks/useProjectsV2'
import { supabase } from '@/lib/supabase'
import { ProjectsV3Header } from './components/ProjectsV3Header'
import { ProjectColumnV3 } from './components/ProjectColumnV3'
import { ProjectCardV3 } from './components/ProjectCardV3'
import { statusToColumn, V3_COLUMN_ORDER, type V3Column } from './utils/statusMapping'
import { getActivePoles, type V3Pole } from './utils/poleMapping'
import type { ProjectV2 } from '@/types/project-v2'

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function ProjectsV3Page() {
  const navigate = useNavigate()
  const { projects, loading } = useProjectsV2()

  const [filterUserId, setFilterUserId] = useState('')
  const [activePoles, setActivePoles] = useState<Set<V3Pole>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounced(searchQuery, 300)
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    supabase.from('users').select('id, name').order('name').then(({ data }) => {
      if (data) setUsers(data as { id: string; name: string }[])
    })
  }, [])

  const togglePole = (pole: V3Pole) => {
    setActivePoles(prev => {
      const next = new Set(prev)
      if (next.has(pole)) next.delete(pole)
      else next.add(pole)
      return next
    })
  }

  const filteredProjects = useMemo(() => {
    let result = projects
    if (filterUserId) {
      result = result.filter(p => p.assigned_to === filterUserId)
    }
    if (activePoles.size > 0) {
      result = result.filter(p => {
        const projectPoles = getActivePoles(p.presta_type)
        return projectPoles.some(pole => activePoles.has(pole))
      })
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.client_name ?? '').toLowerCase().includes(q),
      )
    }
    return result
  }, [projects, filterUserId, activePoles, debouncedSearch])

  const byColumn = useMemo(() => {
    const acc: Record<V3Column, ProjectV2[]> = {
      planification: [],
      en_cours: [],
      en_pause: [],
    }
    for (const p of filteredProjects) {
      acc[statusToColumn(p.status)].push(p)
    }
    return acc
  }, [filteredProjects])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#A78BFA]" />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#0a0814] text-[#ede9fe] p-8 max-w-[1600px] mx-auto">
      <ProjectsV3Header
        projectCount={filteredProjects.length}
        filterUserId={filterUserId}
        onFilterUserChange={setFilterUserId}
        users={users}
        activePoles={activePoles}
        onTogglePole={togglePole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewProject={() => {
          // TODO étape 5 : ouvrir modal création (réutiliser celle de V2 ?)
          console.log('[ProjectsV3] new project — à brancher')
        }}
      />

      <div className="grid grid-cols-3 gap-5">
        {V3_COLUMN_ORDER.map(column => {
          const items = byColumn[column]
          return (
            <ProjectColumnV3
              key={column}
              column={column}
              count={items.length}
              isEmpty={items.length === 0}
            >
              {items.map((project, index) => (
                <ProjectCardV3
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => navigate(`/projets-v3-preview/${project.id}`)}
                />
              ))}
            </ProjectColumnV3>
          )
        })}
      </div>
    </div>
  )
}
