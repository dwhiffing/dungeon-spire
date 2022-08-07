import { GUN_STATS } from '../constants'
import { IGameScene } from '~/scenes/Game'

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  call?: Phaser.Time.TimerEvent
  damageAmount: number
  health: number

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setFrame(40).setSize(1, 1).setOffset(0, 0).setOrigin(0, 0)
    this.damageAmount = 0
    this.health = 1
    this.body.reset(-9, -9)
  }

  damage(amount: number) {
    this.health -= amount
    if (this.health <= 0) this.kill()
  }

  shoot(type: string, x: number, y: number, x2: number, y2: number) {
    this.health = 1
    this.damageAmount = GUN_STATS[type].damage
    this.body.reset(x, y)
    this.setActive(true).setVisible(true)
    this.scene.physics.moveTo(this, x2, y2)
    this.call = this.scene.time.delayedCall(1000, this.kill)
  }

  kill = () => {
    this.body.reset(-9, 10)
    this.setActive(false).setVisible(false)
    this.call?.destroy()
  }
}
