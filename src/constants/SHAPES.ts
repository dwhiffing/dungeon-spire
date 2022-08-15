export const SHAPES = {
  LINE: [
    [-1, 1, -1, -1, 1, -1, -1, 1, -1],
    [-1, -1, -1, 1, 1, 1, -1, -1, -1],
  ],
  TEE: [
    [-1, -1, -1, 1, 1, 1, -1, 1, -1],
    [-1, 1, -1, 1, 1, -1, -1, 1, -1],
    [-1, 1, -1, 1, 1, 1, -1, -1, -1],
    [-1, 1, -1, -1, 1, 1, -1, 1, -1],
  ],
  ELL: [
    [-1, 1, -1, -1, 1, -1, 1, 1, -1],
    [1, -1, -1, 1, 1, 1, -1, -1, -1],
    [-1, 1, 1, -1, 1, -1, -1, 1, -1],
    [-1, -1, -1, 1, 1, 1, -1, -1, 1],
  ],
  JAY: [
    [1, -1, -1, 1, 1, 1, -1, -1, -1],
    [-1, 1, 1, -1, 1, -1, -1, 1, -1],
    [-1, -1, -1, 1, 1, 1, -1, -1, 1],
    [-1, 1, -1, -1, 1, -1, 1, 1, -1],
  ],
  DOT: [[-1, -1, -1, -1, 1, -1, -1, -1, -1]],
  SMALL_LINE: [
    [-1, -1, -1, -1, 1, -1, -1, 1, -1],
    [-1, -1, -1, 1, 1, -1, -1, -1, -1],
    [-1, 1, -1, -1, 1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 1, 1, -1, -1, -1],
  ],
  CORNER: [
    [-1, 1, -1, 1, 1, -1, -1, -1, -1],
    [-1, 1, -1, -1, 1, 1, -1, -1, -1],
    [-1, -1, -1, -1, 1, 1, -1, 1, -1],
    [-1, -1, -1, 1, 1, -1, -1, 1, -1],
  ],
  CROSS: [[-1, 1, -1, 1, 1, 1, -1, 1, -1]],
  ARMOR_2: [
    [-1, -1, -1, -1, 3, -1, -1, 3, -1],
    [-1, -1, -1, 3, 3, -1, -1, -1, -1],
    [-1, 3, -1, -1, 3, -1, -1, -1, -1],
    [-1, -1, -1, -1, 3, 3, -1, -1, -1],
  ],
  ARMOR_3: [
    [-1, 3, -1, 3, 3, -1, -1, -1, -1],
    [-1, 3, -1, -1, 3, 3, -1, -1, -1],
    [-1, -1, -1, -1, 3, 3, -1, 3, -1],
    [-1, -1, -1, 3, 3, -1, -1, 3, -1],
  ],
  ARMOR_5: [[-1, 3, -1, 3, 3, 3, -1, 3, -1]],
  GUN_SNIPE: [[-1, 2, -1, 2, 2, 2, -1, 2, -1]],
  GUN_BASIC: [[-1, -1, -1, -1, 2, -1, -1, -1, -1]],
  GUN_SLOW: [
    [-1, -1, -1, -1, 2, -1, -1, 2, -1],
    [-1, -1, -1, 2, 2, -1, -1, -1, -1],
    [-1, 2, -1, -1, 2, -1, -1, -1, -1],
    [-1, -1, -1, -1, 2, 2, -1, -1, -1],
  ],
}
