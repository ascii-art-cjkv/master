import './../styles/main.scss'

if (process.env.NODE_ENV !== 'production') {
  require('./../index.pug')
}

import xx from 'xx'
import AsciiPainter from './AsciiPainter'

new AsciiPainter({
  charSize: 20,
  resolution: 3
})
