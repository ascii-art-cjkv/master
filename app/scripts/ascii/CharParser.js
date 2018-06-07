import { sortBy } from 'underscore'

import Canvas from './Canvas'
import xx from 'xx'

class CharParser extends Canvas {
  constructor(text) {
    super()
    this.size = 5

    this.init()
    this.parse(text)
  }

  init() {
    this.rawChars = []
    this.chars = []

    this.setSize(this.size)
    this.setFont(`${this.size}px/${this.size}px sans-serif`)
  }

  parse(text) {
    this.chars = []

    this.hasSpace = text.includes(' ')
    this.updateChars(text)
    this.trigger('charsUpdated', this.chars)
  }

  updateChars(text) {
    this.rawChars = text.replace(/[\n| ]/g, '').split('')
    this.rawChars = Array.from(new Set(this.rawChars))
    this.rawChars.forEach(this.updateChar.bind(this))
    this.chars = sortBy(this.chars, 'pixelCount')
  }

  updateChar(char) {
    this.ctx.fillText(char, 0, 0)
    this.chars.push({
      char,
      pixelCount: this.getSumPixelCount()
    })

    this.clear()
  }

  getSumPixelCount() {
    return this.getImageData().filter(data => data > 0).reduce((a, b) => a + b)
  }

}

export default CharParser
