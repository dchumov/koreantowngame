import Phaser from 'phaser'
import { locationCatalog, interactions } from '../../content/interactions'
import { useGameStore } from '../../store/gameStore'
import { getLocationProgress } from '../../utils/progress'
import { NPC } from '../entities/NPC'
import { Player } from '../entities/Player'
import { InteractionSystem } from '../systems/InteractionSystem'

type LocationVisual = {
  building: Phaser.GameObjects.Image
  npc: NPC
  label: Phaser.GameObjects.Text
  progressText: Phaser.GameObjects.Text
  progressBg: Phaser.GameObjects.Rectangle
  progressFill: Phaser.GameObjects.Rectangle
}

export class TownScene extends Phaser.Scene {
  player!: Player
  interactionSystem!: InteractionSystem
  eKey!: Phaser.Input.Keyboard.Key
  private debugGraphics!: Phaser.GameObjects.Graphics
  private lastDebugEvent = 'Сцена создана'
  private locationVisuals = new Map<string, LocationVisual>()

  constructor() {
    super('town')
  }

  preload() {
    this.load.image('bg-town-tile', 'assets/bg-town-tile.png')
    this.load.image('building-dorm', 'assets/building-dorm.png')
    this.load.image('building-store', 'assets/building-store.png')
    this.load.image('building-cafe', 'assets/building-cafe.png')
    this.load.image('building-school', 'assets/building-school.png')

    const directions = ['down', 'up', 'left', 'right']
    for (const direction of directions) {
      this.load.image(`player-${direction}`, `assets/generated/player-${direction}.png`)
      this.load.image(`yuna-${direction}`, `assets/generated/yuna-${direction}.png`)
      this.load.image(`minsu-${direction}`, `assets/generated/minsu-${direction}.png`)
      this.load.image(`jihoon-${direction}`, `assets/generated/jihoon-${direction}.png`)
      this.load.image(`sora-${direction}`, `assets/generated/sora-${direction}.png`)
    }
  }

  create() {
    const mapW = 64
    const mapH = 40
    const tile = 32

    this.registry.set('mobileInput', { x: 0, y: 0 })
    this.physics.world.setBounds(0, 0, mapW * tile, mapH * tile)
    this.add.tileSprite(mapW * tile / 2, mapH * tile / 2, mapW * tile, mapH * tile, 'bg-town-tile').setAlpha(0.9)

    this.interactionSystem = new InteractionSystem(this)
    const walls = this.physics.add.staticGroup()
    const npcs: NPC[] = []
    const addBorder = (x: number, y: number) => {
      const border = walls.create(x, y, 'bg-town-tile').setVisible(false).setDisplaySize(tile, tile)
      border.refreshBody()
    }

    for (let x = 0; x < mapW; x += 1) {
      addBorder(x * tile + 16, 16)
      addBorder(x * tile + 16, (mapH - 1) * tile + 16)
    }
    for (let y = 0; y < mapH; y += 1) {
      addBorder(16, y * tile + 16)
      addBorder((mapW - 1) * tile + 16, y * tile + 16)
    }

    locationCatalog.forEach((location) => {
      const x = location.mapX * tile
      const y = location.mapY * tile
      const npcY = y + (location.entrance === 'bottom' ? 112 : -112)
      const labelY = location.entrance === 'bottom' ? y - 124 : y + 120

      const building = this.add.image(x, y, location.buildingTexture).setDisplaySize(220, 178).setDepth(2)
      const npc = new NPC(this, x, npcY, `${location.npcSpritePrefix}-down`, location.npcId)
      npcs.push(npc)

      const addBlocker = (bx: number, by: number, bw: number, bh: number) => {
        const blocker = this.physics.add.staticImage(bx, by, 'bg-town-tile').setVisible(false).setDisplaySize(bw, bh)
        blocker.refreshBody()
        walls.add(blocker)
      }

      addBlocker(x - 96, y, 28, 150)
      addBlocker(x + 96, y, 28, 150)
      addBlocker(x, location.entrance === 'bottom' ? y - 68 : y + 68, 164, 30)

      const label = this.add.text(x, labelY, `${location.labelKo} · ${location.npcName}`, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { left: 8, right: 8, top: 5, bottom: 5 },
      }).setOrigin(0.5).setDepth(6)

      const progressBg = this.add.rectangle(x, labelY + 32, 120, 10, 0x17253b, 0.95).setOrigin(0.5).setDepth(6)
      const progressFill = this.add.rectangle(x - 60, labelY + 32, 0, 10, location.progressColor, 1).setOrigin(0, 0.5).setDepth(7)
      const progressText = this.add.text(x, labelY + 50, '0 / 4 · 0%', {
        fontSize: '12px',
        color: '#e8f6ff',
      }).setOrigin(0.5).setDepth(6)

      this.locationVisuals.set(location.id, { building, npc, label, progressText, progressBg, progressFill })

    })

    this.player = new Player(this, 32 * tile, 20 * tile)
    this.debugGraphics = this.add.graphics().setDepth(20)
    this.physics.add.collider(this.player, walls)
    npcs.forEach((npc) => this.physics.add.collider(this.player, npc))
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
    this.cameras.main.setBounds(0, 0, mapW * tile, mapH * tile)

    locationCatalog.forEach((location) => {
      const y = location.mapY * tile + (location.entrance === 'bottom' ? 112 : -112)
      this.interactionSystem.addZone({
        id: `${location.id}-zone`,
        x: location.mapX * tile,
        y,
        radius: 72,
        onInteract: () => this.openNextInteraction(location.id),
      })
    })

    this.eKey = this.input.keyboard!.addKey('E')
    this.game.events.on('progress-changed', this.syncLocationVisuals, this)
    this.game.events.on('mobile-interact', this.handleMobileInteract, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('progress-changed', this.syncLocationVisuals, this)
      this.game.events.off('mobile-interact', this.handleMobileInteract, this)
    })

    this.syncLocationVisuals()

    this.add.text(18, 16, '4 места · 16 заданий · E или кнопка справа для разговора', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { left: 8, right: 8, top: 6, bottom: 6 },
    }).setScrollFactor(0).setDepth(100)
  }

  private openNextInteraction(locationId: string) {
    this.lastDebugEvent = `Попытка взаимодействия: ${locationId}`
    const completed = useGameStore.getState().completedInteractions
    const next = interactions.find((interaction) =>
      interaction.locationId === locationId && !completed.includes(interaction.id)
    )

    if (!next) {
      this.lastDebugEvent = `Все задания завершены: ${locationId}`
      return
    }

    this.game.events.emit('open-interaction', { interactionId: next.id })
  }

  private handleMobileInteract = () => {
    if (this.registry.get('interactionOpen')) return
    if (this.interactionSystem.interact()) {
      this.lastDebugEvent = 'Мобильная кнопка взаимодействия'
    }
  }

  private syncLocationVisuals = () => {
    const completedInteractions = useGameStore.getState().completedInteractions
    locationCatalog.forEach((location) => {
      const progress = getLocationProgress(location.id, completedInteractions)
      const visual = this.locationVisuals.get(location.id)
      if (!visual) return

      if (progress.isComplete) {
        visual.building.clearTint()
        visual.npc.clearTint()
        visual.label.setAlpha(1)
      } else {
        visual.building.clearTint()
        visual.npc.clearTint()
        visual.label.setAlpha(1)
      }

      visual.progressFill.width = 120 * (progress.percent / 100)
      visual.progressText.setText(`${progress.completed} / ${progress.total} · ${progress.percent}%`)
      visual.progressBg.setFillStyle(progress.isComplete ? 0x1b2f1a : 0x17253b, 0.95)
    })
  }

  update() {
    this.player.update()
    this.interactionSystem.update(this.player)
    if (!this.registry.get('interactionOpen') && this.eKey) {
      this.interactionSystem.tryInteract(this.eKey)
    }

    this.debugGraphics.clear()
    if (this.registry.get('debugOpen')) {
      this.debugGraphics.lineStyle(2, 0xffcc00, 1)
      const body = this.player.body as Phaser.Physics.Arcade.Body
      this.debugGraphics.strokeRect(body.x, body.y, body.width, body.height)
      const zone = this.interactionSystem.getActiveZone()
      if (zone) {
        this.debugGraphics.strokeCircle(zone.x, zone.y, zone.radius)
        this.debugGraphics.strokeRect(zone.x - 10, zone.y - 10, 20, 20)
      }
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
