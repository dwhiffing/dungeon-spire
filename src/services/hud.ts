import { shuffle } from 'lodash'
import { IGameScene } from '~/scenes/Game'
import { Card } from '../sprites/Card'
import { GUN_CARDS, SHAPE_CARDS } from '../constants'
import { HealthBar } from '../sprites/HealthBar'

export default class HudService {
  scene: IGameScene
  playerHealthBar: HealthBar
  energyText: Phaser.GameObjects.BitmapText
  drawCount: number
  deck: { key: string; label: string }[]
  hand: { key: string; label: string }[]
  discard: { key: string; label: string }[]
  cards: Card[]
  backdrop: Phaser.GameObjects.Rectangle
  playButton: Phaser.GameObjects.Sprite

  constructor(scene: IGameScene) {
    this.scene = scene

    this.backdrop = this.scene.add
      .rectangle(0, 0, 64, 64, 0x000000)
      .setAlpha(0)
      .setOrigin(0)
      .setInteractive()
      .setDepth(9)
      .on('pointerup', () => {
        this.showCards()
        this.backdrop.setAlpha(0.4)
      })
      .on('pointerdown', (e) => {
        this.hideCards()
        this.backdrop.setAlpha(0.01)
      })
    this.scene.input.on('pointermove', (e) => {
      const cards = this.cards.filter((c) => c.alpha === 1)
      cards.forEach((c) => c.unfocus())
      if (e.y < 36) return
      const index = Math.floor(((e.x - 3) / 58) * cards.length)
      cards[index]?.focus()
    })

    this.playButton = this.scene.add
      .sprite(56, 1, 'tilemap', 56)
      .setOrigin(0)
      .setInteractive()
      .setDepth(10)
      .on('pointerdown', () => {
        this.hideCards()
        this.scene.nextWave()
      })

    this.hand = []
    this.drawCount = 5
    this.discard = []
    this.deck = shuffle([...SHAPE_CARDS, ...GUN_CARDS])
    this.cards = new Array(32).fill('').map((_, i) => new Card(this.scene, i))
    this.scene.events.on('card-click', this.hideCards)
    this.scene.events.on('changedata-energyCount', this.setEnergy)
    this.scene.events.on('changedata-healthCount', this.setHealth)

    this.playerHealthBar = this.createPlayerHealth()
    this.energyText = this.scene.add
      .bitmapText(1, 1, 'pixel-dan', '0')
      .setOrigin(0)
      .setDepth(11)
  }

  createPlayerHealth = () => {
    const bar = new HealthBar(this.scene, 64, 1, 0, 0)
    const life = this.scene.data.values.healthCount
    bar.update(life, life)
    this.scene.add.existing(bar.container)
    bar.container.setDepth(1)
    bar.container.setPosition(0, 0)
    return bar
  }

  drawCards = (drawCount = this.drawCount) => {
    if (this.deck.length < drawCount) {
      drawCount = drawCount - this.deck.length
      this.hand = [...this.deck]
      this.deck = shuffle(this.discard)
    }
    this.hand = [...this.hand, ...this.deck.splice(0, drawCount)]
    this.showCards()
  }

  showCards = () => {
    this.backdrop.setAlpha(0.4)
    this.playButton.setAlpha(1)
    this.energyText.setAlpha(1)
    this.hand.forEach((c, i) =>
      this.cards[i].show(this.hand[i], this.hand.length),
    )
  }

  hideCards = (card?) => {
    if (card) {
      this.discard.push(this.hand[card.index])
      this.hand = this.hand.filter((c, i) => i !== card.index)
    }
    this.playButton.setAlpha(0)
    this.energyText.setAlpha(0)
    this.backdrop.setAlpha(0)
    this.cards.forEach((c) => c.hide())
  }

  discardHand = () => {
    this.discard = [...this.discard, ...this.hand]
    this.hand = []
    this.cards.forEach((c) => c.hide())
  }

  setEnergy = (_, value) => {
    this.energyText.text = `${value}`
  }

  setHealth = (_, value) => {
    this.playerHealthBar.update(value)
  }
}
