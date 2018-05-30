import xx from 'xx'
import PixelParser from './PixelParser'

export default class WebCam extends PixelParser {

  constructor(resolution) {
    super(resolution)

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    if (!navigator.getUserMedia) return

    this.video = document.createElement('video')
    this.video.setAttribute('autoplay', true)

    this.observe()
    this.getWebcam()
  }

  getWebcam() {
    navigator.getUserMedia({ video: true, audio: false }, (stream) => {
      this.video.src = window.URL.createObjectURL(stream)
      this.track = stream.getTracks()[0]
    }, (e) => {
      console.error('Rejected!', e)
    })
  }

  observe() {
    this.video.addEventListener('loadedmetadata', () => {
      this.setImageSize(this.video.videoWidth, this.video.videoHeight)
      this.resize()
      requestAnimationFrame(this.draw.bind(this))
    })
  }

  draw() {
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height)
    this.updateGrayData()
    requestAnimationFrame(this.draw.bind(this))
  }

  setResolution(resolution) {
    this.resolution = resolution
    this.resize()
    this.draw()
  }

}
