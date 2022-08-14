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
    waves: [{ size: 8, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [...WALL_FRAME, [O, 6, 6], [I, 1, 1]],
  },
  FOUR: {
    waves: [{ size: 10, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      ...range(0, 8).map((x) => [W, x, 0]),
      ...range(0, 8).map((x) => [W, x, 7]),
      ...range(1, 6).map((y) => [W, 7, y]),
      [O, 6, 1],
      [I, 0, 1],
    ],
  },
  FIVE: {
    waves: [{ size: 12, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [
      [O, 7, 7],
      [I, 0, 0],
    ],
    // tiles: [
    //   [O, 2, 3],
    //   [I, 4, 3],
    // ],
  },
  SIX: {
    waves: [{ size: 8, delay: 1000, type: 'DEER' }],
    tiles: [
      [O, 7, 7],
      [I, 0, 0],
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
]
