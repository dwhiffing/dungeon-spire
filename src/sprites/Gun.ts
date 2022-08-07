import { IGameScene } from '~/scenes/Game'
import EnemyService from '~/services/enemy'
import GunService from '~/services/gun'

export class Gun extends Phaser.Physics.Arcade.Sprite {
  guns: GunService
  enemies: EnemyService
  bulletType: string

  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.guns = scene.guns!
    this.bulletType = 'ONE'
    this.enemies = scene.enemies!
    this.setFrame(7).setOrigin(0)
    this.scene.add.existing(this)
    this.scene.time.addEvent({
      callback: () => this.shoot(x, y),
      repeat: -1,
      delay: 500,
    })
  }

  shoot(x: number, y: number) {
    const bullet = this.guns.bulletGroup.getFirstDead(false)
    const enemy = this.enemies.group.getFirstAlive()
    if (enemy)
      bullet?.shoot(this.bulletType, x + 8, y + 8, enemy.x + 8, enemy.y + 8)
  }
}
