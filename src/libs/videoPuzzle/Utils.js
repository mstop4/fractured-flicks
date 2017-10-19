export default {
  
  msToTimeString(milliseconds, numDecimals) {
    
    let min = Math.floor(milliseconds/1000/60)
    let sec = ((milliseconds/1000) % 60).toFixed(numDecimals)

    if (sec < 10) {
      return `${min}:0${sec}`
    } else {
      return `${min}:${sec}`
    }
    
  },

  clamp(value, min, max) {
    return Math.max( Math.min(value, max), min)
  }
}