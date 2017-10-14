export class Button extends PIXI.Container {
  
  constructor(x, y, width, height, text, clickFunc = null) {
    super()

    this.x = x
    this.y = y

    this.clickFunc = clickFunc

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache["images/button-100.png"])
    this.addChild(this.shape)

    this.labelStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 28,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4
    })

    this.label = new PIXI.Text(text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = width / 2
    this.label.y = height / 2
    this.addChild(this.label)

    this.interactive = true
    this.buttonMode = true
    this.isDown = false
    this.hitArea = new PIXI.Rectangle(0, 0, width, height)

    this.on('pointerdown', () => {
      this.isDown = true
    })

    this.on('pointerup', () => {
      if (this.isDown) {
        this.isDown = false
        this.clickFunc()
      }
    })
  }
}