let dragDelay = 150
let idleColor = 0xE20000
let dragColor = 0xF9DC00
let correctColor = 0x83D92B

export class Piece extends PIXI.Container {

  constructor(x, y, pieceWidth, pieceHeight, cellWidth, cellHeight, scale, texture, app) {
    super()

    this.app = app

    // Graphics
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.width = pieceWidth
    this.sprite.height = pieceHeight

    // Properties
    this.x = x
    this.y = y
    this.pivot = new PIXI.Point(cellWidth/2*scale, cellHeight/2*scale)
    this.xStart = x
    this.yStart = y
    this.width = pieceWidth
    this.height = pieceHeight
    this.outlineWidth = cellWidth * scale
    this.outlineHeight = cellHeight * scale

    this.goalAngle = Math.floor(Math.random() * 4) * 90 * Math.PI / 180
    this.startAngle = 0
    this.rotationT = 0
    this.rotationTDelta = 5

    this.goalScale = new PIXI.Point(1,1)
    this.startScale = new PIXI.Point(1,1)
    this.scaleT = 0
    this.scaleTDelta = 5

    this.snapStrength = 32
    this.clicked = false
    this.dragging = false
    this.dragAlarm = null

    // state of whether the piece is in the correct position and orientation
    this.done = false

    this.interactive = true
    this.buttonMode = true

    // Event handlers
    this.on('pointerdown', this.onClick)
    this.on('pointerup', this.onRelease)
    this.on('pointerupoutside', this.onRelease)
    this.on('pointermove', this.onDragMove)

    // Sounds
    this.pickUpSfx = 'sounds/pickUp.mp3'
    this.putDownSfx = 'sounds/putDown.mp3'
    this.rotateSfx = 'sounds/rotate.mp3'
    this.correctSfx = 'sounds/correct.mp3'

    this.outline = new PIXI.Graphics()
    this.outline.cacheAsBitmap = true
    this.recolourOutline(idleColor)

    this.addChild(this.sprite)
    this.addChild(this.outline)
  }

  // Places piece in a random location on the edge of a rectangle
  randomizePosition(left, top, right, bottom) {
    let side = Math.floor(Math.random() * 4)
    
    switch (side) {
      case 0:
        this.x = Math.random() * (right - left) + left
        this.y = top
        break;
      case 1:
        this.x = Math.random() * (right - left) + left
        this.y = bottom
        break;
      case 2:
        this.x = left
        this.y = Math.random() * (bottom - top) + top
        break;
      case 3:
        this.x = right
        this.y = Math.random() * (bottom - top) + top
        break;
    }
  }

  recolourOutline(colour) {
    this.outline.cacheAsBitmap = false
    this.outline.clear()
    this.outline.lineStyle(2,colour,1)
    this.outline.drawRect(0,0,this.outlineWidth,this.outlineHeight)
    this.outline.cacheAsBitmap = true
  }

  process() {
    // Handle transition between startAngle and goalAngle

    if (this.rotationT <= 100) {
      this.rotation = (this.startAngle - this.goalAngle) * Math.pow(1-(this.rotationT / 100), 3) + this.goalAngle
      this.rotationT += this.rotationTDelta
    }

    if (this.scaleT <= 100) {
      this.scale.x = (this.startScale.x - this.goalScale.x) * Math.pow(1-(this.scaleT / 100), 3) + this.goalScale.x
      this.scale.y = (this.startScale.y - this.goalScale.y) * Math.pow(1-(this.scaleT / 100), 3) + this.goalScale.y
      this.scaleT += this.scaleTDelta
    }
  }

  onClick(event) {
    this.data = event.data
    this.clicked = true
    this.onScaleStart(1, 1, 0.95, 0.95, 25) 
    this.dragAlarm = window.setTimeout( () => {
      
      this.dragging = true
      this.onScaleStart(0.95, 0.95, 1, 1, 5) 
      this.recolourOutline(dragColor)
      this.app.am.playSound(this.pickUpSfx)
  
      // Bring this piece to the front
      let tempParent = this.parent
      tempParent.removeChild(this)
      tempParent.addChild(this)
    
    } , dragDelay)
  }

  onRelease() {
    if (this.dragging) {
      this.data = null
      this.dragging = false

      this.checkDone(false)
    } else {
      if (this.clicked) {
        window.clearTimeout(this.dragAlarm)
        this.onRotateStart(90)
      }
    }

    this.clicked = false
  }

  onDragMove() {
    if (this.dragging) {
      let newPosition = this.data.getLocalPosition(this.parent)

      // prevent piece from going out of sight and unselectable
      this.x = Math.max( Math.min(newPosition.x, this.app.maxWidth), 0)
      this.y = Math.max( Math.min(newPosition.y, this.app.maxHeight), 0)
    }
  }

  onRotateStart(deltaAngle) {
    this.goalAngle = this.goalAngle + deltaAngle * Math.PI / 180
    this.startAngle = this.rotation
    this.rotationT = 0
    this.app.am.playSound(this.rotateSfx)
  }

  onScaleStart(startScaleX, startScaleY, goalScaleX, goalScaleY, deltaT) {
    this.startScale.x = startScaleX
    this.startScale.y = startScaleY
    this.goalScale.x = goalScaleX
    this.goalScale.y = goalScaleY
    this.scaleT = 0
    this.scaleTDelta = deltaT
  }

  checkDone(supressPutDownSFX) {
    // Snap to correct position if close enough and in the correct orientation
    if (Math.abs(this.x - this.xStart) < this.snapStrength && 
        Math.abs(this.y - this.yStart) < this.snapStrength && 
        (this.goalAngle % (2 * Math.PI)).toFixed(2) == 0) {

      this.x = this.xStart
      this.y = this.yStart
      this.recolourOutline(correctColor)
      this.done = true
      this.app.am.playSound(this.correctSfx)
      this.onScaleStart(0.95, 0.95, 1, 1, 5) 
    } else {
      this.recolourOutline(idleColor)
      this.done = false
      if (!supressPutDownSFX) {
        this.app.am.playSound(this.putDownSfx)
      }
      this.onScaleStart(0.9, 0.9, 1, 1, 5) 
    }
  }
}