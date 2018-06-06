import AsciiPainter from './AsciiPainter'
import FileHandler from './FileHandler'
import Control from './Control'

import xx from 'xx'

const settings = {
  text: '中文字的順序會影響閱讀。ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐ',
  resolution: 30,
  color: '#004fb0',
  bgColor: '#fffff1'
}

const painter = new AsciiPainter(settings)
const controls = new Control(settings)

new FileHandler(painter)

controls.on('text', 'change', (e) => painter.charParser.parse(e.target.value))
        .on('webcam', 'change', (e) => painter.setSourceToWebcam(e.target.checked))
        .on('download', 'click', (e) => e.target.href = painter.toDataURL())
        .on('resolution', 'change', (e) => painter.setResolution(e.target.value))

// color picker
window.updateColor = (jsColor) => painter.setColor(`#${jsColor}`)
window.updateBgColor = (jsColor) => painter.setBgColor(`#${jsColor}`)
