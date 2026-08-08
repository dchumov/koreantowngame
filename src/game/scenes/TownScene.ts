import Phaser from 'phaser'
import { locationCatalog, interactions } from '../../content/interactions'
import {
  MAP_H,
  MAP_W,
  OUTDOOR_SPAWN,
  TILE,
  alleyLayer,
  crosswalkLayer,
  decorBuildings,
  districtLabels,
  enterableBuildings,
  propLayer,
  roadLayer,
} from '../../content/hongdae'
import { npcSpritePrefixes } from '../../content/npcs'
import { useGameStore } from '../../store/gameStore'
import { getLocationProgress } from '../../utils/progress'
import { NPC } from '../entities/NPC'
import { Player } from '../entities/Player'
import { DEPTH, addSolid, buildBuilding, buildWorldBorder, drawBand, drawCrosswalk } from '../systems/MapBuilder'
import { InteractionSystem } from '../systems/InteractionSystem'
import { playMusic, preloadMusic } from '../systems/MusicSystem'

type LocationVisual = {
  building: Phaser.GameObjects.Image
  npc: NPC
  label: Phaser.GameObjects.Text
  progressText: Phaser.GameObjects.Text
  progressBg: Phaser.GameObjects.Rectangle
  progressFill: Phaser.GameObjects.Rectangle
}

/** Hongdae outdoor map. Every collision body is generated from map data. */
export class TownScene extends Phaser.Scene {
  player!: Player
  interactionSystem!: InteractionSystem
  eKey!: Phaser.Input.Keyboard.Key
  private debugGraphics!: Phaser.GameObjects.Graphics
  private lastDebugEvent = 'Сцена создана'
  private locationVisuals = new Map<string, LocationVisual>()
  /** Set when returning from an interior, so the player lands by that door. */
  private spawnAt: { x: number; y: number } | null = null

  constructor() {
    super('town')
  }

  init(data: { fromBuildingId?: string }) {
    this.spawnAt = null
    this.locationVisuals = new Map()
    if (data?.fromBuildingId) {
      const building = enterableBuildings.find((entry) => entry.id === data.fromBuildingId)
      if (building) {
        // Placed clear of the doorway zone so the exit cannot instantly re-fire.
        this.spawnAt = {
          x: building.x,
          y: building.entranceSide === 'bottom' ? building.y + building.h / 2 + 100 : building.y - building.h / 2 - 100,
        }
      }
    }
  }

  preload() {
    preloadMusic(this)
    this.load.image('bg-town-tile', 'assets/bg-town-tile.png')
    this.load.image('building-dorm', 'assets/building-dorm.png')
    this.load.image('building-store', 'assets/building-store.png')
    this.load.image('building-cafe', 'assets/building-cafe.png')
    this.load.image('building-school', 'assets/building-school.png')
    for (const building of [...enterableBuildings, ...decorBuildings]) {
      if (building.texture) this.load.image(building.texture, `assets/${building.texture}.png`)
    }

    const directions = ['down', 'up', 'left', 'right']
    for (const direction of directions) {
      this.load.image(`player-${direction}`, `assets/generated/player-${direction}.png`)
      for (const prefix of npcSpritePrefixes) {
        this.load.image(`${prefix}-${direction}`, `assets/generated/${prefix}-${direction}.png`)
      }
    }
  }

  create() {
    playMusic(this, 'town-hub')
    this.registry.set('mobileInput', { x: 0, y: 0 })
    this.physics.world.setBounds(0, 0, MAP_W, MAP_H)

    // ── Ground and street layers (visual only) ────────────────────────────
    this.add.tileSprite(MAP_W / 2, MAP_H / 2, MAP_W, MAP_H, 'bg-town-tile').setAlpha(0.9).setDepth(DEPTH.ground)
    roadLayer.forEach((road) => drawBand(this, road, 0x2b3244, DEPTH.road))
    alleyLayer.forEach((alley) => drawBand(this, alley, 0x333b50, DEPTH.road, 0.9))
    crosswalkLayer.forEach((crosswalk) => drawCrosswalk(this, crosswalk))
    roadLayer.forEach((road) => {
      // Centre line marking for the two main avenues.
      if (road.h > road.w) return
      this.add.rectangle(road.x + road.w / 2, road.y + road.h / 2, road.w, 4, 0xf5d76e, 0.35).setDepth(DEPTH.marking)
    })
    districtLabels.forEach((entry) =>
      this.add.text(entry.x, entry.y, entry.text, {
        fontSize: '15px',
        color: '#dfe9ff',
        backgroundColor: '#00000066',
        padding: { left: 6, right: 6, top: 3, bottom: 3 },
      }).setOrigin(0.5).setDepth(DEPTH.marking)
    )

    const walls = this.physics.add.staticGroup()
    buildWorldBorder(this, walls, MAP_W, MAP_H)

    this.interactionSystem = new InteractionSystem(this)

    // ── Decorative storefronts ───────────────────────────────────────────
    decorBuildings.forEach((building) => buildBuilding(this, walls, building))
    propLayer.forEach((prop) => addSolid(this, walls, prop.x + prop.w / 2, prop.y + prop.h / 2, prop.w, prop.h, prop.color))

    // ── Enterable buildings + their entrance zones ───────────────────────
    enterableBuildings.forEach((building) => {
      const built = buildBuilding(this, walls, building)
      this.interactionSystem.addZone({
        id: `door-${building.id}`,
        x: built.door.x,
        y: built.door.y,
        radius: 66,
        kind: 'door',
        label: '들어가기',
        onInteract: () => {
          this.lastDebugEvent = `Вход: ${building.id}`
          this.game.events.emit('close-overlays')
          this.scene.start('interior', { interiorId: building.interiorId })
        },
      })
    })

    // ── Legacy quest locations (unchanged content) ───────────────────────
    const npcs: NPC[] = []
    locationCatalog.forEach((location) => {
      const x = location.mapX * TILE
      const y = location.mapY * TILE
      const npcY = y + (location.entrance === 'bottom' ? 112 : -112)
      const labelY = location.entrance === 'bottom' ? y - 124 : y + 120

      const building = this.add.image(x, y, location.buildingTexture).setDisplaySize(220, 178).setDepth(DEPTH.building)
      const npc = new NPC(this, x, npcY, `${location.npcSpritePrefix}-down`, location.npcId)
      npcs.push(npc)

      addSolid(this, walls, x - 96, y, 28, 150, 0x000000, 0)
      addSolid(this, walls, x + 96, y, 28, 150, 0x000000, 0)
      addSolid(this, walls, x, location.entrance === 'bottom' ? y - 68 : y + 68, 164, 30, 0x000000, 0)

      const label = this.add.text(x, labelY, `${location.labelKo} · ${location.npcName}`, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { left: 8, right: 8, top: 5, bottom: 5 },
      }).setOrigin(0.5).setDepth(DEPTH.sign)

      const progressBg = this.add.rectangle(x, labelY + 32, 120, 10, 0x17253b, 0.95).setOrigin(0.5).setDepth(DEPTH.sign)
      const progressFill = this.add.rectangle(x - 60, labelY + 32, 0, 10, location.progressColor, 1).setOrigin(0, 0.5).setDepth(DEPTH.sign + 1)
      const progressText = this.add.text(x, labelY + 50, '0 / 4 · 0%', {
        fontSize: '12px',
        color: '#e8f6ff',
      }).setOrigin(0.5).setDepth(DEPTH.sign)

      this.locationVisuals.set(location.id, { building, npc, label, progressText, progressBg, progressFill })

      this.interactionSystem.addZone({
        id: `${location.id}-zone`,
        x,
        y: npcY,
        radius: 72,
        kind: 'npc',
        label: '대화',
        onInteract: () => this.openNextInteraction(location.id),
      })
    })

    // ── Player ───────────────────────────────────────────────────────────
    const spawn = this.spawnAt ?? OUTDOOR_SPAWN
    this.player = new Player(this, spawn.x, spawn.y)
    this.debugGraphics = this.add.graphics().setDepth(DEPTH.actor + 10)
    this.physics.add.collider(this.player, walls)
    npcs.forEach((npc) => this.physics.add.collider(this.player, npc))
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
    this.cameras.main.setBounds(0, 0, MAP_W, MAP_H)

    this.eKey = this.input.keyboard!.addKey('E')
    this.game.events.on('progress-changed', this.syncLocationVisuals, this)
    this.game.events.on('mobile-interact', this.handleMobileInteract, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('progress-changed', this.syncLocationVisuals, this)
      this.game.events.off('mobile-interact', this.handleMobileInteract, this)
    })

    this.syncLocationVisuals()

    this.add.text(18, 16, '홍대 · E или кнопка справа: разговор, магазин, вход в здание', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { left: 8, right: 8, top: 6, bottom: 6 },
    }).setScrollFactor(0).setDepth(DEPTH.ui)

    // Cooldown so the key press that exited an interior cannot re-enter it.
    this.interactionSystem.lock(500)
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

      visual.building.clearTint()
      visual.npc.clearTint()
      visual.label.setAlpha(1)

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
