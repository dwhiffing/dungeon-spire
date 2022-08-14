import { ENEMIES } from '../constants'
import { HealthBar } from './HealthBar'
import { IGameScene, Path } from '~/types'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  timeline?: Phaser.Tweens.Timeline
  slowTween?: Phaser.Tweens.Tween
  tintTween?: Phaser.Tweens.Tween
  emitter?: Phaser.GameObjects.Particles.ParticleEmitter
  health: number
  maxHealth: number
  speed: number
  damageAmount: number
  flying: boolean
  progress: number
  coord?: { x: number; y: number }
  scene: IGameScene
  healthBar: HealthBar

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(3, 3)
      .setActive(false)
      .setOffset(3, 3)
      .setDepth(8)
      .setPipeline('Light2D')

    this.emitter = this.scene.particles
      ?.createEmitter({
        speed: { min: -20, max: 20 },
        angle: { min: 0, max: 360 },
        alpha: { start: 1, end: 0 },
        lifespan: { max: 700, min: 200 },
      })
      .stop()

    this.health = 0
    this.maxHealth = 0
    this.flying = false
    this.progress = 0
    this.speed = 0
    this.damageAmount = 0
    this.healthBar = new HealthBar(scene)
    this.healthBar.container.setDepth(8)
    this.scene.time.addEvent({
      delay: 500,
      repeat: -1,
      callback: this.updateProgress,
    })
    this.body.reset(-9, 10)
    this.flipX = true
  }

  updateProgress = () => {
    if (!this.active) return

    const coord = { x: Math.round(this.x / 8), y: Math.round(this.y / 8) }
    if (coord.x === this.coord?.x && coord.y === this.coord?.y) return

    this.coord = coord
    const path = this.scene.level?.path
    const lava = this.scene.level?.lavaTiles || []
    if (lava.some((t) => t.x === coord.x && t.y === coord.y) && !this.flying) {
      this.damage(1, true)
    }

    const index =
      path?.findIndex((c) => c.x === coord.x && c.y === coord.y) || 0
    const length = path?.length || 1

    this.progress = index / length
  }

  getSlowed() {
    if (!this.timeline) return
    this.slowTween?.stop()

    this.timeline.timeScale = 0.1
    this.slowTween = this.scene.tweens.add({
      targets: [this.timeline],
      ease: Phaser.Math.Easing.Quadratic.Out,
      timeScale: 1,
      duration: 4000,
    })

    this.tweenTint('#0000ff', '#ffffff', 4000)
  }

  tweenTint = (fromColor: string, toColor: string, duration: number) => {
    this.tintTween?.stop()
    this.tintTween = this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      onUpdate: (tween) => {
        const _fromColor = Phaser.Display.Color.HexStringToColor(fromColor)
        const _toColor = Phaser.Display.Color.HexStringToColor(toColor)
        const { ColorWithColor } = Phaser.Display.Color.Interpolate
        const tint = ColorWithColor(_fromColor, _toColor, 100, tween.getValue())
        this.setTint(Phaser.Display.Color.ObjectToColor(tint).color)
      },
      duration,
    })
  }

  damage(amount: number, isLava: boolean = false) {
    this.tweenTint('#ff0000', '#ffffff', 500)

    this.health -= amount
    this.healthBar.update(this.health)
    if (this.health <= 0) {
      this.scene.sound.play('slime-dead', { volume: 0.5 })
      this.emitter?.setTint(0xff0000)
      this.emitter?.explode(25, this.x + 4, this.y + 4)
      this.kill()
    } else {
      this.scene.sound.play('enemy-hit', { volume: 0.8 })
      this.emitter?.setTint(isLava ? 0xffff00 : 0xa6bfb3)
      this.emitter?.explode(5, this.x + 4, this.y + 4)
    }
  }

  spawn(x: number, y: number, type: string, path: Path) {
    this.setActive(true).setVisible(true).setOrigin(0, 0)
    this.body.reset(x, y)
    this.scene.sound.play('slime-spawn', { rate: 4, volume: 0.4 })
    if (this.health === 0) {
      const data = ENEMIES[type]
      this.health = data.health
      this.maxHealth = data.health
      this.speed = data.speed
      this.flying = data.flying || false
      this.damageAmount = data.damage
    }
    this.healthBar.update(this.health, this.maxHealth)
    this.healthBar.container.setPosition(this.x, this.y)
    if (path) this.followPath(path)
    this.play(type + '-walk')
    this.setDepth(7)
  }

  _kill = () => {
    this.setActive(false).setVisible(false)
    this.timeline?.stop()
    this.body.reset(-9, 10)
    this.healthBar.container.setAlpha(0)
  }

  kill = () => {
    this._kill()
    this.health = 0
    this.scene.events.emit('enemy-killed')
  }

  win = () => {
    this.scene.sound.play('enemy-won', { volume: 0.5 })
    this.scene.cameras.main.shake(200, 0.03)
    this._kill()
    this.scene.events.emit('enemy-won', this)
  }

  followPath = (path: Path) => {
    if (!path || !this.active) return

    this.timeline?.stop()
    this.scene.time.delayedCall(100, () => {
      this.timeline = this.scene.tweens.createTimeline()
      this.healthBar.container.setPosition(this.x, this.y)
      path.slice(1).forEach(({ x, y }) => {
        this.timeline?.add({
          targets: [this, this.healthBar.container],
          x: x * 8,
          y: y * 8,
          duration: this.speed,

          onStart: () => {
            this.flipX = this.x > x * 8
          },
        })
      })

      this.timeline.on('complete', this.win)
      this.timeline.play()
    })
  }
}
