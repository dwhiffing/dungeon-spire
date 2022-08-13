import easystarjs from 'easystarjs'
import {
  ENTRANCE_INDEX,
  EXIT_INDEX,
  GUN_INDEX,
  LevelData,
  LEVELS,
  Path,
  WALL_INDEX,
} from '../constants'
import { IGameScene } from '~/scenes/Game'

export default class LevelService {
  scene: IGameScene
  pathGraphics: Phaser.GameObjects.Graphics
  path: Path
  map: Phaser.Tilemaps.Tilemap
  data: number[][]
  groundLayer?: Phaser.Tilemaps.TilemapLayer
  star: any

  constructor(scene: IGameScene) {
    this.scene = scene
    this.pathGraphics = this.scene.add.graphics()

    this.map = this.createMap()
    this.data = this.getMapData()
    this.path = []
    this.star = new easystarjs.js()
    this.star.setAcceptableTiles([-1, EXIT_INDEX, ENTRANCE_INDEX])
  }

  startLevel = (levelData: LevelData) => {
    this.clearMap()
    levelData.tiles.forEach((tile) =>
      this.map.putTileAt(tile.frame, tile.x, tile.y),
    )
    this.update()
  }

  createMap = () => {
    const map = this.scene.make.tilemap(MAP_CONFIG)
    const width = map.widthInPixels
    const height = map.heightInPixels
    this.scene.physics.world.bounds.width = width
    this.scene.physics.world.bounds.height = height
    this.scene.cameras.main.setBounds(0, 0, width, height)
    const groundTiles = map.addTilesetImage('tilemap')
    this.groundLayer = map.createBlankLayer('World', groundTiles)
    return map
  }

  update() {
    this.updateGrid(this.getMapData())
    this.findPath().then((path) => {
      this.pathGraphics.clear()
      this.pathGraphics.lineStyle(1, 0x5500aa)
      if (!path) return
      // @ts-ignore
      this.path = path
      this.path.forEach((item) =>
        this.pathGraphics.lineTo(item.x * 8 + 4, item.y * 8 + 4),
      )
      this.pathGraphics.strokePath()
    })
  }

  placeTile = (i: number, x: number, y: number) => {
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
    this.update()
  }

  canPlaceTiles = (tiles: number[][]) =>
    new Promise((resolve) => {
      const isGun = tiles.some(([f]) => f === 2)
      if (isGun) {
        // abort if not all tiles under gun tiles are wall tiles
        if (tiles.every(([f, x, y]) => this.map.getTileAt(x, y)?.index !== 16))
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

      this.findPath().then((path) => {
        tiles.forEach(([f, x, y]) => this.placeTile(-1, x, y))
        resolve(!!path)
      })
    })

  placeTiles = async (tiles: number[][]) => {
    const canPlace = await this.canPlaceTiles(tiles)
    if (!canPlace) throw new Error()
    tiles.forEach(([f, x, y]) => this.placeTile(indexToFrame(f), x, y))
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

  clearMap = () => this.map.fill(-1, 0, 0, 64, 64)
}

const MAP_CONFIG = { tileWidth: 8, tileHeight: 8, width: 8, height: 8 }

export const indexToFrame = (frame: number) => {
  if (frame === 1) return WALL_INDEX
  if (frame === 2) return GUN_INDEX
  return 20
}
