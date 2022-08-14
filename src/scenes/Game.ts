import LevelService from '../services/level'
import EnemyService from '../services/enemy'
import MarkerService from '../services/marker'
import GunService from '../services/gun'
import InputService from '../services/input'
import HudService from '../services/hud'
import { Enemy } from '~/sprites/Enemy'
import { Bullet } from '~/sprites/Bullet'
import {
  ARMOR_WALL_INDEX,
  DEFAULT_ENERGY_COUNT,
  LEVELS,
  STARTING_LEVEL,
  STARTING_MAX_LIFE,
} from '../constants'
import { LevelData } from '~/types'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  levelData?: LevelData
  level?: LevelService
  enemies?: EnemyService
  marker?: MarkerService
  guns?: GunService
  hud?: HudService
  inputService?: InputService

  init() {}

  create() {
    this.data.set('energyCount', 0)
    this.data.set('levelIndex', STARTING_LEVEL - 1)
    this.data.set('turnIndex', 0)
    this.data.set('healthCount', 0)
    this.data.set('armorCount', 0)
    this.data.set('mode', '')

    this.sound.stopAll()
    this.sound.play('game-music-0', { loop: true, volume: 0.5 })

    this.cameras.main.setBackgroundColor(0x2f2820)
    this.lights.enable()
    this.lights.setAmbientColor(0xbbbbbb)

    this.data.set('healthCount', STARTING_MAX_LIFE)
    this.level = new LevelService(this)
    this.enemies = new EnemyService(this)
    this.marker = new MarkerService(this)
    this.guns = new GunService(this)
    this.hud = new HudService(this)
    this.inputService = new InputService(this)
    this.events.on('card-play', this.cardClick)
    this.events.on('enemy-killed', this.checkEnemies)
    this.events.on('enemy-won', this.enemyWon)

    this.physics.add.overlap(
      this.enemies.group,
      this.guns.bulletGroup,
      this.hit,
    )
    this.nextLevel()
    this.data.set('mode', 'play')
  }

  enemyWon = (enemy: Enemy) => {
    let incomingDamage = enemy.damageAmount

    if (this.data.values.armorCount > 0) {
      incomingDamage -= this.data.values.armorCount
      this.data.values.armorCount -= enemy.damageAmount
      if (this.data.values.armorCount < 0) this.data.values.armorCount = 0
    }

    if (incomingDamage > 0) {
      this.data.values.healthCount -= incomingDamage
    }
    if (this.data.values.healthCount < 1) {
      this.gameover()
    } else {
      this.checkEnemies()
    }
  }

  gameover = () => {
    this.events.off('card-play', this.cardClick)
    this.events.off('enemy-killed', this.checkEnemies)
    this.events.off('enemy-won', this.enemyWon)
    this.events.off('card-click', this.hud?.hideCards)
    this.events.off('changedata-energyCount', this.hud?.setEnergy)
    this.events.off('changedata-healthCount', this.hud?.setHealth)
    this.events.off('changedata-armorCount', this.hud?.setArmor)
    this.events.off('changedata-mode', this.hud?.setMode)
    this.scene.start('Win', { level: this.data.get('levelIndex') })
    this.tweens.timeScale = 1
    this.time.timeScale = 1
    this.physics.world.timeScale = 1
  }

  cardClick = (card) => {
    this.time.delayedCall(100, () => this.marker?.getShape(card))
  }

  hit = (_enemy, _bullet) => {
    const enemy = _enemy as Enemy
    const bullet = _bullet as Bullet
    if (!enemy.active || !bullet.active) return
    enemy.damage(bullet.damageAmount)
    bullet.damage(enemy)
    if (bullet.slow) enemy.getSlowed()
  }

  checkEnemies = () => {
    if (!this.enemies) return

    const numActive = this.enemies.group.countActive()
    const numIncoming = this.enemies.getSurvivingEnemies().length
    const activeCount = this.enemies.remainingSpawnCount + numActive
    if (activeCount > 0) return

    this.data.set('energyCount', DEFAULT_ENERGY_COUNT)
    if (numIncoming === 0) {
      // TODO: show some kind of win animation
      this.data.set('mode', 'add')
      this.nextLevel()
    } else {
      this.data.inc('turnIndex')
      this.time.delayedCall(1500, () => this.data.set('mode', 'play'))
    }
  }

  update() {}

  nextWave = () => {
    this.sound.play('menu4')
    this.data.set('mode', 'fight')
    const value =
      this.level?.map.layers[0].data
        .flat()
        .filter((i) => i.index === ARMOR_WALL_INDEX).length || 0
    this.data.values.armorCount = value
    this.hud?.playerArmorBar.update(value, value)
    this.time.delayedCall(1000, () => {
      this.enemies?.spawn(this.levelData!.waves[0])
    })
  }

  nextLevel() {
    this.data.values.levelIndex++
    this.data.set('turnIndex', 0)
    this.levelData = LEVELS[(this.data.values.levelIndex - 1) % LEVELS.length]
    this.data.set('energyCount', DEFAULT_ENERGY_COUNT)
    this.guns?.clear()
    this.hud?.shuffleDeck()
    this.level?.startLevel(this.levelData)
  }

  placeTile = (event) => {
    if (!this.marker?.shape || !this.marker.isValid) return
    this.data.values.energyCount--

    const x = Math.floor(event.downX / 8)
    const y = Math.floor(event.downY / 8)
    this.level
      ?.placeTiles(this.marker?.getTileData(x, y))
      .then(() => {
        this.sound.play('place', { volume: 0.5 })
        if (this.marker?.card?.key.match(/GUN/)) {
          this.guns?.createGun(x * 8, y * 8, this.marker?.card.key)
        }
        this.enemies?.repath(this.level?.findExit())
        this.marker?.clearShape()
        this.hud?.useCard()
        if (this.data.get('energyCount') < 1 || this.hud?.hand.length === 0) {
          this.nextWave()
        } else {
          this.hud?.showCards()
        }
      })
      .catch((e) => console.log(e))
  }

  rotateTile = () => {
    this.marker?.rotate()
  }
}
