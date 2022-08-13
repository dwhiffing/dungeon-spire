import { IGameScene } from '~/scenes/Game'

export class HealthBar {
  scene: IGameScene
  container: Phaser.GameObjects.Container
  rectangle2: Phaser.GameObjects.Rectangle
  rectangle: Phaser.GameObjects.Rectangle
  health?: number
  max?: number
  width: number
  height: number

  constructor(
    scene: IGameScene,
    width: number = 4,
    height: number = 1,
    xOffset: number = 2,
    yOffset: number = -1,
    bgColor: number = 0x440000,
    color: number = 0xaa0000,
  ) {
    this.scene = scene
    this.width = width
    this.height = height

    this.rectangle = this.scene.add
      .rectangle(xOffset, yOffset, this.width, this.height, bgColor)
      .setOrigin(0)

    this.rectangle2 = this.scene.add
      .rectangle(xOffset, yOffset, this.width, this.height, color)
      .setOrigin(0)

    this.container = this.scene.add.container(0, 0, [
      this.rectangle,
      this.rectangle2,
    ])
  }

  update(health: number, max?: number) {
    this.container.setAlpha(1)
    this.health = health
    if (max) this.max = max
    this.rectangle2.setDisplaySize(
      Math.ceil((this.health / this.max!) * this.width),
      this.height,
    )
  }
}
