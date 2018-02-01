export class AudioManager {
  constructor() {
    this.musicOn = true
    this.sfxOn = true
    PIXI.loader.resources['mus_infinityOcean'].sound.loop = true
    PIXI.loader.resources['mus_infinityOcean'].sound.volume = 0.15
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