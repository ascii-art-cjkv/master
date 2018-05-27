import { sortBy } from 'underscore'

export default class CharParser {
  constructor() {
    this.size = 600
    this.canvasDom = document.createElement('canvas')
    this.textDom = document.getElementById('text')
    this.ctx = this.canvasDom.getContext('2d')

    this.init()
    this.observe()

    this.textDom.dispatchEvent(new Event('change'))
  }

  init() {
    this.rawChars = []
    this.chars = []

    this.canvasDom.width = this.size
    this.canvasDom.height = this.size

    this.ctx.font = `${this.size}px/${this.size}px sans-serif`
    this.ctx.textBaseline = 'top';
  }

  on(eventName, callback) {
    this.checkEventExistance(eventName)
    this[eventName].push(callback)
  }

  trigger(eventName, param) {
    this.checkEventExistance(eventName)
    this[eventName].forEach((cb) => cb(param))
  }

  checkEventExistance(eventName) {
    if (!this[eventName]) {
      this[eventName] = []
    }
  }

  observe() {
    this.textDom.addEventListener('change', this.onTextChanged.bind(this))
  }

  onTextChanged(e) {
    this.chars = []
    this.updateRawChars(e)
    this.updateChars()
    this.trigger('charsUpdated', this.chars)
  }

  updateRawChars(e) {
    this.rawChars = e.target.value.split('')
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
