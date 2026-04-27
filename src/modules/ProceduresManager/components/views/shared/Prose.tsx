import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { buildExtensions } from '../../../lib/tiptap-extensions'
import { useResolvedContent } from '../../../hooks/useResolvedContent'
import type { TipTapDoc } from '../../../types'
import { slugifyHeading } from './headings'

interface ProseProps {
  content: TipTapDoc
  contentKey: string
  className?: string
  calloutStyle?: 'docs' | 'magazine' | 'github'
}

const CALLOUT_PATTERNS: Array<{ regex: RegExp; variant: 'tip' | 'warning' | 'success' | 'note' }> = [
  { regex: /^\s*💡/, variant: 'tip' },
  { regex: /^\s*⚠️/, variant: 'warning' },
  { regex: /^\s*✅/, variant: 'success' },
  { regex: /^\s*ℹ️/, variant: 'note' },
]

const CALLOUT_LABELS: Record<string, string> = {
  tip: 'Astuce',
  warning: 'Attention',
  success: 'Validation',
  note: 'Note',
}

function injectHeadingIds(root: HTMLElement) {
  const seen = new Map<string, number>()
  root.querySelectorAll('h1, h2, h3, h4').forEach((el) => {
    const text = el.textContent?.trim() ?? ''
    if (!text) return
    let id = slugifyHeading(text)
    const count = seen.get(id) ?? 0
    if (count > 0) id = `${id}-${count}`
    seen.set(slugifyHeading(text), count + 1)
    el.setAttribute('id', id)
    el.classList.add('scroll-mt-24')
  })
}

function transformCallouts(root: HTMLElement, style: 'docs' | 'magazine' | 'github') {
  root.querySelectorAll('blockquote').forEach((bq) => {
    const firstP = bq.querySelector('p')
    if (!firstP) return
    const firstText = firstP.textContent ?? ''
    let matchedVariant: string | null = null
    for (const { regex, variant } of CALLOUT_PATTERNS) {
      if (regex.test(firstText)) {
        matchedVariant = variant
        break
      }
    }
    if (!matchedVariant) return

    bq.setAttribute('data-callout', matchedVariant)
    bq.setAttribute('data-callout-style', style)
    bq.setAttribute('data-callout-label', CALLOUT_LABELS[matchedVariant])

    // Strip leading emoji from first paragraph for cleaner display
    if (firstP.firstChild && firstP.firstChild.nodeType === Node.TEXT_NODE) {
      const t = firstP.firstChild.textContent ?? ''
      const stripped = t.replace(/^\s*(💡|⚠️|✅|ℹ️)\s*/, '')
      firstP.firstChild.textContent = stripped
    }
  })
}

export function Prose({ content, contentKey, className, calloutStyle = 'docs' }: ProseProps) {
  const { resolved } = useResolvedContent(content)
  const containerRef = useRef<HTMLDivElement>(null)
  const editor = useEditor(
    {
      editable: false,
      extensions: buildExtensions({ editable: false }),
      content: resolved,
    },
    [contentKey, resolved],
  )

  useEffect(() => {
    if (!editor) return
    const apply = () => {
      const root = containerRef.current
      if (!root) return
      injectHeadingIds(root)
      transformCallouts(root, calloutStyle)
    }
    let raf = requestAnimationFrame(apply)
    const onUpdate = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }
    editor.on('create', onUpdate)
    editor.on('update', onUpdate)
    return () => {
      cancelAnimationFrame(raf)
      editor.off('create', onUpdate)
      editor.off('update', onUpdate)
    }
  }, [editor, resolved, calloutStyle])

  return (
    <div ref={containerRef} className={cn(className)}>
      <EditorContent editor={editor} />
    </div>
  )
}
