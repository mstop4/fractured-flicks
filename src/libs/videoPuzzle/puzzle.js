import * as app from './app.js'
import 'pixi-filters'

let sprites = []
let textureURIs = ["./videos/squirrel.mp4"]
let videoScale = 1
let numRows = 4
let numColumns = 5
let xOffset = 100
let yOffset = 100

let startLocations = []

let outlineIdle = new PIXI.filters.OutlineFilter(2, 0xFF0000)
let outlineDrag = new PIXI.filters.OutlineFilter(2, 0xFFFF00)
let outlineCorrect = new PIXI.filters.OutlineFilter(2, 0x00FF00)

export const initGame = () => {
    app.initApp()
    app.loadTextures(textureURIs, setup)
}

export const setup = () => {
    console.log("Setting up video...")
    let bw = new PIXI.filters.ColorMatrixFilter()

    let guideTexture = PIXI.Texture.fromVideo(PIXI.loader.resources[textureURIs[0]].data)
    guideTexture.baseTexture.source.loop = true
    let guideSprite = new PIXI.Sprite(guideTexture)
    guideSprite.x = xOffset
    guideSprite.y = yOffset
    guideSprite.filters = [bw]
    bw.desaturate()

    app.pixiApp.stage.addChild(guideSprite)

    let cellWidth = guideTexture.width / numColumns
    let cellHeight = guideTexture.height / numRows

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {

            let rect = new PIXI.Rectangle(j*cellWidth, i*cellHeight, cellWidth, cellHeight)
            let texture = PIXI.Texture.fromVideo(PIXI.loader.resources[textureURIs[0]].data)
            texture.frame = rect
            let newSprite = new PIXI.Sprite(texture)

            let side = Math.floor(Math.random() * 4)

            switch (side) {
                case 0:
                    newSprite.x = Math.random() * (guideTexture.width + cellWidth)
                    newSprite.y = yOffset - cellHeight / 2
                    break;
                case 1:
                    newSprite.x = Math.random() * (guideTexture.width + cellWidth)
                    newSprite.y = yOffset + guideTexture.height + cellHeight / 2
                    break;
                case 2:
                    newSprite.x = xOffset - cellWidth / 2
                    newSprite.y = Math.random() * (guideTexture.height + cellHeight)
                    break;
                case 3:
                    newSprite.x = xOffset + guideTexture.width + cellHeight / 2
                    newSprite.y = Math.random() * (guideTexture.height + cellHeight)
                    break;
            }

            newSprite.xStart = xOffset + (j+0.5)*(cellWidth * videoScale)
            newSprite.yStart = yOffset + (i+0.5)*(cellHeight * videoScale)
            newSprite.width = cellWidth / numColumns * videoScale
            newSprite.height = cellHeight / numRows * videoScale
            newSprite.angle = Math.floor(Math.random() * 4) * 90 * Math.PI / 180
            newSprite.angleDelta = 10 * Math.PI / 180
            newSprite.rotation = 0
            newSprite.anchor.set(0.5, 0.5)
            newSprite.filters = [outlineIdle]

            newSprite.dragging = false

            newSprite.interactive = true
            newSprite.buttonMode = true

            newSprite.on('pointerdown', onDragStart)
            newSprite.on('pointerup', onDragEnd)
            newSprite.on('pointerupoutside', onDragEnd)
            newSprite.on('pointermove', onDragMove)

            sprites.push(newSprite)
            app.pixiApp.stage.addChild(newSprite)
        }
    }

    window.addEventListener("keydown", onSpacePress, false)

    app.gameLoop(processPieces)
}

let onDragStart = function(event) {
    this.data = event.data
    //this.alpha = 0.5
    this.dragging = true
    this.filters = [outlineDrag]
}

let onDragEnd = function() {
    this.data = null
    //this.alpha = 1
    this.dragging = false

    if (Math.abs(this.x - this.xStart) < 16 && Math.abs(this.y - this.yStart) < 16 && this.rotation === this.angle) {
        this.x = this.xStart
        this.y = this.yStart
        this.filters = [outlineCorrect]
    } else {
        this.filters = [outlineIdle]
    }
}

let onDragMove = function() {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent)
        this.x = newPosition.x
        this.y = newPosition.y
    }
}

let onSpacePress = () => {
    console.log("Space")
    sprites.forEach(function(spr) {
        if (spr.dragging) {
            spr.angle += 90 * Math.PI / 180
        }
    })
}

export const processPieces = () => {
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

    })
}