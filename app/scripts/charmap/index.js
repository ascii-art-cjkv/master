import Canvas from './Canvas'
import Painter from './Painter'
import CharParser from './CharParser'
import ImageParser from './ImageParser'
import WebcamParser from './WebcamParser'
import FileHandler from './FileHandler'
import Control from './Control'

import getSetting from './presets'
import { xx, isMobile } from 'xx'

new class {
  constructor() {
    this.setting = getSetting()
    this.isDesktop = !isMobile()
    this.prepare()
    this.init()
    this.observe()
    document.body.classList.add(this.isDesktop ? 'is-desktop' : 'is-mobile')
  }

  prepare() {
    this.charParser = new CharParser()
    this.imageParser = new ImageParser()
    this.webcamParser = new WebcamParser()
    this.painter = new Painter()
    this.controls = new Control(this.setting, this.painter)
    this.fileHandler = new FileHandler(this.painter)
  }

  init() {
    this.charParser.parse(this.setting.text)

    this.imageParser.setResolution(this.setting.resolution)
    this.imageParser.loadSample(this.setting.image)

    this.painter.setSource(this.imageParser, this.charParser)
    this.painter.setResolution(this.setting.resolution)
  }

  observe() {
    this.imageParser.on('imageSizeChanged', this.painter.onSourceSizeChanged.bind(this.painter))
    this.webcamParser.on('imageSizeChanged', this.painter.onSourceSizeChanged.bind(this.painter))
    this.charParser.on('charsUpdated', this.painter.onCharsUpdated.bind(this.painter))
    this.imageParser.on('grayDataUpdated', this.painter.onSourceGrayDataUpdated.bind(this.painter))
    this.webcamParser.on('grayDataUpdated', this.painter.onSourceGrayDataUpdated.bind(this.painter))
    this.fileHandler.on('fileLoaded', (datajpg) => {
      this.controls.webcam.checked = false
      this.painter.setSource(this.imageParser)
      this.painter.loadImage(datajpg)
    })

    this.controls.on('text', 'input', (e) => this.charParser.parse(e.target.value))
        .on('download', 'click', (e) => e.target.href = this.painter.toObjectURL())
        .on('resolution', 'input', (e) => this.painter.setResolution(e.target.value))
        .on('webcam', 'change', (e) => this.painter.setSource(e.target.checked ? this.webcamParser : this.imageParser))

    if (this.isDesktop) {
      document.body.addEventListener('keydown', (e) => {
        e.target.tagName.toLowerCase() !== 'input' && e.which === 82 && this.reload() // press r
      })
    } else {
      this.painter.pixi.view.addEventListener('touchstart', this.reload.bind(this))
    }
  }

  reload() {
    if (this.painter.sourceObj.isWebcam) return

    this.setting = getSetting()
    document.body.classList.add('is-loading')

    setTimeout(() => {
      this.controls.applySettings(this.setting)
      this.imageParser.loadSample(this.setting.image)
    }, 300)

    setTimeout(() => {
      document.body.classList.remove('is-loading')
    }, 1000)
  }
}
