
import { isMobile } from 'xx'

// make presets
const makePreset = (text, resolution, color, bgColor, image, webcam = false) => ({ text, resolution, color, bgColor, image, webcam })
const randomRange = () => 20 + Math.floor(Math.random() * 80)

const howManyDays = parseInt((new Date().getTime() - new Date('March, 19, 2017').getTime()) / (24 * 60 * 60 * 1000)) + 1

const url = new URL(location.href)
const isJp = url.search.includes('jp')
let presets = null

if (isJp) {
  presets = [
    makePreset('反送中', 80, '#000000', '#ffffff', 'no_china_extradition.jpg'),
    makePreset('八九六四', 80, '#000000', '#ffffff', '64.jpg'),
    makePreset('ノーベル平和賞受賞者', 60, '#000000', '#ffffff', 'liu_xiaobo.png'),
    makePreset('台湾独立', 30, '#000000', '#ffffff', 'taiwan.jpg'),
  ]
} else {
  presets = [
    makePreset('支持香港！', 80, '#000000', '#ffffff', 'no_china_extradition.jpg'),
    makePreset('八九六四', 80, '#000000', '#ffffff', '64.jpg'),
    makePreset(`尋找李明哲，第${howManyDays}天。`, randomRange(), '#000000', '#ffffff', 'lee_ming_cheh.jpg'),
    makePreset('諾貝爾和平獎得主', 100, '#000000', '#ffffff', 'liu_xiaobo.png'),
    makePreset('台獨', 30, '#000000', '#ffffff', 'taiwan.jpg'),
    makePreset('小熊維尼。', 20, '#000000', '#ffffff', 'xi_jing_pooh.jpg'),
  ]
}

let sampleIndex = -1

export default function getSetting() {
  sampleIndex++
  if (sampleIndex > presets.length - 1) sampleIndex = 0

  if (isMobile()) {
    presets[sampleIndex].resolution = 35
  }

  return presets[sampleIndex]
}
