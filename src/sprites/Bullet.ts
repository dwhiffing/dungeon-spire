import { IGameScene } from '~/scenes/Game'

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  call?: Phaser.Time.TimerEvent

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setFrame(40).setSize(1, 1).setOffset(0, 0).setOrigin(0, 0)
  }

  shoot(x: number, y: number, x2: number, y2: number) {
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
