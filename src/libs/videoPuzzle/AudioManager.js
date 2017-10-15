export class AudioManager {
  constructor() {
    PIXI.loader.resources['sounds/music1.mp3'].sound.loop = true
  }

  playSound(soundRef) {
    PIXI.loader.resources[soundRef].sound.play()
  }

  pauseSound(soundRef) {
    PIXI.loader.resources[soundRef].sound.pause()
  }
}