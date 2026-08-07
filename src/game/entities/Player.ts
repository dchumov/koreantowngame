import Phaser from 'phaser'
import { clampSpeed, DEFAULT_SPEED, MAX_SPEED, useSpeedStore } from '../../store/speedStore'

// Shift keeps its sprint boost, scaled so that at the default speed (150) it still
// reaches the original sprint value (220), and is always capped at MAX_SPEED.
const SPRINT_MULTIPLIER = MAX_SPEED / DEFAULT_SPEED

export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keys!: Record<string, Phaser.Input.Keyboard.Key>
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-down')
    scene.add.existing(this); scene.physics.add.existing(this)
    this.setDisplaySize(42, 58).setDepth(10)
    this.setSize(20, 24).setOffset(11, 30)
    this.setCollideWorldBounds(true)
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys()
      this.keys = scene.input.keyboard.addKeys('W,A,S,D,SHIFT') as Record<string, Phaser.Input.Keyboard.Key>
    }
  }
  update() {
    // Any open overlay (dialogue, quiz, shop, panel) freezes the player so it
    // cannot be moved with the keyboard behind the UI.
    if (this.scene.registry.get('interactionOpen')) {
      this.setVelocity(0, 0)
      return
    }

    const mobileInput = this.scene.registry.get('mobileInput') as { x: number; y: number } | undefined
    const hasMobileInput = Boolean(mobileInput && (Math.abs(mobileInput.x) > 0.08 || Math.abs(mobileInput.y) > 0.08))
    const base = clampSpeed(useSpeedStore.getState().moveSpeed)
    const speed = this.keys?.SHIFT?.isDown ? Math.min(MAX_SPEED, base * SPRINT_MULTIPLIER) : base
    let vx = 0, vy = 0
    if (hasMobileInput && mobileInput) {
      vx = mobileInput.x * speed
      vy = mobileInput.y * speed
    } else {
      if (this.cursors.left.isDown || this.keys.A?.isDown) vx = -speed
      else if (this.cursors.right.isDown || this.keys.D?.isDown) vx = speed
      if (this.cursors.up.isDown || this.keys.W?.isDown) vy = -speed
      else if (this.cursors.down.isDown || this.keys.S?.isDown) vy = speed
    }
    if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071 }
    this.setVelocity(vx, vy)

    // Переключение спрайта по направлению
    if (vx < 0) this.setTexture('player-left')
    else if (vx > 0) this.setTexture('player-right')
    else if (vy < 0) this.setTexture('player-up')
    else if (vy > 0) this.setTexture('player-down')
  }
}
