import EventObject from './EventObject'

export default class PixelParser extends EventObject {

  constructor(resolution) {
    super()
    this.canvasDom = document.createElement('canvas')
    this.ctx = this.canvasDom.getContext('2d')
    this.resolution = resolution
    // document.body.appendChild(this.canvasDom)
  }

  setImageSize(width, height) {
    this.imageWidth = width
    this.imageHeight = height
  }

  resize() {
    this.width = this.canvasDom.width = Math.floor(this.imageWidth / this.resolution)
    this.height = this.canvasDom.height = Math.floor(this.imageHeight / this.resolution)
  }

  updateGrayData() {
    this.grayData = this.getGrayData()
    this.trigger('grayDataUpdated')
  }

  getGrayData() {
    const { data } = this.ctx.getImageData(0, 0, this.width, this.height)
    const grayData = []
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      const gray = 0.3 * r + 0.59 * g + 0.11 * b
      grayData.push(gray)
    }
    /*
      grayData now is an array (width*height) contains number between 0~255
      0 is black
      255 is white
    */
    return grayData
  }
}
