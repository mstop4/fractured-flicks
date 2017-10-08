import 'pixi.js'
import 'pixi-filters'
import 'pixi-sound'
//import {FpsCounter} from './FpsCounter.js'
import Stats from 'stats.js'
import {Piece} from './Piece.js'

export let pixiApp = undefined
export let soundResources = {}
let fpsCount = undefined
export let maxWidth = 1280
export let maxHeight = 720
let canvas
let instances = []
let puzzleManager

export const initApp = (pm) => {

    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type)

    canvas = document.getElementById('videoPuzzle')

    pixiApp = new PIXI.Application({
        width: maxWidth,
        height: maxHeight,
        backgroundColor: 0x77C9D4,
        view: canvas
    }) 

    //Add the canvas to the HTML document
    document.body.appendChild(pixiApp.view)

    // Stage
    scaleStageToWindow()

    // Puzzle Manager
    puzzleManager = pm

    // Fps counter
    fpsCount = new Stats()
    fpsCount.showPanel(0)
    document.body.appendChild(fpsCount.dom)

    // responsive canvas

    window.addEventListener("resize", scaleStageToWindow, false)

    gameLoop()
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

export const destroyInstance = (instance) => {
    if (instance) {
        pixiApp.stage.removeChild(instance)
        instance.destroy({
            children: true,
            texture: true,
            baseTexture: false   
        })
        instance = null
    }
}

export const registerInstance = (inst) => {
    instances.push(inst)
}

export const unregisterInstance = (inst) => {
    let index = instances.indexOf(inst)

    if (index > -1) {
        instances.splice(index, 1)
    }
}

export const gameLoop = () => {

    fpsCount.begin()
    requestAnimationFrame(gameLoop);
    
    instances.forEach( (inst) => {
        inst.process()
    })

    pixiApp.renderer.render(pixiApp.stage)

    fpsCount.end()
}