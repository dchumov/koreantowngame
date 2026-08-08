import { itemCatalog, outfitCatalog, sentenceCatalog } from './interactions'
import { placeCatalog, placeKindLabelRu } from './places'
import { vocabTopicLabelRu, vocabulary } from './vocabulary'

// Normalisation layer for «Коллекция Korea Town».
//
// This does NOT introduce a second collection database: it reads the existing
// vocabulary / sentence / place / item catalogs and reshapes them into one card
// model so the UI can render all four tabs consistently.

export type CollectionCategory = 'words' | 'sentences' | 'places' | 'items'

export interface CollectionEntry {
  id: string
  category: CollectionCategory
  /** Korean headline (word, sentence, place or item name). */
  korean: string
  /** Russian translation / localized name. */
  russian: string
  /** Short topic or category label shown as the card kicker. */
  topicRu: string
  /** Icon or emoji thumbnail. */
  icon: string
  /** Contextual description shown once unlocked. */
  descriptionRu: string
  /** Where the entry is found, shown while still locked. */
  discoveryHintRu: string
  /** Optional secondary Korean line (example sentence). */
  exampleKo?: string
  exampleRu?: string
  /** Price, for purchasable items. */
  cost?: number
}

const itemIcons: Record<string, string> = {
  'cozy-bed': '🛏️',
  'study-desk': '🪑',
  'wood-chair': '🪵',
  'moon-lamp': '🌙',
  'seoul-poster': '🖼️',
  'mint-plant': '🪴',
  'ramen-sticker': '🍜',
  'cafe-mug': '☕',
  'campus-badge': '🎖️',
  'barley-tea': '🍵',
  'rice-ball': '🍙',
  umbrella: '☂️',
  'hair-pin': '⭐',
  'cap-navy': '🧢',
  'round-glasses': '👓',
  'canvas-bag': '👜',
  'mini-backpack': '🎒',
  base: '🧥',
  casual: '👕',
  school: '🎒',
  'street-style': '🧣',
  'hongdae-jacket': '🧥',
  'stage-look': '✨',
}

const itemKindLabelRu: Record<string, string> = {
  furniture: 'Мебель',
  souvenir: 'Сувенир',
  bag: 'Сумка',
  accessory: 'Аксессуар',
  snack: 'Еда и напитки',
  outfit: 'Одежда',
}

/** Words — reads the shared vocabulary list. */
export const wordEntries: CollectionEntry[] = vocabulary.map((entry) => ({
  id: entry.id,
  category: 'words',
  korean: entry.korean,
  russian: entry.russian,
  topicRu: vocabTopicLabelRu[entry.topic],
  icon: '📖',
  descriptionRu: entry.sourceRu,
  discoveryHintRu: entry.sourceRu,
  exampleKo: entry.example,
  exampleRu: entry.exampleRu,
}))

/** Sentences — reads the shared sentence catalog. */
export const sentenceEntries: CollectionEntry[] = sentenceCatalog.map((entry) => ({
  id: entry.id,
  category: 'sentences',
  korean: entry.korean,
  russian: entry.russian,
  topicRu: entry.topicRu ?? 'Фраза',
  icon: '💬',
  descriptionRu: entry.sourceRu ?? 'Открывается во время разговоров и заданий.',
  discoveryHintRu: entry.sourceRu ?? 'Открывается во время разговоров и заданий.',
}))

/** Places — reads the place catalog. */
export const placeEntries: CollectionEntry[] = placeCatalog.map((entry) => ({
  id: entry.id,
  category: 'places',
  korean: entry.koreanName,
  russian: entry.russianName,
  topicRu: placeKindLabelRu[entry.kind],
  icon: entry.icon,
  descriptionRu: entry.descriptionRu,
  discoveryHintRu: entry.discoveryHintRu,
}))

/** Items — reads the shared item and outfit catalogs. */
export const itemEntries: CollectionEntry[] = [
  ...itemCatalog.map((entry) => ({
    id: entry.id,
    category: 'items' as const,
    korean: entry.labelKo,
    russian: entry.labelRu,
    topicRu: itemKindLabelRu[entry.kind] ?? 'Предмет',
    icon: itemIcons[entry.id] ?? '📦',
    descriptionRu: entry.description,
    discoveryHintRu: entry.unlockHint,
    cost: entry.cost > 0 ? entry.cost : undefined,
  })),
  ...outfitCatalog.map((entry) => ({
    id: entry.id,
    category: 'items' as const,
    korean: entry.labelKo,
    russian: entry.labelRu,
    topicRu: itemKindLabelRu.outfit,
    icon: itemIcons[entry.id] ?? '🧥',
    descriptionRu: entry.description,
    discoveryHintRu: entry.unlockHint,
    cost: entry.cost > 0 ? entry.cost : undefined,
  })),
]

export const collectionCategories: Array<{ id: CollectionCategory; label: string; entries: CollectionEntry[] }> = [
  { id: 'words', label: 'Слова', entries: wordEntries },
  { id: 'sentences', label: 'Предложения', entries: sentenceEntries },
  { id: 'places', label: 'Места', entries: placeEntries },
  { id: 'items', label: 'Предметы', entries: itemEntries },
]

export const collectionTotals = {
  words: wordEntries.length,
  sentences: sentenceEntries.length,
  places: placeEntries.length,
  items: itemEntries.length,
}

/** Counts only ids that really exist in the catalog, so stray save data never inflates a counter. */
export function countDiscovered(entries: CollectionEntry[], discovered: string[]): number {
  const owned = new Set(discovered)
  return entries.reduce((total, entry) => (owned.has(entry.id) ? total + 1 : total), 0)
}
