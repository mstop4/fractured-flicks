export class TitleScreen extends PIXI.Container{
  constructor(app) {
    super()

    this.app = app

    this.bannerStyle = new PIXI.TextStyle({
      fontFamily: 'Indie Flower',
      fontSize: 72,
      fill: 0xFFFFFF,
      stroke: '#404060',
      strokeThickness: 10,
      padding: 20
    })

    this.infoStyle = new PIXI.TextStyle({
      fontFamily: 'Indie Flower',
      fontSize: 36,
      fill: 0xFFFFFF,
      stroke: '#404060',
      strokeThickness: 5,
      padding: 20
    })

    this.titleBanner = this.addText("Video Jigsaw Puzzle", this.bannerStyle, 1280 / 2, 100, 0.5, 0.5)
    this.startText = this.addText("Tap to Start", this.bannerStyle, 1280 / 2, 720 / 2, 0.5, 0.5)
    this.infoText = this.addText("github.com/mstop4", this.infoStyle, 0, 704, 0, 1)
    this.versionText = this.addText("v.0.5.0", this.infoStyle, 1280, 704, 1, 1)

    this.interactive = true
    this.interactiveChildren = true
    this.buttonMode = true
    this.hitArea = new PIXI.Rectangle(0, 0, 1280, 720)

    this.startTextTriggerTime = 30
    this.startTextCounter = 0

    this.on('pointertap', this.onClick)
    this.app.registerInstance(this)
  }

  addText(text, style, x, y, anchorX, anchorY) {
    let newText = new PIXI.Text(text, style)
    newText.anchor.set(anchorX, anchorY)
    newText.x = x
    newText.y = y

    this.addChild(newText)
    return newText
  }

  process() {
    this.startTextCounter++

    if (this.startTextCounter >= this.startTextTriggerTime) {
      this.startText.visible = !this.startText.visible
      this.startTextCounter = 0
    }
  }

  onClick() {
    this.app.unregisterInstance(this)
    this.app.destroyInstance(this)
    this.app.menuSetup()
  }
} 