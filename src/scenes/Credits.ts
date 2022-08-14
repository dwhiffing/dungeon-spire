export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' })
  }

  nextButton: any
  prevButton: any
  pageIndex: any
  pageText: any

  create() {
    const { width, height } = this.cameras.main

    this.nextButton = this.add
      .image(width / 2 + 4, height - 10, 'tilemap', 56)
      .setInteractive()
      .on('pointerdown', this.nextPage)

    this.prevButton = this.add
      .image(width / 2 - 4, height - 10, 'tilemap', 56)
      .setInteractive()
      .setFlipX(true)
      .on('pointerdown', this.prevPage)

    this.pageIndex = -1
    this.nextPage()
  }

  prevPage = () => {
    this.pageIndex--
    if (this.pageIndex < 0) {
      this.pageIndex = 0
    }
    this.loadPage()
  }

  nextPage = () => {
    this.pageIndex++
    if (this.pageIndex > PAGES.length - 1) {
      this.cameras.main.fadeOut(1000, 0, 0, 0)
      return this.time.delayedCall(1000, () =>
        this.scene.start('Game', { level: 1 }),
      )
    }
    this.loadPage()
  }

  loadPage = () => {
    this.prevButton.setAlpha(this.pageIndex > 0 ? 1 : 0)
    this.pageText?.destroy()
    this.pageText = this.add
      .bitmapText(3, 6, 'pixel-dan', PAGES[this.pageIndex].toUpperCase())
      .setFontSize(5)
  }

  update() {}
}

const PAGES = [
  'Monsters are \nattacking your \ndungeon\nbuild mazes to\nstop them',
  'if you fail\nthey damage you\nand come back\nnext wave',
  'you can play\n3 cards per wave\n\npress during\nfight for fast\n mode',
  'blue tiles will\nadd armor so\nyou take less\ndamage each wave',
  'press space to\nrotate pieces\n\nlast as long\nas you can',
  'GAME BY\nDANIEL WHIFFING\n\nMUSIC BY\nPURPLE PLANET',
]
