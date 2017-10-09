let dragDelay = 150

export class Piece extends PIXI.Container {

  constructor(x, y, pieceWidth, pieceHeight, cellWidth, cellHeight, texture, app) {
    super()

    this.app = app

    // Graphics
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.width = pieceWidth
    this.sprite.height = pieceHeight

    // Properties
    this.x = x
    this.y = y
    this.pivot = new PIXI.Point(cellWidth/2, cellHeight/2)
    this.xStart = x
    this.yStart = y
    this.width = pieceWidth
    this.height = pieceHeight
    this.outlineWidth = cellWidth
    this.outlineHeight = cellHeight

    this.goalAngle = Math.floor(Math.random() * 4) * 90 * Math.PI / 180
    this.startAngle = 0
    this.rotation = 0
    this.rotationT = 0

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
    this.pickUpSfx = this.app.soundResources['./sounds/pickUp.mp3']
    this.putDownSfx = this.app.soundResources['./sounds/putDown.mp3']
    this.rotateSfx = this.app.soundResources['./sounds/rotate.mp3']
    this.correctSfx = this.app.soundResources['./sounds/correct.mp3']

    this.outline = new PIXI.Graphics()
    this.recolourOutline(0xFF0000)

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
    this.outline.clear()
    this.outline.lineStyle(2,colour,1)
    this.outline.drawRect(0,0,this.outlineWidth,this.outlineHeight)
  }

  process() {
    // Handle transition between startAngle and goalAngle

    if (this.rotationT <= 100) {
      this.rotation = (this.startAngle - this.goalAngle) * Math.pow(1-(this.rotationT / 100), 3) + this.goalAngle
      this.rotationT += 5
    }
  }

  onClick(event) {
    this.data = event.data
    this.clicked = true
    this.dragAlarm = window.setTimeout( () => {
      
      this.dragging = true
      this.recolourOutline(0xFFFF00)
      this.pickUpSfx.play()
  
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

      // Snap to correct position if close enough and in the correct orientation
      if (Math.abs(this.x - this.xStart) < this.snapStrength && 
          Math.abs(this.y - this.yStart) < this.snapStrength && 
          (this.goalAngle % (2 * Math.PI)).toFixed(2) === 0) {

        this.x = this.xStart
        this.y = this.yStart
        this.recolourOutline(0x00FF00)
        this.done = true
        this.correctSfx.play()
      } else {
        this.recolourOutline(0xFF0000)
        this.done = false
        this.putDownSfx.play()
      }
    } else {
      if (this.clicked) {
        window.clearTimeout(this.dragAlarm)
        this.onRotateStart()
      }
    }

    this.clicked = false
  }

  onDragMove() {
    if (this.dragging) {
      let newPosition = this.data.getLocalPosition(this.parent)
      this.x = newPosition.x
      this.y = newPosition.y
    }
  }

  onRotateStart() {
    this.goalAngle = this.goalAngle + 90 * Math.PI / 180
    this.startAngle = this.rotation
    this.rotationT = 0
    this.rotateSfx.play()
  }
}