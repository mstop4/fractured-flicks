import 'pixi.js'

export class Piece extends PIXI.Container {

  constructor(x, y, pieceWidth, pieceHeight, cellWidth, cellHeight, texture) {
    super()
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.width = pieceWidth
    this.sprite.height = pieceHeight

    this.x = x
    this.y = y
    this.pivot = new PIXI.Point(cellWidth/2, cellHeight/2)
    this.xStart = x
    this.yStart = y
    this.width = pieceWidth
    this.height = pieceHeight
    this.outlineWidth = cellWidth
    this.outlineHeight = cellHeight

    // rotation = current rotation being rendered
    // angle = actual rotation value internal to the instance
    // angleDelta = transition speed between rotation and angle

    this.angle = Math.floor(Math.random() * 4) * 90 * Math.PI / 180
    this.angleDelta = 10 * Math.PI / 180
    this.rotation = 0
    this.snapStrength = 32
    this.dragging = false

    // state of whether the piece is in the correct position and orientation
    this.done = false

    this.interactive = true
    this.buttonMode = true

    this.on('pointerdown', this.onDragStart)
    this.on('pointerup', this.onDragEnd)
    this.on('pointerupoutside', this.onDragEnd)
    this.on('pointermove', this.onDragMove)

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
    // Handle transition between rotation and angle
    if (this.angle > this.rotation) {
      if (Math.abs(this.angle - this.rotation) < this.angleDelta) {
        this.rotation = this.angle
      } else {
        this.rotation += this.angleDelta
      }
    } else if (this.angle < this.rotation) {
      if (Math.abs(this.angle - this.rotation) < this.angleDelta) {
        this.rotation = this.angle
      } else {
        this.rotation -= this.angleDelta
      }
    }
  }

  onDragStart(event) {
    this.data = event.data
    this.dragging = true
    this.recolourOutline(0xFFFF00)

    // Bring this piece to the front
    let tempParent = this.parent
    tempParent.removeChild(this)
    tempParent.addChild(this)
  }

  onDragEnd() {
    this.data = null
    this.dragging = false

    // Snap to correct position if close enough and in the correct orientation
    if (Math.abs(this.x - this.xStart) < this.snapStrength && 
        Math.abs(this.y - this.yStart) < this.snapStrength && 
        this.angle % (2 * Math.PI) === 0) {

      this.x = this.xStart
      this.y = this.yStart
      this.recolourOutline(0x00FF00)
      this.done = true
    } else {
      this.recolourOutline(0xFF0000)
      this.done = false
    }
  }

  onDragMove() {
    if (this.dragging) {
      let newPosition = this.data.getLocalPosition(this.parent)
      this.x = newPosition.x
      this.y = newPosition.y
    }
  }
}