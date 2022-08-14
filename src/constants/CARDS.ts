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
  { key: 'GUN_BASIC', label: 'GUN' },
  { key: 'GUN_SLOW', label: 'GUN' },
]

export const CARD_TIERS = {
  ONE: [{ key: 'GUN_BASIC', label: 'GUN' }],
  TWO: [{ key: 'LINE', label: 'TILE' }],
  THREE: [{ key: 'CORNER', label: 'TILE' }],
  FOUR: [{ key: 'GUN_SLOW', label: 'GUN' }],
  FIVE: [{ key: 'ARMOR_2', label: 'TILE' }],
}
