
import { isMobile } from 'xx'

// make presets
const makePreset = (text, resolution, color, bgColor, image, webcam = false) => ({ text, resolution, color, bgColor, image, webcam })
const randomRange = () => 20 + Math.floor(Math.random() * 80)

const howManyDays = parseInt((new Date().getTime() - new Date('March, 19, 2017').getTime()) / (24 * 60 * 60 * 1000)) + 1

const presets = [
  makePreset(`尋找李明哲，第${howManyDays}天。`, randomRange(), '#000000', '#ffffff', 'lee_ming_cheh.jpg'),
  makePreset('六四。', 50, '#000000', '#ffffff', '64.jpg'),
  makePreset('我主張台灣獨立。', 70, '#000000', '#ffffff', 'nylon.jpg'),
  makePreset('小熊維尼。', 20, '#000000', '#ffffff', 'xi_jing_pooh.jpg'),
]

let sampleIndex = -1

export default function getSetting() {
  sampleIndex++
  if (sampleIndex > presets.length - 1) sampleIndex = 0

  if (isMobile()) {
    presets[sampleIndex].resolution = 35
  }

  return presets[sampleIndex]
}
