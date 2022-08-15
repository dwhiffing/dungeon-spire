export const BASIC_DECK = [
  { key: 'DOT', label: 'TILE' },
  { key: 'DOT', label: 'TILE' },
]
// export const BASIC_DECK = [
//   { key: 'DOT', label: 'TILE' },
//   { key: 'CROSS', label: 'TILE' },
//   { key: 'LINE', label: 'TILE' },
//   { key: 'CORNER', label: 'TILE' },
//   { key: 'ARMOR_2', label: 'TILE' },
//   { key: 'GUN_SLOW', label: 'GUN' },
//   { key: 'GUN_SNIPE', label: 'GUN' },
// ]

export const SHAPE_CARDS = [
  { key: 'DOT', label: 'TILE' },
  { key: 'SMALL_LINE', label: 'TILE' },
  { key: 'LINE', label: 'TILE' },
  { key: 'CORNER', label: 'TILE' },
]

export const GUN_CARDS = [
  { key: 'GUN_BASIC', label: 'GUN' },
  { key: 'GUN_SLOW', label: 'GUN' },
]

export const CARD_TIERS = {
  ONE: [[{ key: 'GUN_BASIC', label: 'GUN' }]],
  TWO: [[{ key: 'LINE', label: 'TILE' }]],
  THREE: [[{ key: 'CORNER', label: 'TILE' }]],
  FOUR: [[{ key: 'GUN_SLOW', label: 'GUN' }]],
  FIVE: [[{ key: 'ARMOR_2', label: 'TILE' }]],
  SIX: [
    [
      { key: 'LINE', label: 'TILE' },
      { key: 'GUN_BASIC', label: 'GUN' },
      { key: 'ARMOR_2', label: 'TILE' },
    ],
    [
      { key: 'ELL', label: 'TILE' },
      { key: 'GUN_SLOW', label: 'GUN' },
      { key: 'ARMOR_3', label: 'TILE' },
    ],
    [
      { key: 'CROSS', label: 'TILE' },
      { key: 'GUN_SNIPE', label: 'GUN' },
      { key: 'ARMOR_5', label: 'TILE' },
    ],
    [
      { key: 'JAY', label: 'TILE' },
      { key: 'GUN_SLOW', label: 'GUN' },
      { key: 'ARMOR_2', label: 'TILE' },
    ],
    [
      { key: 'TEE', label: 'TILE' },
      { key: 'GUN_SNIPE', label: 'GUN' },
      { key: 'ARMOR_5', label: 'TILE' },
    ],
  ],
}
