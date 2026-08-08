import { useEffect, useMemo, useRef, useState } from 'react'
import type Phaser from 'phaser'
import {
  MAP_H,
  MAP_W,
  OUTDOOR_SPAWN,
  alleyLayer,
  blockLayer,
  decorBuildings,
  enterableBuildings,
  roadLayer,
  sidewalkLayer,
} from '../content/hongdae'
import { placeCatalog } from '../content/places'

interface Props {
  game: Phaser.Game | null
  isMobile: boolean
}

/**
 * World → minimap conversion.
 *
 * The SVG viewBox is `0 0 MAP_W MAP_H`, so world pixels are the drawing units
 * and the normalisation `((p - min) / size) * dim` is applied by the viewport
 * transform itself. All that remains is clamping the point into world bounds so
 * the marker can never escape the minimap.
 */
function placeMarker(el: SVGGElement | null, worldX: number, worldY: number) {
  if (!el) return
  const x = Math.min(MAP_W, Math.max(0, worldX))
  const y = Math.min(MAP_H, Math.max(0, worldY))
  el.setAttribute('transform', `translate(${x} ${y})`)
}

/**
 * Real-time minimap of the outdoor Hongdae map.
 *
 * Geometry is derived from the same `hongdae.ts` data the playable scene is
 * built from, so the minimap can never drift from the real layout. The SVG
 * uses `viewBox="0 0 MAP_W MAP_H"`, i.e. world pixels are the drawing units.
 *
 * The player marker is moved by writing SVG attributes through a ref, so a
 * moving player never re-renders React or redraws the static map layer.
 */
export default function Minimap({ game, isMobile }: Props) {
  const markerRef = useRef<SVGGElement | null>(null)
  /** Last known world position, so a remounted marker can be placed at once. */
  const lastPos = useRef({ x: OUTDOOR_SPAWN.x, y: OUTDOOR_SPAWN.y })
  const [outdoors, setOutdoors] = useState(true)

  const width = isMobile ? 124 : 196
  const height = Math.round((width * MAP_H) / MAP_W)

  /** Landmarks: every enterable building, labelled from the place catalog. */
  const landmarks = useMemo(
    () =>
      enterableBuildings.map((building) => {
        const place = placeCatalog.find((entry) => entry.outdoorBuildingId === building.id)
        return { id: building.id, x: building.x, y: building.y, icon: place?.icon ?? '📍' }
      }),
    []
  )

  useEffect(() => {
    if (!game) return

    const onPos = (data: { x: number; y: number }) => {
      lastPos.current = { x: data.x, y: data.y }
      placeMarker(markerRef.current, data.x, data.y)
    }
    const onScene = (data: { scene: string }) => setOutdoors(data.scene === 'town')

    game.events.on('player-pos', onPos)
    game.events.on('scene-changed', onScene)

    return () => {
      game.events.off('player-pos', onPos)
      game.events.off('scene-changed', onScene)
    }
  }, [game])

  // The <g> element is recreated whenever the minimap comes back from an
  // interior, so re-apply the last known position as soon as it exists.
  useEffect(() => {
    if (outdoors) placeMarker(markerRef.current, lastPos.current.x, lastPos.current.y)
  }, [outdoors])

  if (!outdoors) return null

  return (
    <div
      aria-label="Мини-карта Хондэ"
      style={{
        position: 'fixed',
        left: 14,
        // On mobile the minimap sits above both the virtual joystick (which
        // ends at ~154px) and the speed slider (which ends at ~190px).
        bottom: isMobile ? 200 : 14,
        zIndex: 900,
        width,
        padding: 6,
        borderRadius: 14,
        background: 'rgba(6, 10, 20, 0.78)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.32)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width={width - 12}
        height={height}
        style={{ display: 'block', borderRadius: 9, background: '#e9edf4' }}
      >
        {/* Paved city blocks */}
        {blockLayer.map((block, i) => (
          <rect key={`b${i}`} x={block.x} y={block.y} width={block.w} height={block.h} fill="#dfe4ee" />
        ))}
        {/* Sidewalks */}
        {sidewalkLayer.map((walk, i) => (
          <rect key={`s${i}`} x={walk.x} y={walk.y} width={walk.w} height={walk.h} fill="#f4f6fa" />
        ))}
        {/* Alleys then roads */}
        {alleyLayer.map((alley, i) => (
          <rect key={`a${i}`} x={alley.x} y={alley.y} width={alley.w} height={alley.h} fill="#c8cfdc" />
        ))}
        {roadLayer.map((road, i) => (
          <rect key={`r${i}`} x={road.x} y={road.y} width={road.w} height={road.h} fill="#b3bccd" />
        ))}
        {/* Building footprints */}
        {decorBuildings.map((building) => (
          <rect
            key={building.id}
            x={building.x - building.w / 2}
            y={building.y - building.h / 2}
            width={building.w}
            height={building.h}
            fill="#9aa6bc"
            rx={10}
          />
        ))}
        {/* Enterable buildings stand out */}
        {enterableBuildings.map((building) => (
          <rect
            key={building.id}
            x={building.x - building.w / 2}
            y={building.y - building.h / 2}
            width={building.w}
            height={building.h}
            fill="#6f86ad"
            stroke="#3d5170"
            strokeWidth={6}
            rx={10}
          />
        ))}
        {/* Landmark dots for each enterable location */}
        {landmarks.map((landmark) => (
          <circle key={landmark.id} cx={landmark.x} cy={landmark.y} r={34} fill="#2f4468" opacity={0.9} />
        ))}

        {/* Player marker — moved via ref, never re-rendered */}
        <g ref={markerRef}>
          <circle r={92} fill="#ff5d73" opacity={0.22} />
          <circle r={52} fill="#ff2d4b" stroke="#ffffff" strokeWidth={20} />
        </g>
      </svg>
    </div>
  )
}
