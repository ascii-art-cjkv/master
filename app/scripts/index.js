import './../styles/main.scss'
import './../index.pug'

import AsciiPainter from './AsciiPainter'

const resCtrl = document.getElementById('resolution')

const painter = new AsciiPainter({ resolution: resCtrl.value })

resCtrl.addEventListener('change', (e) => {
  const value = e.target.value
  painter.setResolution(value)
})
