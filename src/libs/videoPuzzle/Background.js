// This class has only on job: a draw a tiled background
// This used to be the job of Puzzle.js, but pausing the game would also stop the background from scrolling,
// so it was decoupled to avoid this.

export class Background extends PIXI.Container{
  constructor(textureRef, width, height) {
    super()

    this.background = new PIXI.extras.TilingSprite(
      PIXI.utils.TextureCache[textureRef],
      width,
      height
    )

    this.addChild(this.background)
  }

  process() {
    this.background.tilePosition.x -= 0.1
    this.background.tilePosition.y -= 0.1
  }
}