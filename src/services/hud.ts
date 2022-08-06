import { shuffle } from 'lodash'
import { Card } from '../sprites/Card'
import { SHAPES } from './marker'

export default class HudService {
  scene: any
  deck: any
  cards: any
  backdrop: any

  constructor(scene) {
    this.scene = scene
    const shapeKeys = Object.keys(SHAPES)
    const shapeCards = shapeKeys.map((key) => ({ key, label: 'TILE' }))
    const gunCards = [{ key: 'GUN', label: 'GUN' }]

    this.backdrop = this.scene.add
      .rectangle(0, 0, 64, 64, 0x000000)
      .setAlpha(0)
      .setOrigin(0)

    this.deck = [...shapeCards, ...gunCards]
    this.deck = shuffle(this.deck)
    this.cards = new Array(3).fill('').map((_, i) => new Card(this.scene, i))
    this.drawCards()
    this.scene.events.on('card-click', this.hideCards)
  }

  drawCards = () => {
    let cards = shuffle(this.deck).slice(0, 3)
    this.cards.forEach((_card, i) => _card.renderCardData(cards[i]))
    this.showCards()
  }

  showCards = () => {
    this.backdrop.setAlpha(0.4)
    this.cards.forEach((c) => c.show())
  }

  hideCards = () => {
    this.backdrop.setAlpha(0)
    this.cards.forEach((c) => c.hide())
  }
}
