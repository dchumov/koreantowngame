import Phaser from 'phaser'

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
    const mobileInput = this.scene.registry.get('mobileInput') as { x: number; y: number } | undefined
    const hasMobileInput = Boolean(mobileInput && (Math.abs(mobileInput.x) > 0.08 || Math.abs(mobileInput.y) > 0.08))
    const speed = this.keys?.SHIFT?.isDown ? 220 : 150
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
