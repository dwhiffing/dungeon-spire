import { shuffle } from 'lodash'
import { Card } from '../sprites/Card'
import {
  BASIC_DECK,
  CARD_TIERS,
  DEFAULT_DRAW_COUNT,
  PLAYER_WALL_INDEX,
} from '../constants'
import { HealthBar } from '../sprites/HealthBar'
import { IGameScene } from '~/types'

export default class HudService {
  scene: IGameScene
  playerHealthBar: HealthBar
  playerArmorBar: HealthBar
  energyText: Phaser.GameObjects.BitmapText
  titleText: Phaser.GameObjects.BitmapText
  waveText: Phaser.GameObjects.BitmapText
  drawCount: number
  activeCard?: Card
  deck: { key: string; label: string }[]
  hand: { key: string; label: string }[]
  discard: { key: string; label: string }[]
  banish: { key: string; label: string }[]
  cards: Card[]
  backdrop: Phaser.GameObjects.Rectangle
  playButton: Phaser.GameObjects.Sprite
  waveSprite: Phaser.GameObjects.Sprite

  constructor(scene: IGameScene) {
    this.scene = scene

    this.backdrop = this.scene.add
      .rectangle(0, 0, 64, 64, 0x000000)
      .setAlpha(0)
      .setOrigin(0)
      .setInteractive()
      .setDepth(9)
      .on('pointerup', () => {
        if (this.scene.data.get('mode') !== 'play') return
        this.showCards()
        this.backdrop.setAlpha(0.7)
      })
      .on('pointerdown', (e) => {
        if (this.scene.data.get('mode') !== 'play') return
        this.hideCards()
        this.backdrop.setAlpha(0.01)
      })
    this.scene.input.on('pointermove', (e) => {
      if (e.y < 36) return
      const cards = this.cards.filter((c, i) => c.alpha === 1)
      let width = 58
      if (cards.length < 3) width = 35
      const index = Math.floor(((e.x - 3) / width) * cards.length)
      cards[index]?.focus()
      cards.filter((c) => c !== cards[index]).forEach((c) => c.unfocus())
    })

    this.playButton = this.scene.add
      .sprite(56, 1, 'tilemap', 56)
      .setOrigin(0)
      .setInteractive()
      .setDepth(10)
      .on('pointerdown', (e) => {
        if (this.scene.marker?.shape) {
          this.showCards()
          this.scene.marker?.clearShape()
          e.stopPropagation()
        } else if (this.scene.data.get('mode') === 'play') {
          this.hideCards()
          this.scene.nextWave()
        } else {
          this.scene.data.set('mode', 'play')
        }
      })

    this.hand = []
    this.drawCount = DEFAULT_DRAW_COUNT
    this.discard = []
    this.banish = []
    this.deck = shuffle(BASIC_DECK)
    this.cards = new Array(32).fill('').map((_, i) => new Card(this.scene, i))
    this.scene.events.on('card-click', this.cardClick)
    this.scene.events.on('changedata-energyCount', this.setEnergy)
    this.scene.events.on('changedata-healthCount', this.setHealth)
    this.scene.events.on('changedata-armorCount', this.setArmor)
    this.scene.events.on('changedata-mode', this.setMode)

    this.playerHealthBar = this.createPlayerHealth()
    this.playerArmorBar = this.createPlayerArmor()
    this.playerArmorBar.container.setAlpha(0)
    this.titleText = this.scene.add
      .bitmapText(32, 1, 'pixel-dan', '')
      .setOrigin(0.5, 0)
      .setCenterAlign()
      .setDepth(11)
    this.energyText = this.scene.add
      .bitmapText(55, 30, 'pixel-dan', '0')
      .setOrigin(0)
      .setDepth(11)
    this.waveSprite = this.scene.add
      .sprite(1, 27, 'tilemap', 6)
      .setOrigin(0)
      .setDepth(11)
    this.waveText = this.scene.add
      .bitmapText(10, 30, 'pixel-dan', 'X3')
      .setOrigin(0)
      .setDepth(11)
  }

  createPlayerArmor = () => {
    const bar = new HealthBar(this.scene, 64, 1, 0, 0, 0x001144, 0x0044aa)
    const life = this.scene.data.values.armorCount
    bar.update(life, life)
    this.scene.add.existing(bar.container)
    bar.container.setDepth(1)
    bar.container.setPosition(0, 1)
    return bar
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

  getCardAddPool = () => {
    const level = this.scene.data.values.levelIndex
    let tier
    if (level === 1) tier = CARD_TIERS.ONE
    if (level === 2) tier = CARD_TIERS.TWO
    if (level === 3) tier = CARD_TIERS.THREE
    if (level === 4) tier = CARD_TIERS.FOUR
    if (level === 5) tier = CARD_TIERS.FIVE
    if (level > 5) tier = CARD_TIERS.SIX
    return shuffle(Phaser.Math.RND.pick(tier))
  }

  drawCards = (drawCount = this.drawCount) => {
    const mode = this.scene.data.get('mode')
    if (mode === 'remove') {
      drawCount = this.deck.length
    } else if (mode === 'add') {
      this.hand = this.getCardAddPool().slice(0, 3)
      this.showCards()
      return
    }

    this.scene.inputService?.setTimeSpeed(false)

    const randomGun = shuffle(this.deck.filter((c) => c.key.match(/GUN/)))[0]
    if (
      this.scene.data.values.turnIndex === 0 &&
      mode !== 'remove' &&
      randomGun
    ) {
      this.deck = this.deck.filter((c) => c !== randomGun)
      this.hand = [randomGun]
      drawCount -= 1
      const shouldForceWall =
        this.scene
          .level!.map.layers[0].data.flat()
          .filter((i) => i.index === PLAYER_WALL_INDEX).length === 0
      const randomWall = shuffle(
        this.deck.filter((c) => c.label.match(/TILE/)),
      )[0]
      if (shouldForceWall && randomWall) {
        drawCount -= 1
        this.hand = [...this.hand, randomWall]
        this.deck = this.deck.filter((c) => c !== randomWall)
      }
    } else if (this.deck.length < drawCount) {
      drawCount = drawCount - this.deck.length
      this.hand = [...this.deck]
      this.deck = shuffle(this.discard)
      this.discard = []
    }
    this.hand = [...this.hand, ...this.deck.splice(0, drawCount)]
    this.showCards()
  }

  shuffleDeck = () => {
    this.deck = shuffle([
      ...this.deck,
      ...this.discard,
      ...this.banish,
      ...this.hand,
    ])
    this.banish = []
    this.discard = []
    this.hand = []
  }

  showCards = () => {
    this.backdrop.setAlpha(this.scene.data.get('mode') === 'play' ? 0.7 : 1)
    this.playButton.setAlpha(1)
    this.playButton.setFlipX(false)
    this.titleText.setAlpha(1)
    this.cards.forEach((c) => c.hide())
    this.hand.forEach((c, i) =>
      this.cards[i].show(this.hand[i], this.hand.length),
    )
    if (this.scene.data.get('mode') === 'play') {
      this.waveText.setAlpha(1)
      this.waveSprite.setAlpha(1)
      this.energyText.setAlpha(1)
      const wave = this.scene.levelData?.waves[0]
      let remainingCount =
        this.scene.enemies?.getSurvivingEnemies().length || wave?.size
      this.waveSprite.play(`${wave?.type}-walk`)
      this.waveText.setText(`X${remainingCount}`)
    }
  }

  addCard = (card?) => {
    const cardSprite = this.hand.find((_c, i) => i === card.index)
    if (cardSprite) this.deck = [...this.deck, cardSprite]
    this.hand = []
  }

  removeCard = (card?) => {
    this.hand = this.hand.filter((_c, i) => i !== card.index)
    this.shuffleDeck()
  }

  cardClick = (card?) => {
    const mode = this.scene.data.get('mode')
    if (mode === 'remove') {
      this.removeCard(card)
      this.scene.doFade(() => this.scene.data.set('mode', 'play'))
    } else if (mode === 'add') {
      this.addCard(card)
      this.scene.doFade(() => {
        const index = this.scene.data.get('levelIndex') - 1
        this.scene.data.set('mode', index % 5 === 0 ? 'remove' : 'play')
      })
    } else if (mode === 'play') {
      this.scene.sound.play('menu2')

      this.activeCard = card
      this.scene.events.emit('card-play', card)
      this.hideCards()
      this.playButton.setAlpha(1)
      this.playButton.setFlipX(true)
    }
  }

  useCard = (card = this.activeCard) => {
    if (!card) return
    this.banish.push(this.hand[card.index])
    this.hand = this.hand.filter((c, i) => i !== card.index)
  }

  hideCards = () => {
    this.playButton.setAlpha(0)
    this.energyText.setAlpha(0)
    this.waveText.setAlpha(0)
    this.waveSprite.setAlpha(0)
    this.titleText.setAlpha(0)
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

  setArmor = (_, value) => {
    this.playerArmorBar.update(value)
  }

  setMode = (_, value) => {
    if (value === 'remove') {
      this.titleText.text = 'REMOVE\nA CARD'
    } else if (value === 'add') {
      this.titleText.text = 'ADD\nA CARD'
    } else if (value === 'play') {
      this.titleText.text = 'PLAY\nCARD'
    } else {
      this.playButton.setAlpha(0)
      this.titleText.text = ''
    }
    if (value.match(/remove|add|play/)) {
      this.discardHand()
      if (value.match(/remove|add/)) this.shuffleDeck()
      this.drawCards()
    }
  }
}
