import { IGameScene } from '~/scenes/Game'
import { Bullet } from '../sprites/Bullet'
import { Gun } from '../sprites/Gun'

export default class GunService {
  scene: IGameScene
  bulletGroup: Phaser.GameObjects.Group
  gunGroup: Phaser.GameObjects.Group

  constructor(scene: IGameScene) {
    this.scene = scene
    this.bulletGroup = this.scene.add.group()
    this.gunGroup = this.scene.add.group()
    this.bulletGroup.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    })
    this.bulletGroup.children.entries.forEach((c) => {
      const body = c.body as Phaser.Physics.Arcade.Body
      body.reset(-9, -9)
    })
  }

  createGun(x, y) {
    const gun = new Gun(this.scene, x, y)
    this.gunGroup.add(gun)
  }

  update() {}
}
