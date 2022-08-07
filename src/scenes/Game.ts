import LevelService from '../services/level'
import EnemyService from '../services/enemy'
import MarkerService from '../services/marker'
import GunService from '../services/gun'
import InputService from '../services/input'
import HudService from '../services/hud'
import { Enemy } from '~/sprites/Enemy'
import { Bullet } from '~/sprites/Bullet'
import { LevelData, LEVELS } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.levelIndex = 0
    this.lifeCount = 50
    this.energyCount = 2
  }

  levelIndex: number
  levelData?: LevelData
  energyCount: number
  lifeCount: number
  level?: LevelService
  enemies?: EnemyService
  marker?: MarkerService
  guns?: GunService
  hud?: HudService
  inputService?: InputService

  init() {}

  create() {
    this.cameras.main.setBackgroundColor(0x113300)
    // this.physics.world.fixedDelta = true
    this.level = new LevelService(this)
    this.enemies = new EnemyService(this)
    this.marker = new MarkerService(this)
    this.guns = new GunService(this)
    this.hud = new HudService(this)
    this.inputService = new InputService(this)
    this.events.on('card-click', (card) => {
      this.time.delayedCall(100, () => this.marker?.getShape(card))
    })
    this.events.on('enemy-killed', this.checkEnemies)
    this.events.on('enemy-won', (enemy: Enemy) => {
      this.lifeCount -= enemy.damageAmount
      if (this.lifeCount < 1) {
        this.scene.start('Win')
      } else {
        this.checkEnemies()
      }
    })

    this.physics.add.overlap(
      this.enemies.group,
      this.guns.bulletGroup,
      this.hit,
    )
    this.nextLevel()
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

    this.energyCount = 2
    if (numIncoming > 0) {
      this.hud?.drawCards()
    } else {
      this.nextLevel()
    }
  }

  update() {}

  nextWave = () => this.enemies?.spawn(this.levelData!.waves[0])

  nextLevel() {
    this.levelIndex++
    this.levelData = LEVELS[(this.levelIndex - 1) % LEVELS.length]
    this.guns?.clear()
    this.level?.startLevel(this.levelData)
    this.hud?.drawCards()
  }

  placeTile = (event) => {
    if (!this.marker?.shape) return
    this.energyCount--

    const x = Math.floor(event.downX / 8)
    const y = Math.floor(event.downY / 8)
    this.level?.placeTiles(this.marker?.getTileData(x, y), () => {
      if (this.marker?.card?.key === 'GUN') {
        this.guns?.createGun(x * 8, y * 8)
      }
      this.enemies?.repath(this.level?.findExit())
      this.marker?.clearShape()
      if (this.energyCount < 1) {
        this.nextWave()
      } else {
        this.hud?.drawCards()
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
  levelIndex: number
  rotateTile: () => void
  nextWave: () => void
  placeTile: (event: any) => void
}
