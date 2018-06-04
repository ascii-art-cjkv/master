import xx from 'xx'

import Canvas from './Canvas'
import CharParser from './CharParser'
import ImageParser from './ImageParser'
import WebcamParser from './WebcamParser'

class AsciiPainter extends Canvas {
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
      this.resize()
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

    this.imageParser.on('imageSizeChanged', this.resize.bind(this))
    this.webcamParser.on('imageSizeChanged', this.resize.bind(this))
    window.addEventListener('resize', this.resize.bind(this))
  }

  redraw() {
    if (!this.sourceObj.grayData || !this.charParser.chars) return
    this.grayData = this.getMappedGrayData()
    this.draw()
  }

  resize() {
    const { imageHeight, imageWidth } = this.sourceObj

    const toRetinaScale = window.devicePixelRatio > 1 ? 2 : 1

    const padding = 70
    const maxWidth = (window.innerWidth - padding * 2) * toRetinaScale
    const maxHeight = (window.innerHeight - padding * 2) * toRetinaScale
    const ratio = imageWidth / imageHeight
    const windowRatio = maxWidth / maxHeight

    let width, height

    if (windowRatio < ratio) { // window is thiner
      width = maxWidth
      height = width  / ratio
    } else {
      height = maxHeight
      width = ratio * height
    }

    this.setSize(width, height)
    this.setColor(this.color)
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
        charObj = this.charParser.chars[pixelGray - (this.isTransparent ? 1 : 0)]

        if (!charObj) continue

        this.ctx.fillText(charObj.char, x * this.charSize + offsetX, y * this.charSize)
      }
    }
  }

  getMappedGrayData() {
    let newGray;

    const grayData = this.sourceObj.grayData
    const chars = this.charParser.chars

    const grayMin = Math.min.apply(null, grayData)
    const grayMax = Math.max.apply(null, grayData)
    const newGrayMin = 0
    const newGrayMax = chars.length - (this.isTransparent ? 0 : 1)
    const newGrayData = []

    return grayData.map((gray) => {
      return newGrayMax - Math.round(this.mapToRange(gray, grayMin, grayMax, newGrayMin, newGrayMax))
    })
  }

  mapToRange(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

}

export default AsciiPainter
