export const BASIC_DECK = [
  { key: 'DOT', label: 'TILE' },
  { key: 'DOT', label: 'TILE' },
  { key: 'CORNER', label: 'TILE' },
  { key: 'LINE', label: 'TILE' },
  { key: 'GUN1', label: 'GUN' },
]

export const SHAPE_CARDS = [
  { key: 'DOT', label: 'TILE' },
  { key: 'SMALL_LINE', label: 'TILE' },
  { key: 'LINE', label: 'TILE' },
  { key: 'CORNER', label: 'TILE' },
]

export const GUN_CARDS = [
  { key: 'GUN1', label: 'GUN' },
  // { key: 'GUN2', label: 'GUN' },
  // { key: 'GUN3', label: 'GUN' },
]

export const CARD_TIERS = {
  ONE: [{ key: 'CORNER', label: 'TILE' }],
  TWO: [{ key: 'LINE', label: 'TILE' }],
  THREE: [
    { key: 'LINE', label: 'TILE' },
    { key: 'SMALL_LINE', label: 'TILE' },
    { key: 'CORNER', label: 'TILE' },
  ],
  FOUR: [{ key: 'GUN1', label: 'GUN' }],
  FIVE: [
    { key: 'LINE', label: 'TILE' },
    { key: 'SMALL_LINE', label: 'TILE' },
    { key: 'GUN1', label: 'TILE' },
  ],
}
