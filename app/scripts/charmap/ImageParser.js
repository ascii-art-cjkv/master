import PixelParser from './PixelParser'
import {xx} from 'xx'

function importAll(r) {
  let images = {}
  r.keys().map((item) => { images[item.replace('./', '')] = r(item) })
  return images
}

// this class reads image and  return gray map

class ImageParser extends PixelParser {

  loadSample(imageName) {
    const images = importAll(require.context('../../images', false, /\.(png|jpe?g)$/))
    this.currentImageName = imageName
    this.load(images[imageName])
  }

  load(url) {
    this.isLoaded = false
    if (!this.loader) {
      this.loader = new PIXI.loaders.Loader()
    }
    this.loader.reset()
    this.loader.add(this.currentImageName, url)
    this.loader.once('complete', this.onImageLoad.bind(this))
    this.loader.load()
  }

  onImageLoad() {
    this.isLoaded = true
    this.trigger('imageLoad')
    const { width, height } = this.loader.resources[this.currentImageName].data
    this.storeImageSize(width, height)
    this.rescale()
    this.draw()
  }

  draw() {
    this.image = PIXI.Texture.fromImage(this.loader.resources[this.currentImageName].url)

    if (!this.sprite) {
      this.sprite = new PIXI.Sprite(this.image)
      this.pixi.stage.addChild(this.sprite)
    } else {
      this.sprite.texture = this.image
    }

    this.sprite.width = this.pixi.renderer.width / window.devicePixelRatio
    this.sprite.height = this.pixi.renderer.height / window.devicePixelRatio

    this.updateGrayData()
  }

  setResolution(resolution) {
    this.resolution = resolution
    if (this.isLoaded) {
      this.rescale()
      this.draw()
    }
  }
}

export default ImageParser
