import EnemyService from './services/enemy'
import GunService from './services/gun'
import HudService from './services/hud'
import InputService from './services/input'
import LevelService from './services/level'
import MarkerService from './services/marker'

export type Path = { x: number; y: number }[]

export interface LevelData {
  waves: Wave[]
  // tiles: [frame: number, x: number, y: number][]
  tiles: number[][]
}

export interface Wave {
  size: number
  delay: number
  type: string
}

export interface IGameScene extends Phaser.Scene {
  level?: LevelService
  enemies?: EnemyService
  marker?: MarkerService
  guns?: GunService
  particles?: Phaser.GameObjects.Particles.ParticleEmitterManager
  hud?: HudService
  levelData?: LevelData
  inputService?: InputService
  rotateTile: () => void
  nextWave: () => void
  doFade: (onComplete: any) => void
  placeTile: (event: any) => void
}
