import {ButtonBase} from './ButtonBase.js'

export class Button extends ButtonBase {
  
  constructor(x, y, textureID = "spr_button100", text, audioMananger, clickFunc = null) {
    super(x, y, text, audioMananger, clickFunc)

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache[textureID])
    this.addChild(this.shape)

    this.label = new PIXI.Text(text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = this.width / 2
    this.label.y = this.height / 2
    this.addChild(this.label)

    this.pivot.set(this.width / 2, this.height / 2)
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height)

    this.on('pointerover', () => {
      this.onScaleStart(0.95, 0.95, 1, 1, 5)
    })

    this.on('pointerout', () => {
      this.isDown = false
      this.onScaleStart(0.95, 0.95, 1, 1, 5) 
    })
  }
}