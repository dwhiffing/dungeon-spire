import { ENEMIES } from '../constants'
import { HealthBar } from './HealthBar'
import { IGameScene, Path } from '~/types'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  timeline?: Phaser.Tweens.Timeline
  health: number
  maxHealth: number
  speed: number
  damageAmount: number
  progress: number
  coord?: { x: number; y: number }
  scene: IGameScene
  healthBar: HealthBar

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(3, 3).setActive(false).setOffset(3, 3)
    this.health = 0
    this.maxHealth = 0
    this.progress = 0
    this.speed = 0
    this.damageAmount = 0
    this.healthBar = new HealthBar(scene)
    this.healthBar.container.setDepth(8)
    this.body.reset(-9, 10)

    this.flipX = true
  }

  damage(amount: number) {
    this.health -= amount
    this.healthBar.update(this.health)
    if (this.health <= 0) this.kill()
  }

  spawn(x: number, y: number, type: string, path: Path) {
    this.setActive(true).setVisible(true).setOrigin(0, 0)
    this.body.reset(x, y)
    if (this.health === 0) {
      const data = ENEMIES[type]
      this.health = data.health
      this.maxHealth = data.health
      this.speed = data.speed
      this.damageAmount = data.damage
    }
    this.healthBar.update(this.health, this.maxHealth)
    this.healthBar.container.setPosition(this.x, this.y)
    if (path) this.followPath(path)
    this.play(type + '-walk')
  }

  _kill = () => {
    this.setActive(false).setVisible(false)
    this.timeline?.stop()
    this.body.reset(-9, 10)
    this.healthBar.container.setAlpha(0)
  }

  kill = () => {
    this._kill()
    this.health = 0
    this.scene.events.emit('enemy-killed')
  }

  win = () => {
    this._kill()
    this.scene.events.emit('enemy-won', this)
  }

  followPath = (path: Path) => {
    if (!path || !this.active) return

    this.timeline?.stop()
    this.scene.time.delayedCall(100, () => {
      this.timeline = this.scene.tweens.createTimeline()
      this.healthBar.container.setPosition(this.x, this.y)
      path.slice(1).forEach(({ x, y }) => {
        this.timeline?.add({
          targets: [this, this.healthBar.container],
          x: x * 8,
          y: y * 8,
          duration: this.speed,
          onUpdate: () => {
            const coord = {
              x: Math.floor(this.x / 8),
              y: Math.floor(this.y / 8),
            }
            if (coord.x === this.coord?.x && coord.y === this.coord?.y) return
            this.coord = coord
            const index =
              this.scene.level?.path.findIndex(
                (c) => c.x === coord.x && c.y === coord.y,
              ) || 0
            const length = this.scene.level?.path.length || 1

            this.progress = index / length
          },
          onStart: () => {
            this.flipX = this.x > x * 8
          },
        })
      })

      this.timeline.on('complete', this.win)
      this.timeline.play()
    })
  }
}
