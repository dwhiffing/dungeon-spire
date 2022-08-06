export class Enemy extends Phaser.Physics.Arcade.Sprite {
  timeline: any

  constructor(scene, x, y) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.name = 'enemy'
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(4, 4)
  }

  spawn(x, y) {
    this.setOrigin(0, 0)
    this.body.reset(x, y)
    this.setActive(true)
    this.setVisible(true)
  }

  kill = () => {
    this.setActive(false)
    this.setVisible(false)
    this.timeline?.stop()
    this.body.reset(-9, -9)
  }

  followPath = (path) => {
    if (!path) return
    this.timeline?.stop()
    this.scene.time.delayedCall(100, () => {
      this.timeline = this.scene.tweens.createTimeline()
      path.slice(1).forEach((tile) => {
        this.timeline.add({
          targets: [this],
          x: tile.x * 8,
          y: tile.y * 8,
          duration: 2000,
        })
      })

      this.timeline.on('complete', this.kill)
      this.timeline.play()
    })
  }
}
