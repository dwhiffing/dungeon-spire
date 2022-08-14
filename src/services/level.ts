import easystarjs from 'easystarjs'
import {
  ARMOR_WALL_INDEX,
  ENTRANCE_INDEX,
  EXIT_INDEX,
  GUN_INDEX,
  LAVA_INDEX,
  PLAYER_WALL_INDEX,
} from '../constants'
import { IGameScene, LevelData, Path } from '~/types'

export default class LevelService {
  scene: IGameScene
  pathGraphics: Phaser.GameObjects.Graphics
  pathGraphicsGhost: Phaser.GameObjects.Graphics
  path: Path
  lavaTiles: { x: number; y: number }[]
  map: Phaser.Tilemaps.Tilemap
  data: number[][]
  lavaSprites: any[]
  lights: any[]
  groundLayer?: Phaser.Tilemaps.TilemapLayer
  star: any

  constructor(scene: IGameScene) {
    this.scene = scene

    this.map = this.createMap()
    this.data = this.getMapData()
    this.path = []
    this.lavaTiles = []
    this.star = new easystarjs.js()
    this.star.setAcceptableTiles([-1, LAVA_INDEX, EXIT_INDEX, ENTRANCE_INDEX])
    this.lavaSprites = []
    this.lights = []
    this.pathGraphicsGhost = this.scene.add.graphics().setDepth(1)
    this.pathGraphics = this.scene.add.graphics().setDepth(1)
    this.scene.tweens.add({
      targets: [this.pathGraphicsGhost],
      alpha: 0.4,
      yoyo: true,
      repeat: -1,
    })

    for (let i = 0; i < 10; i++) {
      const sprite = this.scene.add
        .sprite(-8, -8, 'tilemap', 21)
        .setPipeline('Light2D')
        .setOrigin(0)
        .setDepth(0)
      this.lavaSprites.push(sprite)
      this.scene.tweens.add({
        targets: [sprite],
        alpha: 0,
        yoyo: true,
        duration: 1400,
        repeat: -1,
      })
      const light = this.scene.lights
        .addLight(-8, -8, 32)
        .setColor(0x872f01)
        .setIntensity(0)
      this.lights.push(light)
      this.scene.tweens.add({
        targets: [light],
        intensity: 1.2,
        ease: Phaser.Math.Easing.Quadratic.InOut,
        yoyo: true,
        repeat: -1,
        duration: 1400,
      })
    }
  }

  startLevel = (levelData: LevelData) => {
    this.clearMap()
    levelData.tiles.forEach(([frame, x, y]) => this.map.putTileAt(frame, x, y))
    this.map.forEachTile((t) => (t.tint = 0xffffff))
    this.updateGrid(this.getMapData())
    this.findPath().then(this.updatePath)
    this.lavaTiles = this.map.layers[0].data
      .flat()
      .filter((t) => t.index === 20)
      .map((t) => ({ x: t.x, y: t.y }))

    this.drawLavaEffects()
  }

  drawLavaEffects = () => {
    this.lights.forEach((l) => {
      l.x = -64
      l.y = -64
    })
    this.lavaSprites.forEach((l) => {
      l.x = -64
      l.y = -64
    })
    this.lavaTiles.forEach((lt, i) => {
      const sprite = this.lavaSprites[i]
      const light = this.lights[i]
      sprite.x = lt.x * 8
      sprite.y = lt.y * 8
      light.x = lt.x * 8 + 4
      light.y = lt.y * 8 + 4
      light.setIntensity(2.5)
    })
  }

  createMap = () => {
    const map = this.scene.make.tilemap(MAP_CONFIG)
    const map2 = this.scene.make.tilemap(MAP_CONFIG)
    const width = map.widthInPixels
    const height = map.heightInPixels
    this.scene.physics.world.bounds.width = width
    this.scene.physics.world.bounds.height = height
    this.scene.cameras.main.setBounds(0, 0, width, height)
    const groundTiles = map.addTilesetImage('tilemap')
    map2
      .createBlankLayer('World', groundTiles)
      .fill(24, 0, 0, 64, 64)
      .setPipeline('Light2D')
    this.groundLayer = map
      .createBlankLayer('World', groundTiles)
      .setDepth(0)
      .setPipeline('Light2D')
    return map
  }

  updatePath = (path) => {
    this.pathGraphics.clear()
    this.pathGraphics.lineStyle(1, 0xd6c06e).setAlpha(0.5)
    if (!path) return
    // @ts-ignore
    this.path = path
    this.path.forEach((item) =>
      this.pathGraphics.lineTo(item.x * 8 + 4, item.y * 8 + 4),
    )
    this.pathGraphics.strokePath()
  }

  updatePathGhost(path) {
    this.pathGraphicsGhost.clear()
    this.pathGraphicsGhost.lineStyle(1, 0xd6c06e)
    if (!path) return
    path.forEach((item) =>
      this.pathGraphicsGhost.lineTo(item.x * 8 + 4, item.y * 8 + 4),
    )
    this.pathGraphicsGhost.strokePath()
  }

  placeTile = (i: number, x: number, y: number, tint?) => {
    const tile = this.map.getTileAt(x, y)
    if (tile?.index === i) i = -1
    // if placing entrance/exit, remove existing instance
    if (i === EXIT_INDEX || i === ENTRANCE_INDEX) {
      this.map
        .getTilesWithin(0, 0, 8, 8)
        .filter((t) => t.index === i)
        .forEach((t) => this.map.putTileAt(-1, t.x, t.y))
    }
    this.map.putTileAt(i, x, y)
    if (this.groundLayer && tint) this.groundLayer.layer.data[y][x].tint = tint
  }

  canPlaceTiles = (tiles: number[][]) =>
    new Promise((resolve) => {
      const isGun = tiles.some(([f]) => f === 2)
      if (isGun) {
        // abort if not all tiles under gun tiles are wall tiles
        if (
          tiles.some(
            ([f, x, y]) =>
              this.map.getTileAt(x, y)?.index !== PLAYER_WALL_INDEX,
          )
        )
          resolve(false)

        return resolve(true)
      }
      // abort if placement overlaps with existing tiles
      if (tiles.some(([f, x, y]) => this.map.getTileAt(x, y)))
        return resolve(false)

      // prevent placing walls that clip outside map
      if (tiles.some(([f, x, y]) => x < 0 || y < 0 || x > 7 || y > 7)) {
        return resolve(false)
      }

      tiles.forEach(([f, x, y]) => this.placeTile(indexToFrame(f), x, y))

      this.updateGrid(this.getMapData())
      this.findPath().then((path) => {
        this.updatePathGhost(path)
        tiles.forEach(([f, x, y]) => this.placeTile(-1, x, y))
        this.updateGrid(this.getMapData())
        resolve(!!path)
      })
    })

  placeTiles = async (tiles: number[][], tint?: any) => {
    const canPlace = await this.canPlaceTiles(tiles)
    if (!canPlace) throw new Error()
    tiles.forEach(([f, x, y]) => this.placeTile(indexToFrame(f), x, y, tint))
    this.updateGrid(this.getMapData())
    this.findPath().then(this.updatePath)
  }

  findPath = (
    start = this.findEntrance(),
    end = this.findExit(),
  ): Promise<Path | null> =>
    new Promise((resolve) => {
      if (!start || !end) return resolve(null)
      this.star.findPath(start.x, start.y, end.x, end.y, resolve)
      this.star.calculate()
    })

  findEntrance = () => {
    const tile = this.map
      .getTilesWithin(0, 0, 8, 8)
      .find((t) => t.index === ENTRANCE_INDEX)
    return { x: tile!.x, y: tile!.y }
  }

  findExit = () => {
    const tile = this.map
      .getTilesWithin(0, 0, 8, 8)
      .find((t) => t.index === EXIT_INDEX)
    return { x: tile!.x, y: tile!.y }
  }

  updateGrid = (data: number[][]) => {
    if (data) this.data = data
    this.star.setGrid(this.data)
  }

  getMapData = () =>
    this.map.layers[0].data.map((row) => row.map((tile) => tile.index))

  clearMap = () => {
    this.pathGraphics.clear()
    this.pathGraphicsGhost.clear()
    this.map.fill(-1, 0, 0, 64, 64)
  }
}

const MAP_CONFIG = { tileWidth: 8, tileHeight: 8, width: 8, height: 8 }

export const indexToFrame = (frame: number) => {
  if (frame === 1) return PLAYER_WALL_INDEX
  if (frame === 3) return ARMOR_WALL_INDEX
  if (frame === 2) return GUN_INDEX
  return 23
}
