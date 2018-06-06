import xx from 'xx'
import PixelParser from './PixelParser'

class WebcamParser extends PixelParser {

  constructor(resolution) {
    super(resolution)

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false; // no camera

    this.video = document.createElement('video')

    const attributesMap = {
      autoplay: '',
      playsinline: true,
      id: 'webcam-video'
    }

    Object.keys(attributesMap).forEach((k) => this.video.setAttribute(k, attributesMap[k]))

    if (this.isMobile) {
      document.body.appendChild(this.video)
    }

    this.setReverse(true)
    this.observe()
  }

  getWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      this.video.srcObject = stream
      this.video.classList.add('is-playing')
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
    this.video.classList.remove('is-playing')
  }

  observe() {
    if (this.isMobile) {
      this.video.addEventListener('click', () => {
        this.setImageSize(this.video.videoWidth, this.video.videoHeight)
        this.rescale()
        this.draw()
        this.saveFinalFrame()
        this.stopWebcam()
      })
      return;
    }
    this.video.addEventListener('loadedmetadata', () => {
      this.setImageSize(this.video.videoWidth, this.video.videoHeight)
      this.rescale()
      requestAnimationFrame(this.play.bind(this))
    })
  }

  saveFinalFrame() {
    this.finalFrame = document.createElement('img')
    this.finalFrame.src = this.canvasDom.toDataURL()
  }

  play() {
    if (!this.isPlaying) return
    this.draw()
    requestAnimationFrame(this.play.bind(this))
  }

  draw() {
    if (this.isMobile && !this.isPlaying) {
      this.ctx.save()
      this.ctx.scale(-1, 1)
      this.ctx.drawImage(this.finalFrame, 0, 0, this.width * -1, this.height)
      this.ctx.restore()
    } else {
      this.ctx.drawImage(this.video, 0, 0, this.width, this.height)
    }

    this.updateGrayData()
  }

  setResolution(resolution) {
    this.resolution = resolution
    if (!this.isMobile && !this.isPlaying) return
    this.rescale()
    this.draw()
  }

}

export default WebcamParser
