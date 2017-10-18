import {Button} from './Button.js'

export class OptionsMenu extends PIXI.Container {
  constructor(app) {
    super()

    this.app = app

    this.resumeButton = this.createButton(100, 100, "images/button-150.png", "Resume", this.deactivate.bind(this))
    this.backButton = this.createButton(100, 200, "images/button-150.png", "Quit", this.onBackButton.bind(this))
    this.musicToggle = this.createButton(100, 300, "images/button-150.png", "Music", this.onMusicToggle.bind(this))
    this.sfxToggle = this.createButton(100, 400, "images/button-150.png", "SFX", this.onSfxToggle.bind(this))

    this.updateAudioButtonLabels()

    this.titleStyle = new PIXI.TextStyle({
      fontFamily: "Kite One",
      fill: 0xffffff,
      stroke: 0x000000
    })
    this.contentStyle = new PIXI.TextStyle({
      fontFamily: "Kite One",
      fill: 0xffffff,
      stroke: 0x000000
    })

    this.controlsTitle = new PIXI.Text("Controls", this.titleStyle)
    this.controlsTitle.x = 300
    this.controlsTitle.y = 100
    this.controlText = new PIXI.Text("Tap - Rotate piece\nHold & Drag - Move piece", this.contentStyle)
    this.controlText.x = 300
    this.controlText.y = 200

    this.addChild(this.controlsTitle)
    this.addChild(this.controlText)
  }

  createButton(x, y, textureID, label, clickFunc) {
    let newButton = new Button(x, y, textureID, label, clickFunc)
    this.app.registerInstance(newButton)
    this.addChild(newButton)
    return newButton
  }

  updateAudioButtonLabels() {
    if (this.app.am.musicOn) {
      this.musicToggle.label.text = "Music: On"
    } else {
      this.musicToggle.label.text = "Music: Off"
    }

    if (this.app.am.sfxOn) {
      this.sfxToggle.label.text = "SFX: On"
    } else {
      this.sfxToggle.label.text = "SFX: Off"
    }
  }

  onMusicToggle() {
    let curSound = 'sounds/music1.mp3'
    this.app.am.musicOn = !this.app.am.musicOn

    if (this.app.am.musicOn) {
      this.app.am.playSound(curSound)
    } else {
      this.app.am.pauseSound(curSound)
    }

    this.updateAudioButtonLabels.apply(this)
  }

  onSfxToggle() {
    this.app.am.sfxOn = !this.app.am.sfxOn
    this.updateAudioButtonLabels.apply(this)
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