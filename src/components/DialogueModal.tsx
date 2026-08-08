import { useState, useEffect, useCallback, useRef } from 'react'

export interface DialogueLine {
  speaker: string
  korean: string
  russian: string
}

interface Props {
  lines: DialogueLine[]
  onComplete: () => void
  onClose: () => void
}

export default function DialogueModal({ lines, onComplete, onClose }: Props) {
  const [idx, setIdx] = useState(0)
  /** Guards against `onComplete` firing twice from repeated inputs. */
  const completedRef = useRef(false)

  // Index is clamped so a burst of clicks or a held key can never read past
  // the last line (which previously crashed the whole app).
  const safeIdx = Math.min(idx, Math.max(0, lines.length - 1))
  const line = lines[safeIdx]
  const isLast = safeIdx >= lines.length - 1

  const next = useCallback(() => {
    if (completedRef.current) return
    if (isLast) {
      completedRef.current = true
      onComplete()
      return
    }
    setIdx((i) => Math.min(i + 1, lines.length - 1))
  }, [isLast, lines.length, onComplete])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // `e.repeat` stops a held Enter/Space from racing through the dialogue.
      if (e.repeat) return
      if (e.key === 'Enter' || e.key === ' ') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, onClose])

  if (!line) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: 600, background: '#1a1a2eea', border: '2px solid #4fc3f7',
      borderRadius: 12, padding: '16px 20px', color: '#fff', zIndex: 1000,
      fontFamily: 'system-ui, sans-serif', boxShadow: '0 8px 32px #000a'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong style={{ color: '#4fc3f7', fontSize: 14 }}>{line.speaker}</strong>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{safeIdx + 1} / {lines.length}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{line.korean}</div>
      <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 16, fontStyle: 'italic' }}>{line.russian}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => window.speechSynthesis?.speak(
          Object.assign(new SpeechSynthesisUtterance(line.korean), { lang: 'ko-KR', rate: 0.9 })
        )} style={{ background: '#333', color: '#fff', border: '1px solid #555', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>
          🔊 Прослушать
        </button>
        <button onClick={next} style={{ background: '#4fc3f7', color: '#000', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          Далее →
        </button>
      </div>
    </div>
  )
}
