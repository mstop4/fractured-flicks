import {ButtonBase} from './ButtonBase.js'

export class ButtonVideo extends ButtonBase {
  constructor(x, y, textureID = "spr_buttonVideo", video, text, difficulty, audioMananger, clickFunc = null) {
    super(x, y, text, audioMananger, clickFunc)

    this.difficultyStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 18,
      fill: 0xFFFFFF,
      stroke: 0x202030,
      strokeThickness: 3,
      padding: 10
    })

    this.shape = new PIXI.Sprite(PIXI.utils.TextureCache[textureID])
    this.addChild(this.shape)

    let previewTex = PIXI.Texture.fromVideo(PIXI.loader.resources[video].data)
    previewTex.baseTexture.source.loop = true
    previewTex.baseTexture.source.pause()

    this.preview = new PIXI.Sprite(previewTex)
    this.preview.x = 20
    this.preview.y = 20
    this.addChild(this.preview)

    this.nameLabel = new PIXI.Text(text, this.labelStyle)
    this.nameLabel.anchor.set(0.5, 0.5)
    this.nameLabel.x = this.width / 2
    this.nameLabel.y = this.height * 3 / 4 - 12
    this.addChild(this.nameLabel)

    this.difficultyLabel = new PIXI.Text(difficulty, this.difficultyStyle)
    this.difficultyLabel.anchor.set(0.5, 0.5)
    this.difficultyLabel.x = this.width / 2
    this.difficultyLabel.y = this.height * 7 / 8
    this.addChild(this.difficultyLabel)

    this.pivot.set(this.width / 2, this.height / 2)
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height)

    this.on('pointerover', () => {
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