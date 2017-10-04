import 'pixi.js'
import {fpsCounter} from './fpsCounter.js'

export let pixiApp = undefined
export let titleText = undefined
let frameSkip = 1
let fsIndex = 0
let fpsCount = undefined

export const initApp = () => {

    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type)

    pixiApp = new PIXI.Application({
        width: 1280,
        height: 720,
        backgroundColor: 0x808080,
    }) 

    // Full window canvas
    pixiApp.renderer.autoResize = true

    //Add the canvas to the HTML document
    document.getElementById("videoPuzzle").appendChild(pixiApp.view)

    /*window.addEventListener("resize", function () {
        pixiApp.renderer.resize(window.innerWidth, window.innerHeight)
    })*/

    // fps counter
    fpsCount = new fpsCounter()
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