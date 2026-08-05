import { useGameStore } from './gameStore'

export function saveGame() { return useGameStore.getState() }
export function loadGame() { return useGameStore.getState() }
export function resetGame() { useGameStore.getState().resetProgress() }
