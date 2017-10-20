import {App} from './app.js'

import {puzzles} from '../../puzzles.manifest.js'
import {commonAssets} from '../../common.manifest.js'

import Utils from './Utils.js'
import {TitleScreen} from './TitleScreen.js'
import {PuzzleMenu} from './PuzzleMenu.js'
import {OptionsMenu} from './OptionsMenu.js'
import {AudioManager} from './AudioManager.js'
import {Piece} from './Piece.js'
import {Button} from './Button.js'
import {Background} from './Background.js'

export class Puzzle extends App {
  constructor() {
    super()
    this.currentLevel = 1

    this.pieces = []
    this.background = null
    this.menuScreen = null
    this.optionsScreen = null
    this.am = null
    this.guide = null
    this.videoTex = null
    this.frame = null
    this.titleText = null
    this.timerText = null
    this.bestTimeText = null
    this.pauseButton = null
    this.loadingMessage = null
    this.hasStorage = false

    this.timerThenTime = 0
    this.timerNowTime = 0
    this.duration = 0

    this.commonAssets = commonAssets
    this.videoURI = puzzles[this.currentLevel].file
    this.videoScale = puzzles[this.currentLevel].scale
    this.numRows = 5
    this.numColumns = 7

    this.xOffset = 0
    this.yOffset = 0
    this.loadingNewLevel = true
    this.puzzleComplete = false
    this.processPaused = false

    this.startLocations = []
    this.videoElements = {} // used for kludge for loading videos from external server
    this.bestTimes = {}
  }

  initGame() {
    console.log(process.env.NODE_ENV)
    this.initApp(this)

    // Delay calling initGameSetup so player can see the 100% loading progress message
    this.loadResources(this.commonAssets, this.initGameSetup.bind(this), 500)

    // Check for local storage
    if (typeof Storage !== "undefined") {
      console.log("Storage detected")
      this.hasStorage = true
      
      // load best times from local storage
      puzzles.forEach( (puzzle) => {
        this.bestTimes[puzzle.name] = window.localStorage.getItem("time" + puzzle.name)

        if (!this.bestTimes[puzzle.name]) {
          this.bestTimes[puzzle.name] = (59 * 60 + 59.9) * 1000
        }
      })
    } else {
      console.log("No Storage detected")

      // Init local best times
      puzzles.forEach( (puzzle) => {
        this.bestTimes[puzzle.name] = (59 * 60 + 59.9) * 1000
      })
    }
  }

  initGameSetup() {

    // Hide loading spinner
    let loadEl = document.getElementById('loading-outer');
    loadEl.style.visibility = 'hidden'

    // Add background
    this.background = new Background('spr_background', this.maxWidth, this.maxHeight)
    this.pixiApp.stage.addChild(this.background)
    this.registerInstance(this.background)

    let loadingStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 72,
      fill: 0xFFFFFF,
      stroke: 0x404060,
      strokeThickness: 10,
      padding: 20
    })

    // loading message
    this.loadingMessage = new PIXI.Text("Loading...", loadingStyle)
    this.loadingMessage.x = this.maxWidth / 2
    this.loadingMessage.y = this.maxHeight / 2
    this.loadingMessage.anchor.set(0.5, 0.5)
    this.loadingMessage.displayGroup = this.uiLayer
    this.loadingMessage.visible = false
    this.pixiApp.stage.addChild(this.loadingMessage)

    // Title screen
    let titleScreen = new TitleScreen(this)
    this.pixiApp.stage.addChild(titleScreen)

    // Audio Manager
    this.am = new AudioManager()
    //this.am.playSound('mus_TimeToDream')

    this.registerInstance(this)
  }

  menuSetup() {
    // create menu screen
    this.menuScreen = new PuzzleMenu(this)
    this.pixiApp.stage.addChild(this.menuScreen)

    this.optionsScreen = new OptionsMenu(this)
    this.optionsScreen.deactivate()
    this.pixiApp.stage.addChild(this.optionsScreen)

    // create puzzle screen
    this.initPuzzleSetup()
    this.toggleUIVisibility(false)
  }

  initPuzzleSetup() {
    this.xOffset = (this.maxWidth - 854) / 2
    this.yOffset = (this.maxHeight - 480) / 2

    // Add frame
    this.frame = new PIXI.Sprite(PIXI.utils.TextureCache["spr_frame"])
    this.frame.pivot = new PIXI.Point(16,16)
    this.frame.x = this.xOffset
    this.frame.y = this.yOffset
    this.pixiApp.stage.addChild(this.frame)

    // Add Title
    let titleStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 40,
      stroke: 0x404060,
      strokeThickness: 6,
      fill: 'white'
    })

    let timerStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 48,
      stroke: 0x404060,
      strokeThickness: 6,
      fill: 'white'
    })

    let bestTimeStyle = new PIXI.TextStyle({
      fontFamily: 'Kite One',
      fontSize: 24,
      stroke: 0x404060,
      strokeThickness: 3,
      fill: 'white'
    })

    // Puzzle Name
    this.titleText = new PIXI.Text("Title", titleStyle)
    this.titleText.x = 0
    this.titleText.y = 0
    this.titleText.displayGroup = this.uiLayer
    this.pixiApp.stage.addChild(this.titleText)

    // Timer
    this.timerText = new PIXI.Text("0:00", timerStyle)
    this.timerText.x = this.maxWidth / 2
    this.timerText.y = 0
    this.timerText.anchor.set(0.5, 0)
    this.timerText.displayGroup = this.uiLayer
    this.pixiApp.stage.addChild(this.timerText)

    // Best Time
    this.bestTimeText = new PIXI.Text("0:00", bestTimeStyle)
    this.bestTimeText.x = this.maxWidth
    this.bestTimeText.y = this.maxHeight
    this.bestTimeText.anchor.set(1, 1)
    this.bestTimeText.displayGroup = this.uiLayer
    this.pixiApp.stage.addChild(this.bestTimeText)
  }

  loadLevel(level) {
    console.log("Changing Levels")

    this.loadingMessage.visible = true

    // load new puzzle
    this.currentLevel = level
    this.videoURI = puzzles[this.currentLevel].file
    this.titleText.text = "Loading"
    this.puzzleComplete = false
    this.bestTimeText.text = "Best: " + Utils.msToTimeString(this.bestTimes[puzzles[this.currentLevel].name], 1)

    // if video isn't already in cache, load it
    // kludge - due to a CORS bug in the resource loader 
    //          (https://github.com/englercj/resource-loader/issues/99), 
    //          we need to bypass it in order to load videos 
    //          from an external source

    //if (!PIXI.loader.resources.hasOwnProperty(this.videoURI)) {
      //this.loadResources(this.videoURI, this.puzzleSetup.bind(this), 0)

    if (!this.videoElements.hasOwnProperty(this.videoURI)) {
      var ve = document.createElement('video')
      ve.crossOrigin = "anonymous"
      ve.autoplay = true
      ve.src = this.videoURI
      this.videoElements[this.videoURI] = ve

      this.loadResources({
        url: {
          metadata: {
            loadElement: this.videoElements[this.videoURI]
          }
        },
        name: this.videoURI
      }, this.puzzleSetup.bind(this), 0)
    } else {
      this.puzzleSetup()
    }
  } 

  puzzleSetup() {
    console.log("Setting up puzzle...")

    this.titleText.text = puzzles[this.currentLevel].name

    //let bw = new PIXI.filters.ColorMatrixFilter()

    this.videoTex = PIXI.Texture.fromVideo(PIXI.loader.resources[this.videoURI].data)
    this.videoTex.baseTexture.source.loop = true
    this.videoTex.baseTexture.source.play()
    this.guide = new PIXI.Sprite(this.videoTex)

    this.guide.x = this.xOffset
    this.guide.y = this.yOffset
    this.guide.scale.x = this.videoScale
    this.guide.scale.y = this.videoScale
    this.guide.tint = 0x606060

    this.pixiApp.stage.addChild(this.guide)

    let cellWidth = this.videoTex.width / this.numColumns
    let cellHeight = this.videoTex.height / this.numRows

    let pieceWidth = cellWidth / this.numColumns * this.videoScale
    let pieceHeight = cellHeight / this.numRows * this.videoScale

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numColumns; j++) {
        
        let rect = new PIXI.Rectangle((j*cellWidth).toFixed(2), (i*cellHeight).toFixed(2), cellWidth, cellHeight)
        let pieceTex = new PIXI.Texture(this.videoTex.baseTexture)
        pieceTex.frame = rect

        let pieceX = this.xOffset + (j+0.5)*(cellWidth * this.videoScale)
        let pieceY = this.yOffset + (i+0.5)*(cellHeight * this.videoScale)

        let newPiece = new Piece(pieceX, pieceY, pieceWidth, pieceHeight, cellWidth, cellHeight, this.videoScale, pieceTex, this)
        newPiece.randomizePosition(this.xOffset - 99, 
                    this.yOffset - 52, 
                    this.xOffset + this.guide.width + 99,
                    this.yOffset + this.guide.height + 52)
        
        this.registerInstance(newPiece)
        this.pieces.push(newPiece)
        this.pixiApp.stage.addChild(newPiece)
      }
    }

    this.pauseButton = new Button(this.maxWidth-50, 40, "spr_button100", "Menu", this.togglePauseGame.bind(this, true))
    this.pauseButton.displayGroup = this.uiLayer
    this.pixiApp.stage.addChild(this.pauseButton)
    this.registerInstance(this.pauseButton)

    this.loadingNewLevel = false
    this.timerNowTime = window.performance.now()
    this.timerThenTime = this.timerNowTime
    this.duration = 0

    this.loadingMessage.visible = false
    this.processPaused = false
    this.toggleUIVisibility(true)
  }

  removePuzzle() {
    this.loadingNewLevel = true
    
    if (this.guide) {
      // Pause and reset current video
      this.guide.texture.baseTexture.source.pause()
      this.guide.texture.baseTexture.source.currentTime = 0

      // remove guide
      this.unregisterInstance(this.guide)
      this.destroyInstance(this.guide, true, false)
    }

    // remove pieces
    if (this.pieces) {
      this.pieces.forEach( (piece) => {
        this.unregisterInstance(piece)
        this.destroyInstance(piece, true, false)
      })

      this.pieces = []
    }

    // remove back button
    if (this.pauseButton) {
      this.unregisterInstance(this.pauseButton)
      this.destroyInstance(this.pauseButton, false, false)
    }
  }

  toggleUIVisibility(on) {

    // check to see if the instance exists before toggling its visibility
    const safeToggle = (inst, on) => {
      if (inst) {
        inst.visible = on
      }
    }

    safeToggle(this.frame, on)
    safeToggle(this.titleText, on)
    safeToggle(this.timerText, on)
    safeToggle(this.bestTimeText, on)
    safeToggle(this.pauseButton, on)
    safeToggle(this.guide, on)

    this.pieces.forEach( (piece) => {
      safeToggle(piece, on)
    })
  }

  togglePauseGame(pause) {
    this.processPaused = pause
    this.toggleUIVisibility(!pause)

    if (pause) {
      if (this.guide) {
        this.guide.texture.baseTexture.source.pause()
      }
      this.optionsScreen.activate()
    } else {
      if (this.guide) {
        this.guide.texture.baseTexture.source.play()
        this.timerThenTime = window.performance.now()
      }
    }
  }

  backToMenu() {
    this.removePuzzle()
    this.toggleUIVisibility(false)
    this.menuScreen.activate()
  }

  process() {
    let done = true

    // Check to see if all pieces are in there correct places
    this.pieces.forEach( (piece) => {
      done = piece.done && done
    })

    if (!this.loadingNewLevel) {
      if (!this.puzzleComplete) {
        if (done) {

          this.titleText.text = "Complete!"
          this.puzzleComplete = true
          this.guide.tint = 0xFFFFFF
          this.pieces.forEach(function(piece) {
            piece.visible = false
          })

          // Record best time
          if (this.duration < this.bestTimes[puzzles[this.currentLevel].name]) {
            this.bestTimes[puzzles[this.currentLevel].name] = this.duration
            this.bestTimeText.text = "Best: " + Utils.msToTimeString(this.duration, 1)

            if (this.hasStorage) {
              window.localStorage.setItem("time" + puzzles[this.currentLevel].name, this.duration)
            }
          }

        } else {
          this.timerNowTime = window.performance.now()
          this.duration += this.timerNowTime - this.timerThenTime
          this.timerText.text = Utils.msToTimeString(this.duration, 1)
          this.timerThenTime = this.timerNowTime
        }
      }
    }
  }
}