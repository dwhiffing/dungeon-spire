const ENTRANCE_INDEX = 32
const EXIT_INDEX = 33
const WALL_INDEX = 16
const W = WALL_INDEX
const I = ENTRANCE_INDEX
const O = EXIT_INDEX
const range = (startAt = 0, size) =>
  [...Array(size).keys()].map((i) => i + startAt)

const WALL_FRAME = [
  ...range(0, 8).map((x) => [W, x, 0]),
  ...range(0, 8).map((x) => [W, x, 7]),
  ...range(1, 6).map((y) => [W, 0, y]),
  ...range(1, 6).map((y) => [W, 7, y]),
]

const WALL_FRAME_BIG = [
  ...WALL_FRAME,
  ...range(0, 8).map((x) => [W, x, 1]),
  ...range(0, 8).map((x) => [W, x, 6]),
  ...range(2, 5).map((y) => [W, 6, y]),
]
export const LEVEL_TYPES = {
  ONE: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [...WALL_FRAME_BIG, [O, 5, 5], [I, 1, 2]],
  },
  TWO: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [...WALL_FRAME_BIG, [O, 5, 5], [I, 1, 2]],
  },
  THREE: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [...WALL_FRAME, [O, 5, 5], [I, 1, 2]],
  },
  FOUR: {
    waves: [{ size: 6, delay: 2000, type: 'SMALL_SLIME' }],
    tiles: [...WALL_FRAME, [O, 5, 5], [I, 1, 2]],
  },
  DUCK: {
    waves: [{ size: 5, delay: 2000, type: 'DUCK' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
  DEER: {
    waves: [{ size: 7, delay: 2000, type: 'DEER' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
  MAN: {
    waves: [{ size: 9, delay: 2000, type: 'MAN' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
  SLIME: {
    waves: [{ size: 5, delay: 2000, type: 'BIG_SLIME' }],
    tiles: [
      [W, 3, 2],
      [O, 2, 2],
      [I, 4, 2],
    ],
  },
}
