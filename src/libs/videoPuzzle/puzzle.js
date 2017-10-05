import 'pixi.js'
import 'pixi-filters'
import * as app from './app.js'
import {puzzles} from '../../puzzles.config.js'
import {Piece} from './Piece.js'

let pieces = []
let guide = undefined
let textureURIs = puzzles[0].file
let videoScale = 1
let numRows = puzzles[0].numRows
let numColumns = puzzles[0].numColumns
let xOffset = 0
let yOffset = 0

let startLocations = []

export const initGame = () => {
    app.initApp()
    app.loadTextures(textureURIs, setup)
}

const setup = () => {
    console.log("Setting up puzzle...")
    app.titleText.text = puzzles[0].name

    let bw = new PIXI.filters.ColorMatrixFilter()

    let guideTex = PIXI.Texture.fromVideo(PIXI.loader.resources[textureURIs[0]].data)
    guideTex.baseTexture.source.loop = true
    guide = new PIXI.Sprite(guideTex)

    xOffset = (app.maxWidth- guide.width) / 2
    yOffset = (app.maxHeight - guide.height) / 2

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
            let pieceTex = PIXI.Texture.fromVideo(PIXI.loader.resources[textureURIs[0]].data)
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
    window.addEventListener("keydown", onSpacePress, false)
    window.addEventListener("resize", app.scaleStageToWindow, false)

    app.gameLoop(processPieces)
}

let onSpacePress = (event) => {
    if (event.keyCode === 32) {
        pieces.forEach(function(piece) {
            if (piece.dragging) {
                piece.angle += 90 * Math.PI / 180
            }
        })
    }
}

export const processPieces = () => {

    let done = true

    pieces.forEach( (piece) => {
        piece.process()
        done = piece.done && done
    })

    if (done && app.titleText.text != "Complete!") {
        app.titleText.text = "Complete!"
        guide.filters = []
        pieces.forEach(function(piece) {
            piece.visible = false
        })
    }
}