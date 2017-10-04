import 'pixi.js'

let outlineIdle = new PIXI.filters.OutlineFilter(2, 0xFF0000)
let outlineDrag = new PIXI.filters.OutlineFilter(2, 0xFFFF00)
let outlineCorrect = new PIXI.filters.OutlineFilter(2, 0x00FF00)

export class Piece extends PIXI.Sprite {

  constructor(x, y, width, height, texture) {
    super(texture)

    this.x = x
    this.y = y
    this.xStart = x
    this.yStart = y
    this.width = width
    this.height = height

    // rotation = current rotation being rendered
    // angle = actual rotation value internal to the instance
    // angleDelta = transition speed between rotation and angle

    this.angle = Math.floor(Math.random() * 4) * 90 * Math.PI / 180
    this.angleDelta = 10 * Math.PI / 180
    this.rotation = 0
    this.snapStrength = 32
    this.anchor.set(0.5, 0.5)
    this.filters = [outlineIdle]
    this.dragging = false

    // state of whether the piece is in the correct position and orientation
    this.done = false

    this.interactive = true
    this.buttonMode = true

    this.on('pointerdown', this.onDragStart)
    this.on('pointerup', this.onDragEnd)
    this.on('pointerupoutside', this.onDragEnd)
    this.on('pointermove', this.onDragMove)
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
    this.filters = [outlineDrag]
    this.stage.removeChild(this)
    this.stage.addChild(this)
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
      this.filters = [outlineCorrect]
      this.done = true
    } else {
      this.filters = [outlineIdle]
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