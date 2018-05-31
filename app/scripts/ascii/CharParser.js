import { sortBy } from 'underscore'

import Canvas from './Canvas'
import xx from 'xx'

class CharParser extends Canvas {
  constructor() {
    super()
    this.size = 500
    this.textDom = document.getElementById('text')

    this.init()
    this.observe()
    this.parse()
  }

  init() {
    this.rawChars = []
    this.chars = []

    this.setSize(this.size)
    this.setFont(`${this.size}px/${this.size}px sans-serif`)
  }

  observe() {
    this.textDom.addEventListener('change', this.parse.bind(this))
  }

  parse() {
    this.chars = []
    this.updateRawChars()
    this.updateChars()
    this.trigger('charsUpdated', this.chars)
  }

  updateRawChars() {
    this.rawChars = this.textDom.value.replace(/[\n| ]/g, '').split('')
    this.rawChars = Array.from(new Set(this.rawChars))
  }

  updateChars() {
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
