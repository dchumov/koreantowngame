import Phaser from 'phaser'

/**
 * Interaction targets are ranked so that a single input always resolves to
 * exactly one deterministic action:
 *   rank 0 — NPCs and shop counters (nearest wins)
 *   rank 1 — building entrances / exits
 * Ties inside a rank are broken by distance.
 */
export type ZoneKind = 'npc' | 'shop' | 'door'

const KIND_RANK: Record<ZoneKind, number> = { npc: 0, shop: 0, door: 1 }

export interface InteractionZone {
  id: string
  x: number
  y: number
  radius: number
  kind: ZoneKind
  /** Short prompt suffix, e.g. 대화 / 상점 / 들어가기. */
  label: string
  onInteract: () => void
}

export class InteractionSystem {
  private zones: InteractionZone[] = []
  private activeZone: InteractionZone | null = null
  private promptText: Phaser.GameObjects.Text | null = null
  private scene: Phaser.Scene
  /** Guards against re-triggering while an input is held or a scene swaps. */
  private lockedUntil = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  addZone(zone: InteractionZone) {
    this.zones.push(zone)
  }

  clearZones() {
    this.zones = []
    this.activeZone = null
  }

  getActiveZoneId() {
    return this.activeZone?.id ?? null
  }

  getActiveZone() {
    return this.activeZone
  }

  /** Blocks interactions for `ms` (used after scene transitions). */
  lock(ms: number) {
    this.lockedUntil = this.scene.time.now + ms
  }

  isLocked() {
    return this.scene.time.now < this.lockedUntil
  }

  update(player: Phaser.Physics.Arcade.Sprite) {
    const p = player.getCenter()
    let best: InteractionZone | null = null
    let bestRank = Number.POSITIVE_INFINITY
    let bestDist = Number.POSITIVE_INFINITY

    for (const zone of this.zones) {
      const distance = Phaser.Math.Distance.Between(p.x, p.y, zone.x, zone.y)
      if (distance >= zone.radius) continue
      const rank = KIND_RANK[zone.kind]
      if (rank < bestRank || (rank === bestRank && distance < bestDist)) {
        best = zone
        bestRank = rank
        bestDist = distance
      }
    }

    this.activeZone = best

    if (!best) {
      this.promptText?.setVisible(false)
      return
    }

    if (!this.promptText) {
      this.promptText = this.scene.add.text(0, 0, '', {
        fontSize: '14px',
        color: '#ffff00',
        backgroundColor: '#000a',
        padding: { left: 6, right: 6, top: 3, bottom: 3 },
      }).setOrigin(0.5).setDepth(100)
    }

    this.promptText
      .setText(`[E] ${best.label}`)
      .setPosition(best.x, best.y - 46)
      .setVisible(true)
  }

  /** Keyboard path — JustDown already prevents repeats while the key is held. */
  tryInteract(key: Phaser.Input.Keyboard.Key) {
    if (!this.activeZone || this.isLocked()) return false
    if (!Phaser.Input.Keyboard.JustDown(key)) return false
    return this.interact()
  }

  interact() {
    if (!this.activeZone || this.isLocked()) return false
    // Short lock so a held key or a double tap cannot fire twice.
    this.lock(350)
    this.activeZone.onInteract()
    return true
  }
}
