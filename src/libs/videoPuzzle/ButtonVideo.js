export class ButtonVideo extends PIXI.Container {
  constructor(x, y, width, height, video, text, clickFunc = null) {
    super()

    this.x = x
    this.y = y

    this.clickFunc = clickFunc

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache["images/button-video.png"])
    this.addChild(this.shape)

    console.log(PIXI.loader.resources)
    let previewTex = PIXI.Texture.fromVideo(PIXI.loader.resources[video].data)
    previewTex.baseTexture.source.loop = true
    previewTex.baseTexture.source.pause()

    this.preview = new PIXI.Sprite(previewTex)
    this.preview.x = 20
    this.preview.y = 20
    this.addChild(this.preview)

    this.labelStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 28,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4
    })

    this.label = new PIXI.Text(text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = width / 2
    this.label.y = height * 3 / 4
    this.addChild(this.label)

    this.interactive = true
    this.buttonMode = true
    this.isDown = false
    this.hitArea = new PIXI.Rectangle(0, 0, width, height)

    this.on('pointerdown', () => {
      this.isDown = true
    })

    this.on('pointerup', () => {
      if (this.isDown) {
        this.isDown = false
        this.clickFunc()
      }
    })

    this.on('pointerover', () => {
      this.preview.texture.baseTexture.source.play()
    })

    this.on('pointerout', () => {
      this.preview.texture.baseTexture.source.pause()
    })
  }
}