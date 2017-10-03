import pixi from 'pixi.js'

let pixiApp = undefined
let sprites = []
let then = window.performance.now()

let fpsText = undefined
let fpsHistory = []
let frameSkip = 1
let fsIndex = 0

export function initApp() {

    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type)

    pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, {
        backgroundColor: 0x808080
    }) 

    // Full window canvas
    pixiApp.renderer.view.style.position = "absolute"
    pixiApp.renderer.view.style.display = "block"
    pixiApp.renderer.autoResize = true
    pixiApp.minFPS = 30

    //Add the canvas to the HTML document
    document.body.appendChild(pixiApp.view)

    window.addEventListener("resize", function () {
        pixiApp.renderer.resize(window.innerWidth, window.innerHeight)
    })

    fpsText = new PIXI.Text("0")
    fpsText.x = 300
    fpsText.y = 0

    pixiApp.stage.addChild(fpsText)
}

// Load sprites to cache
export function loadTextures(texArray, setup) {

    PIXI.loader
    .add(texArray)
    .on("progress", loadProgressHandler)
    .load(setup)

    // Sprite Loader setup
    function loadProgressHandler(loader, resource) {
        console.log(`Loading "${resource.url}" ... ${loader.progress}%`)
    }
}

export function gameLoop(updateFunc) {
    requestAnimationFrame(function () { gameLoop(updateFunc) } );

    updateFunc()

    //Tell the `renderer` to `render` the `stage`
    if (fsIndex === frameSkip) {
        pixiApp.renderer.render(pixiApp.stage)
        fsIndex = 0
    } else {
        fsIndex++
    }

    let now = window.performance.now()
    let deltaTime = now - then
    then = now

    fpsHistory.push(1000 / deltaTime)
    if (fpsHistory.length > 20) {
        fpsHistory = fpsHistory.slice(1, 21)
    }

    let sum = fpsHistory.reduce( function (a, b) { return a+b })
    fpsText.text = `FPS: ${(sum / fpsHistory.length).toFixed(2)}`
}