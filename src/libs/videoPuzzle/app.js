import 'pixi.js'
import {FpsCounter} from './FpsCounter.js'
import {Piece} from './Piece.js'

export let pixiApp = undefined
export let titleText = undefined
let frameSkip = 1
let fsIndex = 0
let fpsCount = undefined
export let maxWidth = 1280
export let maxHeight = 720

export const initApp = () => {

    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type)

    pixiApp = new PIXI.Application({
        width: maxWidth,
        height: maxHeight,
        backgroundColor: 0x808080,
    }) 

    //Add the canvas to the HTML document
    document.getElementById("videoPuzzle").appendChild(pixiApp.view)

    // Stage
    scaleStageToWindow()

    // Fps counter
    fpsCount = new FpsCounter()
    fpsCount.addToStage(pixiApp.stage)

    titleText = new PIXI.Text("Title")
    titleText.x = 0
    titleText.y = 0
    pixiApp.stage.addChild(titleText)
}

// Load sprites to cache
export const loadTextures = (texArray, setup) => {

    PIXI.loader
    .add(texArray)
    .on("progress", loadProgressHandler)
    .load(setup)

    // Sprite Loader setup
    function loadProgressHandler(loader, resource) {
        console.log(`Loading "${resource.url}" ... ${loader.progress}%`)
    }
}

export const scaleStageToWindow = () => {

    let hRatio = (window.innerHeight) / maxHeight
    let wRatio = (window.innerWidth) / maxWidth
    let leastRatio = Math.min(hRatio, wRatio)
    
    pixiApp.renderer.resize(Math.min(maxWidth * leastRatio, maxWidth), Math.min(maxHeight * leastRatio, maxHeight))
    pixiApp.stage.scale = new PIXI.Point(Math.min(1, leastRatio), Math.min(1, leastRatio))
}

export const gameLoop = (updateFunc) => {
    requestAnimationFrame(function () { gameLoop(updateFunc) } );

    updateFunc()

    let hasRendered = false

    //Tell the `renderer` to `render` the `stage`
    if (fsIndex === frameSkip) {
        pixiApp.renderer.render(pixiApp.stage)
        fsIndex = 0
        hasRendered = true
    } else {
        fsIndex++
    }

    fpsCount.update(hasRendered)
}