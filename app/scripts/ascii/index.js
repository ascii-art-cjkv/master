import AsciiPainter from './AsciiPainter'
import FileHandler from './FileHandler'
import Control from './Control'

import { xx, isMobile } from 'xx'


// make presets
const makePreset = (text, resolution, color, bgColor, image, webcam = false) => ({ text, resolution, color, bgColor, image, webcam })

const isDesktop = !isMobile()
const presets = [
  makePreset('黑白灰', 70, '#000', '#fff', 'gradient.jpg'),
  makePreset('笑 臉 贏 人 ', 20, '#fff', '#000', 'ba90.png'),
  makePreset('飛快的棕色狐狸跳過了懶狗 ', 30, '#673808', '#e7ff98', 'qbf.jpg'), // from https://dribbble.com/shots/330090-The-quick-brown-fox-
]

if (isDesktop) {
  presets.push(makePreset('E = instein', 30, '#000', '#fff', 'albert-einstein.jpg'))
  presets.push(makePreset('人民 政府 自由 畏懼', 20, '#000', '#fff', 'v.jpg'))
}

let sampleIndex = Math.floor(Math.random() * presets.length)
let settings = presets[sampleIndex]


// init painter
const painter = new AsciiPainter(settings)
const controls = new Control(settings, painter)

new FileHandler(painter)


// bind controls behavior
controls.on('text', 'change', (e) => painter.charParser.parse(e.target.value))
        .on('download', 'click', (e) => e.target.href = painter.toDataURL())
        .on('resolution', 'input', (e) => painter.setResolution(e.target.value))

if (isDesktop) {
  controls.on('webcam', 'change', (e) => painter.setSourceToWebcam(e.target.checked))
}


// handle desktop & mobile
document.body.classList.add(isDesktop ? 'is-desktop' : 'is-mobile')

document.body.addEventListener('keydown', (e) => {
  // press r
  e.target.tagName.toLowerCase() !== 'input' && e.which === 82 && reload()
})

painter.canvasDom.addEventListener('touchstart', reload)

function reload() {
  painter.canvasDom.classList.remove('is-done')
  sampleIndex++
  if (sampleIndex > presets.length - 1) sampleIndex = 0

  settings = presets[sampleIndex]
  controls.applySettings(settings)
  painter.imageParser.loadSample(settings.image)
}
