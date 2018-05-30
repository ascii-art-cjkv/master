export default class EventObject {

  constructor() {

  }

  on(eventName, callback) {
    this.checkEventExistance(eventName)
    this[eventName].push(callback)
  }

  trigger(eventName, param) {
    this.checkEventExistance(eventName)
    this[eventName].forEach((cb) => cb(param))
  }

  checkEventExistance(eventName) {
    if (!this[eventName]) {
      this[eventName] = []
    }
  }

}
