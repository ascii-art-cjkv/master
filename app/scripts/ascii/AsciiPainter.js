import xx from 'xx'
import CharParser from './CharParser'
import ImageParser from './ImageParser'
import WebCam from './WebCam'

export default class AsciiPainter {
  constructor({ resolution }) {
    this.resolution = resolution

    this.charParser = new CharParser()

    this.sourceObj = new ImageParser(resolution)
    // this.sourceObj = new WebCam(resolution)

    this.canvasDom = document.getElementById('ascii')
    this.ctx = this.canvasDom.getContext('2d')
    this.ctx.textBaseline = 'top'

    this.fullscreen()
    this.setCharSize()

    this.charParser.on('charsUpdated', this.redraw.bind(this))
    this.sourceObj.on('grayDataUpdated', this.redraw.bind(this))
    window.addEventListener('resize', this.resize.bind(this))
  }

  redraw() {
    if (!this.charParser.chars) return
    this.grayData = this.mapGrayWithChar(this.sourceObj.grayData, this.charParser.chars)
    this.setCharSize()
    this.draw()
  }

  resize() {
    this.fullscreen()
    this.redraw()
  }

  fullscreen() {
    const toRetinaScale = window.devicePixelRatio > 1 ? 2 : 1

    this.width = this.canvasDom.width = window.innerWidth * toRetinaScale
    this.height = this.canvasDom.height = window.innerHeight * toRetinaScale
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.sourceObj.setResolution(resolution)
  }

  setCharSize() {
    this.charSize = this.height/ this.sourceObj.height
    this.ctx.font = `${this.charSize}px sans-serif`
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
    let pixelIndex, pixelGray, char

    for (let y = 0; y < this.sourceObj.height; y++) {
      for (let x = 0; x < this.sourceObj.width; x++) {
        pixelIndex = y * this.sourceObj.width + x
        pixelGray = this.grayData[pixelIndex]
        if (!this.charParser.chars[pixelGray]) {
          debugger
        }
        char = this.charParser.chars[pixelGray].char
        this.ctx.fillText(char, x * this.charSize, y * this.charSize)
      }
    }
  }

  mapGrayWithChar(grayData, chars) {
    let newGray;
    const grayMin = Math.min.apply(null, grayData)
    const grayMax = Math.max.apply(null, grayData)
    const newGrayMin = 0
    const newGrayMax = chars.length - 1
    const newGrayData = []

    return grayData.map((gray) => {
      return newGrayMax - Math.round(this.mapToRange(gray, grayMin, grayMax, newGrayMin, newGrayMax))
    })
  }

  mapToRange(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

}
