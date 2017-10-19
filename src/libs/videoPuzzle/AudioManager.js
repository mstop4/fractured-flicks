export class AudioManager {
  constructor() {
    this.musicOn = true
    this.sfxOn = true
    PIXI.loader.resources['mus_TimeToDream'].sound.loop = true
    PIXI.sound.volume('mus_TimeToDream', 0.5)
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