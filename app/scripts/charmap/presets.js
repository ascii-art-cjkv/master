// make presets
const makePreset = (text, resolution, color, bgColor, image, webcam = false) => ({ text, resolution, color, bgColor, image, webcam })

const presets = [
  makePreset('黑白灰', 20, '#000000', '#ffffff', 'gradient.jpg'),
  makePreset('笑臉贏人', 80, '#ffffff', '#000000', 'ba90.png'),
  makePreset('飛快的棕色狐狸跳過了懶狗', 30, '#673808', '#e7ff98', 'qbf.jpg'), // from https://dribbble.com/shots/330090-The-quick-brown-fox-
  makePreset('E = instein', 100, '#000000', '#ffffff', 'albert-einstein.jpg'),
  makePreset('政府畏懼人民自由', 50, '#000000', '#ffffff', 'v.jpg'),
]

let sampleIndex = Math.floor(Math.random() * presets.length)

export default function getSetting() {
  sampleIndex++
  if (sampleIndex > presets.length - 1) sampleIndex = 0

  return presets[sampleIndex]
}
