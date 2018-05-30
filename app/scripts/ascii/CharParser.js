import { sortBy } from 'underscore'
import EventObject from '../EventObject'
import xx from 'xx'

export default class CharParser extends EventObject {
  constructor() {
    super()
    this.size = 500
    this.canvasDom = document.createElement('canvas')
    this.textDom = document.getElementById('text')
    this.ctx = this.canvasDom.getContext('2d')

    this.init()
    this.observe()
    this.parse()
  }

  init() {
    this.rawChars = []
    this.chars = []

    this.canvasDom.width = this.size
    this.canvasDom.height = this.size

    this.ctx.font = `${this.size}px/${this.size}px sans-serif`
    this.ctx.textBaseline = 'top';
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
    this.ctx.clearRect(0, 0, this.size, this.size);
  }

  getSumPixelCount() {
    const { data } = this.ctx.getImageData(0, 0, this.size, this.size)
    const sum = data.filter(data => data > 0).reduce((a, b) => a + b)
    return sum
  }

}
