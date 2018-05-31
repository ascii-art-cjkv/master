import xx from 'xx'

import Canvas from './Canvas'
import CharParser from './CharParser'
import ImageParser from './ImageParser'
import WebcamParser from './WebcamParser'

export default class AsciiPainter extends Canvas {
  constructor({ blur, text }) {
    super()
    this.resolution = blur

    this.charParser = new CharParser(text)
    this.webcamParser = new WebcamParser(this.resolution)
    this.imageParser = new ImageParser(this.resolution)

    this.setSource()
    this.appendCanvasToBody()
    this.fullscreen()
    this.setCharSize()
    this.observe()
  }

  appendCanvasToBody() {
    this.canvasDom.setAttribute('id', 'ascii')
    this.canvasDom.classList.add('full-screen')

    document.body.appendChild(this.canvasDom)
  }

  observe() {
    this.charParser.on('charsUpdated', this.redraw.bind(this))
    this.webcamParser.on('grayDataUpdated', this.redraw.bind(this))
    this.imageParser.on('grayDataUpdated', this.redraw.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }

  setSource(toUseWebcam) {
    this.sourceObj = toUseWebcam && this.webcamParser || this.imageParser
    if (toUseWebcam) {
      this.webcamParser.getWebcam()
    } else {
      this.webcamParser.stopWebcam()
    }
  }

  redraw() {
    if (!this.charParser.chars) return
    this.grayData = this.mapGrayWithChar(this.sourceObj.grayData, this.charParser.chars)
    this.setCharSize()
    this.draw()
  }

  onResize() {
    this.fullscreen()
    this.redraw()
  }

  fullscreen() {
    const toRetinaScale = window.devicePixelRatio > 1 ? 2 : 1
    this.setSize(window.innerWidth * toRetinaScale, window.innerHeight * toRetinaScale)
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.sourceObj.setResolution(resolution)
  }

  setCharSize() {
    this.charSize = this.height/ this.sourceObj.height
    this.setFont(`${this.charSize}px sans-serif`)
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
