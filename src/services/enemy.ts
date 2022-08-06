import { Enemy } from '../sprites/Enemy'

export default class EnemyService {
  scene: any
  group: any

  constructor(scene) {
    this.scene = scene
    this.group = this.scene.add.group()
    this.group.createMultiple({
      frameQuantity: 5,
      key: 'enemy',
      active: false,
      visible: false,
      classType: Enemy,
    })
    this.group.children.entries.forEach((c) => c.body.reset(-9, 10))
  }

  spawn(entrance) {
    if (!entrance) return
    let enemy = this.group.getFirstDead(false)
    if (enemy) {
      enemy.spawn(entrance.x * 8, entrance.y * 8)
      enemy.followPath(this.scene.level.path)
    }
  }

  repath = (exit) => {
    this.group.children.entries.forEach((child) => {
      if (!child.active) return
      const x = Math.round(child.x / 8)
      const y = Math.round(child.y / 8)
      this.scene.level
        .findPath({ x, y }, exit)
        .then((path) => child.followPath(path))
    })
  }
  update() {}
}
