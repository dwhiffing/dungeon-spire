import { TIME_SPEED_FACTOR } from '../constants'
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
      mPressed: () => (this.scene.sound.mute = !this.scene.sound.mute),
      spacePressed: () => this.scene.rotateTile(),
    }

    this.scene.input.on('pointerdown', (event) => {
      if (this.scene.data.get('mode') === 'fight') {
        this.setTimeSpeed(true)
      } else {
        this.scene.placeTile(event)
      }
    })
    this.scene.input.on('pointerup', () => {
      if (this.scene.data.get('mode') !== 'fight') return
      this.setTimeSpeed(false)
    })
    this.mKey = this.scene.input.keyboard.addKey('M')
    this.mKey.addListener('down', this.events.mPressed || noop)
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
    this.spaceKey.addListener('down', this.events.spacePressed || noop)
  }

  setTimeSpeed = (fast) => {
    this.scene.tweens.timeScale = fast ? TIME_SPEED_FACTOR : 1
    this.scene.time.timeScale = fast ? TIME_SPEED_FACTOR : 1
    this.scene.physics.world.timeScale = fast ? 1 / TIME_SPEED_FACTOR : 1
  }

  cleanup = () => {
    this.mKey?.removeListener('down')
    this.spaceKey?.removeListener('down')
  }
}
