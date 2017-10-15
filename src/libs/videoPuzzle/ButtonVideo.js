import {ButtonBase} from './ButtonBase.js'

export class ButtonVideo extends ButtonBase {
  constructor(x, y, width, height, video, text, clickFunc = null) {
    super(x, y, width, height, text, clickFunc)
    this.video = video

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache["images/button-video.png"])
    this.addChild(this.shape)

    let previewTex = PIXI.Texture.fromVideo(PIXI.loader.resources[this.video].data)
    previewTex.baseTexture.source.loop = true
    previewTex.baseTexture.source.pause()

    this.preview = new PIXI.Sprite(previewTex)
    this.preview.x = 20
    this.preview.y = 20
    this.addChild(this.preview)

    this.label = new PIXI.Text(this.text, this.labelStyle)
    this.label.anchor.set(0.5, 0.5)
    this.label.x = this.width / 2
    this.label.y = this.height * 3 / 4
    this.addChild(this.label)

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