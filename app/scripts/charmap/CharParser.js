import { sortBy } from 'underscore'
import Canvas from './Canvas'
import {xx} from 'xx'

class CharParser extends Canvas {
  constructor() {
    super()

    this.size = 5
    this.init()
  }

  init() {
    this.rawChars = []
    this.chars = []
    this.textPool = {}

    this.setSize(this.size)
    this.setFont({
      fontSize: this.size,
      fill: 'red'
    })
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
    let text = this.textPool[char]
    if (!text) {
      this.textPool[char] = text = new PIXI.Text(char, this.fontStyle)
    } else {
      text.fontStyle = this.fontStyle
    }
    this.pixi.stage.addChild(text)
    this.chars.push({
      char,
      pixelCount: this.getSumPixelCount()
    })
    this.pixi.stage.removeChild(text)
  }

  getSumPixelCount() {
    return this.getImageData().filter(data => data > 0).reduce((a, b) => a + b)
  }
}

export default CharParser
