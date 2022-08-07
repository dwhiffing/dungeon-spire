export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Win' })
  }

  create() {
    const { width, height } = this.cameras.main

    this.add
      .bitmapText(width / 2, height / 2 - 10, 'pixel-dan', 'GAME OVER')
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
