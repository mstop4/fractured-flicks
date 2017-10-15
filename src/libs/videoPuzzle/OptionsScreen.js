import {Button} from './Button.js'

export class OptionsScreen extends PIXI.Container {
  constructor() {
    super()

    this.resumeButton = new Button(100, 100, "images/button-100.png", "Resume", null)
    this.backButton = new Button(100, 200, "images/button-100.png", "Quit", null)
    this.musicToggle = new Button(100, 300, "images/button-100.png", "Music", this.onMusicToggle)
    this.sfxToggle = new Button(100, 400, "images/button-100.png", "SFX", null)

    this.titleStyle = new PIXI.TextStyle({})
    this.contentStyle = new PIXI.TextStyle({})

    this.controlsTitle = new PIXI.Text("Controls", this.titleStyle)
    this.controlText = new PIXI.Text("Tap - Rotate piece\nHold & Drag - Move piece", this.contentStyle)
  }

  onMusicToggle() {
    let curSound = PIXI.loader.resources['sounds/music1.mp3'].sound

    if (curSound.isPlaying) {
      curSound.pause()
    } else {
      curSound.play()
    }
  }
}