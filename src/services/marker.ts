import { SHAPES, GUN_STATS } from '../constants'
import { Card } from '~/sprites/Card'
import { WallMarker } from '../sprites/WallMarker'
import { indexToFrame } from './level'
import { IGameScene } from '~/types'

export default class MarkerService {
  scene: IGameScene
  group: Phaser.GameObjects.Container
  card: Card | null
  shape: number[][] | null
  rotationIndex: number
  tileX: number
  tileY: number
  isValid: boolean
  rangeCircle: Phaser.GameObjects.Arc

  constructor(scene: IGameScene) {
    this.scene = scene
    this.group = this.scene.add.container().setDepth(9).setPipeline('Light2D')

    this.shape = null
    this.rangeCircle = this.scene.add.circle(0, 0, 10)
    this.rangeCircle.setStrokeStyle(1, 0xffffff, 1)
    this.rangeCircle.setAlpha(0)
    this.card = null
    this.tileX = 0
    this.tileY = 0
    this.isValid = true
    this.rotationIndex = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const wallMarker = new WallMarker(this.scene, x * 8, y * 8)

        this.group.add(wallMarker)
      }
    }

    this.updateMarkers()

    this.scene.input.on('pointermove', (event) => {
      if (!this.shape) return
      const x = Math.floor(event.x / 8)
      const y = Math.floor(event.y / 8)
      if (this.tileX === x && this.tileY === y) return
      this.tileX = x
      this.tileY = y
      this.group.x = this.tileX * 8 - 8
      this.group.y = this.tileY * 8 - 8

      this.scene.level
        ?.canPlaceTiles(this.getTileData(this.tileX, this.tileY))
        .then((isValid) => {
          this.isValid = !!isValid
          this.updateMarkers()
          if (this.card) {
            const stats = GUN_STATS[this.card.key]
            if (stats) {
              this.rangeCircle.setAlpha(this.isValid ? 1 : 0)
              this.rangeCircle.setPosition(this.group.x + 12, this.group.y + 12)
              this.rangeCircle.radius = stats.range
            }
          }
        })
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
    this.shape = SHAPES[card.key]
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
    this.scene.sound.play('menu1')
    if (!this.shape) return
    this.rotationIndex++
    this.rotationIndex = this.rotationIndex % this.shape.length
    this.scene.level
      ?.canPlaceTiles(this.getTileData(this.tileX, this.tileY))
      .then((isValid) => {
        this.isValid = !!isValid
        this.updateMarkers()
      })
  }

  updateMarkers = () => {
    const shape = this.shape || [[-1, -1, -1, -1, -1, -1, -1, -1, -1]]
    const markers = this.group.list as WallMarker[]
    markers.forEach((wallMarker, i) => {
      let frame = shape[this.rotationIndex][i] || 1
      wallMarker.setFrame(indexToFrame(frame))
      let gunStats
      if (this.card) gunStats = GUN_STATS[this.card.key]

      wallMarker.setTint(
        this.isValid ? gunStats?.baseTint || 0xffffff : 0xff0000,
      )
      wallMarker.setAlpha(this.isValid ? 1 : 1)
    })
  }
}
