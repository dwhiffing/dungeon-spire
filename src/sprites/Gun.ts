export class Gun extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.setFrame(7)
    this.scene.add.existing(this)
    this.scene.time.addEvent({
      callback: () => this.shoot(x, y),
      repeat: -1,
      delay: 500,
    })
    this.setOrigin(0)
  }

  shoot(x, y) {
    let bullet = this.scene.guns.bulletGroup.getFirstDead(false)
    if (bullet) {
      const enemy = this.scene.enemies.group.getFirstAlive()
      if (enemy) bullet.shoot(x + 4, y + 4, enemy.x + 4, enemy.y + 4)
    }
  }
}
