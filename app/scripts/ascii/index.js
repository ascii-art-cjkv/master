import AsciiPainter from './AsciiPainter'
import * as dat from 'dat.gui'
import initFileHandler from './file-handler'

import xx from 'xx'

const presets = {
  bopomofo: () => {
    return {
      resolution: 30,
      text: '中文字的順序會影響閱讀。ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐ',
      webcam: false,
    }
  },
  sign: () => {
    return {
      resolution: 3.048264182895851,
      text: '↓↑←→★△◯☆♞☞❖✵☻♕⚑',
      webcam: false,
    }
  }
}

const settings = presets.bopomofo()
const painter = new AsciiPainter(settings)

const handlers = {
  changeResolution: () => painter.setResolution(settings.resolution),
  changeText: () => painter.charParser.parse(settings.text),
  changeWebcam: () => painter.setSource(settings.webcam),
}

const gui = new dat.GUI()
initFileHandler(painter)

// const gui = new dat.GUI({
//   load: {
//     remembered: {
//       '中文': [presets.bopomofo()],
//     　'★': [presets.sign()],
//     },
//     closed: false,
//     folders: {}
//   },
// })

// gui.remember(settings)

gui.add(settings, 'resolution', 2, 100).onChange(handlers.changeResolution).listen().step(1)
gui.add(settings, 'text').onFinishChange(handlers.changeText)
gui.add(settings, 'webcam').onFinishChange(handlers.changeWebcam)


  }
}


