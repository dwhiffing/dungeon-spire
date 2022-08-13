export const ENTRANCE_INDEX = 32
export const EXIT_INDEX = 33
export const WALL_INDEX = 16
export const GUN_INDEX = 17
export const DEFAULT_ENERGY_COUNT = 3

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
  GUN1: [[-1, -1, -1, -1, 2, -1, -1, -1, -1]],
  GUN2: [[-1, -1, -1, -1, 2, -1, -1, -1, -1]],
  GUN3: [[-1, -1, -1, -1, 2, -1, -1, -1, -1]],
}

export const GUN_STATS = {
  GUN1: {
    key: 'GUN1',
    damage: 1,
    range: 20,
    bulletSpeed: 40,
    fireRate: 1000,
    accuracy: 0,
    scale: 1,
    tint: 0xff0000,
  },
  // BUBBLES: {
  //   key: 'BUBBLES',
  //   range: 10,
  //   damage: 0.1,
  //   fireRate: 50,
  //   bulletSpeed: 10,
  //   accuracy: 10,
  // },
  GUN2: {
    key: 'GUN2',
    damage: 2,
    range: 30,
    fireRate: 500,
    bulletSpeed: 100,
    accuracy: 3,
    scale: 1,
    tint: 0x00ff00,
  },
  GUN3: {
    key: 'GUN3',
    damage: 4,
    range: 50,
    fireRate: 2000,
    bulletSpeed: 10,
    accuracy: 10,
    scale: 3,
    pierce: 1,
    tint: 0x0000ff,
  },
}

export const ENEMIES = {
  SMALL_SLIME: {
    damage: 1,
    health: 4,
    speed: 2000,
  },
  DUCK: {
    damage: 1,
    health: 8,
    speed: 1000,
  },
  DEER: {
    damage: 1,
    health: 16,
    speed: 800,
  },
  BIG_SLIME: {
    damage: 1,
    health: 32,
    speed: 3000,
  },
  MAN: {
    damage: 1,
    health: 32,
    speed: 1000,
  },
}
const W = WALL_INDEX
const I = ENTRANCE_INDEX
const O = EXIT_INDEX
const range = (startAt = 0, size) =>
  [...Array(size).keys()].map((i) => i + startAt)

const SMALL_MAP = [
  ...range(0, 8).map((x) => [W, x, 0]),
  ...range(0, 8).map((x) => [W, x, 1]),
  ...range(0, 8).map((x) => [W, x, 6]),
  ...range(0, 8).map((x) => [W, x, 7]),
  ...range(2, 5).map((y) => [W, 0, y]),
  ...range(2, 5).map((y) => [W, 7, y]),
]
export const LEVEL_TYPES = {
  ONE: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      ...SMALL_MAP,
      ...range(2, 5).map((y) => [W, 6, y]),
      [O, 5, 5],
      [I, 1, 2],
    ],
  },
  TWO: {
    waves: [{ size: 5, delay: 2000, type: 'DUCK' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
  THREE: {
    waves: [{ size: 7, delay: 2000, type: 'DEER' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
  FOUR: {
    waves: [{ size: 9, delay: 2000, type: 'MAN' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
  FIVE: {
    waves: [{ size: 5, delay: 2000, type: 'BIG_SLIME' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
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
  // tiles: [frame: number, x: number, y: number][]
  tiles: number[][]
}

export interface Wave {
  size: number
  delay: number
  type: string
}

export const SHAPE_CARDS = [
  { key: 'LINE', label: 'TILE' },
  { key: 'LINE', label: 'TILE' },
  // { key: 'CORNER', label: 'TILE' },
]
export const GUN_CARDS = [
  { key: 'GUN1', label: 'GUN' },
  // { key: 'GUN2', label: 'GUN' },
  // { key: 'GUN3', label: 'GUN' },
]
export const BASIC_DECK = [...GUN_CARDS, ...SHAPE_CARDS]
