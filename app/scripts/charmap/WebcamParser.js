import PixelParser from './PixelParser'
import { xx } from 'xx'
class WebcamParser extends PixelParser {
  constructor() {
    super({
      forceCanvas: true,
      clearBeforeRender: false,
    })

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false // no camera

    this.video = document.createElement('video')

    const attributesMap = {
      autoplay: '',
      playsinline: true,
      id: 'webcam-video'
    }

    Object.keys(attributesMap).forEach((k) => this.video.setAttribute(k, attributesMap[k]))

    this.isWebcam = true
    this.observe()
  }

  observe() {
    this.video.addEventListener('loadedmetadata', () => {
      this.storeImageSize(this.video.videoWidth, this.video.videoHeight)
      this.rescale()
      requestAnimationFrame(this.play.bind(this))
    })
  }

  getWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      this.video.srcObject = stream
      this.isPlaying = true
    }).catch((error) => {
      console.error('Rejected!', error)
    })
  }

  stopWebcam() {
    if (!this.video.srcObject || !this.isPlaying) return
    const tracks = this.video.srcObject.getTracks()
    tracks.forEach((track) => track.stop())
    this.video.srcObject = null
    this.isPlaying = false
  }

  rescale() {
    super.rescale()
    this.rescaleSprite()
  }

  rescaleSprite() {
    if (this.videoSprite) {
      this.videoSprite.texture.update()
      this.videoSprite.width = this.width
      this.videoSprite.height = this.height
      this.videoContainer.setTransform(this.width, 0, -1, 1)
    }
  }

  setResolution(resolution) {
    this.resolution = resolution
    if (!this.isPlaying) return
    this.rescale()
  }

  play() {
    if (!this.isPlaying) return
    this.draw()
    requestAnimationFrame(this.play.bind(this))
  }

  draw() {
    if (!this.videoSprite) {
      const texture = PIXI.Texture.fromVideo(this.video)

      this.videoContainer = new PIXI.Container()
      this.videoSprite = new PIXI.Sprite(texture)
      this.videoContainer.addChild(this.videoSprite)
      this.pixi.stage.addChild(this.videoContainer)
      this.rescaleSprite()
    }

    this.updateGrayData()
  }
}

export default WebcamParser
