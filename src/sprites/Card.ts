import { IGameScene } from '~/types'
import { SHAPES, CARD_HEIGHT, CARD_WIDTH } from '../constants'

export class Card extends Phaser.GameObjects.Rectangle {
  graphics: Phaser.GameObjects.Graphics
  key: string
  index: number
  labelText: Phaser.GameObjects.BitmapText

  constructor(scene: IGameScene, index: number) {
    super(scene, 0, 0, CARD_WIDTH, CARD_HEIGHT, 0x222222)

    this.scene.add.existing(this)
    this.index = index
    this.key = ''
    this.setStrokeStyle(1, 0x555555).setInteractive().setOrigin(0).setAlpha(0)
    this.graphics = this.scene.add.graphics()
    this.labelText = this.scene.add.bitmapText(0, 0, 'pixel-dan', '')
    this.unfocus()
    this.on('pointerdown', (e) => this.scene.events.emit('card-click', this))
  }

  move(numCards: number) {
    const y = 36
    let x = 2 + this.index * (CARD_POSITIONS[numCards] || 2)
    if (x > 48) x = 48
    this.setPosition(x, y)
    this.labelText.setPosition(x + 1, y + 19)
  }

  focus = () => {
    this.setDepth(99)
    this.graphics.setDepth(99)
    this.labelText.setDepth(99)
    this.setStrokeStyle(1, 0x666666)
    this.setFillStyle(0x222222)
  }

  unfocus = () => {
    this.setStrokeStyle(1, 0x222222)
    this.setFillStyle(0x111111)
    this.setDepth(this.index + 10)
    this.graphics.setDepth(this.index + 10)
    this.labelText.setDepth(this.index + 10)
  }

  show = (cardData: any, numCards: number) => {
    this.move(numCards)
    this.graphics.clear()

    this.key = cardData.key

    const shape = SHAPES[this.key][0] as number[]
    shape.forEach((frame, index) => {
      if (frame === -1) return
      const _x = this.x + (index % 3) * 3 + 4
      const _y = this.y + Math.floor(index / 3) * 3 + 4
      this.graphics
        .fillStyle(frame === 1 ? 0x00aa00 : frame === 2 ? 0xaa0000 : 0x0000aa)
        .fillRect(_x, _y, 2, 2)
    })

    this.labelText.text = cardData.label

    this.setAlpha(1)
    this.labelText.setAlpha(1)
    this.graphics.setAlpha(1)
  }

  hide = () => {
    this.unfocus()
    this.setAlpha(0)
    this.labelText.setAlpha(0)
    this.graphics.setAlpha(0)
  }
}

const CARD_POSITIONS = {
  1: 20,
  2: 20,
  3: 20,
  4: 14,
  5: 10,
  6: 8,
  7: 7,
  8: 6,
  9: 5,
  10: 5,
  11: 4,
  12: 4,
  13: 3,
  14: 3,
  15: 3,
  16: 3,
}
