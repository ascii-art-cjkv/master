import AsciiPainter from './AsciiPainter'
import * as dat from 'dat.gui'
import xx from 'xx'

const presets = {
  bopomofo: () => {
    return {
      blur: 4,
      text: '中文字的順序會影響閱讀！ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐ',
      webcam: false,
    }
  },
  sign: () => {
    return {
      blur: 3.048264182895851,
      text: '↓↑←→★△◯☆♞☞❖✵☻♕⚑',
      webcam: false,
    }
  }
}

const settings = presets.bopomofo()
const painter = new AsciiPainter(settings)

const handlers = {
  changeResolution: () => painter.setResolution(settings.blur),
  changeText: () => painter.charParser.parse(settings.text),
  changeWebcam: () => painter.setSource(settings.webcam),
}

const gui = new dat.GUI()

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

gui.add(settings, 'blur', 2, 15).onChange(handlers.changeResolution)
gui.add(settings, 'text').onFinishChange(handlers.changeText)
gui.add(settings, 'webcam').onFinishChange(handlers.changeWebcam)
