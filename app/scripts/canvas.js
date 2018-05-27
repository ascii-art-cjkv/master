import xx from 'xx'
import CharParser from './charParser'

const parser = new CharParser()
parser.on('charsUpdated', (chars) => {
  xx(chars)
})
