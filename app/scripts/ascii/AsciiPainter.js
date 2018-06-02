import xx from 'xx'

import Canvas from './Canvas'
import CharParser from './CharParser'
import ImageParser from './ImageParser'
import WebcamParser from './WebcamParser'

export default class AsciiPainter extends Canvas {
  constructor(options) {
    super()

    const defaultOptions = {
      text: '中文字',
      resolution: 50,
      webcam: false,
      color: '#cc0000',
      bgColor: '#000000',
    }

    Object.assign(this, Object.assign(defaultOptions, options))

    this.charParser = new CharParser(this.text)
    this.webcamParser = new WebcamParser(this.resolution)
    this.imageParser = new ImageParser(this.resolution)

    this.appendCanvasToBody()
    this.fullscreen()
    this.setSourceToWebcam(this.webcam)
    this.updateCharSize()
    this.observe()
  }


  // public

  setSourceToWebcam(toUseWebcam) {
    this.sourceObj = toUseWebcam && this.webcamParser || this.imageParser
    if (toUseWebcam) {
      this.webcamParser.getWebcam()
    } else {
      this.webcamParser.stopWebcam()
      this.redraw()
    }
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.imageParser.setResolution(resolution)
    this.webcamParser.setResolution(resolution)
    this.updateCharSize()
    this.redraw()
  }

  setColor(color) {
    this.color = color
    this.ctx.fillStyle = this.color
    this.redraw()
  }

  setBgColor(bgColor) {
    this.bgColor = bgColor
    this.redraw()
  }

  toDataURL() {
    return this.canvasDom.toDataURL('image/png')
  }

  // private

  appendCanvasToBody() {
    this.canvasDom.setAttribute('id', 'ascii')
    document.body.appendChild(this.canvasDom)
  }

  observe() {
    this.charParser.on('charsUpdated', this.redraw.bind(this))
    this.webcamParser.on('grayDataUpdated', this.redraw.bind(this))
    this.imageParser.on('grayDataUpdated', this.redraw.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }

  redraw() {
    if (!this.sourceObj.grayData || !this.charParser.chars) return
    this.grayData = this.mapGrayWithChar(this.sourceObj.grayData, this.charParser.chars)
    this.draw()
  }

  onResize() {
    this.fullscreen()
    this.updateCharSize()
    this.redraw()
  }

  updateCharSize() {
    this.charSize = this.height / this.resolution
    this.setFont(`${this.charSize}px sans-serif`)
  }

  fullscreen() {
    const toRetinaScale = window.devicePixelRatio > 1 ? 2 : 1
    this.setSize(window.innerWidth * toRetinaScale, window.innerHeight * toRetinaScale)
  }

  clear() {
    this.ctx.save()
    this.ctx.fillStyle = this.bgColor
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore()
  }

  draw() {
    this.clear()

    let pixelIndex, pixelGray, charObj
    const offsetX = (this.width - (this.charSize * this.sourceObj.width)) / 2

    for (let y = 0; y < this.sourceObj.height; y++) {
      for (let x = 0; x < this.sourceObj.width; x++) {
        pixelIndex = y * this.sourceObj.width + x
        pixelGray = this.grayData[pixelIndex]
        charObj = this.charParser.chars[pixelGray]
        if (!charObj) {
          // grayData is not ready
          return
        }
        this.ctx.fillText(charObj.char, x * this.charSize + offsetX, y * this.charSize)
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
