import { IGameScene } from '~/types'

export default class InputService {
  scene: IGameScene
  direction: Record<string, boolean>
  events: Record<string, any>
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  spaceKey?: Phaser.Input.Keyboard.Key
  zKey?: Phaser.Input.Keyboard.Key
  xKey?: Phaser.Input.Keyboard.Key
  cKey?: Phaser.Input.Keyboard.Key
  mKey?: Phaser.Input.Keyboard.Key

  constructor(scene: IGameScene) {
    this.scene = scene
    this.direction = {}
    const noop = () => {}
    this.events = {
      leftPressed: () => (this.direction.left = true),
      leftReleased: () => (this.direction.left = false),
      rightPressed: () => (this.direction.right = true),
      rightReleased: () => (this.direction.right = false),
      upPressed: () => (this.direction.up = true),
      upReleased: () => (this.direction.up = false),
      downPressed: () => (this.direction.down = true),
      downReleased: () => (this.direction.down = false),
      zPressed: () => {
        this.scene.rotateTile()
      },
      xPressed: () => {},
      cPressed: () => {},
      mPressed: () => (this.scene.sound.mute = !this.scene.sound.mute),
      spacePressed: () => {
        this.scene.tweens.timeScale = 4
        this.scene.time.timeScale = 4
        // this.scene.sound.setRate(1.5)
        this.scene.physics.world.timeScale = 1 / 4
      },
      spaceReleased: () => {
        this.scene.tweens.timeScale = 1
        this.scene.time.timeScale = 1
        // this.scene.sound.setRate(1)
        this.scene.physics.world.timeScale = 1
      },
    }

    // @ts-ignore
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // this.addTouchControls()
    } else {
      this.scene.input.on('pointerdown', this.scene.placeTile)
      this.cursors = this.scene.input.keyboard.createCursorKeys()
      this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
      this.zKey = this.scene.input.keyboard.addKey('Z')
      this.xKey = this.scene.input.keyboard.addKey('X')
      this.cKey = this.scene.input.keyboard.addKey('C')
      this.mKey = this.scene.input.keyboard.addKey('M')

      this.cursors.up.addListener('down', this.events.upPressed || noop)
      this.cursors.up.addListener('up', this.events.upReleased || noop)
      this.cursors.left.addListener('down', this.events.leftPressed || noop)
      this.cursors.left.addListener('up', this.events.leftReleased || noop)
      this.cursors.right.addListener('down', this.events.rightPressed || noop)
      this.cursors.right.addListener('up', this.events.rightReleased || noop)
      this.cursors.down.addListener('down', this.events.downPressed || noop)
      this.cursors.down.addListener('up', this.events.downReleased || noop)
      this.zKey.addListener('down', this.events.zPressed || noop)
      this.zKey.addListener('up', this.events.zReleased || noop)
      this.xKey.addListener('down', this.events.xPressed || noop)
      this.cKey.addListener('down', this.events.cPressed || noop)
      this.mKey.addListener('down', this.events.mPressed || noop)
      this.spaceKey.addListener('down', this.events.spacePressed || noop)
      this.spaceKey.addListener('up', this.events.spaceReleased || noop)
    }
  }

  addTouchControls() {
    const { height, width } = this.scene.cameras.main
    const X = 25
    const Y = 20
    const H = height - Y

    this.makeButton(X, height - Y, 216, 'left')
    this.makeButton(X * 1.8, H * 1.6, 213, 'up')
    this.makeButton(X * 1.8, H + Y * 0.6, 215, 'down')
    this.makeButton(X * 2.6, H, 214, 'right')
    this.makeButton(width - X, H, 217, 'jump')
    this.makeButton(width - X * 2, H, 218, 'shoot')
  }

  makeButton = (x: number, y: number, key: number, type: string) => {
    const noop = () => {}
    return this.scene.add
      .image(x, y, 'tilemap', key)
      .setScale(1)
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.6)
      .on('pointerdown', this.events[`${type}Pressed`] || noop)
      .on('pointerup', this.events[`${type}Released`] || noop)
      .on('pointerout', this.events[`${type}Released`] || noop)
  }

  cleanup = () => {
    this.cursors?.up.removeListener('down')
    this.cursors?.left.removeListener('down')
    this.cursors?.right.removeListener('down')
    this.cursors?.down.removeListener('down')
    this.zKey?.removeListener('down')
    this.spaceKey?.removeListener('down')
    this.cursors?.down.removeListener('up')
    this.cursors?.up.removeListener('up')
    this.cursors?.left.removeListener('up')
    this.cursors?.right.removeListener('up')
  }
}
