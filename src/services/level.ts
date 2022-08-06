import easystarjs from 'easystarjs'

const ENTRANCE_INDEX = 32
const EXIT_INDEX = 17
const WALL_INDEX = 16
const GUN_INDEX = 18

export const indexToFrame = (frame) => {
  if (frame === -1) return 7
  if (frame === 1) return WALL_INDEX
  if (frame === 2) return GUN_INDEX
  // if (frame === 2) return ENTRANCE_INDEX
  // if (frame === 2) return EXIT_INDEX
}

export default class LevelService {
  scene: any
  pathGraphics: any
  data: any
  path: any[]
  map: any
  star: any
  width: any
  height: any
  groundLayer: any

  constructor(scene) {
    this.scene = scene
    this.pathGraphics = this.scene.add.graphics()
    this.pathGraphics.lineStyle(1, 0xffffff)

    this.createMap()
    this.data = this.getMapData()
    this.path = []
    this.star = new easystarjs.js()
    this.star.setAcceptableTiles([-1, EXIT_INDEX, ENTRANCE_INDEX])

    this.map.putTileAt(WALL_INDEX, 3, 2)
    this.map.putTileAt(EXIT_INDEX, 2, 2)
    this.map.putTileAt(ENTRANCE_INDEX, 4, 2)
    this.update()
  }

  placeTiles = (tiles, onComplete) => {
    // abort if placement overlaps with existing tiles
    if (tiles.some(([f, x, y]) => this.map.getTileAt(x, y))) return

    tiles.forEach(([f, x, y]) => this.placeTile(indexToFrame(f), x, y))

    this.findPath().then((path) => {
      if (!path) tiles.forEach(([f, x, y]) => this.placeTile(-1, x, y))
      if (path) {
        onComplete()
      }
    })
  }

  placeTile = (i, x, y) => {
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

  findEntrance = () =>
    this.map.getTilesWithin(0, 0, 8, 8).find((t) => t.index === ENTRANCE_INDEX)

  findExit = () =>
    this.map.getTilesWithin(0, 0, 8, 8).find((t) => t.index === EXIT_INDEX)

  createMap = () => {
    this.map = this.scene.make.tilemap(MAP_CONFIG)
    this.width = this.map.widthInPixels
    this.height = this.map.heightInPixels
    this.scene.physics.world.bounds.width = this.width
    this.scene.physics.world.bounds.height = this.height
    this.scene.cameras.main.setBounds(0, 0, this.width, this.height)
    const groundTiles = this.map.addTilesetImage('tilemap')
    this.groundLayer = this.map.createBlankLayer('World', groundTiles)
  }

  getMapData = () =>
    this.map.layers[0].data.map((row) => row.map((tile) => tile.index))

  updateGrid = (data) => {
    if (data) this.data = data
    this.star.setGrid(this.data)
  }

  findPath = (start = this.findEntrance(), end = this.findExit()) =>
    new Promise((resolve) => {
      if (!start || !end) resolve(null)
      this.star.findPath(start.x, start.y, end.x, end.y, resolve)
      this.star.calculate()
    })

  update() {
    this.updateGrid(this.getMapData())
    this.findPath().then((path) => {
      this.pathGraphics.clear()
      if (!path) return
      // @ts-ignore
      this.path = path
      this.path.forEach((item) =>
        this.pathGraphics.lineTo(item.x * 8 + 4, item.y * 8 + 4),
      )
      this.pathGraphics.strokePath()
    })
  }
}

const MAP_CONFIG = { tileWidth: 8, tileHeight: 8, width: 8, height: 8 }
