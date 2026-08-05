import { useEffect, useRef, useState } from 'react'

interface Props {
  disabled: boolean
  onMoveChange: (input: { x: number; y: number }) => void
  onInteract: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function MobileControls({ disabled, onMoveChange, onInteract }: Props) {
  const baseRef = useRef<HTMLDivElement | null>(null)
  const pointerIdRef = useRef<number | null>(null)
  const [stick, setStick] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled) {
      setStick({ x: 0, y: 0 })
      onMoveChange({ x: 0, y: 0 })
    }
  }, [disabled, onMoveChange])

  const resetStick = () => {
    pointerIdRef.current = null
    setStick({ x: 0, y: 0 })
    onMoveChange({ x: 0, y: 0 })
  }

  const updateStickFromEvent = (clientX: number, clientY: number) => {
    const rect = baseRef.current?.getBoundingClientRect()
    if (!rect) return
    const radius = rect.width / 2
    const centerX = rect.left + radius
    const centerY = rect.top + radius
    const rawX = clientX - centerX
    const rawY = clientY - centerY
    const distance = Math.hypot(rawX, rawY)
    const limited = distance > radius ? radius / distance : 1
    const x = clamp(rawX * limited, -radius, radius)
    const y = clamp(rawY * limited, -radius, radius)
    setStick({ x, y })
    onMoveChange({ x: x / radius, y: y / radius })
  }

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '18px 16px calc(env(safe-area-inset-bottom, 0px) + 18px)',
      pointerEvents: 'none',
      zIndex: 1300,
    }}>
      <div
        ref={baseRef}
        onPointerDown={(event) => {
          if (disabled) return
          pointerIdRef.current = event.pointerId
          event.currentTarget.setPointerCapture(event.pointerId)
          updateStickFromEvent(event.clientX, event.clientY)
        }}
        onPointerMove={(event) => {
          if (disabled || pointerIdRef.current !== event.pointerId) return
          updateStickFromEvent(event.clientX, event.clientY)
        }}
        onPointerUp={() => resetStick()}
        onPointerCancel={() => resetStick()}
        style={{
          width: 136,
          height: 136,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.28), rgba(255,255,255,0.08))',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 14px 34px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none',
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, rgba(94, 200, 255, 0.95), rgba(74, 165, 255, 0.95))',
          transform: `translate(calc(-50% + ${stick.x}px), calc(-50% + ${stick.y}px))`,
          boxShadow: '0 8px 22px rgba(0, 0, 0, 0.28)',
        }} />
      </div>

      <button
        onClick={onInteract}
        disabled={disabled}
        style={{
          minWidth: 112,
          minHeight: 112,
          borderRadius: 28,
          border: '1px solid rgba(154, 238, 134, 0.35)',
          background: disabled
            ? 'rgba(255,255,255,0.12)'
            : 'linear-gradient(135deg, rgba(154, 238, 134, 0.95), rgba(94, 200, 255, 0.95))',
          color: '#08111e',
          fontSize: 20,
          fontWeight: 900,
          boxShadow: '0 16px 34px rgba(0, 0, 0, 0.32)',
          pointerEvents: 'auto',
          touchAction: 'manipulation',
        }}
      >
        E / 대화
      </button>
    </div>
  )
}
