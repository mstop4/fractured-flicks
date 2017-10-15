export class ButtonVideo extends PIXI.Container {
  constructor(x, y, width, height, video, text, clickFunc = null) {
    super()

    this.x = x
    this.y = y
    this.clickFunc = clickFunc
    this.video = video
    this.width = width
    this.height = height
    this.text = text

    this.labelStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 28,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4
    })

    this.interactive = true
    this.buttonMode = true
    this.isDown = false
    this.hitArea = new PIXI.Rectangle(0, 0, width, height)

    this.goalScale = new PIXI.Point(1,1)
    this.startScale = new PIXI.Point(1,1)
    this.scaleT = 0
    this.scaleTDelta = 5

    this.setup()
  }

  setup() {
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

    this.on('pointerdown', () => {
      this.onScaleStart(1, 1, 0.95, 0.95, 25) 
      this.isDown = true
    })

    this.on('pointerup', () => {
      if (this.isDown) {
        this.isDown = false
        this.onScaleStart(0.9, 0.9, 1, 1, 5) 
        this.clickFunc()
      }
    })

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

  onScaleStart(startScaleX, startScaleY, goalScaleX, goalScaleY, deltaT) {
    this.startScale.x = startScaleX
    this.startScale.y = startScaleY
    this.goalScale.x = goalScaleX
    this.goalScale.y = goalScaleY
    this.scaleT = 0
    this.scaleTDelta = deltaT
  }

  process() {
    if (this.scaleT <= 100) {
      this.scale.x = (this.startScale.x - this.goalScale.x) * Math.pow(1-(this.scaleT / 100), 3) + this.goalScale.x
      this.scale.y = (this.startScale.y - this.goalScale.y) * Math.pow(1-(this.scaleT / 100), 3) + this.goalScale.y
      this.scaleT += this.scaleTDelta
    }
  }
}