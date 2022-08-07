import LevelService from '../services/level'
import EnemyService from '../services/enemy'
import MarkerService from '../services/marker'
import GunService from '../services/gun'
import InputService from '../services/input'
import HudService from '../services/hud'
import { Enemy } from '~/sprites/Enemy'
import { Bullet } from '~/sprites/Bullet'
import { LevelData, LEVELS } from '../constants'

const MAX_LIFE = 10
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
    this.data.set('levelIndex', 0)
    this.data.set('healthCount', 0)

    this.cameras.main.setBackgroundColor(0x113300)
    // this.physics.world.fixedDelta = true
    this.data.set('healthCount', MAX_LIFE)
    this.level = new LevelService(this)
    this.enemies = new EnemyService(this)
    this.marker = new MarkerService(this)
    this.guns = new GunService(this)
    this.hud = new HudService(this)
    this.inputService = new InputService(this)
    this.events.on('card-click', this.cardClick)
    this.events.on('enemy-killed', this.checkEnemies)
    this.events.on('enemy-won', this.enemyWon)

    this.physics.add.overlap(
      this.enemies.group,
      this.guns.bulletGroup,
      this.hit,
    )
    this.nextLevel()
  }

  enemyWon = (enemy: Enemy) => {
    this.data.values.healthCount -= enemy.damageAmount
    if (this.data.values.healthCount < 1) {
      this.gameover()
    } else {
      this.checkEnemies()
    }
  }

  gameover = () => {
    this.events.off('card-click', this.cardClick)
    this.events.off('enemy-killed', this.checkEnemies)
    this.events.off('enemy-won', this.enemyWon)
    this.events.off('card-click', this.hud?.hideCards)
    this.events.off('changedata-energyCount', this.hud?.setEnergy)
    this.events.off('changedata-healthCount', this.hud?.setHealth)
    this.scene.start('Win', { level: this.data.get('levelIndex') })
  }

  cardClick = (card) => {
    this.time.delayedCall(100, () => this.marker?.getShape(card))
  }

  hit = (_enemy, _bullet) => {
    const enemy = _enemy as Enemy
    const bullet = _bullet as Bullet
    if (!enemy.active || !bullet.active) return
    enemy.damage(bullet.damageAmount)
    bullet.damage(1)
  }

  checkEnemies = () => {
    if (!this.enemies) return

    const numActive = this.enemies.group.countActive()
    const numIncoming = this.enemies.getSurvivingEnemies().length
    const activeCount = this.enemies.remainingSpawnCount + numActive
    if (activeCount > 0) return

    this.data.set('energyCount', 2)
    if (numIncoming > 0) {
      this.hud?.drawCards()
    } else {
      this.nextLevel()
    }
  }

  update() {}

  nextWave = () => {
    this.hud?.discardHand()
    this.enemies?.spawn(this.levelData!.waves[0])
  }

  nextLevel() {
    this.data.values.levelIndex++
    this.data.set('energyCount', 2)
    this.levelData = LEVELS[(this.data.values.levelIndex - 1) % LEVELS.length]
    this.guns?.clear()
    this.level?.startLevel(this.levelData)
    this.hud?.discardHand()
    this.hud?.drawCards()
  }

  placeTile = (event) => {
    if (!this.marker?.shape) return
    this.data.values.energyCount--

    const x = Math.floor(event.downX / 8)
    const y = Math.floor(event.downY / 8)
    this.level?.placeTiles(this.marker?.getTileData(x, y), () => {
      if (this.marker?.card?.key === 'GUN') {
        this.guns?.createGun(x * 8, y * 8)
      }
      this.enemies?.repath(this.level?.findExit())
      this.marker?.clearShape()
      if (this.data.get('energyCount') < 1) {
        this.nextWave()
      } else {
        this.hud?.showCards()
      }
    })
  }

  rotateTile = () => {
    this.marker?.rotate()
  }
}

export interface IGameScene extends Phaser.Scene {
  level?: LevelService
  enemies?: EnemyService
  marker?: MarkerService
  guns?: GunService
  hud?: HudService
  levelData?: LevelData
  inputService?: InputService
  rotateTile: () => void
  nextWave: () => void
  placeTile: (event: any) => void
}
