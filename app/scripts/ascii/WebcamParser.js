import xx from 'xx'
import PixelParser from './PixelParser'

class WebcamParser extends PixelParser {

  constructor(resolution) {
    super(resolution)

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false // no camera

    this.video = document.createElement('video')

    const attributesMap = {
      autoplay: '',
      playsinline: true,
      id: 'webcam-video'
    }

    Object.keys(attributesMap).forEach((k) => this.video.setAttribute(k, attributesMap[k]))

    this.setReverse(true)
    this.observe()
  }

  getWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      this.video.srcObject = stream
      this.isPlaying = true
    }).catch((error) => {
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
