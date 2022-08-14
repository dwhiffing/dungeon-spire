export const GUN_SHAPES = {
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
    fireRate: 2000,
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
