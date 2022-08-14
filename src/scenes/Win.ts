export default class extends Phaser.Scene {
  finalLevel?: number
  constructor() {
    super({ key: 'Win' })
  }

  init(opts) {
    this.finalLevel = opts.level
  }

  create() {
    const { width, height } = this.cameras.main
    this.sound.stopAll()
    this.sound.play('menu-music', { loop: true, volume: 0.5 })

    this.add
      .bitmapText(width / 2, height / 2 - 10, 'pixel-dan', 'GAME OVER')
      .setCenterAlign()
      .setFontSize(5)
      .setOrigin(0.5)

    this.add
      .bitmapText(
        width / 2,
        height / 2 + 5,
        'pixel-dan',
        'LEVEL ' + this.finalLevel,
      )
      .setCenterAlign()
      .setFontSize(5)
      .setOrigin(0.5)

    this.add
      .image(width / 2 - 15, height - 10, 'tilemap', 56)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Game'))

    this.add
      .image(width / 2 + 15, height - 10, 'tilemap', 57)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Credits'))
  }

  update() {}
}
