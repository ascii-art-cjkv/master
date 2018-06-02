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
      this.isPlaying = true
    }, (e) => {
      console.error('Rejected!', e)
    })
  }

  stopWebcam() {
    if (!this.video.srcObject) return
    const tracks = this.video.srcObject.getTracks()
    tracks.forEach((track) => track.stop())
    this.video.srcObject = null
    this.isPlaying = false
  }

  observe() {
    this.video.addEventListener('loadedmetadata', () => {
      this.setImageSize(this.video.videoWidth, this.video.videoHeight)
      this.rescale()
      requestAnimationFrame(this.play.bind(this))
    })
  }

  play() {
    if (!this.isPlaying) return
    this.draw()
    requestAnimationFrame(this.play.bind(this))
  }

  draw() {
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height)
    this.updateGrayData()
  }

  setResolution(resolution) {
    this.resolution = resolution
    if (!this.isPlaying) return
    this.rescale()
    this.draw()
  }

}

export default WebcamParser
