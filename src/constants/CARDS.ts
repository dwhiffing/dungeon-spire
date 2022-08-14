export const BASIC_DECK = [
  { key: 'DOT', label: 'TILE' },
  { key: 'DOT', label: 'TILE' },
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
  ONE: [{ key: 'GUN1', label: 'GUN' }],
  TWO: [{ key: 'LINE', label: 'TILE' }],
  THREE: [{ key: 'CORNER', label: 'TILE' }],
  FOUR: [
    { key: 'LINE', label: 'TILE' },
    { key: 'SMALL_LINE', label: 'TILE' },
    { key: 'DOT', label: 'TILE' },
  ],
  FIVE: [{ key: 'GUN2', label: 'GUN' }],
}
