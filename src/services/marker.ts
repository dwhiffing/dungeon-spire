import { GUNS, GUN_STATS, SHAPES } from '../constants'
import { IGameScene } from '~/scenes/Game'
import { Card } from '~/sprites/Card'
import { WallMarker } from '../sprites/WallMarker'
import { indexToFrame } from './level'

export default class MarkerService {
  scene: IGameScene
  group: Phaser.GameObjects.Container
  card: Card | null
  shape: number[][] | null
  rotationIndex: number
  rangeCircle: Phaser.GameObjects.Arc

  constructor(scene: IGameScene) {
    this.scene = scene
    this.group = this.scene.add.container()
    this.shape = null
    this.rangeCircle = this.scene.add.circle(0, 0, 10)
    this.rangeCircle.setStrokeStyle(1, 0xffffff, 1).setDepth(9)
    this.rangeCircle.setAlpha(0)
    this.card = null
    this.rotationIndex = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const wallMarker = new WallMarker(this.scene, x * 8, y * 8)

        this.group.add(wallMarker)
      }
    }

    this.updateMarkers()

    this.scene.input.on('pointermove', (event) => {
      const x = Math.floor(event.x / 8) * 8 - 8
      const y = Math.floor(event.y / 8) * 8 - 8
      this.group.x = x
      this.group.y = y
      if (this.card) {
        const stats = GUN_STATS[this.card.key]
        if (stats) {
          this.rangeCircle.setPosition(x + 12, y + 12)
          this.rangeCircle.setAlpha(1)
          this.rangeCircle.radius = stats.range
        }
      }
    })
  }

  clearShape = () => {
    this.card = null
    this.shape = null
    this.rotationIndex = 0
    this.updateMarkers()
    this.rangeCircle.setAlpha(0)
  }

  getShape = (card: Card) => {
    this.card = card
    this.shape =
      card.labelText.text === 'TILE' ? SHAPES[card.key] : GUNS[card.key]
    this.rotationIndex = 0
    this.updateMarkers()
  }

  getTileData = (x: number, y: number) =>
    this.shape![this.rotationIndex].map((f, i) => [
      f,
      x + (i % 3) - 1,
      y + Math.floor(i / 3) - 1,
    ]).filter(([f]) => f > -1)

  rotate = () => {
    if (!this.shape) return
    this.rotationIndex++
    this.rotationIndex = this.rotationIndex % this.shape.length
    this.updateMarkers()
  }

  updateMarkers = () => {
    const shape = this.shape || [[-1, -1, -1, -1, -1, -1, -1, -1, -1]]
    const markers = this.group.list as WallMarker[]
    markers.forEach((wallMarker, i) => {
      let frame = shape[this.rotationIndex][i] || 1
      wallMarker.setFrame(indexToFrame(frame))
    })
  }
}
