import xx from 'xx'
import PixelParser from './PixelParser'
import imgUrl from '../../images/gradient.jpg'

class ImageParser extends PixelParser {
  constructor(resolution) {
    super(resolution)
    this.load()
  }

  load(url = imgUrl) {
    const imgDom = document.createElement('img')
    imgDom.onload = () => {
      this.trigger('imageLoad')
      this.setImageSize(this.imgDom.width, this.imgDom.height)
      this.draw()
    }
    imgDom.src = url
    this.imgDom = imgDom
  }

  draw() {
    this.rescale()
    this.ctx.drawImage(this.imgDom, 0, 0, this.width, this.height)
    this.updateGrayData()
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.draw()
  }

}

export default ImageParser
