// Note: This class is deprecated in favour of using stats.js

const fontStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 16,
  fill: 'white'
})

export class FpsCounter {
  
  constructor(x, y) {

    this.realFpsText = new PIXI.Text("0", fontStyle)
    this.realFpsText.x = x
    this.realFpsText.y = y

    this.realFpsHistory = []
    this.realThen = window.performance.now()

    this.renderFpsText = new PIXI.Text("0", fontStyle)
    this.renderFpsText.x = x
    this.renderFpsText.y = y+20

    this.renderFpsHistory = []
    this.renderThen = window.performance.now()
  }

  addToStage(stage) {
    //stage.addChild(this.realFpsText)
    stage.addChild(this.renderFpsText)
  }

  removeFromStage() {
  }

  update(hasRendered) {

    // update real FPS
    let now = window.performance.now()
    let realDeltaTime = now - this.realThen
    this.realThen = now

    this.realFpsHistory.push(1000 / realDeltaTime)
    if (this.realFpsHistory.length > 20) {
      this.realFpsHistory = this.realFpsHistory.slice(1, 21)
    }

    let sum = this.realFpsHistory.reduce( function (a, b) { return a+b })
    this.realFpsText.text = `Game Loop FPS: ${(sum / this.realFpsHistory.length).toFixed(2)}`

    // update render FPS if game has rendered
    if (hasRendered) {
   
      let renderDeltaTime = now - this.renderThen
      this.renderThen = now
  
      this.renderFpsHistory.push(1000 / renderDeltaTime)
      if (this.renderFpsHistory.length > 20) {
        this.renderFpsHistory = this.renderFpsHistory.slice(1, 21)
      }
  
      sum = this.renderFpsHistory.reduce( function (a, b) { return a+b })
      this.renderFpsText.text = `${(sum / this.renderFpsHistory.length).toFixed(2)}`
    }
  }
}