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

    this.load.audio('menu-music', 'assets/audio/menu-music.mp3')
    this.load.audio('game-music-0', 'assets/audio/game-music-0.mp3')
    this.load.image('particle', 'assets/images/spark.png')
    // this.load.audio('game-music-1', 'assets/audio/game-music-1.mp3')
    this.load.audio('menu1', 'assets/audio/menu1.wav')
    this.load.audio('menu2', 'assets/audio/menu2.wav')
    this.load.audio('menu3', 'assets/audio/menu3.wav')
    this.load.audio('menu4', 'assets/audio/menu4.wav')
    this.load.audio('menu5', 'assets/audio/menu5.wav')
    this.load.audio('shoot', 'assets/audio/shoot.wav')
    this.load.audio('place', 'assets/audio/place.wav')
    this.load.audio('slime-spawn', 'assets/audio/slime-spawn.wav')
    this.load.audio('slime-dead', 'assets/audio/slime-dead.wav')
    this.load.audio('enemy-hit', 'assets/audio/enemy-hit.wav')
    this.load.audio('enemy-won', 'assets/audio/enemy-won.wav')
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
