import LevelService from '../services/level'
import EnemyService from '../services/enemy'
import MarkerService from '../services/marker'
import GunService from '../services/gun'
import InputService from '../services/input'
import HudService from '../services/hud'
import { Enemy } from '~/sprites/Enemy'
import { Bullet } from '~/sprites/Bullet'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

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

    this.physics.add.overlap(
      this.enemies.group,
      this.guns.bulletGroup,
      this.hit,
    )
  }

  hit = (_enemy, _bullet) => {
    const enemy = _enemy as Enemy
    const bullet = _bullet as Bullet
    if (!enemy.active || !bullet.active) return
    enemy.damage(bullet.damageAmount)
    bullet.damage(1)
  }

  update() {}

  spawn() {
    this.enemies?.spawn(this.level?.findEntrance())
  }

  placeTile = (event) => {
    if (!this.marker?.shape) return

    const x = Math.floor(event.downX / 8)
    const y = Math.floor(event.downY / 8)
    this.level?.placeTiles(this.marker?.getTileData(x, y), () => {
      if (this.marker?.card?.key === 'GUN') {
        this.guns?.createGun(x * 8, y * 8)
      }
      this.enemies?.repath(this.level?.findExit())
      this.marker?.clearShape()

      // next turn
      this.hud?.drawCards()
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
  inputService?: InputService
  rotateTile: () => void
  spawn: () => void
  placeTile: (event: any) => void
}
