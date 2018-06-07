import { xx } from 'xx'
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
  constructor(settings, painter) {
    Object.keys(settings).forEach(domId => {
      this.addElement(domId)

      const value = settings[domId]
      const attr = typeof value === 'boolean' ? 'checked' : 'value'

      if (!this[domId]) return
      this[domId].setAttribute(attr, value)
    })

    this.addColor(settings.color, 'color', 'updateColor')
    this.addColor(settings.bgColor, 'bgColor', 'updateBgColor')

    window.updateColor = function (jsColor) { painter.setColor(`#${jsColor}`) }
    window.updateBgColor = function (jsColor) { painter.setBgColor(`#${jsColor}`) }

    rangesliderJs.create(document.querySelectorAll('input[type="range"]'))
  }

  addColor(value, id, changeHandler) {
    const colorContainer = document.querySelector('.control_item--color')
    const button = document.createElement('button')
    button.setAttribute('id', id)
    button.classList.add('input--color')
    const option = Object.assign(defaultJsColorOptions, { value, onFineChange: `${changeHandler}(this)` });
    const picker = new jscolor(button, option)
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
