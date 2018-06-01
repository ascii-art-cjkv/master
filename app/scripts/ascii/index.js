import AsciiPainter from './AsciiPainter'
import initFileHandler from './file-handler'

import xx from 'xx'

const settings = {
  text: '中文字的順序會影響閱讀。ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐ',
  resolution: 30,
  color: '#000000',
  bgColor: '#ffffff'
}

const painter = new AsciiPainter(settings)

initFileHandler(painter)
class Control {
  constructor(settings) {
    Object.keys(settings).forEach(domId => {
      this.addElement(domId)

      const value = settings[domId]
      const attr = typeof value === 'boolean' ? 'checked' : 'value'

      this[domId][attr] = value
    })
  }

  addElement(domName) {
    return this[domName] = document.getElementById(domName)
  }

  on(domName, eventName, handler) {
    let ele = this[domName] || this.addElement(domName)
    ele.addEventListener(eventName, handler)
  }
}

const controls = new Control(settings)

controls.on('text', 'change', (e) => painter.charParser.parse(e.target.value))
controls.on('resolution', 'change', (e) => painter.setResolution(e.target.value))
controls.on('webcam', 'change', (e) => painter.setSource(e.target.checked))
controls.on('color', 'change', (e) => painter.setColor(e.target.value))
controls.on('bgColor', 'change', (e) => painter.setBgColor(e.target.value))
