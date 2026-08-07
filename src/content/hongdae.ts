// Data-driven definition of the Hongdae outdoor map.
// The scene renders these layers and generates all collision bodies from them,
// so no collision rectangles are hard-coded inside scene logic.
//
// All shop names are generic and fictional. No real brands, logos or
// entertainment-company names are used.

export const TILE = 32
export const MAP_W_TILES = 100
export const MAP_H_TILES = 68
export const MAP_W = MAP_W_TILES * TILE // 3200 px
export const MAP_H = MAP_H_TILES * TILE // 2176 px

/** Player spawn on the outdoor map (pixels). */
export const OUTDOOR_SPAWN = { x: 1024, y: 1000 }

export type Rect = { x: number; y: number; w: number; h: number }

/** Asphalt / pavement strips. Purely visual, never solid. */
export const roadLayer: Rect[] = [
  { x: 0, y: 600, w: MAP_W, h: 170 },   // 걷고 싶은 거리 — main street
  { x: 0, y: 1500, w: MAP_W, h: 130 },  // secondary street
  { x: 1180, y: 0, w: 140, h: MAP_H },  // vertical street
  { x: 2000, y: 0, w: 140, h: MAP_H },  // vertical street
]

/** Narrow alleys that make the block feel like Hongdae back streets. */
export const alleyLayer: Rect[] = [
  { x: 640, y: 770, w: 70, h: 730 },
  { x: 2600, y: 770, w: 70, h: 730 },
  { x: 1320, y: 1180, w: 680, h: 64 },
  { x: 320, y: 1630, w: 64, h: 546 },
]

/** Zebra crossings drawn as stripe groups at the intersections. */
export const crosswalkLayer: Array<Rect & { orientation: 'h' | 'v' }> = [
  { x: 1080, y: 600, w: 100, h: 170, orientation: 'v' },
  { x: 1320, y: 600, w: 100, h: 170, orientation: 'v' },
  { x: 1900, y: 600, w: 100, h: 170, orientation: 'v' },
  { x: 2140, y: 600, w: 100, h: 170, orientation: 'v' },
  { x: 1180, y: 500, w: 140, h: 100, orientation: 'h' },
  { x: 2000, y: 1400, w: 140, h: 100, orientation: 'h' },
  { x: 1180, y: 1630, w: 140, h: 100, orientation: 'h' },
]

export type BuildingSide = 'top' | 'bottom'

export interface OutdoorBuilding {
  id: string
  /** Centre position in pixels. */
  x: number
  y: number
  w: number
  h: number
  signKo: string
  signRu: string
  bodyColor: number
  roofColor: number
  /** Side the doorway gap is on; collision is generated around it. */
  entranceSide: BuildingSide
  /** Present only for buildings the player can walk into. */
  interiorId?: string
}

/**
 * Enterable buildings. Each one gets a doorway gap in its collision and a
 * matching entrance zone, both generated from this data.
 */
export const enterableBuildings: OutdoorBuilding[] = [
  {
    id: 'convenience',
    x: 2496,
    y: 384,
    w: 300,
    h: 210,
    signKo: '24시 편의점',
    signRu: 'Круглосуточный магазин',
    bodyColor: 0x21406b,
    roofColor: 0x3f7fd4,
    entranceSide: 'bottom',
    interiorId: 'convenience',
  },
  {
    id: 'clothing',
    x: 2496,
    y: 1088,
    w: 320,
    h: 220,
    signKo: '스타일 옷가게',
    signRu: 'Магазин одежды',
    bodyColor: 0x5c2b4d,
    roofColor: 0xc86bab,
    entranceSide: 'bottom',
    interiorId: 'clothing',
  },
  {
    id: 'department',
    x: 960,
    y: 1810,
    w: 420,
    h: 260,
    signKo: '홍대 백화점',
    signRu: 'Универмаг Хондэ',
    bodyColor: 0x4a3a1f,
    roofColor: 0xd7a44a,
    entranceSide: 'top',
    interiorId: 'department',
  },
  {
    id: 'subway',
    x: 2320,
    y: 1860,
    w: 360,
    h: 230,
    signKo: '홍대입구역',
    signRu: 'Станция Хондэ-Ипку',
    bodyColor: 0x1f4a45,
    roofColor: 0x49c4b0,
    entranceSide: 'top',
    interiorId: 'subway',
  },
]

/** Purely decorative storefronts that give the district its density. */
export const decorBuildings: OutdoorBuilding[] = [
  { id: 'd1', x: 300, y: 470, w: 240, h: 150, signKo: '달빛 분식', signRu: 'Закусочная «Лунный свет»', bodyColor: 0x33294f, roofColor: 0x7a6ab5, entranceSide: 'bottom' },
  { id: 'd2', x: 760, y: 470, w: 240, h: 150, signKo: '구름 서점', signRu: 'Книжный «Облако»', bodyColor: 0x24404f, roofColor: 0x5aa2c4, entranceSide: 'bottom' },
  { id: 'd3', x: 2920, y: 470, w: 250, h: 150, signKo: '별빛 문구', signRu: 'Канцтовары «Звёздный свет»', bodyColor: 0x4a2f2f, roofColor: 0xc47f6a, entranceSide: 'bottom' },
  { id: 'd4', x: 860, y: 880, w: 250, h: 150, signKo: '하늘 미용실', signRu: 'Салон «Небо»', bodyColor: 0x2f4a36, roofColor: 0x74c48a, entranceSide: 'top' },
  { id: 'd5', x: 900, y: 1330, w: 250, h: 150, signKo: '노을 떡집', signRu: 'Ток-пекарня «Закат»', bodyColor: 0x50392a, roofColor: 0xd39a63, entranceSide: 'top' },
  { id: 'd6', x: 2760, y: 880, w: 250, h: 150, signKo: '바람 꽃집', signRu: 'Цветы «Ветер»', bodyColor: 0x3f2f4f, roofColor: 0xa87fc4, entranceSide: 'top' },
  { id: 'd7', x: 400, y: 1330, w: 260, h: 160, signKo: '연습실 스튜디오', signRu: 'Репетиционная студия', bodyColor: 0x2b3350, roofColor: 0x6c7fc4, entranceSide: 'top' },
  { id: 'd8', x: 1700, y: 1330, w: 260, h: 160, signKo: '골목 라멘', signRu: 'Рамэн в переулке', bodyColor: 0x4f3320, roofColor: 0xd08a4a, entranceSide: 'top' },
  { id: 'd9', x: 2760, y: 1330, w: 250, h: 160, signKo: '홍대 문화센터', signRu: 'Культурный центр Хондэ', bodyColor: 0x23404a, roofColor: 0x57b0c4, entranceSide: 'top' },
  { id: 'd10', x: 1500, y: 1860, w: 280, h: 180, signKo: '작은 공연장', signRu: 'Небольшой концертный зал', bodyColor: 0x40254a, roofColor: 0xb06fc4, entranceSide: 'top' },
  { id: 'd11', x: 500, y: 2010, w: 240, h: 140, signKo: '동네 슈퍼', signRu: 'Районный супермаркет', bodyColor: 0x2f4030, roofColor: 0x77b877, entranceSide: 'top' },
  { id: 'd12', x: 2860, y: 1860, w: 240, h: 180, signKo: '거리 갤러리', signRu: 'Уличная галерея', bodyColor: 0x3a2f24, roofColor: 0xbb9a63, entranceSide: 'top' },
]

/** Small solid street props (planters, kiosks, benches). */
export const propLayer: Array<Rect & { color: number }> = [
  { x: 1000, y: 820, w: 56, h: 56, color: 0x3d6b46 },
  { x: 1500, y: 820, w: 56, h: 56, color: 0x3d6b46 },
  { x: 2300, y: 820, w: 56, h: 56, color: 0x3d6b46 },
  { x: 700, y: 1180, w: 56, h: 56, color: 0x3d6b46 },
  { x: 2700, y: 1180, w: 56, h: 56, color: 0x3d6b46 },
  { x: 1050, y: 1700, w: 70, h: 46, color: 0x5a4636 },
  { x: 2500, y: 1700, w: 70, h: 46, color: 0x5a4636 },
  { x: 300, y: 780, w: 46, h: 46, color: 0x5a4636 },
]

/** Non-solid ground text labels that name the district areas. */
export const districtLabels: Array<{ x: number; y: number; text: string }> = [
  { x: 1600, y: 690, text: '걷고 싶은 거리 · Пешеходная улица' },
  { x: 700, y: 1560, text: '골목길 · Переулки' },
  { x: 2400, y: 1560, text: '홍대 상가 · Торговый квартал' },
]
