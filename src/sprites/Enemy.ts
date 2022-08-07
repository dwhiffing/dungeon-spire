import { ENEMIES } from '../constants'
import { IGameScene } from '~/scenes/Game'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  timeline?: Phaser.Tweens.Timeline
  health: number
  healthBar: HealthBar

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(4, 4)
    this.health = 0
    this.healthBar = new HealthBar(scene)
  }

  damage(amount: number) {
    this.health -= amount
    this.healthBar.update(this.health)
    if (this.health <= 0) this.kill()
  }

  spawn(x, y, type) {
    this.setActive(true).setVisible(true).setOrigin(0, 0)
    this.body.reset(x, y)
    this.health = ENEMIES[type].health
    this.healthBar.update(this.health, this.health)
    this.healthBar.container.setPosition(this.x, this.y)
  }

  kill = () => {
    this.setActive(false).setVisible(false)
    this.timeline?.stop()
    this.body.reset(-9, -9)
    this.healthBar.container.setAlpha(0)
  }

  followPath = (path) => {
    if (!path) return

    this.timeline?.stop()
    this.scene.time.delayedCall(100, () => {
      this.timeline = this.scene.tweens.createTimeline()
      const duration = 2000
      this.healthBar.container.setPosition(this.x, this.y)
      path.slice(1).forEach(({ x, y }) => {
        this.timeline?.add({
          targets: [this, this.healthBar.container],
          x: x * 8,
          y: y * 8,
          duration,
        })
      })

      this.timeline.on('complete', this.kill)
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
