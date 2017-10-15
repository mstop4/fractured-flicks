import {Button} from './Button.js'

export class OptionsMenu extends PIXI.Container {
  constructor(app) {
    super()

    this.app = app

    this.resumeButton = this.createButton(100, 100, "images/button-100.png", "Resume", this.deactivate.bind(this))
    this.backButton = this.createButton(100, 200, "images/button-100.png", "Quit", this.onBackButton.bind(this))
    this.musicToggle = this.createButton(100, 300, "images/button-100.png", "Music", this.onMusicToggle.bind(this))
    this.sfxToggle = this.createButton(100, 400, "images/button-100.png", "SFX", null)

    this.titleStyle = new PIXI.TextStyle({
      fill: 0xffffff
    })
    this.contentStyle = new PIXI.TextStyle({
      fill: 0xffffff
    })

    this.controlsTitle = new PIXI.Text("Controls", this.titleStyle)
    this.controlText = new PIXI.Text("Tap - Rotate piece\nHold & Drag - Move piece", this.contentStyle)

    this.addChild(this.controlsTitle)
    this.addChild(this.controlText)
  }

  createButton(x, y, textureID, label, clickFunc) {
    let newButton = new Button(x, y, textureID, label, clickFunc)
    this.app.registerInstance(newButton)
    this.addChild(newButton)
    return newButton
  }

  onMusicToggle() {
    let curSound = 'sounds/music1.mp3'

    if (this.app.am.isPlaying(curSound)) {
      this.app.am.pauseSound(curSound)
    } else {
      this.app.am.playSound(curSound)
    }
  }

  onBackButton() {
    this.app.backToMenu.apply(this.app)
    this.visible = false
  }

  deactivate() {
    this.visible = false
    this.app.togglePauseGame(false)
  }

  activate() {
    this.visible = true
  }
}