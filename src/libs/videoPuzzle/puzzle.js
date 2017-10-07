import * as app from './app.js'
import {puzzles} from '../../puzzles.config.js'
import {sounds} from '../../audio.config.js'
import {Piece} from './Piece.js'

let currentLevel = 1

let pieces = []
let guide = undefined
let commonAssets = ['./images/frame.png']
let videoURI = puzzles[currentLevel].file
let soundURIs = sounds
let videoScale = 1
let numRows = puzzles[currentLevel].numRows
let numColumns = puzzles[currentLevel].numColumns
let xOffset = 0
let yOffset = 0
let loadingNewLevel = false
let firstTimeSetup = true

let startLocations = []

export const initGame = () => {
    app.initApp()

    app.loadTextures(commonAssets, () => {
        app.loadAudio(soundURIs, initSetup)
    })
}

const initSetup = () => {

    xOffset = (app.maxWidth - 960) / 2
    yOffset = (app.maxHeight - 540) / 2

    let frame = new PIXI.Sprite(PIXI.utils.TextureCache["./images/frame.png"])
    frame.pivot = new PIXI.Point(16,16)
    frame.x = xOffset
    frame.y = yOffset
    app.pixiApp.stage.addChild(frame)
    loadLevel(0)
}

const loadLevel = (level) => {

    console.log("Changing Levels")
    loadingNewLevel = true

    if (guide) {
        app.pixiApp.stage.removeChild(guide)
        guide.destroy({
            children: true,
            texture: true,
            baseTexture: true   
        })
        guide = null
    }

    if (pieces) {
        pieces.forEach( (piece) => {
            app.pixiApp.stage.removeChild(piece)
            piece.destroy({
                children: true,
                texture: true,
                baseTexture: true
            })
            piece = null
        })

        pieces = []
    }

    currentLevel = level
    videoURI = puzzles[currentLevel].file
    app.titleText.text = "Loading"

    if (!PIXI.loader.resources.hasOwnProperty(videoURI)) {
        app.loadTextures(videoURI, setup)
    } else {
        setup()
    }
} 

const setup = () => {
    console.log("Setting up puzzle...")

    app.titleText.text = puzzles[currentLevel].name

    let bw = new PIXI.filters.ColorMatrixFilter()
    let guideTex = PIXI.Texture.fromVideo(PIXI.loader.resources[videoURI].data)
    guideTex.baseTexture.source.loop = true
    guide = new PIXI.Sprite(guideTex)

    guide.x = xOffset
    guide.y = yOffset
    guide.filters = [bw]
    bw.blackAndWhite()

    app.pixiApp.stage.addChild(guide)

    let cellWidth = guide.width / numColumns
    let cellHeight = guide.height / numRows

    let pieceWidth = cellWidth / numColumns * videoScale
    let pieceHeight = cellHeight / numRows * videoScale

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {

            let rect = new PIXI.Rectangle(j*cellWidth, i*cellHeight, cellWidth, cellHeight)
            let pieceTex = PIXI.Texture.fromVideo(PIXI.loader.resources[videoURI].data)
            pieceTex.frame = rect

            let pieceX = xOffset + (j+0.5)*(cellWidth * videoScale)
            let pieceY = yOffset + (i+0.5)*(cellHeight * videoScale)

            let newPiece = new Piece(pieceX, pieceY, pieceWidth, pieceHeight, cellWidth, cellHeight, pieceTex)
            newPiece.randomizePosition(xOffset - 50, 
                                       yOffset - 50, 
                                       xOffset + guide.width + 50,
                                       yOffset + guide.height + 50)

            pieces.push(newPiece)
            app.pixiApp.stage.addChild(newPiece)
        }
    }
    
    window.addEventListener("resize", app.scaleStageToWindow, false)
    window.addEventListener("keydown", onChangeLevel, false)

    if (firstTimeSetup) {
        app.gameLoop(processPieces)

        app.soundResources['./sounds/music1.mp3'].loop = true
        app.soundResources['./sounds/music1.mp3'].play()

        firstTimeSetup = false
    }

    loadingNewLevel = false
}

const onChangeLevel = (event) => {
    if (event.keyCode === 49) {
        loadLevel(0)
    } else if (event.keyCode === 50) {
        loadLevel(1)
    }
}

export const processPieces = () => {
    let done = true

    pieces.forEach( (piece) => {
        piece.process()
        done = piece.done && done
    })

    if (done && !loadingNewLevel && app.titleText.text != "Complete!") {
        app.titleText.text = "Complete!"
        guide.filters = []
        pieces.forEach(function(piece) {
            piece.visible = false
        })
    }
}