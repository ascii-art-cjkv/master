import xx from 'xx'
import PixelParser from './PixelParser'
import imgUrl from './../images/sample.png'

export default class ImageParser extends PixelParser {
  constructor(resolution) {
    super(resolution)
    this.load();
  }

  load() {
    const imgDom = document.createElement('img')
    imgDom.setAttribute('src', imgUrl)
    imgDom.onload = () => {
      this.setImageSize(this.imgDom.width, this.imgDom.height)
      this.draw()
    }
    this.imgDom = imgDom
  }

  draw() {
    this.resize()
    this.ctx.drawImage(this.imgDom, 0, 0, this.width, this.height)
    this.updateGrayData()
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.draw()
  }

}
