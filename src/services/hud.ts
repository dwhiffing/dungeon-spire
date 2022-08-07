import { shuffle } from 'lodash'
import { IGameScene } from '~/scenes/Game'
import { Card } from '../sprites/Card'
import { GUN_CARDS, SHAPE_CARDS } from '../constants'

export default class HudService {
  scene: IGameScene
  drawCount: number
  deck: { key: string; label: string }[]
  hand: { key: string; label: string }[]
  discard: { key: string; label: string }[]
  cards: Card[]
  backdrop: Phaser.GameObjects.Rectangle

  constructor(scene: IGameScene) {
    this.scene = scene

    this.backdrop = this.scene.add
      .rectangle(0, 0, 64, 64, 0x000000)
      .setAlpha(0)
      .setOrigin(0)

    this.hand = []
    this.drawCount = 5
    this.discard = []
    this.deck = shuffle([...SHAPE_CARDS, ...GUN_CARDS])
    this.cards = new Array(9).fill('').map((_, i) => new Card(this.scene, i))
    this.scene.events.on('card-click', this.hideCards)
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
    this.hand.forEach((c, i) =>
      this.cards[i].show(this.hand[i], this.hand.length),
    )
  }

  hideCards = (card) => {
    this.discard.push(this.hand[card.index])
    this.hand = this.hand.filter((c, i) => i !== card.index)
    this.backdrop.setAlpha(0)
    this.cards.forEach((c) => c.hide())
  }

  discardHand = () => {
    this.discard = [...this.discard, ...this.hand]
    this.hand = []
    this.cards.forEach((c) => c.hide())
  }
}
