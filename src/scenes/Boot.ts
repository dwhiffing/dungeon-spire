export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()
    const { width, height } = this.sys.game.config

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, 0, +width * value, +height)
    })

    this.load.image('title', 'assets/images/dungeon-spire.png')
    this.load.spritesheet('tilemap', 'assets/images/tilemap.png', {
      frameWidth: 8,
      frameHeight: 8,
    })

    this.load.bitmapFont(
      'pixel-dan',
      'assets/pixel-dan.png',
      'assets/pixel-dan.xml',
    )

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Menu')
    })
  }
}
