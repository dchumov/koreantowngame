import Phaser from 'phaser'

export interface InteractionZone {
  id: string
  x: number
  y: number
  radius: number
  onInteract: () => void
}

export class InteractionSystem {
  private zones: InteractionZone[] = []
  private activeZone: InteractionZone | null = null
  private promptText: Phaser.GameObjects.Text | null = null
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) { this.scene = scene }

  addZone(zone: InteractionZone) { this.zones.push(zone) }

  getActiveZoneId() { return this.activeZone?.id ?? null }
  getActiveZone() { return this.activeZone }

  update(player: Phaser.Physics.Arcade.Sprite) {
    const p = player.getCenter()
    let nearest: InteractionZone | null = null
    let minDist = Infinity
    for (const z of this.zones) {
      const d = Phaser.Math.Distance.Between(p.x, p.y, z.x, z.y)
      if (d < z.radius && d < minDist) { minDist = d; nearest = z }
    }
    this.activeZone = nearest
    if (this.promptText) this.promptText.destroy()
    this.promptText = null
    if (nearest) {
      this.promptText = this.scene.add.text(nearest.x, nearest.y - 40, '[E]', {
        fontSize: '14px', color: '#ffff00', backgroundColor: '#0008'
      }).setOrigin(0.5).setScrollFactor(1).setDepth(100)
    }
  }

  tryInteract(key: Phaser.Input.Keyboard.Key) {
    if (this.activeZone && Phaser.Input.Keyboard.JustDown(key)) {
      return this.interact()
    }
    return false
  }

  interact() {
    if (!this.activeZone) return false
    this.activeZone.onInteract()
    return true
  }
}
