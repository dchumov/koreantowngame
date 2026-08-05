import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RoomSlotId } from '../content/interactions'

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

const migrateState = (persistedState: unknown) => {
  if (!persistedState || typeof persistedState !== 'object') {
    return initialState
  }

  const legacy = persistedState as Record<string, unknown>
  const legacyCollection = Array.isArray(legacy.collection) ? legacy.collection.filter((value): value is string => typeof value === 'string') : []
  const furniture = Array.isArray(legacy.furniture) ? legacy.furniture.filter((value): value is string => typeof value === 'string') : []
  const outfits = Array.isArray(legacy.outfits) ? legacy.outfits.filter((value): value is string => typeof value === 'string') : ['base']
  const unlockedItems = Array.isArray(legacy.unlockedItems) ? legacy.unlockedItems.filter((value): value is string => typeof value === 'string') : furniture
  const unlockedOutfits = Array.isArray(legacy.unlockedOutfits) ? legacy.unlockedOutfits.filter((value): value is string => typeof value === 'string') : outfits
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
    completedInteractions: Array.isArray(legacy.completedInteractions)
      ? dedupe(legacy.completedInteractions.filter((value): value is string => typeof value === 'string'))
      : [],
    unlockedItems: dedupe(unlockedItems),
    unlockedOutfits: dedupe(['base', ...unlockedOutfits]),
    collection: {
      words: persistedCollection?.words ? dedupe(persistedCollection.words.filter(Boolean)) : [],
      sentences: persistedCollection?.sentences ? dedupe(persistedCollection.sentences.filter(Boolean)) : legacyCollection,
      places: persistedCollection?.places ? dedupe(persistedCollection.places.filter(Boolean)) : [],
      items: persistedCollection?.items ? dedupe(persistedCollection.items.filter(Boolean)) : dedupe(furniture),
    },
    reviewList: Array.isArray(legacy.reviewList)
      ? dedupe(legacy.reviewList.filter((value): value is string => typeof value === 'string'))
      : [],
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
      resetProgress: () => set({ ...initialState, roomSlots: { ...initialRoomSlots }, collection: { ...initialCollection } }),
    }),
    {
      name: 'korea-town-storage',
      version: 2,
      migrate: (persistedState) => migrateState(persistedState),
    }
  )
)
