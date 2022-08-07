import { IGameScene } from '~/scenes/Game'
import EnemyService from '~/services/enemy'
import GunService from '~/services/gun'

export class Gun extends Phaser.Physics.Arcade.Sprite {
  scene: IGameScene
  bulletType: string

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.bulletType = 'ONE'
    this.setFrame(20).setOrigin(0).setAlpha(0)
    this.scene.add.existing(this)
    this.scene.time.addEvent({
      callback: () => this.shoot(this.x, this.y),
      repeat: -1,
      delay: 500,
    })
  }

  shoot(x: number, y: number) {
    if (!this.active) return
    const bullet = this.scene.guns?.bulletGroup.getFirstDead(false)
    const enemy = this.scene.enemies?.group.getFirstAlive()
    if (enemy)
      bullet?.shoot(this.bulletType, x + 8, y + 8, enemy.x + 8, enemy.y + 8)
  }

  spawn(x: number, y: number) {
    this.setActive(true)
    this.setAlpha(1)
    this.setPosition(x, y)
  }

  kill() {
    this.setActive(false)
    this.setAlpha(0)
    this.setPosition(-10, -10)
  }
}
