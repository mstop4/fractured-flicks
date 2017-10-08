import * as app from './app.js'
import {puzzles} from '../../puzzles.config.js'
import {sounds} from '../../audio.config.js'
import {Piece} from './Piece.js'
import {TitleScreen} from './TitleScreen.js'

export class Puzzle {
    constructor() {
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
        app.initApp(this)

        let that = this

        app.loadTextures(this.commonAssets, () => {
            app.loadAudio(this.soundURIs, that.initGameSetup.bind(that))
        })
    }

    initGameSetup() {
        // Add background

        this.background = new PIXI.extras.TilingSprite(
            PIXI.utils.TextureCache["./images/background.png"],
            app.maxWidth,
            app.maxHeight
        )

        app.pixiApp.stage.addChild(this.background)

        let titleScreen = new TitleScreen(app, this)
        app.pixiApp.stage.addChild(titleScreen)

        app.soundResources['./sounds/music1.mp3'].loop = true
        app.soundResources['./sounds/music1.mp3'].play()

        app.registerInstance(this)

        window.addEventListener("keydown", this.onChangeLevel.bind(this), false)
    }

    initPuzzleSetup() {
        this.xOffset = (app.maxWidth - 960) / 2
        this.yOffset = (app.maxHeight - 540) / 2

        // Add frame
        let frame = new PIXI.Sprite(PIXI.utils.TextureCache["./images/frame.png"])
        frame.pivot = new PIXI.Point(16,16)
        frame.x = this.xOffset
        frame.y = this.yOffset
        app.pixiApp.stage.addChild(frame)

        // Add Title
        let titleStyle = new PIXI.TextStyle({
            fontFamily: 'Indie Flower',
            fill: 'white'
        })

        this.titleText = new PIXI.Text("Title", titleStyle)
        this.titleText.x = 0
        this.titleText.y = 0
        app.pixiApp.stage.addChild(this.titleText)

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
            app.unregisterInstance(this.guide)
            app.destroyInstance(this.guide)
        }

        // remvoe pieces
        if (this.pieces) {
            this.pieces.forEach( (piece) => {
                app.unregisterInstance(piece)
                app.destroyInstance(piece)
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
            app.loadTextures(this.videoURI, this.puzzleSetup.bind(this))
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

        app.pixiApp.stage.addChild(this.guide)

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

                let newPiece = new Piece(pieceX, pieceY, pieceWidth, pieceHeight, cellWidth, cellHeight, pieceTex)
                newPiece.randomizePosition(this.xOffset - 50, 
                                        this.yOffset - 50, 
                                        this.xOffset + this.guide.width + 50,
                                        this.yOffset + this.guide.height + 50)
                
                app.registerInstance(newPiece)
                this.pieces.push(newPiece)
                app.pixiApp.stage.addChild(newPiece)
            }
        }

        this.loadingNewLevel = false
    }

    onChangeLevel(event) {
        if (!this.loadingNewLevel) {
            if (event.keyCode === 49) {
                this.loadLevel(0)
            } else if (event.keyCode === 50) {
                this.loadLevel(1)
            }
        }
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