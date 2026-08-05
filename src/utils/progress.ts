import { interactions, itemCatalog, locationCatalog, outfitCatalog, roomSlots, sentenceCatalog } from '../content/interactions'
import { vocabulary } from '../content/vocabulary'

export function getLocationInteractions(locationId: string) {
  return interactions.filter((interaction) => interaction.locationId === locationId)
}

export function getLocationProgress(locationId: string, completedInteractions: string[]) {
  const steps = getLocationInteractions(locationId)
  const completed = steps.filter((interaction) => completedInteractions.includes(interaction.id)).length
  const total = steps.length

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    isComplete: total > 0 && completed === total,
  }
}

export function getOverallProgress(completedInteractions: string[]) {
  const total = interactions.length
  const completed = interactions.filter((interaction) => completedInteractions.includes(interaction.id)).length
  return total === 0 ? 0 : Math.round((completed / total) * 100)
}

export const vocabularyMap = new Map(vocabulary.map((entry) => [entry.id, entry]))
export const sentenceMap = new Map(sentenceCatalog.map((entry) => [entry.id, entry]))
export const locationMap = new Map(locationCatalog.map((entry) => [entry.id, entry]))
export const itemMap = new Map(itemCatalog.map((entry) => [entry.id, entry]))
export const outfitMap = new Map(outfitCatalog.map((entry) => [entry.id, entry]))
export const roomSlotMap = new Map(roomSlots.map((entry) => [entry.id, entry]))
