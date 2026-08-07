import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Single source of truth for the player's selected movement speed.
// Kept in its own localStorage key so it stays isolated from save-game progress.
export const MIN_SPEED = 100
export const DEFAULT_SPEED = 150
export const MAX_SPEED = 220

export function clampSpeed(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return DEFAULT_SPEED
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, value))
}

interface SpeedState {
  moveSpeed: number
  setMoveSpeed: (value: number) => void
}

export const useSpeedStore = create<SpeedState>()(
  persist(
    (set) => ({
      moveSpeed: DEFAULT_SPEED,
      setMoveSpeed: (value) => set({ moveSpeed: clampSpeed(value) }),
    }),
    {
      name: 'korea-town-speed',
      version: 1,
      // Validate the restored value and keep it inside [MIN_SPEED, MAX_SPEED].
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SpeedState> | undefined
        return { ...currentState, moveSpeed: clampSpeed(persisted?.moveSpeed) }
      },
    }
  )
)
