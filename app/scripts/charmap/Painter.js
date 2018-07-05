import Canvas from './Canvas'
import { xx, isMobile } from 'xx'

function dataURLtoBlob(dataURI) {
  const arr = dataURI.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const binStr = atob(arr[1])
  let n = binStr.length
  const u8arr = new Uint8Array(n)

  while (n--) u8arr[n] = binStr.charCodeAt(n)

  return new Blob([u8arr], { type: mime })
}

class Painter extends Canvas {
  constructor() {
    super({ preserveDrawingBuffer: true, transparent: false })
    this.pixi.view.setAttribute('id', 'painter')
    this.isMobile = isMobile()

    this.pool = {
      text: {},
      sprite: [],
    }

    this.setFont({ fill: 'black' })

    document.body.appendChild(this.pixi.view)
    window.addEventListener('resize', this.resize.bind(this))
  }

  onCharsUpdated() {
    this.updateText()
    this.draw()
  }

  onSourceSizeChanged() {
    this.resize()
  }

  onSourceGrayDataUpdated() {
    this.draw()
  }

  loadImage(image) {
    if (!this.sourceObj.isWebcam) {
      this.sourceObj.load(image)
    }
  }

  setSource(sourceObj, charParser = null) {
    if (this.sourceObj === sourceObj) return

    if (charParser) {
      this.charParser = charParser
    }

    const prevSourceObj = this.sourceObj
    this.sourceObj = sourceObj
    sourceObj.setResolution(this.resolution)

    if (sourceObj.isWebcam) {
      sourceObj.getWebcam()
    }

    if (prevSourceObj && prevSourceObj.isWebcam) {
      prevSourceObj.stopWebcam()
      this.resize()
      sourceObj.draw()
    }

  }

  setResolution(resolution) {
    this.resolution = resolution
    this.updateText()
    if (this.sourceObj) {
      this.sourceObj.setResolution(resolution)
    }
  }

  setColor(color) {
    this.color = color
    this.updateText()
  }

  setBgColor(bgColor) {
    this.bgColor = bgColor
    this.pixi.renderer.backgroundColor = parseInt(`0x${bgColor.slice(1, 7)}`, 16)
    document.body.style.backgroundColor = bgColor
  }

  set(key, value) {
    const methodName = key.charAt(0).toUpperCase() + key.slice(1)
    this[`set${methodName}`](value)
  }

  resize() {
    const { imageHeight, imageWidth } = this.sourceObj
    if (!imageWidth) return

    const paddingH = 50
    const paddingV = 80
    const sideWidth = 320
    const sideHeight = 100 // for smaller screen
    const footerHeight = 64

    const isLargeScreen = window.innerWidth >= 1024
    const isMediumScreen = window.innerWidth >= 768

    let maxWidth, maxHeight

    if (isLargeScreen) {
      maxWidth = window.innerWidth - paddingH * 2 - sideWidth
      maxHeight = window.innerHeight - paddingV * 2
    } else if (isMediumScreen) {
      maxWidth = window.innerWidth - paddingH * 2
      maxHeight = window.innerHeight - paddingV * 2 - sideHeight
    } else {
      maxWidth = window.innerWidth - paddingH
      maxHeight = window.innerHeight - paddingV - sideHeight - footerHeight
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

    this.setSize(width, height)
    this.updateText()
  }

  updateText() {
    if (!this.height) return

    this.charSize = this.height / this.resolution
    let text

    this.charParser.chars.forEach((charObj) => {
      text = this.pool.text[charObj.char]
      if (!text) {
        text = new PIXI.Text(charObj.char, {
          fontFamily: "'Hiragino Sans GB', sans-serif",
          fontSize: this.charSize * window.devicePixelRatio,
          fill: this.color
        })
        this.pool.text[charObj.char] = text
      } else {
        text.style.fontSize = this.charSize * window.devicePixelRatio
        text.style.fill = this.color
      }
      text.updateText()
      text.bounds = text.getBounds()
    })
  }

  draw() {
    if (!this.sourceObj.grayData || !this.charParser.chars) return

    this.pixi.stage.removeChildren()

    this.isTransparent = this.charParser.hasSpace
    this.grayData = this.getMappedGrayData()

    let pixelIndex, pixelGray, charObj, sprite, text
    const offsetX = (this.width - (this.charSize * this.sourceObj.width)) / 2

    for (let y = 0; y < this.sourceObj.height; y++) {
      for (let x = 0; x < this.sourceObj.width; x++) {
        pixelIndex = y * this.sourceObj.width + x
        pixelGray = this.grayData[pixelIndex]
        charObj = this.charParser.chars[pixelGray - (this.isTransparent ? 1 : 0)]

        if (!charObj) {
          continue
        }

        sprite = this.pool.sprite[pixelIndex]
        text = this.pool.text[charObj.char]

        if (!sprite) {
          sprite = PIXI.Sprite.from(text.texture)
          this.pool.sprite[pixelIndex] = sprite
        } else {
          sprite.texture = text.texture
        }

        sprite.width = text.bounds.width / window.devicePixelRatio
        sprite.height = text.bounds.height / window.devicePixelRatio
        sprite.x = x * this.charSize + offsetX
        sprite.y = y * this.charSize

        this.pixi.stage.addChild(sprite)
      }
    }
  }

  toObjectURL() {
    const imgData = this.pixi.view.toDataURL('image/png')
    const blob = dataURLtoBlob(imgData)
    return URL.createObjectURL(blob)
  }

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

export default Painter
