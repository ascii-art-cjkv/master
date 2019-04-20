import eventMixin from '../eventMixin'

class Canvas {
  constructor(pixiOptions) {
    const defaultOptions = {
      transparent: true,
      autoResize: true,
      resolution: window.devicePixelRatio,
    }

    this.pixi = new PIXI.Application(Object.assign(defaultOptions, pixiOptions))
    // document.body.appendChild(this.pixi.view)
  }

  setSize(width, height = +width) {
    this.pixi.renderer.resize(width, height)
    this.width = width
    this.height = height
  }

  setFont(fontStyle) {
    if (this.fontStyle) {
      Object.assign(this.fontStyle, fontStyle)
    } else {
      this.fontStyle = fontStyle
      this.fontStyle.fontFamily = "'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'Osaka', 'メイリオ', 'Meiryo', 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif"
    }

    this.fontStyle.lineHeight = fontStyle.fontSize

  }

  getImageData() {
    return this.pixi.renderer.extract.pixels(this.pixi.stage)
  }

}

Object.assign(Canvas.prototype, eventMixin)

export default Canvas
