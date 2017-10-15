import {ButtonBase} from './ButtonBase.js'

export class ButtonVideo extends ButtonBase {
  constructor(x, y, textureID = "images/button-video.png", video, text, clickFunc = null) {
    super(x, y, text, clickFunc)

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache[textureID])
    this.addChild(this.shape)

    let previewTex = PIXI.Texture.fromVideo(PIXI.loader.resources[video].data)
    previewTex.baseTexture.source.loop = true
    previewTex.baseTexture.source.pause()

    this.preview = new PIXI.Sprite(previewTex)
    this.preview.x = 20
    this.preview.y = 20
    this.addChild(this.preview)

    this.label = new PIXI.Text(text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = this.width / 2
    this.label.y = this.height * 3 / 4
    this.addChild(this.label)

    this.pivot.set(this.width / 2, this.height / 2)
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height)

    this.on('pointerover', (event) => {
      this.preview.texture.baseTexture.source.play()
      this.onScaleStart(0.95, 0.95, 1, 1, 5)
    })

    this.on('pointerout', () => {
      this.isDown = false
      this.preview.texture.baseTexture.source.pause()
      this.onScaleStart(0.95, 0.95, 1, 1, 5) 
    })
  }
}