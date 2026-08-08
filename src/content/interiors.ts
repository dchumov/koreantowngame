import type { Rect } from './hongdae'

// Data-driven interior layouts. A single generic InteriorScene renders every
// entry here, so entrance/exit logic is never duplicated per building.

export interface InteriorSolid extends Rect {
  color: number
  /** Optional Korean label drawn on top of the object. */
  label?: string
  /** Label anchor in the rendered background, independent from the collider. */
  labelPosition?: { x: number; y: number }
}

export interface InteriorConfig {
  id: string
  /** Matching outdoor building id; used to place the player back outside. */
  outdoorBuildingId: string
  titleKo: string
  titleRu: string
  w: number
  h: number
  floorColor: number
  wallColor: number
  /** Optional full-room illustration used instead of procedural floor art. */
  backgroundTexture?: string
  /** Player spawn, deliberately offset from the exit trigger. */
  spawn: { x: number; y: number }
  /** Exit interaction zone (returns the player outdoors). */
  exit: { x: number; y: number }
  /** Solid furniture / fixtures. Perimeter walls are generated automatically. */
  solids: InteriorSolid[]
  /** Optional shop counter: zone position plus the shop id it opens. */
  shop?: { id: string; x: number; y: number }
}

const W = 760
const H = 520

/** Shared perimeter walls with a doorway gap at the bottom centre. */
export const WALL_THICKNESS = 24
export const DOOR_GAP = { from: 330, to: 430 }

export const interiorCatalog: InteriorConfig[] = [
  {
    id: 'convenience',
    outdoorBuildingId: 'convenience',
    titleKo: '24시 편의점',
    titleRu: 'Круглосуточный магазин',
    w: W,
    h: H,
    floorColor: 0x18243d,
    wallColor: 0x2c4675,
    backgroundTexture: 'interior-convenience-store',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    shop: { id: 'shop-convenience', x: 610, y: 310 },
    solids: [
      { x: 56, y: 80, w: 170, h: 36, color: 0x35507f, label: '음료수', labelPosition: { x: 112, y: 122 } },
      { x: 56, y: 152, w: 170, h: 36, color: 0x35507f, label: '과자', labelPosition: { x: 112, y: 214 } },
      { x: 56, y: 224, w: 170, h: 36, color: 0x35507f, label: '컵라면', labelPosition: { x: 112, y: 306 } },
      { x: 470, y: 130, w: 220, h: 60, color: 0x4a6ea8, label: '계산대', labelPosition: { x: 618, y: 306 } },
    ],
  },
  {
    id: 'clothing',
    outdoorBuildingId: 'clothing',
    titleKo: '스타일 옷가게',
    titleRu: 'Магазин одежды',
    w: W,
    h: H,
    floorColor: 0x2a1a2b,
    wallColor: 0x5c2b4d,
    backgroundTexture: 'interior-clothing-shop',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    shop: { id: 'shop-clothing', x: 580, y: 215 },
    solids: [
      { x: 56, y: 90, w: 150, h: 40, color: 0x8a4a76, label: '옷걸이', labelPosition: { x: 126, y: 142 } },
      { x: 56, y: 170, w: 150, h: 40, color: 0x8a4a76, label: '티셔츠', labelPosition: { x: 126, y: 238 } },
      { x: 620, y: 300, w: 110, h: 150, color: 0x7a3f66, label: '탈의실', labelPosition: { x: 664, y: 286 } },
      { x: 470, y: 130, w: 220, h: 60, color: 0xa1568a, label: '계산대', labelPosition: { x: 618, y: 306 } },
    ],
  },
  {
    id: 'department',
    outdoorBuildingId: 'department',
    titleKo: '홍대 백화점',
    titleRu: 'Универмаг Хондэ',
    w: W,
    h: H,
    floorColor: 0x2b2418,
    wallColor: 0x4a3a1f,
    backgroundTexture: 'interior-department-store',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    shop: { id: 'shop-department', x: 580, y: 215 },
    solids: [
      { x: 56, y: 90, w: 160, h: 40, color: 0x8a6a33, label: '가방', labelPosition: { x: 126, y: 142 } },
      { x: 56, y: 170, w: 160, h: 40, color: 0x8a6a33, label: '액세서리', labelPosition: { x: 126, y: 238 } },
      { x: 250, y: 90, w: 160, h: 40, color: 0x8a6a33, label: '신상품', labelPosition: { x: 330, y: 142 } },
      { x: 470, y: 130, w: 220, h: 60, color: 0xb08a44, label: '계산대', labelPosition: { x: 618, y: 306 } },
    ],
  },
  {
    id: 'subway',
    outdoorBuildingId: 'subway',
    titleKo: '홍대입구역',
    titleRu: 'Станция Хондэ-Ипку',
    w: W,
    h: H,
    floorColor: 0x14282a,
    wallColor: 0x1f4a45,
    backgroundTexture: 'interior-subway-station',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    solids: [
      { x: 56, y: 90, w: 120, h: 40, color: 0x2f7a70, label: '개찰구', labelPosition: { x: 116, y: 160 } },
      { x: 200, y: 90, w: 120, h: 40, color: 0x2f7a70, label: '개찰구', labelPosition: { x: 260, y: 160 } },
      { x: 560, y: 120, w: 140, h: 40, color: 0x2f7a70, label: '의자', labelPosition: { x: 630, y: 188 } },
      { x: 560, y: 380, w: 150, h: 44, color: 0x2f7a70, label: '노선도', labelPosition: { x: 635, y: 366 } },
    ],
  },
  {
    id: 'cafe',
    outdoorBuildingId: 'd1',
    titleKo: '달빛 분식',
    titleRu: 'Закусочная «Лунный свет»',
    w: W,
    h: H,
    floorColor: 0x3a2530,
    wallColor: 0x704536,
    backgroundTexture: 'interior-cafe',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    solids: [],
  },
  {
    id: 'music',
    outdoorBuildingId: 'd7',
    titleKo: '음악 상점',
    titleRu: 'Музыкальный магазин',
    w: W,
    h: H,
    floorColor: 0x211832,
    wallColor: 0x4c2d63,
    backgroundTexture: 'interior-music-shop',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    solids: [],
  },
  {
    id: 'restaurant',
    outdoorBuildingId: 'd8',
    titleKo: '골목 라멘',
    titleRu: 'Рамэн в переулке',
    w: W,
    h: H,
    floorColor: 0x3d2418,
    wallColor: 0x704126,
    backgroundTexture: 'interior-restaurant',
    spawn: { x: 380, y: 396 },
    exit: { x: 380, y: 494 },
    solids: [],
  },
]

export const interiorMap = new Map(interiorCatalog.map((interior) => [interior.id, interior]))
