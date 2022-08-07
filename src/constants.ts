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
  SMALL_SLIME: {
    damage: 1,
    health: 2,
    speed: 2000,
  },
  DUCK: {
    damage: 1,
    health: 4,
    speed: 1000,
  },
  DEER: {
    damage: 1,
    health: 10,
    speed: 800,
  },
  BIG_SLIME: {
    damage: 1,
    health: 20,
    speed: 3000,
  },
  MAN: {
    damage: 1,
    health: 30,
    speed: 1000,
  },
}

export const LEVEL_TYPES = {
  ONE: {
    waves: [{ size: 3, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      { frame: WALL_INDEX, x: 3, y: 2 },
      { frame: EXIT_INDEX, x: 2, y: 2 },
      { frame: ENTRANCE_INDEX, x: 4, y: 2 },
    ],
  },
  TWO: {
    waves: [{ size: 3, delay: 2000, type: 'DUCK' }],
    tiles: [
      { frame: WALL_INDEX, x: 3, y: 2 },
      { frame: EXIT_INDEX, x: 2, y: 2 },
      { frame: ENTRANCE_INDEX, x: 4, y: 2 },
    ],
  },
  THREE: {
    waves: [{ size: 3, delay: 2000, type: 'DEER' }],
    tiles: [
      { frame: WALL_INDEX, x: 3, y: 2 },
      { frame: EXIT_INDEX, x: 2, y: 2 },
      { frame: ENTRANCE_INDEX, x: 4, y: 2 },
    ],
  },
  FOUR: {
    waves: [{ size: 3, delay: 2000, type: 'MAN' }],
    tiles: [
      { frame: WALL_INDEX, x: 3, y: 2 },
      { frame: EXIT_INDEX, x: 2, y: 2 },
      { frame: ENTRANCE_INDEX, x: 4, y: 2 },
    ],
  },
  FIVE: {
    waves: [{ size: 3, delay: 2000, type: 'BIG_SLIME' }],
    tiles: [
      { frame: WALL_INDEX, x: 3, y: 2 },
      { frame: EXIT_INDEX, x: 2, y: 2 },
      { frame: ENTRANCE_INDEX, x: 4, y: 2 },
    ],
  },
}

export const LEVELS = [
  LEVEL_TYPES.ONE,
  LEVEL_TYPES.TWO,
  LEVEL_TYPES.THREE,
  LEVEL_TYPES.FOUR,
  LEVEL_TYPES.FIVE,
]

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
