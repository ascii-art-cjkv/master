import xx from 'xx'
import imgUrl from './../images/sample.png'

export default class ImageParser {
  constructor(gridSize) {
    this.canvasDom = document.createElement('canvas')
    this.ctx = this.canvasDom.getContext('2d')
    this.gridSize = gridSize // it means char size = gridSize * gridSize
    this.draw(() => {
      this.grayData = this.getGrayData()
      this.grayMin = Math.min.apply(null, this.grayData)
      this.grayMax = Math.max.apply(null, this.grayData)
    });
  }

  resize() {
    this.canvasDom.width = this.width
    this.canvasDom.height = this.height
  }

  draw(cb) {
    const imgDom = document.createElement('img')
    imgDom.setAttribute('src', imgUrl)
    imgDom.onload = () => {
      this.width = imgDom.width / this.gridSize
      this.height = imgDom.height / this.gridSize
      this.resize()
      this.ctx.drawImage(imgDom, 0, 0, this.width, this.height)
      cb()
    }
  }

  getGrayData() {
    const { data } = this.ctx.getImageData(0, 0, this.width, this.height)
    const grayData = []
    for (let i = 0; i < data.length; i+=4) {
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

