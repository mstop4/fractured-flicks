export class AudioManager {
  constructor() {
    this.musicOn = true
    this.sfxOn = true
    PIXI.loader.resources['sounds/DST-TimeToDream.mp3'].sound.loop = true
    PIXI.sound.volume('sounds/DST-TimeToDream.mp3', 0.5)
  }

  playSfx(soundRef) {
    if (this.sfxOn) {
      this.playSound(soundRef)
    }
  }

  isPlaying(soundRef) {
    return PIXI.loader.resources[soundRef].sound.isPlaying
  }

  playSound(soundRef) {
    PIXI.loader.resources[soundRef].sound.play()
  }

  pauseSound(soundRef) {
    PIXI.loader.resources[soundRef].sound.pause()
  }
}