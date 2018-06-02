import xx from 'xx'
import eventMixin from '../eventMixin'

class Canvas {

  constructor() {
    this.canvasDom = document.createElement('canvas')
    this.ctx = this.canvasDom.getContext('2d')
  }

  setReverse(isReverse) {
    this.isReverse = isReverse
  }

  setSize(width, height = width) {
    const toRetinaScale = window.devicePixelRatio > 1 ? 2 : 1

    this.width = this.canvasDom.width = width
    this.height = this.canvasDom.height = height

    this.canvasDom.style.width = width / toRetinaScale + 'px'
    this.canvasDom.style.height = height / toRetinaScale + 'px'

    if (this.isReverse) {
      this.ctx.translate(this.width, 0)
      this.ctx.scale(-1, 1)
    }
  }

  setFont(font) {
    this.ctx.font = font
    this.ctx.textBaseline = 'top';
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.width, this.height).data
  }
}

Object.assign(Canvas.prototype, eventMixin);

export default Canvas
