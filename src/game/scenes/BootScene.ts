import { Scene } from 'phaser'


export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', require('@/game/assets/sky.png'))
    this.load.image('bomb', require('@/game/assets/bomb.png'))
    this.load.audio('thud', [require('@/game/assets/thud.mp3'), require('@/game/assets/thud.ogg')])
  }

  create () {
    this.scene.start('PlayScene')
  }
}
