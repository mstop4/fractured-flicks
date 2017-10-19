import {Button} from './Button.js'

export class OptionsMenu extends PIXI.Container {
  constructor(app) {
    super()

    this.app = app

    this.resumeButton = this.createButton(this.app.maxWidth / 2 - 100, 525, "spr_button150", "Resume", this.deactivate.bind(this))
    this.backButton = this.createButton(this.app.maxWidth / 2 + 100, 525, "spr_button150", "Quit", this.onBackButton.bind(this))
    this.musicToggle = this.createButton(this.app.maxWidth / 2, 350, "spr_button150", "Music", this.onMusicToggle.bind(this))
    this.sfxToggle = this.createButton(this.app.maxWidth / 2, 425, "spr_button150", "SFX", this.onSfxToggle.bind(this))

    this.updateAudioButtonLabels()

    this.titleStyle = new PIXI.TextStyle({
      fontFamily: "Kite One",
      fill: 0xffffff,
      stroke: 0x404060,
      strokeThickness: 10,
      fontSize: 72 
    })

    this.titleText = new PIXI.Text("Game Paused", this.titleStyle)
    this.titleText.x = this.app.maxWidth / 2
    this.titleText.y = 200
    this.titleText.anchor.set(0.5,0.5)

    this.addChild(this.titleText)
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
    let curSound = 'mus_TimeToDream'
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