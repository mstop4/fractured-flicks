import {ButtonBase} from './ButtonBase.js'

export class Button extends ButtonBase {
  
  constructor(x, y, width, height, text, clickFunc = null) {
    super(x, y, width, height, text, clickFunc)

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache["images/button-100.png"])
    this.addChild(this.shape)

    this.label = new PIXI.Text(text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = width / 2
    this.label.y = height / 2
    this.addChild(this.label)

    this.on('pointerover', () => {
      this.onScaleStart(0.95, 0.95, 1, 1, 5)
    })
  }
}