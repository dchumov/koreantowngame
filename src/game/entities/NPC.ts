import Phaser from 'phaser'

export class NPC extends Phaser.Physics.Arcade.Sprite {
  npcId: string
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, npcId: string) {
    super(scene, x, y, texture)
    this.npcId = npcId
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    this.setImmovable(true)
    this.setDisplaySize(46, 62).setDepth(10)
    this.setSize(20, 24).setOffset(13, 34)
  }
}
