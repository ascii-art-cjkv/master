import { xx, isMobile } from 'xx'
import rangesliderJs from 'rangeslider-js'

const defaultJsColorOptions = {
  shadow: false,
  borderWidth: 0,
  borderRadius: 0,
  backgroundColor: 'transparent',
  insetColor: 'transparent',
  valueElement: null,
}

class Control {
  constructor(settings, painter, hasWebcam) {
    this.painter = painter
    this.addColor('color', (jsColor) => painter.setColor(`#${jsColor}`))
    this.addColor('bgColor', (jsColor) => painter.setBgColor(`#${jsColor}`))
    this.applySettings(settings)
    this.hasWebcam = hasWebcam
  }

  applySettings(settings) {
    Object.keys(settings).forEach(domId => {
      const el = this.addElement(domId)

      if (!el) return

      const value = settings[domId]
      const attr = typeof value === 'boolean' ? 'checked' : 'value'

      el[attr] = value

      if (['color', 'bgColor'].includes(domId)) {
        el.style.background = value
        this.painter.set(domId, value)
      }

      if (domId === 'resolution') {
        el.setAttribute(attr, value)

        if (isMobile()) {
          el.setAttribute('max', 50)
        }
        const rangeslider = el['rangeslider-js']

        // workaround to fix unchanged rangeslide position
        rangeslider && rangeslider.destroy()
        rangesliderJs.create(el)
      }

      el.dispatchEvent(new Event('input'))
    })
  }

  addColor(id, changeHandler) {
    window[`change${id}`] = changeHandler

    const colorContainer = document.querySelector('.controls_item--color')
    const button = document.createElement('button')
    const option = Object.assign(defaultJsColorOptions, { onFineChange: `change${id}(this)` })
    const picker = new jscolor(button, option)

    button.setAttribute('id', id)
    button.classList.add('input--color')
    colorContainer.appendChild(button)
  }

  addElement(domName) {
    return this[domName] = document.getElementById(domName)
  }

  on(domName, eventName, handler) {
    let ele = this[domName] || this.addElement(domName)
    ele.addEventListener(eventName, handler)
    return this
  }
}

export default Control
