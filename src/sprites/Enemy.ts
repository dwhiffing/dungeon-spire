import { IGameScene } from '~/scenes/Game'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  timeline?: Phaser.Tweens.Timeline

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(4, 4)
  }

  spawn(x, y) {
    this.setActive(true).setVisible(true).setOrigin(0, 0)
    this.body.reset(x, y)
  }

  kill = () => {
    this.setActive(false).setVisible(false)
    this.timeline?.stop()
    this.body.reset(-9, -9)
  }

  followPath = (path) => {
    if (!path) return

    this.timeline?.stop()
    this.scene.time.delayedCall(100, () => {
      this.timeline = this.scene.tweens.createTimeline()
      const duration = 2000
      path.slice(1).forEach(({ x, y }) => {
        this.timeline?.add({ targets: [this], x: x * 8, y: y * 8, duration })
      })

      this.timeline.on('complete', this.kill)
      this.timeline.play()
    })
  }
}
