import { shuffle } from 'lodash'
import { IGameScene } from '~/scenes/Game'
import { Card } from '../sprites/Card'
import { SHAPES } from '../constants'

export default class HudService {
  scene: IGameScene
  deck: { key: string; label: string }[]
  cards: Card[]
  backdrop: Phaser.GameObjects.Rectangle

  constructor(scene: IGameScene) {
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
    this.scene.events.on('card-click', this.hideCards)
  }

  drawCards = () => {
    let cards = shuffle(this.deck).slice(0, 3)
    this.backdrop.setAlpha(0.4)
    this.cards.forEach((c, i) => c.show(cards[i]))
  }

  hideCards = () => {
    this.backdrop.setAlpha(0)
    this.cards.forEach((c) => c.hide())
  }
}
