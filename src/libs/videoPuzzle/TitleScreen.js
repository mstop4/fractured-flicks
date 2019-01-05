const APP_VERSION = "1.0.0-rc1"

export class TitleScreen extends PIXI.Container{
  constructor(app) {
    super()

    this.app = app

    this.tapStartStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 64,
      fill: 0xFFFFFF,
      stroke: '#404060',
      strokeThickness: 10,
      padding: 20
    })

    this.infoStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 24,
      fill: 0xFFFFFF,
      stroke: '#404060',
      strokeThickness: 5,
      padding: 20
    })

    this.titleBanner = new PIXI.Sprite(PIXI.utils.TextureCache["spr_title"])
    this.titleBanner.anchor.set(0.5,0.5)
    this.titleBanner.x = this.app.maxWidth / 2
    this.titleBanner.y = 180
    this.addChild(this.titleBanner)

    this.startText = this.addText("Tap to Start", this.tapStartStyle, this.app.maxWidth / 2, this.app.maxHeight / 2 + 110, 0.5, 0.5)
    this.infoText = this.addText("github.com/mstop4/fractured-flicks", this.infoStyle, 0, 704, 0, 1)
    this.versionText = this.addText(`v.${APP_VERSION}`, this.infoStyle, this.app.maxWidth, 704, 1, 1)

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
    this.app.destroyInstance(this, true, false)
    this.app.menuSetup()
  }
} 