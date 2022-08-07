import { IGameScene } from '~/scenes/Game'
import { CARD_HEIGHT, CARD_WIDTH, SHAPES } from '../constants'

export class Card extends Phaser.GameObjects.Rectangle {
  graphics: Phaser.GameObjects.Graphics
  key: string
  index: number
  labelText: Phaser.GameObjects.BitmapText

  constructor(scene: IGameScene, index: number) {
    super(
      scene,
      3 + index * (CARD_WIDTH + 3),
      36,
      CARD_WIDTH,
      CARD_HEIGHT,
      0x222222,
    )

    this.scene.add.existing(this)
    this.index = index
    this.key = ''
    this.setStrokeStyle(1, 0x555555).setInteractive().setOrigin(0).setAlpha(0)

    this.graphics = this.scene.add.graphics().setDepth(10)
    this.labelText = this.scene.add
      .bitmapText(this.x + 1, this.y + 19, 'pixel-dan', '')
      .setDepth(10)

    this.on('pointerdown', (e) => this.scene.events.emit('card-click', this))
  }

  show(cardData) {
    this.graphics.clear()

    this.key = cardData.key

    if (cardData.label === 'TILE') {
      const shape = SHAPES[this.key][0] as number[]
      shape.forEach((frame, index) => {
        if (frame === -1) return
        const _x = this.x + (index % 3) * 3 + 4
        const _y = this.y + Math.floor(index / 3) * 3 + 4
        this.graphics.fillStyle(0x00aa00).fillRect(_x, _y, 2, 2)
      })
    }

    this.labelText.text = cardData.label

    this.setAlpha(1)
    this.labelText.setAlpha(1)
    this.graphics.setAlpha(1)
  }

  hide() {
    this.setAlpha(0)
    this.labelText.setAlpha(0)
    this.graphics.setAlpha(0)
  }
}
