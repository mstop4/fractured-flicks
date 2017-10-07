import 'pixi.js'
import 'pixi-filters'
import 'pixi-sound'
//import {FpsCounter} from './FpsCounter.js'
import Stats from 'stats.js'
import {Piece} from './Piece.js'

export let pixiApp = undefined
export let titleText = undefined
export let soundResources = {}
let fpsCount = undefined
export let maxWidth = 1280
export let maxHeight = 720
let canvas

export const initApp = () => {

    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type)

    canvas = document.getElementById('videoPuzzle')

    pixiApp = new PIXI.Application({
        width: maxWidth,
        height: maxHeight,
        backgroundColor: 0x001040,
        view: canvas
    }) 

    console.dir(pixiApp.view)

    //Add the canvas to the HTML document
    document.body.appendChild(pixiApp.view)
    

    // Stage
    scaleStageToWindow()

    // Fps counter
    fpsCount = new Stats()
    fpsCount.showPanel(0)
    document.body.appendChild(fpsCount.dom)

    let titleStyle = new PIXI.TextStyle({
        fontFamily: 'Indie Flower',
        fill: 'white'
    })

    titleText = new PIXI.Text("Title", titleStyle)
    titleText.x = 0
    titleText.y = 0
    pixiApp.stage.addChild(titleText)
}

// Load sprites to cache
export const loadTextures = (texArray, next) => {
    console.log("Loading textures")
    PIXI.loader
    .add(texArray)
    .on("progress", loadProgressHandler)
    .load(next)
}

export const loadAudio = (sndArray, next) => {
    console.log("Loading sounds")
    
    sndArray.forEach( (snd) => {
        soundResources[snd] = PIXI.sound.Sound.from(snd)
    })

    next()
}

const loadProgressHandler = (loader, resource) => {
    console.log(`Loading "${resource.url}" ... ${loader.progress}%`)
}

export const scaleStageToWindow = () => {

    let hRatio = (window.innerHeight) / maxHeight
    let wRatio = (window.innerWidth) / maxWidth
    let leastRatio = Math.min(hRatio, wRatio)
    
    pixiApp.renderer.resize(Math.min(maxWidth * leastRatio, maxWidth), Math.min(maxHeight * leastRatio, maxHeight))
    pixiApp.stage.scale = new PIXI.Point(Math.min(1, leastRatio), Math.min(1, leastRatio))
}

export const gameLoop = (updateFunc) => {

    fpsCount.begin()
    requestAnimationFrame(function () { gameLoop(updateFunc) } );
    updateFunc()
    pixiApp.renderer.render(pixiApp.stage)

    fpsCount.end()
}