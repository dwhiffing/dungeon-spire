import { IGameScene } from '~/scenes/Game'
import { Enemy } from '../sprites/Enemy'
import LevelService from './level'

export default class EnemyService {
  scene: IGameScene
  group: Phaser.GameObjects.Group
  level: LevelService

  constructor(scene: IGameScene) {
    this.scene = scene
    this.group = this.scene.add.group()
    this.level = scene.level!
    this.group.createMultiple({
      frameQuantity: 5,
      key: 'enemy',
      active: false,
      visible: false,
      classType: Enemy,
    })
    this.group.children.entries.forEach((c) => {
      const body = c.body as Phaser.Physics.Arcade.Body
      body.reset(-9, 10)
    })
  }

  spawn(entrance?: { x: number; y: number }) {
    if (!entrance) return
    let enemy = this.group.getFirstDead(false)
    if (enemy) {
      enemy.spawn(entrance.x * 8, entrance.y * 8, 'ONE')
      enemy.followPath(this.level.path)
    }
  }

  repath = (exit?: { x: number; y: number }) => {
    if (!exit) return
    const enemies = this.group.children.entries as Enemy[]
    enemies.forEach((child) => {
      if (!child.active) return
      const x = Math.round(child.x / 8)
      const y = Math.round(child.y / 8)
      this.level.findPath({ x, y }, exit).then((path) => child.followPath(path))
    })
  }
  update() {}
}
