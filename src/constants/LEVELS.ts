const ENTRANCE_INDEX = 32
const EXIT_INDEX = 33
const WALL_INDEX = 16
const PLAYER_WALL_INDEX = 18
const LAVA_INDEX = 20
const W = WALL_INDEX
const P = PLAYER_WALL_INDEX
const I = ENTRANCE_INDEX
const O = EXIT_INDEX
const L = LAVA_INDEX
const range = (startAt = 0, size) =>
  [...Array(size).keys()].map((i) => i + startAt)

const WALL_FRAME = [
  ...range(0, 8).map((x) => [W, x, 0]),
  ...range(0, 8).map((x) => [W, x, 7]),
  ...range(1, 6).map((y) => [W, 0, y]),
  ...range(1, 6).map((y) => [W, 7, y]),
]

const LEVEL_TYPES = {
  ONE: {
    waves: [{ size: 4, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      ...WALL_FRAME,
      ...range(0, 8).map((x) => [W, x, 1]),
      ...range(0, 8).map((x) => [W, x, 6]),
      ...range(2, 5).map((y) => [W, 6, y]),
      [P, 2, 3],
      [P, 2, 4],
      [P, 4, 3],
      [P, 4, 4],
      [L, 3, 2],
      [L, 3, 3],
      [L, 3, 4],
      [L, 3, 5],
      [O, 5, 5],
      [I, 1, 2],
    ],
  },
  TWO: {
    waves: [{ size: 4, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      ...WALL_FRAME,
      ...range(0, 8).map((x) => [W, x, 1]),
      [P, 2, 2],
      [P, 2, 3],
      [P, 2, 4],
      [P, 4, 4],
      [P, 4, 5],
      [P, 4, 6],
      [L, 4, 2],
      [L, 2, 6],
      [O, 6, 6],
      [I, 1, 2],
    ],
  },
  THREE: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      ...WALL_FRAME,
      [L, 6, 1],
      [P, 4, 2],
      [P, 5, 2],
      [P, 3, 4],
      [P, 5, 4],
      [P, 6, 4],
      [L, 2, 4],
      [L, 6, 3],
      [L, 1, 6],
      [O, 6, 6],
      [I, 1, 1],
    ],
  },
  FOUR: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      ...range(0, 8).map((x) => [W, x, 0]),
      ...range(0, 8).map((x) => [W, x, 7]),
      ...range(1, 6).map((y) => [W, 7, y]),
      [P, 3, 3],
      [P, 4, 3],
      [P, 5, 3],
      [P, 6, 3],
      [P, 3, 5],
      [P, 4, 5],
      [P, 5, 5],
      [L, 2, 3],
      [L, 6, 5],
      [O, 6, 1],
      [I, 0, 1],
    ],
  },
  FIVE: {
    waves: [{ size: 4, delay: 4000, type: 'DEER' }],
    tiles: [
      ...range(0, 8).map((x) => [W, x, 0]),
      ...range(0, 8).map((x) => [W, x, 7]),
      [P, 0, 2],
      [P, 1, 2],
      [P, 2, 2],
      [P, 3, 2],
      [P, 4, 5],
      [P, 5, 5],
      [P, 6, 5],
      [P, 7, 5],
      [I, 0, 1],
      [O, 7, 6],
    ],
    // tiles: [
    //   [O, 2, 3],
    //   [I, 4, 3],
    // ],
  },
  SIX: {
    waves: [{ size: 3, delay: 3000, type: 'BIG_SLIME' }],
    tiles: [
      ...range(0, 8).map((x) => [W, x, 0]),
      ...range(0, 8).map((x) => [W, x, 7]),
      [O, 7, 6],
      [I, 0, 1],
    ],
  },
  SEVEN: {
    waves: [{ size: 10, delay: 5000, type: 'DUCK' }],
    tiles: [
      ...range(0, 8).map((x) => [W, x, 0]),
      ...range(0, 8).map((x) => [W, x, 7]),
      [P, 0, 2],
      [P, 1, 2],
      [P, 2, 2],
      [P, 4, 5],
      [P, 6, 2],
      [P, 2, 4],
      [P, 5, 5],
      [P, 7, 5],
      [L, 3, 2],
      [L, 4, 2],
      [L, 5, 2],
      [L, 3, 3],
      [L, 4, 3],
      [L, 5, 3],
      [L, 3, 4],
      [L, 4, 4],
      [L, 5, 4],
      [O, 7, 6],
      [I, 0, 1],
    ],
  },
}

export const LEVELS = [
  LEVEL_TYPES.ONE,
  LEVEL_TYPES.TWO,
  LEVEL_TYPES.THREE,
  LEVEL_TYPES.FOUR,
  LEVEL_TYPES.FIVE,
  LEVEL_TYPES.SIX,
  LEVEL_TYPES.SEVEN,
]
