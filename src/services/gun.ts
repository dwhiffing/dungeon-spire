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
      frameQuantity: 100,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    })
    this.gunGroup.createMultiple({
      frameQuantity: 20,
      key: 'gun',
      active: false,
      visible: false,
      classType: Gun,
    })
  }

  createGun(x, y, type) {
    const gun: Gun = this.gunGroup.getFirstDead(false)
    gun?.spawn(x, y, type)
  }

  clear() {
    const guns = this.gunGroup.children.entries as Gun[]
    guns.forEach((child) => child.kill())
  }
}
