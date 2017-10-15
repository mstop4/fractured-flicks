export class ButtonBase extends PIXI.Container {
  
  constructor(x, y, width, height, text, clickFunc = null) {
    super()

    this.x = x
    this.y = y
    this.clickFunc = clickFunc
    this.width = width
    this.height = height
    this.text = text
    this.pivot.set(width / 2, height / 2)

    this.labelStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 28,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4
    })

    this.interactive = true
    this.buttonMode = true
    this.isDown = false
    this.hitArea = new PIXI.Rectangle(0, 0, width, height)

    this.goalScale = new PIXI.Point(1,1)
    this.startScale = new PIXI.Point(1,1)
    this.scaleT = 0
    this.scaleTDelta = 5
  }

  onScaleStart(startScaleX, startScaleY, goalScaleX, goalScaleY, deltaT) {
    this.startScale.x = startScaleX
    this.startScale.y = startScaleY
    this.goalScale.x = goalScaleX
    this.goalScale.y = goalScaleY
    this.scaleT = 0
    this.scaleTDelta = deltaT
  }

  process() {
    if (this.scaleT <= 100) {
      this.scale.x = (this.startScale.x - this.goalScale.x) * Math.pow(1-(this.scaleT / 100), 3) + this.goalScale.x
      this.scale.y = (this.startScale.y - this.goalScale.y) * Math.pow(1-(this.scaleT / 100), 3) + this.goalScale.y
      this.scaleT += this.scaleTDelta
    }
  }
}