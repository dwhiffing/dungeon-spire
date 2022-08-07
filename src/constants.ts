export const ENTRANCE_INDEX = 32
export const EXIT_INDEX = 33
export const WALL_INDEX = 16
export const GUN_INDEX = 17

export const CARD_WIDTH = 18
export const CARD_HEIGHT = 25
export const SHAPES = {
  LINE: [
    [-1, 1, -1, -1, 1, -1, -1, 1, -1],
    [-1, -1, -1, 1, 1, 1, -1, -1, -1],
  ],
  DOT: [[-1, -1, -1, -1, 1, -1, -1, -1, -1]],
  CORNER: [
    [-1, 1, -1, 1, 1, -1, -1, -1, -1],
    [-1, 1, -1, -1, 1, 1, -1, -1, -1],
    [-1, -1, -1, -1, 1, 1, -1, 1, -1],
    [-1, -1, -1, 1, 1, -1, -1, 1, -1],
  ],
}

export const GUNS = {
  GUN: [[-1, -1, -1, -1, 2, -1, -1, -1, -1]],
}

export const GUN_STATS = {
  ONE: {
    damage: 1,
  },
}

export const ENEMIES = {
  ONE: {
    damage: 1,
    health: 4,
    speed: 2000,
  },
}

export const LEVEL_TYPES = {
  ONE: {
    waves: [{ size: 3, delay: 2000, type: 'ONE' }],
    tiles: [
      { frame: WALL_INDEX, x: 3, y: 2 },
      { frame: EXIT_INDEX, x: 2, y: 2 },
      { frame: ENTRANCE_INDEX, x: 4, y: 2 },
    ],
  },
}

export const LEVELS = [LEVEL_TYPES.ONE]

export type Path = { x: number; y: number }[]

export interface LevelData {
  waves: Wave[]
  tiles: { frame: number; x: number; y: number }[]
}

export interface Wave {
  size: number
  delay: number
  type: string
}

const shapeKeys = Object.keys(SHAPES)
const shapeCards = shapeKeys.map((key) => ({ key, label: 'TILE' }))
export const SHAPE_CARDS = [...shapeCards]
export const GUN_CARDS = [
  { key: 'GUN', label: 'GUN' },
  { key: 'GUN', label: 'GUN' },
  { key: 'GUN', label: 'GUN' },
]
