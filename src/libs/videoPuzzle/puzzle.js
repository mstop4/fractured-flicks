import 'pixi-filters'
import * as app from './app.js'
import {puzzles} from '../../puzzles.config.js'
import {Piece} from './Piece.js'

let pieces = []
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
    let guide = new PIXI.Sprite(guideTex)

    xOffset = (app.pixiApp.view.width - guide.width) / 2
    yOffset = (app.pixiApp.view.height - guide.height) / 2

    guide.x = xOffset
    guide.y = yOffset
    guide.filters = [bw]
    bw.desaturate()

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

            let newPiece = new PIXI.Piece(pieceX, pieceY, pieceTex)
            newPiece.randomizePosition(xOffset - 50, 
                                       yOffset - 50, 
                                       xOffset + guide.width + 50,
                                       yOffset + guide.height + 50)

            pieces.push(piece)
            app.pixiApp.stage.addChild(piece)    
        }
    }
    window.addEventListener("keydown", onSpacePress, false)
    app.gameLoop(processPieces)
}

let onSpacePress = (event) => {
    if (event.keyCode === 32) {
        sprites.forEach(function(spr) {
            if (spr.dragging) {
                spr.angle += 90 * Math.PI / 180
            }
        })
    }
}

export const processPieces = () => {

    let done = true

    sprites.forEach(function(spr) {
        if (spr.angle > spr.rotation) {
            if (Math.abs(spr.angle - spr.rotation) < spr.angleDelta) {
                spr.rotation = spr.angle
            } else {
                spr.rotation += spr.angleDelta
            }
        } else if (spr.angle < spr.rotation) {
            if (Math.abs(spr.angle - spr.rotation) < spr.angleDelta) {
                spr.rotation = spr.angle
            } else {
                spr.rotation -= spr.angleDelta
            }
        }

        if (!spr.done) {
            done = false
        }
    })

    if (done && app.titleText.text != "Complete!") {
        app.titleText.text = "Complete!"
        sprites.forEach(function(spr) {
            spr.filters = []
        })
    }
}