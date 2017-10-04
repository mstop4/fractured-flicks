import * as app from './app.js'
import 'pixi-filters'

let sprites = []
let textureURIs = ["./videos/squirrel.mp4"]
let videoScale = 1
let numRows = 4
let numColumns = 8
let xOffset = 0
let yOffset = 0

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
    app.titleText.text = textureURIs[0]

    let bw = new PIXI.filters.ColorMatrixFilter()

    let guideTexture = PIXI.Texture.fromVideo(PIXI.loader.resources[textureURIs[0]].data)
    guideTexture.baseTexture.source.loop = true
    let guideSprite = new PIXI.Sprite(guideTexture)

    xOffset = (app.pixiApp.view.width - guideSprite.width) / 2
    yOffset = (app.pixiApp.view.height - guideSprite.height) / 2

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
                    newSprite.x = Math.random() * (guideTexture.width + xOffset)
                    newSprite.y = yOffset - yOffset / 2
                    break;
                case 1:
                    newSprite.x = Math.random() * (guideTexture.width + xOffset)
                    newSprite.y = yOffset + guideTexture.height + yOffset / 2
                    break;
                case 2:
                    newSprite.x = xOffset - xOffset / 2
                    newSprite.y = Math.random() * (guideTexture.height + yOffset)
                    break;
                case 3:
                    newSprite.x = xOffset + guideTexture.width + xOffset / 2
                    newSprite.y = Math.random() * (guideTexture.height + yOffset)
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
            newSprite.done = false

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
    this.dragging = true
    this.filters = [outlineDrag]
    app.pixiApp.stage.removeChild(this)
    app.pixiApp.stage.addChild(this)
}

let onDragEnd = function() {
    this.data = null
    this.dragging = false

    if (Math.abs(this.x - this.xStart) < 32 && Math.abs(this.y - this.yStart) < 32 && this.angle % (2 * Math.PI) === 0) {
        this.x = this.xStart
        this.y = this.yStart
        this.filters = [outlineCorrect]
        this.done = true
    } else {
        this.filters = [outlineIdle]
        this.done = false
    }
}

let onDragMove = function() {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent)
        this.x = newPosition.x
        this.y = newPosition.y
    }
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