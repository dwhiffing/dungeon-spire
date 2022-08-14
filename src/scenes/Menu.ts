export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  create() {
    const { width, height } = this.cameras.main
    this.sound.stopAll()
    this.sound.play('menu-music', { loop: true, volume: 0.5 })
    let started = false
    const start = () => {
      if (started) return
      started = true
      this.cameras.main.fadeOut(1000, 0, 0, 0)
      this.time.delayedCall(1000, () => {
        this.scene.start('Game', { level: 1 })
      })
    }

    this.input.keyboard.addKey('M').addListener('down', () => {
      this.sound.mute = !this.sound.mute
    })

    this.input.keyboard.addKey('SPACE').addListener('down', start)

    this.add.image(32, 24, 'title')

    this.add
      .image(width / 2 - 15, height - 10, 'tilemap', 56)
      .setInteractive()
      .on('pointerdown', start)

    this.add
      .image(width / 2 + 15, height - 10, 'tilemap', 57)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Credits'))
    // start()
  }

  update() {}
}
