import xx from 'xx'
import CharParser from './CharParser'
import ImageParser from './ImageParser'

export default class AsciiPainter {
  constructor({ charSize, resolution }) {
    this.charParser = new CharParser()
    this.imageParser = new ImageParser(resolution)
    this.canvasDom = document.getElementById('canvas')
    this.ctx = this.canvasDom.getContext('2d')
    this.ctx.textBaseline = 'top'

    this.charSize = charSize

    this.charParser.on('charsUpdated', (chars) => {
      if (!chars.length) return
      this.clear()
      this.imageParser.mapGrayWithChar(chars.length)
      this.resize()
      this.draw()
    })
  }

  resize() {
    this.width = this.imageParser.width * this.charSize
    this.height = this.imageParser.height * this.charSize
    this.canvasDom.width = this.width
    this.canvasDom.height = this.height
    this.ctx.font = `${this.charSize}px sans-serif`
    if (window.devicePixelRatio > 1) {
      this.canvasDom.style.width = this.width * 0.5 + 'px'
      this.canvasDom.style.height = this.height * 0.5 + 'px'
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
  }

  draw() {
    let pixelIndex, pixelGray, char

    for (let y = 0; y < this.imageParser.height; y++) {
      for (let x = 0; x < this.imageParser.width; x++) {
        pixelIndex = y * this.imageParser.width + x
        pixelGray = this.imageParser.mappedGrayData[pixelIndex]
        char = this.charParser.chars[pixelGray].char
        this.ctx.fillText(char, x * this.charSize, y * this.charSize)
      }
    }
  }

}
