export const ENTRANCE_INDEX = 32
export const EXIT_INDEX = 17
export const WALL_INDEX = 16
export const GUN_INDEX = 18

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
    health: 4,
  },
}
