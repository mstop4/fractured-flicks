import {Button} from './Button.js'

export class PuzzleMenu extends PIXI.Container {
  constructor(app) {
    super()

    this.app = app
    this.buttons = []
    this.buttonCount = 0
    this.processPaused = false
    this.buttonsPerRow = 2
    this.buttonWidth = 100
    this.buttonHeight = 50
    this.buttonMarginX = 10 

    for (let i = 0; i < this.buttonsPerRow; i++) {
      this.createButton(this.app.maxWidth / 2 - ((this.buttonWidth + this.buttonMarginX) * (this.buttonsPerRow - 1) / 2) + i * (this.buttonWidth + this.buttonMarginX), 
                        this.app.maxHeight / 2, 
                        100, 50, 
                        (i+1).toString(), i)
    }

    this.app.registerInstance(this)
  }

  createButton(x, y, width, height, label, level) {
    this.buttons[this.buttonCount] = new Button(x, y, width, height, label, this.gotoLevel.bind(this, level))
    this.buttons[this.buttonCount].pivot = new PIXI.Point(width / 2, height / 2)
    this.addChild(this.buttons[this.buttonCount])
    this.buttonCount++
  }

  gotoLevel(level) {
    this.processPaused = true
    this.visible = false

    this.buttons.forEach( (button) => {
      button.visible = false
    })
    this.app.loadLevel(level) 
  }

  activate() {
    this.processPaused = false
    this.visible = true
    this.buttons.forEach( (button) => {
      button.visible = true
    })
  }

  process() {
    // stuff
  }
}