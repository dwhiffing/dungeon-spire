import { IGameScene } from '~/scenes/Game'

export class WallMarker extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: IGameScene, x: number, y: number) {
    super(scene, x, y, 'tilemap')
    this.scene.add.existing(this)
    this.setFrame(20).setAlpha(0.5).setOrigin(0)
  }
}
