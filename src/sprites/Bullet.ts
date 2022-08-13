import { IGameScene } from '~/scenes/Game'
import { Enemy } from './Enemy'

export class Bullet extends Phaser.GameObjects.Rectangle {
  call?: Phaser.Time.TimerEvent
  damageAmount: number
  hitEnemies: Enemy[]
  health: number
  body: Phaser.Physics.Arcade.Body
  scene: IGameScene

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 1, 1, 0xffffff, 1)
    this.scene = scene as IGameScene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(1, 1).setOrigin(0.5).setActive(false).setDepth(3)
    this.damageAmount = 0
    this.hitEnemies = []
    this.health = 1
    // @ts-ignore
    this.body = this.body as Phaser.Physics.Arcade.Body
    this.body.reset(-9, -9)
  }

  damage(enemy: Enemy) {
    if (this.hitEnemies.includes(enemy)) return
    this.hitEnemies.push(enemy)
    this.health -= 1
    if (this.health <= 0) this.kill()
  }

  shoot(stats: any, x: number, y: number, x2: number, y2: number) {
    this.health = 1
    this.damageAmount = stats.damage || 1
    this.setScale(stats.scale || 1)
    this.hitEnemies = []
    this.health = stats.pierce || 1
    this.body.reset(x, y)
    this.setFillStyle(stats.tint || 0xffffff)
    this.setActive(true).setVisible(true)
    const offset = stats.accuracy
    x2 += Phaser.Math.RND.between(-offset, offset)
    y2 += Phaser.Math.RND.between(-offset, offset)
    this.scene.physics.moveTo(this, x2, y2, stats.bulletSpeed)
    this.call = this.scene.time.delayedCall(10000, this.kill)
  }

  kill = () => {
    this.body.reset(-9, 10)
    this.setActive(false).setVisible(false)
    this.call?.destroy()
  }
}
