import { GUN_STATS } from '../constants'
import { IGameScene } from '~/scenes/Game'

export class Gun extends Phaser.Physics.Arcade.Sprite {
  scene: IGameScene
  stats: any
  rangeCircle: Phaser.GameObjects.Arc

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.stats = {}
    this.setFrame(17).setOrigin(1).setAlpha(0.2).setInteractive().setDepth(1)
    this.rangeCircle = this.scene.add.circle(10, 10, 0)
    this.rangeCircle.setStrokeStyle(1, 0xffffff, 1)
    this.rangeCircle.setAlpha(0)
    this.on('pointerover', () => this.showRange())
    this.on('pointerout', () => this.hideRange())

    this.scene.add.existing(this)
    this.scene.time.addEvent({
      callback: () => this.shoot(this.x, this.y),
      delay: 500,
    })
  }

  shoot(x: number, y: number) {
    this.scene.time.addEvent({
      callback: () => this.shoot(this.x, this.y),
      delay: this.stats.fireRate || 500,
    })
    if (!this.active) return
    const bullet = this.scene.guns?.bulletGroup.getFirstDead(false)

    const enemies = this.scene.enemies?.group
      .getMatching('active', true)
      .map((e) => ({
        ...e,
        dist: Phaser.Math.Distance.BetweenPoints(e, this),
      }))
      .filter((e) => e.dist < this.stats.range)
      .sort((a, b) => b.progress - a.progress)
    const enemy = enemies?.[0]
    if (enemy) bullet?.shoot(this.stats, x, y, enemy.x + 4, enemy.y + 4)
  }

  spawn(x: number, y: number, type) {
    this.rangeCircle.setPosition(x + 4, y + 4)
    const stats = GUN_STATS[type]
    this.stats = stats
    stats.range = stats.range || 30
    this.rangeCircle.radius = stats.range
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
    this.setPosition(-10, -10)
  }
}
