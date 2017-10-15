import {ButtonBase} from './ButtonBase.js'

export class Button extends ButtonBase {
  
  constructor(x, y, width, height, text, clickFunc = null) {
    super(x, y, width, height, text, clickFunc)
    this.setup()
  }

  setup() {
    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache["images/button-100.png"])
    this.addChild(this.shape)

    this.label = new PIXI.Text(this.text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = this.width / 2
    this.label.y = this.height / 2
    this.addChild(this.label)

    this.on('pointerdown', () => {
      this.onScaleStart(1, 1, 0.95, 0.95, 25)
      this.isDown = true
    })

    this.on('pointerup', () => {
      if (this.isDown) {
        this.isDown = false
        this.onScaleStart(0.9, 0.9, 1, 1, 5) 
        this.clickFunc()
      }
    })

    this.on('pointerover', () => {
      this.onScaleStart(0.9, 0.9, 1, 1, 5)
    })
  }
}