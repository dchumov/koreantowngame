// Catalog of every place the player can actually discover in the current build.
//
// Legacy quest locations keep their original ids ('dorm', 'store', 'cafe',
// 'school') so existing saves keep their discovered places. Interiors use an
// 'int-' prefix, which also avoids colliding with the legacy 'cafe' location id.

export type PlaceKind = 'district' | 'quest' | 'shop' | 'food' | 'transport' | 'culture'

export interface PlaceEntry {
  id: string
  koreanName: string
  russianName: string
  kind: PlaceKind
  icon: string
  descriptionRu: string
  /** Shown while the place is still undiscovered. */
  discoveryHintRu: string
  /** Interior id, when this place is an enterable building. */
  interiorId?: string
  /** Outdoor building id, used for the minimap marker. */
  outdoorBuildingId?: string
  /** Ambient vocabulary learned simply by visiting this place. */
  unlockWords?: string[]
  /** Ambient sentences learned simply by visiting this place. */
  unlockSentences?: string[]
}

export const placeKindLabelRu: Record<PlaceKind, string> = {
  district: 'Район',
  quest: 'Учебная локация',
  shop: 'Магазин',
  food: 'Еда',
  transport: 'Транспорт',
  culture: 'Культура',
}

export const placeCatalog: PlaceEntry[] = [
  {
    id: 'hongdae-street',
    koreanName: '홍대 거리',
    russianName: 'Улицы Хондэ',
    kind: 'district',
    icon: '🏙️',
    descriptionRu: 'Оживлённый квартал с пешеходной улицей, переулками и торговыми рядами.',
    unlockWords: ['v-street', 'v-alley', 'v-buy'],
    discoveryHintRu: 'Откроется, как только вы окажетесь на улице.',
  },

  // ── Enterable interiors ─────────────────────────────────────────────────
  {
    id: 'int-convenience',
    koreanName: '24시 편의점',
    russianName: 'Круглосуточный магазин',
    kind: 'shop',
    icon: '🏪',
    descriptionRu: 'Напитки, онигири и мелочи на каждый день. Здесь удобно тренировать покупки.',
    unlockSentences: ['s-street-2', 's-street-3'],
    discoveryHintRu: 'Войдите в круглосуточный магазин на северо-востоке района.',
    interiorId: 'convenience',
    outdoorBuildingId: 'convenience',
  },
  {
    id: 'int-clothing',
    koreanName: '스타일 옷가게',
    russianName: 'Магазин одежды',
    kind: 'shop',
    icon: '👕',
    descriptionRu: 'Одежда, размеры и примерочная. Купленные вещи попадают в гардероб.',
    discoveryHintRu: 'Войдите в магазин одежды в восточной части района.',
    interiorId: 'clothing',
    outdoorBuildingId: 'clothing',
  },
  {
    id: 'int-department',
    koreanName: '홍대 백화점',
    russianName: 'Универмаг Хондэ',
    kind: 'shop',
    icon: '🏬',
    descriptionRu: 'Сумки и аксессуары, разговоры об этажах и скидках.',
    unlockWords: ['v-backpack', 'v-accessory', 'v-hat'],
    discoveryHintRu: 'Войдите в универмаг в южной части района.',
    interiorId: 'department',
    outdoorBuildingId: 'department',
  },
  {
    id: 'int-subway',
    koreanName: '홍대입구역',
    russianName: 'Станция Хондэ-Ипку',
    kind: 'transport',
    icon: '🚇',
    descriptionRu: 'Турникеты, схема линий и разговоры о пересадках.',
    discoveryHintRu: 'Спуститесь в метро на юго-востоке района.',
    interiorId: 'subway',
    outdoorBuildingId: 'subway',
  },
  {
    id: 'int-cafe',
    koreanName: '달빛 분식',
    russianName: 'Закусочная «Лунный свет»',
    kind: 'food',
    icon: '🍜',
    descriptionRu: 'Уютная закусочная у пешеходной улицы.',
    discoveryHintRu: 'Зайдите в закусочную на северо-западе района.',
    interiorId: 'cafe',
    outdoorBuildingId: 'd1',
  },
  {
    id: 'int-music',
    koreanName: '음악 상점',
    russianName: 'Музыкальный магазин',
    kind: 'culture',
    icon: '🎸',
    descriptionRu: 'Репетиционная студия и музыкальный магазин — сердце Хондэ.',
    unlockWords: ['v-music'],
    discoveryHintRu: 'Загляните в репетиционную студию в западных переулках.',
    interiorId: 'music',
    outdoorBuildingId: 'd7',
  },
  {
    id: 'int-restaurant',
    koreanName: '골목 라멘',
    russianName: 'Рамэн в переулке',
    kind: 'food',
    icon: '🍲',
    descriptionRu: 'Маленькая рамэн-лавка в переулке за главной улицей.',
    unlockWords: ['v-ramen', 'v-eat', 'v-restaurant'],
    unlockSentences: ['s-food-1', 's-food-2'],
    discoveryHintRu: 'Найдите рамэн-лавку в центральном переулке.',
    interiorId: 'restaurant',
    outdoorBuildingId: 'd8',
  },

  // ── Legacy quest locations (ids preserved for old saves) ────────────────
  {
    id: 'dorm',
    koreanName: '기숙사',
    russianName: 'Общежитие',
    kind: 'quest',
    icon: '🛏️',
    descriptionRu: 'Первое место игрока: базовые слова комнаты и знакомство с Юной.',
    discoveryHintRu: 'Поговорите с 유나 у общежития.',
  },
  {
    id: 'store',
    koreanName: '편의점',
    russianName: 'Магазин у общежития',
    kind: 'quest',
    icon: '🥤',
    descriptionRu: 'Еда и напитки на каждый день, разговоры с Минсу.',
    discoveryHintRu: 'Поговорите с 민수 у магазина.',
  },
  {
    id: 'cafe',
    koreanName: '카페',
    russianName: 'Кафе',
    kind: 'quest',
    icon: '☕',
    descriptionRu: 'Заказ кофе и чтение меню вместе с Джихуном.',
    discoveryHintRu: 'Поговорите с 지훈 у кафе.',
  },
  {
    id: 'school',
    koreanName: '학교',
    russianName: 'Школа',
    kind: 'quest',
    icon: '🏫',
    descriptionRu: 'Учебные слова, документы и предметы класса вместе с Сорой.',
    discoveryHintRu: 'Поговорите с 소라 у школы.',
  },
]

export const placeMap = new Map(placeCatalog.map((place) => [place.id, place]))

/** Place id unlocked when the player walks into a given interior. */
export function placeIdForInterior(interiorId: string): string | null {
  return placeCatalog.find((place) => place.interiorId === interiorId)?.id ?? null
}

/** Only ids that exist in the catalog count towards the HUD counter. */
export function countDiscoveredPlaces(discovered: string[]): number {
  return placeCatalog.filter((place) => discovered.includes(place.id)).length
}
