import xx from 'xx'
import PixelParser from './PixelParser'

function importAll(r) {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
  return images;
}

class ImageParser extends PixelParser {
  constructor(resolution, imageName) {
    super(resolution)
    const images = importAll(require.context('../../images', false, /\.(png|jpe?g)$/));
    this.load(images[imageName])
  }

  load(url) {
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
