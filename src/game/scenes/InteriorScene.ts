import Phaser from 'phaser'
import { enterableBuildings } from '../../content/hongdae'
import { DOOR_GAP, WALL_THICKNESS, interiorCatalog, interiorMap } from '../../content/interiors'
import { getNpcsForInterior, npcSpritePrefixes } from '../../content/npcs'
import { NPC } from '../entities/NPC'
import { Player } from '../entities/Player'
import { DEPTH, addSolid } from '../systems/MapBuilder'
import { InteractionSystem } from '../systems/InteractionSystem'
import { playMusic, preloadMusic } from '../systems/MusicSystem'

/**
 * One generic scene renders every interior from `interiorCatalog`.
 * Entrance/exit, shop and NPC wiring are all data-driven, so no building
 * needs its own scene or its own copy of the transition logic.
 */
export class InteriorScene extends Phaser.Scene {
  private interiorId!: string
  private player!: Player
  private interactionSystem!: InteractionSystem
  private eKey!: Phaser.Input.Keyboard.Key
  private lastDebugEvent = 'Интерьер загружен'

  constructor() {
    super('interior')
  }

  init(data: { interiorId?: string }) {
    this.interiorId = data?.interiorId ?? 'convenience'
  }

  preload() {
    preloadMusic(this)
    for (const entry of interiorCatalog) {
      if (entry.backgroundTexture) this.load.image(entry.backgroundTexture, `assets/${entry.backgroundTexture}.png`)
    }
    // Textures are global once loaded; this only matters on a direct start.
    for (const direction of ['down', 'up', 'left', 'right']) {
      this.load.image(`player-${direction}`, `assets/generated/player-${direction}.png`)
      for (const prefix of npcSpritePrefixes) {
        this.load.image(`${prefix}-${direction}`, `assets/generated/${prefix}-${direction}.png`)
      }
    }
  }

  create() {
    const interior = interiorMap.get(this.interiorId)
    if (!interior) {
      this.scene.start('town')
      return
    }

    const music = this.interiorId === 'convenience'
      ? 'interior-cu'
      : this.interiorId === 'department'
        ? 'interior-department'
        : this.interiorId === 'music'
          ? 'interior-music-shop'
        : 'town-hub'
    playMusic(this, music)

    const { w, h } = interior
    this.physics.world.setBounds(0, 0, w, h)
    this.add.rectangle(w / 2, h / 2, w, h, interior.floorColor).setDepth(DEPTH.ground)
    if (interior.backgroundTexture) {
      this.add.image(w / 2, h / 2, interior.backgroundTexture).setDisplaySize(w, h).setDepth(DEPTH.ground + 1)
    }

    const walls = this.physics.add.staticGroup()
    const t = WALL_THICKNESS

    // Perimeter walls, with a doorway gap at the bottom centre.
    const collisionAlpha = interior.backgroundTexture ? 0 : 1
    addSolid(this, walls, w / 2, t / 2, w, t, interior.wallColor, collisionAlpha)
    addSolid(this, walls, t / 2, h / 2, t, h, interior.wallColor, collisionAlpha)
    addSolid(this, walls, w - t / 2, h / 2, t, h, interior.wallColor, collisionAlpha)
    addSolid(this, walls, DOOR_GAP.from / 2, h - t / 2, DOOR_GAP.from, t, interior.wallColor, collisionAlpha)
    addSolid(this, walls, (DOOR_GAP.to + w) / 2, h - t / 2, w - DOOR_GAP.to, t, interior.wallColor, collisionAlpha)

    // Fixtures and furniture.
    for (const solid of interior.solids) {
      addSolid(this, walls, solid.x + solid.w / 2, solid.y + solid.h / 2, solid.w, solid.h, solid.color, collisionAlpha)
      if (solid.label) {
        const labelPosition = solid.labelPosition ?? { x: solid.x + solid.w / 2, y: solid.y + solid.h / 2 }
        this.add.text(labelPosition.x, labelPosition.y, solid.label, {
          fontSize: '12px',
          color: '#ffffff',
          backgroundColor: '#172033cc',
          padding: { left: 4, right: 4, top: 2, bottom: 2 },
        }).setOrigin(0.5).setDepth(DEPTH.sign)
      }
    }

    // Exit mat + title.
    this.add.rectangle(w / 2, h - t - 10, DOOR_GAP.to - DOOR_GAP.from, 22, 0xf2d98a, 0.5).setDepth(DEPTH.marking)
    this.add.text(w / 2, 44, `${interior.titleKo} · ${interior.titleRu}`, {
      fontSize: '17px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { left: 8, right: 8, top: 5, bottom: 5 },
    }).setOrigin(0.5).setDepth(DEPTH.sign)

    this.interactionSystem = new InteractionSystem(this)

    // NPCs use their own full-color directional sprite sets.
    const npcs: NPC[] = []
    for (const data of getNpcsForInterior(this.interiorId)) {
      const npc = new NPC(this, data.x, data.y, `${data.spritePrefix}-down`, data.id)
      npcs.push(npc)

      this.add.text(data.x, data.y - 44, data.category === 'idol' ? `★ ${data.koreanName}` : data.koreanName, {
        fontSize: '12px',
        color: data.category === 'idol' ? '#ffe66b' : '#e8f6ff',
        backgroundColor: '#00000099',
        padding: { left: 5, right: 5, top: 2, bottom: 2 },
      }).setOrigin(0.5).setDepth(DEPTH.sign)

      this.interactionSystem.addZone({
        id: `npc-${data.id}`,
        x: data.x,
        y: data.y + 12,
        radius: 64,
        kind: 'npc',
        label: '대화',
        onInteract: () => {
          this.lastDebugEvent = `Диалог: ${data.id}`
          this.game.events.emit('open-npc-dialogue', { npcId: data.id })
        },
      })
    }

    // Shop counter.
    if (interior.shop) {
      const shop = interior.shop
      this.interactionSystem.addZone({
        id: `shop-${shop.id}`,
        x: shop.x,
        y: shop.y,
        radius: 64,
        kind: 'shop',
        label: '상점',
        onInteract: () => {
          this.lastDebugEvent = `Магазин: ${shop.id}`
          this.game.events.emit('open-shop', { shopId: shop.id })
        },
      })
    }

    // Exit back to the matching Hongdae entrance.
    this.interactionSystem.addZone({
      id: `exit-${interior.id}`,
      x: interior.exit.x,
      y: interior.exit.y,
      radius: 56,
      kind: 'door',
      label: '나가기',
      onInteract: () => this.leave(),
    })

    this.player = new Player(this, interior.spawn.x, interior.spawn.y)
    this.physics.add.collider(this.player, walls)
    npcs.forEach((npc) => this.physics.add.collider(this.player, npc))

    this.cameras.main.centerOn(w / 2, h / 2)

    this.eKey = this.input.keyboard!.addKey('E')
    this.game.events.on('mobile-interact', this.handleMobileInteract, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('mobile-interact', this.handleMobileInteract, this)
    })

    // Cooldown so the entering key press cannot immediately trigger the exit.
    this.interactionSystem.lock(500)
  }

  private leave() {
    const interior = interiorMap.get(this.interiorId)
    const building = enterableBuildings.find((entry) => entry.id === interior?.outdoorBuildingId)
    this.game.events.emit('close-overlays')
    this.scene.start('town', { fromBuildingId: building?.id })
  }

  private handleMobileInteract = () => {
    if (this.registry.get('interactionOpen')) return
    this.interactionSystem.interact()
  }

  update() {
    this.player.update()
    this.interactionSystem.update(this.player)
    if (!this.registry.get('interactionOpen') && this.eKey) {
      this.interactionSystem.tryInteract(this.eKey)
    }

    this.game.events.emit('debug-state', {
      x: Math.round(this.player.x),
      y: Math.round(this.player.y),
      vx: Math.round(this.player.body?.velocity.x ?? 0),
      vy: Math.round(this.player.body?.velocity.y ?? 0),
      activeZone: this.interactionSystem.getActiveZoneId(),
      lastEvent: this.lastDebugEvent,
    })
  }
}
