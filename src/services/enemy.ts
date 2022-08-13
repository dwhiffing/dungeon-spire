import { IGameScene, Wave } from '~/types'
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
      frameQuantity: 20,
      key: 'enemy',
      active: false,
      visible: false,
      classType: Enemy,
    })
    this.createAnim('SMALL_SLIME', 0, 1, 4)
    this.createAnim('BIG_SLIME', 2, 3, 4)
    this.createAnim('DEER', 4, 5, 4)
    this.createAnim('DUCK', 6, 7, 4)
    this.createAnim('MAN', 8, 9, 4)
  }

  async spawn(wave: Wave) {
    const start = this.scene.level?.findEntrance()
    if (!start) return

    let toSpawn = this.getSurvivingEnemies()
    if (toSpawn.length === 0) {
      toSpawn = this.group.getMatching('active', false).slice(0, wave.size)
    }

    this.remainingSpawnCount = toSpawn.length
    for (let i = 0; i < toSpawn.length; i++) {
      this.scene.time.addEvent({
        delay: wave.delay * i,
        callback: () => {
          toSpawn[i]?.spawn(
            start.x * 8,
            start.y * 8,
            wave.type,
            this.level.path,
          )
          this.remainingSpawnCount--
        },
      })
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

  getSurvivingEnemies = () =>
    (this.group.children.entries as Enemy[]).filter((c) => c.health > 0)

  createAnim = (key, start, end, rate) => {
    this.scene.anims.create({
      key: `${key}-walk`,
      repeat: -1,
      frameRate: rate,
      frames: this.scene.anims.generateFrameNumbers('tilemap', {
        start,
        end,
      }),
    })
  }
}
