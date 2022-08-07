import { Wave } from '../constants'
import { IGameScene } from '~/scenes/Game'
import { Enemy } from '../sprites/Enemy'
import LevelService from './level'

export default class EnemyService {
  scene: IGameScene
  group: Phaser.GameObjects.Group
  level: LevelService
  remainingSpawnCount: number

  constructor(scene: IGameScene) {
    this.scene = scene
    this.group = this.scene.add.group()
    this.level = scene.level!
    this.remainingSpawnCount = 0
    this.group.createMultiple({
      frameQuantity: 5,
      key: 'enemy',
      active: false,
      visible: false,
      classType: Enemy,
    })
  }

  async spawn(wave: Wave) {
    const start = this.scene.level?.findEntrance()
    this.remainingSpawnCount = wave.size
    if (!start) return
    for (let i = 0; i < wave.size; i++) {
      const enemy = this.group.getFirstDead(false)
      enemy?.spawn(start.x * 8, start.y * 8, 'ONE', this.level.path)
      this.remainingSpawnCount--
      await new Promise((r) => setTimeout(r, wave.delay))
    }
  }

  repath = (exit?: { x: number; y: number }) => {
    if (!exit) return
    const enemies = this.group.children.entries as Enemy[]
    enemies.forEach((child) => {
      if (!child.active) return
      const x = Math.round(child.x / 8)
      const y = Math.round(child.y / 8)
      this.level.findPath({ x, y }, exit).then((path) => {
        if (path) child.followPath(path)
      })
    })
  }
}
