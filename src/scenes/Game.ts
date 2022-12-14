import LevelService from '../services/level'
import EnemyService from '../services/enemy'
import MarkerService from '../services/marker'
import GunService from '../services/gun'
import InputService from '../services/input'
import { GUN_STATS } from '../constants'
import HudService from '../services/hud'
import { Enemy } from '~/sprites/Enemy'
import { Bullet } from '~/sprites/Bullet'
import { shuffle } from 'lodash'
import {
  ARMOR_WALL_INDEX,
  DEFAULT_ENERGY_COUNT,
  LEVELS,
  STARTING_LEVEL,
  STARTING_MAX_LIFE,
  ENEMIES,
} from '../constants'
import { LevelData } from '~/types'

let enemyTypes = [] as string[]
let nextLevelTriggered = false
export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  levelData?: LevelData
  level?: LevelService
  enemies?: EnemyService
  particles?: Phaser.GameObjects.Particles.ParticleEmitterManager
  marker?: MarkerService
  guns?: GunService
  isGameOver?: boolean
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
    this.cameras.main.fadeFrom(500, 0, 0, 0)

    this.sound.stopAll()
    this.sound.play('game-music-0', { loop: true, volume: 0.5 })
    this.particles = this.add.particles('particle').setDepth(3)

    this.cameras.main.setBackgroundColor(0x2f2820)
    this.lights.enable()
    this.lights.setAmbientColor(0x888888)

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
    this.isGameOver = false

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
      this.cameras.main.shake(200, 0.03)
      this.data.values.healthCount -= incomingDamage
    }
    if (this.data.values.healthCount < 1 && !this.isGameOver) {
      this.isGameOver = true
      this.sound.play('game-over')
      this.time.delayedCall(1500, () => this.doFade(this.gameover))
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
    enemy.takeDamage(bullet.damageAmount)
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
    if (numIncoming === 0 && !nextLevelTriggered) {
      nextLevelTriggered = true
      this.sound.play('success')
      this.inputService?.setTimeSpeed(false)
      this.time.delayedCall(500, () =>
        this.doFade(() => {
          this.data.set('mode', 'add')
          nextLevelTriggered = false
          this.nextLevel()
        }),
      )
    } else {
      this.data.inc('turnIndex')
      this.time.delayedCall(1000, () => this.data.set('mode', 'play'))
    }
  }

  doFade = (onComplete: any) => {
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.time.delayedCall(1000, () => {
      onComplete()
      this.cameras.main.fadeIn(500, 0, 0, 0)
    })
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
    this.hud?.playerArmorBar.container.setAlpha(value > 0 ? 1 : 0)
    this.time.delayedCall(1000, () => {
      this.enemies?.spawn(this.levelData!.waves[0])
    })
  }

  nextLevel() {
    this.data.values.levelIndex++
    this.data.set('turnIndex', 0)
    const levelIndex = this.data.values.levelIndex - 1
    if (levelIndex < 7) {
      this.levelData = LEVELS[levelIndex]
    } else {
      if (enemyTypes.length === 0) enemyTypes = shuffle(Object.keys(ENEMIES))
      let type = enemyTypes.pop() as string
      let size = Math.floor((10 + levelIndex / 2) * ENEMIES[type].waveSize)
      let tiles = [] as number[][]

      const expectedDistance = Math.max(1, 11 - Math.floor(levelIndex / 4))
      let entranceCoords
      let exitCoords
      do {
        entranceCoords = this.getRandomFreeCoord(tiles)
        exitCoords = this.getRandomFreeCoord(tiles)
      } while (
        Math.abs(
          Phaser.Math.Distance.Between(
            entranceCoords[0],
            entranceCoords[1],
            exitCoords[0],
            exitCoords[1],
          ) - expectedDistance,
        ) > 1
      )
      tiles.push([33, ...entranceCoords])
      tiles.push([32, ...exitCoords])

      // TODO: figure out how wall generation works
      // tiles.push([18, ...this.getRandomFreeCoord(tiles)])
      // on early levels, generates 2 lines of size 4
      // then 2 lines of size 3
      // then 2 lines of size 2
      // then 2 lines of size 1

      const numLavaTiles = Math.max(2, 9 - Math.floor(levelIndex / 5))
      for (let l = 0; l < numLavaTiles; l++)
        tiles.push([20, ...this.getRandomFreeCoord(tiles)])
      this.levelData = { waves: [{ size, type }], tiles }
    }

    this.data.set('energyCount', DEFAULT_ENERGY_COUNT)
    this.guns?.clear()
    if (this.data.get('mode') === 'play') this.hud?.shuffleDeck()
    this.level?.startLevel(this.levelData)
  }

  getRandomFreeCoord = (tiles: number[][]) => {
    let x, y
    do {
      x = Phaser.Math.RND.between(0, 7)
      y = Phaser.Math.RND.between(0, 7)
    } while (tiles.some((t) => t[1] === x && t[2] === y))
    return [x, y]
  }

  placeTile = (event) => {
    if (!this.marker?.shape) return
    if (!this.marker.isValid) {
      return this.sound.play('error', { volume: 0.5, rate: 0.6 })
    }
    this.data.values.energyCount--
    const cardKey = this.marker?.card?.key || ''
    const isGun = cardKey.match(/GUN/)
    const x = Math.floor(event.downX / 8)
    const y = Math.floor(event.downY / 8)
    const tint = isGun ? GUN_STATS[cardKey].baseTint : undefined
    this.level
      ?.placeTiles(this.marker?.getTileData(x, y), tint)
      .then(() => {
        this.sound.play('place', { volume: 0.5 })
        if (isGun) this.guns?.createGun(x * 8, y * 8, cardKey)
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
    if (!this.marker?.shape) return
    this.marker?.rotate()
  }
}
