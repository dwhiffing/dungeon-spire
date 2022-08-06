import Phaser from 'phaser'
import * as scenes from './scenes'

const game = new Phaser.Game({
  scene: Object.values(scenes),
  // @ts-ignore
  type: navigator.userAgent.includes('Chrome') ? Phaser.WEBGL : Phaser.CANVAS,
  parent: 'phaser-example',
  width: 64,
  height: 64,
  zoom: 10,
  transparent: true,
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    arcade: { fps: 60, tileBias: 8, debug: false },
  },
})

export default game
