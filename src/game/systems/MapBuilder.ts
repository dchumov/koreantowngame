import Phaser from 'phaser'
import type { OutdoorBuilding, Rect } from '../../content/hongdae'

/** Depth bands so map layers stack predictably. */
export const DEPTH = { ground: 0, road: 1, marking: 2, building: 4, sign: 6, actor: 10, ui: 100 }

/** Width of the walkable doorway alcove cut into an enterable building. */
export const DOOR_WIDTH = 96
const ALCOVE_DEPTH = 48

/** Adds a static solid rectangle and returns it. */
export function addSolid(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  alpha = 1,
  depth = DEPTH.building
) {
  const rect = scene.add.rectangle(x, y, w, h, color, alpha).setDepth(depth)
  scene.physics.add.existing(rect, true)
  group.add(rect)
  return rect
}

/** Draws a non-solid decorative band (roads, alleys, floors). */
export function drawBand(scene: Phaser.Scene, rect: Rect, color: number, depth: number, alpha = 1) {
  return scene.add
    .rectangle(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w, rect.h, color, alpha)
    .setDepth(depth)
}

/** Draws zebra-crossing stripes inside the given rect. */
export function drawCrosswalk(scene: Phaser.Scene, rect: Rect & { orientation: 'h' | 'v' }) {
  const stripe = 16
  const gap = 14
  if (rect.orientation === 'v') {
    for (let y = rect.y + 8; y < rect.y + rect.h - stripe; y += stripe + gap) {
      scene.add.rectangle(rect.x + rect.w / 2, y + stripe / 2, rect.w - 12, stripe, 0xe8eef7, 0.75).setDepth(DEPTH.marking)
    }
  } else {
    for (let x = rect.x + 8; x < rect.x + rect.w - stripe; x += stripe + gap) {
      scene.add.rectangle(x + stripe / 2, rect.y + rect.h / 2, stripe, rect.h - 12, 0xe8eef7, 0.75).setDepth(DEPTH.marking)
    }
  }
}

/** Draws a dashed lane marking along a road centre line. */
export function drawLaneMarking(
  scene: Phaser.Scene,
  rect: Rect & { orientation: 'h' | 'v' },
  color: number
) {
  const dash = 46
  const gap = 38
  if (rect.orientation === 'h') {
    for (let x = rect.x; x < rect.x + rect.w; x += dash + gap) {
      scene.add.rectangle(x + dash / 2, rect.y + rect.h / 2, dash, rect.h, color, 0.55).setDepth(DEPTH.marking)
    }
  } else {
    for (let y = rect.y; y < rect.y + rect.h; y += dash + gap) {
      scene.add.rectangle(rect.x + rect.w / 2, y + dash / 2, rect.w, dash, color, 0.55).setDepth(DEPTH.marking)
    }
  }
}

/** Thin kerb line along the inner edge of a sidewalk strip. */
export function drawCurb(scene: Phaser.Scene, rect: Rect, color: number) {
  const t = 3
  if (rect.w > rect.h) {
    scene.add.rectangle(rect.x + rect.w / 2, rect.y + rect.h - t / 2, rect.w, t, color, 0.5).setDepth(DEPTH.marking)
  } else {
    scene.add.rectangle(rect.x + rect.w - t / 2, rect.y + rect.h / 2, t, rect.h, color, 0.5).setDepth(DEPTH.marking)
  }
}

/**
 * Draws a small piece of non-solid street furniture. Purely decorative so it
 * can never block a pedestrian route or an entrance.
 */
export function drawStreetFurniture(
  scene: Phaser.Scene,
  x: number,
  y: number,
  kind: 'lamp' | 'bench' | 'bike' | 'tree' | 'sign' | 'busstop',
  palette: { furniture: number; tree: number; planter: number; lamp: number }
) {
  const depth = DEPTH.marking + 1
  switch (kind) {
    case 'lamp':
      scene.add.rectangle(x, y, 5, 30, palette.furniture, 0.95).setDepth(depth)
      scene.add.circle(x, y - 20, 7, palette.lamp, 0.85).setDepth(depth)
      break
    case 'bench':
      scene.add.rectangle(x, y, 44, 13, palette.furniture, 0.95).setDepth(depth)
      scene.add.rectangle(x, y - 8, 44, 4, palette.furniture, 0.7).setDepth(depth)
      break
    case 'bike':
      scene.add.rectangle(x, y, 40, 6, palette.furniture, 0.9).setDepth(depth)
      for (let i = -1; i <= 1; i += 1) {
        scene.add.rectangle(x + i * 13, y - 8, 4, 16, palette.furniture, 0.9).setDepth(depth)
      }
      break
    case 'tree':
      scene.add.rectangle(x, y + 8, 7, 14, 0x5a4636, 0.95).setDepth(depth)
      scene.add.circle(x, y - 6, 17, palette.tree, 0.95).setDepth(depth)
      break
    case 'sign':
      scene.add.rectangle(x, y, 4, 26, palette.furniture, 0.95).setDepth(depth)
      scene.add.rectangle(x, y - 18, 22, 15, 0x3f6fb5, 0.95).setDepth(depth)
      break
    case 'busstop':
      scene.add.rectangle(x, y, 70, 10, palette.furniture, 0.95).setDepth(depth)
      scene.add.rectangle(x - 30, y - 16, 5, 32, palette.furniture, 0.95).setDepth(depth)
      scene.add.rectangle(x + 30, y - 16, 5, 32, palette.furniture, 0.95).setDepth(depth)
      break
  }
}

export interface BuiltBuilding {
  /** Interaction zone position, in the doorway mouth. */
  door: { x: number; y: number }
  /** Safe position to place the player when they come back outside. */
  outside: { x: number; y: number }
}

/**
 * Builds a building from data: solid geometry filling the whole footprint
 * except a doorway alcove on the entrance side, plus its sign.
 * Collision is derived entirely from the data, never hand-placed.
 */
export function buildBuilding(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup,
  building: OutdoorBuilding
): BuiltBuilding {
  const { x, y, w, h } = building
  const left = x - w / 2
  const right = x + w / 2
  const top = y - h / 2
  const bottom = y + h / 2
  const doorLeft = x - DOOR_WIDTH / 2
  const doorRight = x + DOOR_WIDTH / 2
  const enterable = Boolean(building.interiorId)

  if (building.texture) {
    const scale = building.textureScale ?? 1.15
    scene.add.image(x, y, building.texture).setDisplaySize(w * scale, h * scale).setDepth(DEPTH.building + 1)
  }

  if (!enterable) {
    // Decorative block: fully solid, no alcove.
    const alpha = building.texture ? 0 : 1
    addSolid(scene, group, x, y, w, h, building.bodyColor, alpha)
    addSolid(scene, group, x, top + 16, w, 32, building.roofColor, alpha)
    drawSign(scene, building, building.entranceSide === 'bottom' ? bottom + 22 : top - 22)
    return {
      door: { x, y: bottom },
      outside: { x, y: building.entranceSide === 'bottom' ? bottom + 96 : top - 96 },
    }
  }

  if (building.entranceSide === 'bottom') {
    const mainH = h - ALCOVE_DEPTH
    const alpha = building.texture ? 0 : 1
    addSolid(scene, group, x, top + mainH / 2, w, mainH, building.bodyColor, alpha)
    addSolid(scene, group, (left + doorLeft) / 2, bottom - ALCOVE_DEPTH / 2, doorLeft - left, ALCOVE_DEPTH, building.bodyColor, alpha)
    addSolid(scene, group, (doorRight + right) / 2, bottom - ALCOVE_DEPTH / 2, right - doorRight, ALCOVE_DEPTH, building.bodyColor, alpha)
    addSolid(scene, group, x, top + 16, w, 32, building.roofColor, alpha)
    drawDoorMat(scene, x, bottom - ALCOVE_DEPTH / 2)
    drawSign(scene, building, top - 20)
    return { door: { x, y: bottom + 8 }, outside: { x, y: bottom + 100 } }
  }

  const mainH = h - ALCOVE_DEPTH
  const alpha = building.texture ? 0 : 1
  addSolid(scene, group, x, bottom - mainH / 2, w, mainH, building.bodyColor, alpha)
  addSolid(scene, group, (left + doorLeft) / 2, top + ALCOVE_DEPTH / 2, doorLeft - left, ALCOVE_DEPTH, building.bodyColor, alpha)
  addSolid(scene, group, (doorRight + right) / 2, top + ALCOVE_DEPTH / 2, right - doorRight, ALCOVE_DEPTH, building.bodyColor, alpha)
  addSolid(scene, group, x, bottom - 16, w, 32, building.roofColor, alpha)
  drawDoorMat(scene, x, top + ALCOVE_DEPTH / 2)
  drawSign(scene, building, bottom + 20)
  return { door: { x, y: top - 8 }, outside: { x, y: top - 100 } }
}

function drawDoorMat(scene: Phaser.Scene, x: number, y: number) {
  scene.add.rectangle(x, y, DOOR_WIDTH - 12, 30, 0xf2d98a, 0.5).setDepth(DEPTH.marking)
}

function drawSign(scene: Phaser.Scene, building: OutdoorBuilding, y: number) {
  scene.add
    .text(building.x, y, `${building.signKo} · ${building.signRu}`, {
      fontSize: '15px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { left: 7, right: 7, top: 4, bottom: 4 },
    })
    .setOrigin(0.5)
    .setDepth(DEPTH.sign)
}

/** Invisible walls that keep the player inside the playable area. */
export function buildWorldBorder(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup,
  width: number,
  height: number,
  thickness = 32
) {
  addSolid(scene, group, width / 2, thickness / 2, width, thickness, 0x000000, 0)
  addSolid(scene, group, width / 2, height - thickness / 2, width, thickness, 0x000000, 0)
  addSolid(scene, group, thickness / 2, height / 2, thickness, height, 0x000000, 0)
  addSolid(scene, group, width - thickness / 2, height / 2, thickness, height, 0x000000, 0)
}
