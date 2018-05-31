import xx from 'xx'
import PixelParser from './PixelParser'

class WebcamParser extends PixelParser {

  constructor(resolution) {
    super(resolution)

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    if (!navigator.getUserMedia) return

    this.video = document.createElement('video')
    this.video.setAttribute('autoplay', true)

    this.setReverse(true)
    this.observe()
  }

  getWebcam() {
    navigator.getUserMedia({ video: true, audio: false }, (stream) => {
      this.video.srcObject = stream
      this.video.play()
    }, (e) => {
      console.error('Rejected!', e)
    })
  }

  stopWebcam() {
    if (!this.video.srcObject) return
    const tracks = this.video.srcObject.getTracks()
    tracks.forEach((track) => track.stop())
    this.video.srcObject = null
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

export default WebcamParser
