import { IGameScene } from '~/scenes/Game'

export class WallMarker extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.setFrame(7)
    this.scene.add.existing(this)
    this.setAlpha(0.5)
    this.setOrigin(0)
  }
}
