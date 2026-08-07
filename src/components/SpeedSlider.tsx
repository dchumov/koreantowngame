import { MAX_SPEED, MIN_SPEED, useSpeedStore } from '../store/speedStore'

interface Props {
  isMobile: boolean
}

// Horizontal "volume-style" movement-speed slider with a circular draggable thumb.
// Uses a ⚡ icon (not a speaker icon) because it controls movement speed, not sound.
export default function SpeedSlider({ isMobile }: Props) {
  const moveSpeed = useSpeedStore((state) => state.moveSpeed)
  const setMoveSpeed = useSpeedStore((state) => state.setMoveSpeed)

  const percent = ((moveSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100
  const trackBackground =
    `linear-gradient(90deg, #9aee86 0%, #5ec8ff ${percent}%, rgba(255,255,255,0.14) ${percent}%, rgba(255,255,255,0.14) 100%)`

  return (
    <div style={{
      position: 'fixed',
      right: 14,
      // On mobile, sit above the interact button so it never overlaps the joystick or E button.
      bottom: isMobile ? 156 : 16,
      zIndex: 950,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      borderRadius: 16,
      background: 'rgba(6, 10, 20, 0.72)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
      color: '#f5f7ff',
      pointerEvents: 'auto',
      touchAction: 'none',
      userSelect: 'none',
    }}>
      <style>{`
        .kt-speed-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }
        .kt-speed-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(180deg, #eafcff, #cdeeff);
          border: 2px solid #5ec8ff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          cursor: pointer;
        }
        .kt-speed-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(180deg, #eafcff, #cdeeff);
          border: 2px solid #5ec8ff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          cursor: pointer;
        }
      `}</style>

      <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>⚡</span>

      <input
        className="kt-speed-slider"
        type="range"
        min={MIN_SPEED}
        max={MAX_SPEED}
        step={1}
        value={moveSpeed}
        aria-label="Скорость движения"
        title="Скорость движения"
        onChange={(event) => setMoveSpeed(Number(event.target.value))}
        // Release keyboard focus after dragging so arrow keys keep moving the player.
        onPointerUp={(event) => event.currentTarget.blur()}
        style={{ width: isMobile ? 120 : 140, background: trackBackground }}
      />

      <span style={{ minWidth: 30, textAlign: 'right', fontWeight: 800, fontSize: 12 }}>{moveSpeed}</span>
    </div>
  )
}
