import AsciiPainter from './AsciiPainter'
import FileHandler from './FileHandler'
import Control from './Control'

import { xx, isMobile } from 'xx'

const makePreset = (text, resolution, color, bgColor, image) => ({ text, resolution, color, bgColor, image })

const presets = [
  makePreset('愛因斯坦', 30, '#000', '#fff', 'albert-einstein.jpg'),
  makePreset('打一個由淺到深的詞吧', 30, '#7c7c7c', '#000', 'gradient.jpg'),
  makePreset('哪裡的人民害怕政府，哪裡就有暴政。哪裡的政府害怕人民，哪裡就有自由。', 20, '#000', '#fff', 'v.jpg'),
  makePreset('笑 臉 贏 人 ', 20, '#fff', '#000', 'ba90.png'),
  makePreset('飛快的棕色狐狸跳過了懶狗 ', 30, '#673808', '#e7ff98', 'qbf.jpg'), // from https://dribbble.com/shots/330090-The-quick-brown-fox-
]

const settings = presets[Math.floor(Math.random() * presets.length)]

const painter = new AsciiPainter(settings)
const controls = new Control(settings, painter)

new FileHandler(painter)

if (isMobile()) {
  document.body.classList.add('is-mobile')
} else {
  controls.on('webcam', 'change', (e) => painter.setSourceToWebcam(e.target.checked))
}

controls.on('text', 'change', (e) => painter.charParser.parse(e.target.value))
        .on('download', 'click', (e) => e.target.href = painter.toDataURL())
        .on('resolution', 'change', (e) => painter.setResolution(e.target.value))
