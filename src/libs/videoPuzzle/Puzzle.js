import {App} from './app.js'
import {puzzles} from '../../puzzles.config.js'
import {sounds} from '../../audio.config.js'
import {Piece} from './Piece.js'
import {TitleScreen} from './TitleScreen.js'
import {Button} from './Button.js'

export class Puzzle extends App {
  constructor() {
    super()
    this.currentLevel = 1

    this.pieces = []
    this.guide = undefined
    this.background = undefined
    this.titleText = undefined

    this.commonAssets = ['./images/frame.png', './images/background.png']
    this.videoURI = puzzles[this.currentLevel].file
    this.videoScale = 1
    this.numRows = puzzles[this.currentLevel].numRows
    this.numColumns = puzzles[this.currentLevel].numColumns
    this.soundURIs = sounds

    this.xOffset = 0
    this.yOffset = 0
    this.loadingNewLevel = true
    this.puzzleComplete = false

    this.startLocations = []
  }

  initGame() {
    this.initApp(this)

    let that = this

    this.loadTextures(this.commonAssets, () => {
      this.loadAudio(this.soundURIs, that.initGameSetup.bind(that))
    })
  }

  initGameSetup() {
    // Add background

    this.background = new PIXI.extras.TilingSprite(
      PIXI.utils.TextureCache["./images/background.png"],
      this.maxWidth,
      this.maxHeight
    )

    this.pixiApp.stage.addChild(this.background)

    let titleScreen = new TitleScreen(this)
    this.pixiApp.stage.addChild(titleScreen)

    this.soundResources['./sounds/music1.mp3'].loop = true
    this.soundResources['./sounds/music1.mp3'].play()

    this.registerInstance(this)
  }

  initPuzzleSetup() {
    this.xOffset = (this.maxWidth - 960) / 2
    this.yOffset = (this.maxHeight - 540) / 2

    // Add frame
    let frame = new PIXI.Sprite(PIXI.utils.TextureCache["./images/frame.png"])
    frame.pivot = new PIXI.Point(16,16)
    frame.x = this.xOffset
    frame.y = this.yOffset
    this.pixiApp.stage.addChild(frame)

    // Add Title
    let titleStyle = new PIXI.TextStyle({
      fontFamily: 'Indie Flower',
      fill: 'white'
    })

    this.titleText = new PIXI.Text("Title", titleStyle)
    this.titleText.x = 0
    this.titleText.y = 0
    this.pixiApp.stage.addChild(this.titleText)

    this.button = []
    
    this.button[0] = new Button(this.maxWidth-100, 0, 50, 50, "1", this.loadLevel.bind(this, [0]))
    this.button[1] = new Button(this.maxWidth-50, 0, 50, 50, "2", this.loadLevel.bind(this, [1]))
    this.pixiApp.stage.addChild(this.button[0])
    this.pixiApp.stage.addChild(this.button[1])    

    this.loadLevel(this.currentLevel)
  }

  loadLevel(level) {

    console.log("Changing Levels")
    this.loadingNewLevel = true

    if (this.guide) {
      // Pause and reset current video
      this.guide.texture.baseTexture.source.pause()
      this.guide.texture.baseTexture.source.currentTime = 0

      // remove guide
      this.unregisterInstance(this.guide)
      this.destroyInstance(this.guide)
    }

    // remvoe pieces
    if (this.pieces) {
      this.pieces.forEach( (piece) => {
        this.unregisterInstance(piece)
        this.destroyInstance(piece)
      })

      this.pieces = []
    }

    // load new puzzle
    this.currentLevel = level
    this.videoURI = puzzles[this.currentLevel].file
    this.titleText.text = "Loading"
    this.puzzleComplete = false

    // if video isn't already in cache, load it
    if (!PIXI.loader.resources.hasOwnProperty(this.videoURI)) {
      this.loadTextures(this.videoURI, this.puzzleSetup.bind(this))
    } else {
      this.puzzleSetup()
    }
  } 

  puzzleSetup() {
    console.log("Setting up puzzle...")

    this.titleText.text = puzzles[this.currentLevel].name

    //let bw = new PIXI.filters.ColorMatrixFilter()
    let guideTex = PIXI.Texture.fromVideo(PIXI.loader.resources[this.videoURI].data)
    guideTex.baseTexture.source.loop = true
    guideTex.baseTexture.source.play()
    this.guide = new PIXI.Sprite(guideTex)

    this.guide.x = this.xOffset
    this.guide.y = this.yOffset
    //guide.filters = [bw]
    this.guide.tint = 0x808080
    //bw.blackAndWhite()

    this.pixiApp.stage.addChild(this.guide)

    let cellWidth = this.guide.width / this.numColumns
    let cellHeight = this.guide.height / this.numRows

    let pieceWidth = cellWidth / this.numColumns * this.videoScale
    let pieceHeight = cellHeight / this.numRows * this.videoScale

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numColumns; j++) {

        let rect = new PIXI.Rectangle(j*cellWidth, i*cellHeight, cellWidth, cellHeight)
        let pieceTex = PIXI.Texture.fromVideo(PIXI.loader.resources[this.videoURI].data)
        pieceTex.frame = rect

        let pieceX = this.xOffset + (j+0.5)*(cellWidth * this.videoScale)
        let pieceY = this.yOffset + (i+0.5)*(cellHeight * this.videoScale)

        let newPiece = new Piece(pieceX, pieceY, pieceWidth, pieceHeight, cellWidth, cellHeight, pieceTex, this)
        newPiece.randomizePosition(this.xOffset - 50, 
                    this.yOffset - 50, 
                    this.xOffset + this.guide.width + 50,
                    this.yOffset + this.guide.height + 50)
        
        this.registerInstance(newPiece)
        this.pieces.push(newPiece)
        this.pixiApp.stage.addChild(newPiece)
      }
    }

    this.loadingNewLevel = false

    console.dir(this.pixiApp.stage)
    console.dir(PIXI.utils)
  }

  process() {
    this.background.tilePosition.x -= 0.1
    this.background.tilePosition.y -= 0.1

    let done = true

    this.pieces.forEach( (piece) => {
      done = piece.done && done
    })

    if (done && !this.loadingNewLevel && !this.puzzleComplete) {
      this.titleText.text = "Complete!"
      this.puzzleComplete = true
      //this.guide.filters = []
      this.guide.tint = 0xFFFFFF
      this.pieces.forEach(function(piece) {
        piece.visible = false
      })
    }
  }
}