import { xx } from 'xx'

import Canvas from './Canvas'
import CharParser from './CharParser'
import ImageParser from './ImageParser'
import WebcamParser from './WebcamParser'

const TO_RETINA_SCALE = window.devicePixelRatio > 1 ? 2 : 1

class AsciiPainter extends Canvas {
  constructor(options) {
    super()

    const defaultOptions = {
      text: '中文字',
      resolution: 50,
      webcam: false,
      color: '#cc0000',
      bgColor: '#000000',
      image: 'sample.png',
    }

    Object.assign(this, Object.assign(defaultOptions, options))

    this.charParser = new CharParser(this.text)
    this.imageParser = new ImageParser(this.resolution, this.image)

    if (!this.isMobile) {
      this.webcamParser = new WebcamParser(this.resolution)
    }

    // this.textarea = document.getElementById('textarea')

    this.appendCanvasToBody()
    this.fullscreen()
    this.setSourceToWebcam(this.webcam)
    this.updateCharSize()
    this.observe()
  }


  // public

  setSourceToWebcam(toUseWebcam) {
    // if (toUseWebcam && this.sourceObj === this.webcamParser) return
    this.sourceObj = toUseWebcam && this.webcamParser || this.imageParser

    if (this.isMobile) return

    if (toUseWebcam) {
      this.webcamParser.getWebcam()
    } else {
      this.webcamParser.stopWebcam()
      this.sourceObj.imageWidth && this.resize()
    }
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.imageParser.setResolution(resolution)
    !this.isMobile && this.webcamParser.setResolution(resolution)
    this.updateCharSize()
    this.redraw()
  }

  setColor(color) {
    this.color = color
    this.ctx.fillStyle = this.color
    // this.textarea.style.color = this.color
    this.redraw()
  }

  setBgColor(bgColor) {
    this.bgColor = bgColor
    document.body.style.backgroundColor = this.bgColor
    this.redraw()
  }

  set(key, value) {
    const methodName = key.charAt(0).toUpperCase() + key.slice(1)
    this[`set${methodName}`](value)
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
    window.addEventListener('resize', this.resize.bind(this))

    this.charParser.on('charsUpdated', this.redraw.bind(this))
    this.imageParser.on('grayDataUpdated', this.redraw.bind(this))
    this.imageParser.on('imageSizeChanged', this.resize.bind(this))
    this.imageParser.on('imageLoad', () => this.setSourceToWebcam(false))

    if (this.isMobile) return

    this.webcamParser.on('grayDataUpdated', this.redraw.bind(this))
    this.webcamParser.on('imageSizeChanged', this.resize.bind(this))
  }

  redraw() {
    if (!this.sourceObj.grayData || !this.charParser.chars) return
    this.isTransparent = this.charParser.hasSpace
    this.grayData = this.getMappedGrayData()
    this.draw()
    setTimeout(() => {
      this.canvasDom.classList.add('is-done')
    }, 300)
  }

  resize() {
    const { imageHeight, imageWidth } = this.sourceObj

    const paddingH = 50
    const paddingV = 80
    const sideWidth = 320
    const sideHeight = 100 // for smaller screen
    const footerHeight = 64

    const isLarge = window.innerWidth >= 1024;
    const isMedium = window.innerWidth >= 768;

    let maxWidth, maxHeight;

    if (isLarge) {
      maxWidth = (window.innerWidth - paddingH * 2 - sideWidth) * TO_RETINA_SCALE
      maxHeight = (window.innerHeight - paddingV * 2) * TO_RETINA_SCALE
    } else if (isMedium) {
      maxWidth = (window.innerWidth - paddingH * 2) * TO_RETINA_SCALE
      maxHeight = (window.innerHeight - paddingV * 2 - sideHeight) * TO_RETINA_SCALE
    } else {
      maxWidth = (window.innerWidth - paddingH) * TO_RETINA_SCALE
      maxHeight = (window.innerHeight - paddingV - sideHeight - footerHeight) * TO_RETINA_SCALE
    }

    const ratio = imageWidth / imageHeight
    const windowRatio = maxWidth / maxHeight

    let width, height

    if (windowRatio < ratio) { // window is thiner
      width = maxWidth
      height = width / ratio
    } else {
      height = maxHeight
      width = ratio * height
    }

    // this.textarea.style.width = width / TO_RETINA_SCALE + 'px'
    // this.textarea.style.height = height / TO_RETINA_SCALE + 'px'

    this.setSize(width, height)
    this.setColor(this.color)
    this.updateCharSize()
    this.redraw()
  }

  updateCharSize() {
    this.charSize = this.height / this.resolution
    this.setFont(`${this.charSize}px sans-serif`)
    // this.textarea.style.fontSize = this.charSize / TO_RETINA_SCALE + 'px'
  }

  fullscreen() {
    this.setSize(window.innerWidth * TO_RETINA_SCALE, window.innerHeight * TO_RETINA_SCALE)
  }

  clear() {
    // this.plainTexts = ''
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw() {
    this.clear()

    let pixelIndex, pixelGray, charObj
    const offsetX = (this.width - (this.charSize * this.sourceObj.width)) / 2
    // const plainTexts = []

    for (let y = 0; y < this.sourceObj.height; y++) {
      for (let x = 0; x < this.sourceObj.width; x++) {
        pixelIndex = y * this.sourceObj.width + x
        pixelGray = this.grayData[pixelIndex]
        charObj = this.charParser.chars[pixelGray - (this.isTransparent ? 1 : 0)]

        if (!charObj) {
          // plainTexts.push(' ')
          continue
        }

        this.ctx.fillText(charObj.char, x * this.charSize + offsetX, y * this.charSize)
        // plainTexts.push(charObj.char)
      }
      // plainTexts.push('\n')
    }
    // this.plainTexts = plainTexts.join('')
    // this.exportTexts()
  }

  // exportTexts() {
  //   this.textarea.innerText = this.plainTexts
  // }

  getMappedGrayData() {
    const grayData = this.sourceObj.grayData
    const chars = this.charParser.chars

    const grayMin = Math.min.apply(null, grayData)
    const grayMax = Math.max.apply(null, grayData)
    const newGrayMin = 0
    const newGrayMax = chars.length - (this.isTransparent ? 0 : 1)

    return grayData.map((gray) => {
      return newGrayMax - Math.round(this.mapToRange(gray, grayMin, grayMax, newGrayMin, newGrayMax))
    })
  }

  mapToRange(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }

}

export default AsciiPainter
