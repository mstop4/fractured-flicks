import {ButtonVideo} from './ButtonVideo.js'
import {puzzles} from '../../puzzles.manifest.js'

export class PuzzleMenu extends PIXI.Container {
  constructor(app) {
    super()

    this.app = app
    this.buttons = []
    this.buttonCount = 0
    this.processPaused = false
    this.buttonsPerRow = 2
    this.numRows = Math.floor(puzzles.length / this.buttonsPerRow)
    this.buttonWidth = 200
    this.buttonHeight = 200
    this.buttonMarginX = 40
    this.buttonMarginY = 40

    this.titleStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
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
      this.createButton(this.app.maxWidth / 2 - ((this.buttonWidth + this.buttonMarginX) * (this.buttonsPerRow - 1) / 2) + (i % this.buttonsPerRow) * (this.buttonWidth + this.buttonMarginX), 
                        this.app.maxHeight / 2 + 50 - ((this.buttonHeight + this.buttonMarginY) * (this.numRows - 1) / 2) + Math.floor(i / this.buttonsPerRow) * (this.buttonHeight + this.buttonMarginY), 
                        "spr_buttonVideo",
                        puzzles[i].preview,
                        puzzles[i].name, puzzles[i].id)
    }
  }

  createButton(x, y, textureID, preview, label, level) {
    this.buttons[this.buttonCount] = new ButtonVideo(x, y, textureID, preview, label, this.gotoLevel.bind(this, level, this.buttonCount))
    this.app.registerInstance(this.buttons[this.buttonCount])
    this.addChild(this.buttons[this.buttonCount])
    this.buttonCount++
  }

  gotoLevel(level, buttonID) {
    this.processPaused = true
    this.visible = false
    this.buttons[buttonID].preview.texture.baseTexture.source.pause()
    this.app.loadLevel(level) 
  }

  activate() {
    this.processPaused = false
    this.visible = true
  }

  //process() {
    // stuff
  //}
}