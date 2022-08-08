import { IGameScene } from '~/scenes/Game'

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  call?: Phaser.Time.TimerEvent
  damageAmount: number
  health: number

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setFrame(40)
      .setSize(1, 1)
      .setOffset(0, 0)
      .setOrigin(0, 0)
      .setActive(false)
    this.damageAmount = 0
    this.health = 1
    this.body.reset(-9, -9)
  }

  damage(amount: number) {
    this.health -= amount
    if (this.health <= 0) this.kill()
  }

  shoot(stats: any, x: number, y: number, x2: number, y2: number) {
    this.health = 1
    this.damageAmount = stats.damage
    // this.setScale(stats.scale || 1)
    this.body.reset(x, y)
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
