import { IGameScene } from '~/types'
import { GUN_STATS } from '../constants'

export class Gun extends Phaser.Physics.Arcade.Sprite {
  scene: IGameScene
  stats: any
  target: any
  rangeCircle: Phaser.GameObjects.Arc
  barrel: Phaser.GameObjects.Rectangle

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.stats = {}
    this.setFrame(17).setOrigin(0).setAlpha(0.2).setInteractive().setDepth(1)
    this.rangeCircle = this.scene.add.circle(10, 10, 0)
    this.barrel = this.scene.add
      .rectangle(0, 0, 2, 4, 0x766962)
      .setAlpha(0)
      .setOrigin(0.5, 1)
    this.rangeCircle.setStrokeStyle(1, 0xffffff, 1)
    this.rangeCircle.setAlpha(0)
    this.on('pointerover', () => this.showRange())
    this.on('pointerout', () => this.hideRange())

    this.scene.add.existing(this)
    this.scene.time.addEvent({
      callback: () => this.shoot(this.x, this.y),
      delay: 500,
    })
    this.scene.time.addEvent({
      callback: () => this.checkTargets(this.x, this.y),
      delay: 100,
      repeat: -1,
    })
  }

  checkTargets(x: number, y: number) {
    if (!this.active) return
    // let sorter= (a, b) => b.health - a.health
    let sorter = (a, b) => b.progress - a.progress
    if (this.stats.slow)
      sorter = (a, b) => b.timeline?.timeScale || 0 - a.timeline?.timeScale || 0
    const enemies = this.scene.enemies?.group
      .getMatching('active', true)
      .map((e) => ({
        ...e,
        dist: Phaser.Math.Distance.Between(e.x + 4, e.y + 4, this.x, this.y),
      }))
      .filter((e) => e.dist < this.stats.range)
      .sort(sorter)

    this.target = enemies?.[0]
    if (this.target) {
      this.pointAt(x, y, this.target.x + 4, this.target.y + 4)
    }
  }

  shoot(x: number, y: number) {
    this.scene.time.addEvent({
      callback: () => this.shoot(this.x, this.y),
      delay: this.stats.fireRate || 500,
    })
    if (!this.active) return
    const bullet = this.scene.guns?.bulletGroup.getFirstDead(false)
    if (this.target && bullet) {
      this.scene.sound.play('shoot', { rate: 1, volume: 0.33 })
      bullet.shoot(this.stats, x, y, this.target.x + 4, this.target.y + 4)
    }
  }

  pointAt = (x1, y1, x2, y2) => {
    const radAngle = Phaser.Math.Angle.Between(x1, y1, x2, y2)
    const angle = Phaser.Math.Angle.WrapDegrees(radAngle * (180 / Math.PI) + 90)
    this.barrel.setAngle(angle)
  }

  spawn(x: number, y: number, type) {
    this.rangeCircle.setPosition(x + 4, y + 4)
    this.barrel.setPosition(x + 4, y + 4).setAlpha(1)
    const stats = GUN_STATS[type]
    this.stats = stats
    stats.range = stats.range || 30
    this.rangeCircle.radius = stats.range
    this.barrel.setFillStyle(this.stats.barrelTint)
    this.setActive(true)
    this.setVisible(true)
    this.setPosition(x + 4, y + 4)
  }

  showRange = () => {
    this.rangeCircle.setAlpha(1)
  }

  hideRange = () => {
    this.rangeCircle.setAlpha(0)
  }

  kill() {
    this.setActive(false)
    this.setAlpha(0.2)
    this.rangeCircle.setAlpha(0)
    this.barrel.setAlpha(0)
    this.rangeCircle.setPosition(-10, -10)
    this.barrel.setPosition(-10, -10)
    this.setPosition(-10, -10)
  }
}
