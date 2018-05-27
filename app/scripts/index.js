import './../styles/main.scss'

if (process.env.NODE_ENV !== 'production') {
  require('./../index.pug')
}

import xx from 'xx'
import CharParser from './CharParser'
import ImageParser from './ImageParser'

const charSize = 5

const charParser = new CharParser()
const imageParser = new ImageParser(charSize)

charParser.on('charsUpdated', (chars) => {
  xx(chars)
})
