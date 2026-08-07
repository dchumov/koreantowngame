import { itemCatalog, outfitCatalog } from './interactions'

// Shops reuse the existing coins balance as currency and the existing
// item / outfit catalogs. No separate currency or inventory is introduced.

export type PurchasableKind = 'furniture' | 'souvenir' | 'bag' | 'accessory' | 'snack' | 'outfit'

export interface PurchasableEntry {
  id: string
  labelKo: string
  labelRu: string
  kind: PurchasableKind
  cost: number
  description: string
  /** Emoji used as the compact visual representation in the shop grid. */
  icon: string
}

export interface ShopConfig {
  id: string
  interiorId: string
  titleKo: string
  titleRu: string
  subtitleRu: string
  itemIds: string[]
}

const icons: Record<string, string> = {
  'barley-tea': '🍵',
  'rice-ball': '🍙',
  umbrella: '☂️',
  'hair-pin': '⭐',
  'cap-navy': '🧢',
  'round-glasses': '👓',
  'canvas-bag': '👜',
  'mini-backpack': '🎒',
  'street-style': '👕',
  'hongdae-jacket': '🧥',
  'stage-look': '✨',
}

export const shopCatalog: ShopConfig[] = [
  {
    id: 'shop-convenience',
    interiorId: 'convenience',
    titleKo: '24시 편의점',
    titleRu: 'Круглосуточный магазин',
    subtitleRu: 'Напитки, перекусы и мелочи на каждый день.',
    itemIds: ['barley-tea', 'rice-ball', 'umbrella'],
  },
  {
    id: 'shop-clothing',
    interiorId: 'clothing',
    titleKo: '스타일 옷가게',
    titleRu: 'Магазин одежды',
    subtitleRu: 'Купленная одежда сразу появляется в гардеробе.',
    itemIds: ['street-style', 'hongdae-jacket', 'stage-look', 'hair-pin'],
  },
  {
    id: 'shop-department',
    interiorId: 'department',
    titleKo: '홍대 백화점',
    titleRu: 'Универмаг Хондэ',
    subtitleRu: 'Сумки и аксессуары на первом этаже.',
    itemIds: ['canvas-bag', 'mini-backpack', 'cap-navy', 'round-glasses'],
  },
]

export const shopMap = new Map(shopCatalog.map((shop) => [shop.id, shop]))

/** Resolves an id into a purchasable entry from either catalog (outfits win last). */
export function resolvePurchasable(id: string): PurchasableEntry | null {
  const item = itemCatalog.find((entry) => entry.id === id)
  if (item) {
    return {
      id: item.id,
      labelKo: item.labelKo,
      labelRu: item.labelRu,
      kind: item.kind,
      cost: item.cost,
      description: item.description,
      icon: icons[item.id] ?? '📦',
    }
  }
  const outfit = outfitCatalog.find((entry) => entry.id === id)
  if (outfit) {
    return {
      id: outfit.id,
      labelKo: outfit.labelKo,
      labelRu: outfit.labelRu,
      kind: 'outfit',
      cost: outfit.cost,
      description: outfit.description,
      icon: icons[outfit.id] ?? '🧥',
    }
  }
  return null
}

export function getShopEntries(shopId: string): PurchasableEntry[] {
  const shop = shopMap.get(shopId)
  if (!shop) return []
  return shop.itemIds
    .map(resolvePurchasable)
    .filter((entry): entry is PurchasableEntry => entry !== null)
}

export const kindLabelRu: Record<PurchasableKind, string> = {
  furniture: 'Мебель',
  souvenir: 'Сувенир',
  bag: 'Сумка',
  accessory: 'Аксессуар',
  snack: 'Еда и напитки',
  outfit: 'Одежда',
}
