import {ButtonVideo} from './ButtonVideo.js'
import {puzzles} from '../../puzzles.config.js'

export class PuzzleMenu extends PIXI.Container {
  constructor(app) {
    super()

    this.app = app
    this.buttons = []
    this.buttonCount = 0
    this.processPaused = false
    this.buttonsPerRow = 3
    this.buttonWidth = 200
    this.buttonHeight = 200
    this.buttonMarginX = 20

    this.titleStyle = new PIXI.TextStyle({
      fontFamily: 'Indie Flower',
      fontSize: 72,
      fill: 0xFFFFFF,
      stroke: '#404060',
      strokeThickness: 10,
      padding: 20
    })

    this.titleLabel = new PIXI.Text("Select a puzzle", this.titleStyle)
    this.titleLabel.x = this.app.maxWidth / 2
    this.titleLabel.y = 100
    this.titleLabel.anchor.set(0.5, 0.5)
    this.addChild(this.titleLabel)

    for (let i = 0; i < puzzles.length; i++) {
      this.createButton(this.app.maxWidth / 2 - ((this.buttonWidth + this.buttonMarginX) * (this.buttonsPerRow - 1) / 2) + i * (this.buttonWidth + this.buttonMarginX), 
                        this.app.maxHeight / 2, 
                        this.buttonWidth, this.buttonHeight,
                        puzzles[i].preview,
                        puzzles[i].name, puzzles[i].id)
    }

    this.app.registerInstance(this)
  }

  createButton(x, y, width, height, preview, label, level) {
    this.buttons[this.buttonCount] = new ButtonVideo(x, y, width, height, preview, label, this.gotoLevel.bind(this, level))
    this.buttons[this.buttonCount].pivot = new PIXI.Point(width / 2, height / 2)
    this.addChild(this.buttons[this.buttonCount])
    this.buttonCount++
  }

  gotoLevel(level) {
    this.processPaused = true
    this.visible = false
    this.app.loadLevel(level) 
  }

  activate() {
    this.processPaused = false
    this.visible = true
  }

  process() {
    // stuff
  }
}