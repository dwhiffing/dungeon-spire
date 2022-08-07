import { ENEMIES, Path } from '../constants'
import { IGameScene } from '~/scenes/Game'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  timeline?: Phaser.Tweens.Timeline
  health: number
  maxHealth: number
  speed: number
  damageAmount: number
  healthBar: HealthBar

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(4, 4).setActive(false)
    this.health = 0
    this.maxHealth = 0
    this.speed = 0
    this.damageAmount = 0
    this.healthBar = new HealthBar(scene)
    this.body.reset(-9, 10)
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
    if (!path) return

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
        })
      })

      this.timeline.on('complete', this.win)
      this.timeline.play()
    })
  }
}

class HealthBar {
  scene: IGameScene
  container: Phaser.GameObjects.Container
  rectangle2: Phaser.GameObjects.Rectangle
  rectangle: Phaser.GameObjects.Rectangle
  health?: number
  max?: number

  constructor(scene: IGameScene) {
    this.scene = scene

    this.rectangle = this.scene.add
      .rectangle(2, -2, 4, 1, 0xaa0000)
      .setOrigin(0)

    this.rectangle2 = this.scene.add
      .rectangle(2, -2, 4, 1, 0xff0000)
      .setOrigin(0)

    this.container = this.scene.add.container(0, 0, [
      this.rectangle,
      this.rectangle2,
    ])
  }

  update(health: number, max?: number) {
    this.container.setAlpha(1)
    this.health = health
    if (max) this.max = max
    this.rectangle2.setDisplaySize(Math.ceil((this.health / this.max!) * 4), 1)
  }
}
