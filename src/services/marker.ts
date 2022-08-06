import { WallMarker } from '../sprites/WallMarker'
import { indexToFrame } from './level'

export default class MarkerService {
  scene: any
  card: any
  group: any
  shape: any
  rotationIndex: any

  constructor(scene) {
    this.scene = scene
    this.group = this.scene.add.container()
    this.shape = null
    this.rotationIndex = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const wallMarker = new WallMarker(this.scene, x * 8, y * 8)

        this.group.add(wallMarker)
      }
    }

    this.updateMarkers()

    this.scene.input.on('pointermove', (event) => {
      this.group.x = Math.floor(event.x / 8) * 8 - 8
      this.group.y = Math.floor(event.y / 8) * 8 - 8
    })
  }

  clearShape = () => {
    this.card = null
    this.shape = null
    this.rotationIndex = 0
    this.updateMarkers()
  }

  getShape = (card) => {
    this.card = card
    this.shape =
      card.labelText.text === 'TILE' ? SHAPES[card.key] : GUNS[card.key]
    this.rotationIndex = 0
    this.updateMarkers()
  }

  getTileData = (x, y) => {
    return this.shape[this.rotationIndex]
      .map((f, i) =>
        f === -1 ? null : [f, x + (i % 3) - 1, y + Math.floor(i / 3) - 1],
      )
      .filter(Boolean)
  }

  rotate = () => {
    if (!this.shape) return
    this.rotationIndex++
    this.rotationIndex = this.rotationIndex % this.shape.length
    this.updateMarkers()
  }

  updateMarkers = () => {
    const shape = this.shape || [[-1, -1, -1, -1, -1, -1, -1, -1, -1]]
    this.group.list.forEach((wallMarker, i) => {
      let frame = shape[this.rotationIndex][i]
      wallMarker.setFrame(indexToFrame(frame))
    })
  }
}

export const SHAPES = {
  LINE: [
    [-1, 1, -1, -1, 1, -1, -1, 1, -1],
    [-1, -1, -1, 1, 1, 1, -1, -1, -1],
  ],
  DOT: [[-1, -1, -1, -1, 1, -1, -1, -1, -1]],
  CORNER: [
    [-1, 1, -1, 1, 1, -1, -1, -1, -1],
    [-1, 1, -1, -1, 1, 1, -1, -1, -1],
    [-1, -1, -1, -1, 1, 1, -1, 1, -1],
    [-1, -1, -1, 1, 1, -1, -1, 1, -1],
  ],
}

export const GUNS = {
  GUN: [[-1, -1, -1, -1, 2, -1, -1, -1, -1]],
}
