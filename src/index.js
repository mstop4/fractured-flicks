import {Puzzle} from './libs/videoPuzzle/Puzzle.js'
import WebFont from 'webfontloader'

window.onload = () => {
  WebFont.load({

    // triggers when fonts has loaded
    active: () => {
      let vp = new Puzzle()
      vp.initGame()
    },

    fontLoading: preRenderFont,

    google: {
      families: [ 'Kite One' ]
    }
  })
}

const preRenderFont = (fontName) => {
  // create <p> tag with our font and render some text secretly. We don't need to see it after all...

	let el = document.createElement('p');
	el.style.fontFamily = fontName;
	el.style.fontSize = "0px";
	el.style.visibility = "hidden";
	el.innerHTML = '.';
	
  document.body.appendChild(el);
}