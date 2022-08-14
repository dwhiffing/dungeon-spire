import { IGameScene } from '~/types'
import { GUN_STATS } from '../constants'

export class Gun extends Phaser.Physics.Arcade.Sprite {
  scene: IGameScene
  stats: any
  rangeCircle: Phaser.GameObjects.Arc

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.stats = {}
    this.setFrame(17).setOrigin(0).setAlpha(0.2).setInteractive().setDepth(1)
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

    // TODO: allow gun to change aiming style

    // let sorter= (a, b) => b.health - a.health
    let sorter = (a, b) => b.progress - a.progress
    if (this.stats.slow)
      sorter = (a, b) => b.timeline.timeScale - a.timeline.timeScale
    const enemies = this.scene.enemies?.group
      .getMatching('active', true)
      .map((e) => ({
        ...e,
        dist: Phaser.Math.Distance.Between(e.x + 4, e.y + 4, this.x, this.y),
      }))
      .filter((e) => e.dist < this.stats.range)
      .sort(sorter)

    const enemy = enemies?.[0]
    if (enemy && bullet) {
      this.scene.sound.play('shoot', { rate: 1, volume: 0.33 })

      bullet.shoot(this.stats, x, y, enemy.x + 4, enemy.y + 4)
    }
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
