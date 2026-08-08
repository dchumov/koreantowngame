import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RoomSlotId } from '../content/interactions'
import { resolvePurchasable } from '../content/shops'

/** Outcome of a shop purchase attempt. */
export type PurchaseResult = 'ok' | 'insufficient' | 'owned' | 'unknown'

type CollectionState = {
  words: string[]
  sentences: string[]
  places: string[]
  items: string[]
}

type RoomSlotsState = Record<RoomSlotId, string | null>

interface GameState {
  xp: number
  coins: number
  furniture: string[]
  outfits: string[]
  equippedOutfit: string
  roomSlots: RoomSlotsState
  completedInteractions: string[]
  unlockedItems: string[]
  unlockedOutfits: string[]
  collection: CollectionState
  reviewList: string[]
  addXP: (n: number) => void
  addCoins: (n: number) => void
  spendCoins: (n: number) => boolean
  addFurniture: (id: string) => void
  addOutfit: (id: string) => void
  unlockItem: (id: string) => void
  unlockOutfit: (id: string) => void
  equipOutfit: (id: string) => void
  setRoomSlot: (slotId: RoomSlotId, itemId: string | null) => void
  completeInteraction: (id: string) => void
  addWordToCollection: (id: string) => void
  addSentenceToCollection: (id: string) => void
  addPlaceToCollection: (id: string) => void
  addItemToCollection: (id: string) => void
  addToReview: (id: string) => void
  purchase: (id: string) => PurchaseResult
  resetProgress: () => void
}

const initialRoomSlots: RoomSlotsState = {
  bed: null,
  desk: null,
  chair: null,
  lamp: null,
  poster: null,
  plant: null,
}

const initialCollection: CollectionState = {
  words: [],
  sentences: [],
  places: [],
  items: ['base'],
}

const initialState = {
  xp: 0,
  coins: 0,
  furniture: [] as string[],
  outfits: ['base'] as string[],
  equippedOutfit: 'base',
  roomSlots: initialRoomSlots,
  completedInteractions: [] as string[],
  unlockedItems: [] as string[],
  unlockedOutfits: ['base'] as string[],
  collection: initialCollection,
  reviewList: [] as string[],
}

const dedupe = (list: string[]) => [...new Set(list)]

/**
 * Defensive reader for persisted arrays. Older or hand-edited saves can hold
 * `null`, a string, or an object where a string[] is expected; those must never
 * crash the game on load.
 */
const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : []

const migrateState = (persistedState: unknown) => {
  if (!persistedState || typeof persistedState !== 'object') {
    return initialState
  }

  const legacy = persistedState as Record<string, unknown>
  const legacyCollection = asStringArray(legacy.collection)
  const furniture = asStringArray(legacy.furniture)
  const outfits = Array.isArray(legacy.outfits) ? asStringArray(legacy.outfits) : ['base']
  const unlockedItems = Array.isArray(legacy.unlockedItems) ? asStringArray(legacy.unlockedItems) : furniture
  const unlockedOutfits = Array.isArray(legacy.unlockedOutfits) ? asStringArray(legacy.unlockedOutfits) : outfits
  const persistedCollection = legacy.collection && typeof legacy.collection === 'object' && !Array.isArray(legacy.collection)
    ? legacy.collection as Partial<CollectionState>
    : null

  return {
    xp: typeof legacy.xp === 'number' ? legacy.xp : 0,
    coins: typeof legacy.coins === 'number' ? legacy.coins : 0,
    furniture: dedupe(furniture),
    outfits: dedupe(['base', ...outfits]),
    equippedOutfit: typeof legacy.equippedOutfit === 'string' ? legacy.equippedOutfit : 'base',
    roomSlots: {
      ...initialRoomSlots,
      ...(legacy.roomSlots && typeof legacy.roomSlots === 'object' ? legacy.roomSlots as Partial<RoomSlotsState> : {}),
    },
    completedInteractions: dedupe(asStringArray(legacy.completedInteractions)),
    unlockedItems: dedupe(unlockedItems),
    unlockedOutfits: dedupe(['base', ...unlockedOutfits]),
    collection: {
      words: dedupe(asStringArray(persistedCollection?.words)),
      sentences: Array.isArray(persistedCollection?.sentences)
        ? dedupe(asStringArray(persistedCollection?.sentences))
        : legacyCollection,
      places: dedupe(asStringArray(persistedCollection?.places)),
      items: Array.isArray(persistedCollection?.items)
        ? dedupe(asStringArray(persistedCollection?.items))
        : dedupe(furniture),
    },
    reviewList: dedupe(asStringArray(legacy.reviewList)),
  }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addXP: (n) => set((state) => ({ xp: state.xp + n })),
      addCoins: (n) => set((state) => ({ coins: state.coins + n })),
      spendCoins: (n) => {
        if (get().coins < n) return false
        set((state) => ({ coins: state.coins - n }))
        return true
      },
      addFurniture: (id) => set((state) => ({
        furniture: dedupe([...state.furniture, id]),
        unlockedItems: dedupe([...state.unlockedItems, id]),
        collection: {
          ...state.collection,
          items: dedupe([...state.collection.items, id]),
        },
      })),
      addOutfit: (id) => set((state) => ({
        outfits: dedupe([...state.outfits, id]),
        unlockedOutfits: dedupe([...state.unlockedOutfits, id]),
        collection: {
          ...state.collection,
          items: dedupe([...state.collection.items, id]),
        },
      })),
      unlockItem: (id) => set((state) => ({
        unlockedItems: dedupe([...state.unlockedItems, id]),
      })),
      unlockOutfit: (id) => set((state) => ({
        unlockedOutfits: dedupe([...state.unlockedOutfits, id]),
      })),
      equipOutfit: (id) => set(() => ({ equippedOutfit: id })),
      setRoomSlot: (slotId, itemId) => set((state) => ({
        roomSlots: {
          ...state.roomSlots,
          [slotId]: itemId,
        },
      })),
      completeInteraction: (id) => set((state) => ({
        completedInteractions: dedupe([...state.completedInteractions, id]),
      })),
      addWordToCollection: (id) => set((state) => ({
        collection: {
          ...state.collection,
          words: dedupe([...state.collection.words, id]),
        },
      })),
      addSentenceToCollection: (id) => set((state) => ({
        collection: {
          ...state.collection,
          sentences: dedupe([...state.collection.sentences, id]),
        },
      })),
      addPlaceToCollection: (id) => set((state) => ({
        collection: {
          ...state.collection,
          places: dedupe([...state.collection.places, id]),
        },
      })),
      addItemToCollection: (id) => set((state) => ({
        collection: {
          ...state.collection,
          items: dedupe([...state.collection.items, id]),
        },
      })),
      addToReview: (id) => set((state) => ({ reviewList: dedupe([...state.reviewList, id]) })),
      /**
       * Atomic purchase: the balance check, the deduction and the grant all
       * happen inside a single state update, so points can never be spent
       * without receiving the item (and never go negative). Already-owned
       * items are rejected, which also absorbs double clicks and held inputs.
       */
      purchase: (id) => {
        const entry = resolvePurchasable(id)
        if (!entry) return 'unknown'

        let result: PurchaseResult = 'ok'
        set((state) => {
          const owned = entry.kind === 'outfit'
            ? state.outfits.includes(entry.id)
            : state.unlockedItems.includes(entry.id)

          if (owned) {
            result = 'owned'
            return {}
          }
          if (state.coins < entry.cost) {
            result = 'insufficient'
            return {}
          }

          result = 'ok'
          const collection = { ...state.collection, items: dedupe([...state.collection.items, entry.id]) }

          if (entry.kind === 'outfit') {
            return {
              coins: state.coins - entry.cost,
              outfits: dedupe([...state.outfits, entry.id]),
              unlockedOutfits: dedupe([...state.unlockedOutfits, entry.id]),
              collection,
            }
          }

          return {
            coins: state.coins - entry.cost,
            unlockedItems: dedupe([...state.unlockedItems, entry.id]),
            furniture: entry.kind === 'furniture' ? dedupe([...state.furniture, entry.id]) : state.furniture,
            collection,
          }
        })

        return result
      },
      resetProgress: () => set({ ...initialState, roomSlots: { ...initialRoomSlots }, collection: { ...initialCollection } }),
    }),
    {
      name: 'korea-town-storage',
      version: 2,
      migrate: (persistedState) => migrateState(persistedState),
    }
  )
)
