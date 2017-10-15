export class ButtonBase extends PIXI.Container {
  
  constructor(x, y, text, clickFunc = null) {
    super()

    this.x = x
    this.y = y
    this.clickFunc = clickFunc
    this.text = text

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

    this.goalScale = new PIXI.Point(1,1)
    this.startScale = new PIXI.Point(1,1)
    this.scaleT = 0
    this.scaleTDelta = 5

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