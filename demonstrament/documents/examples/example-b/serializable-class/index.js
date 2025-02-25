export default class SerializableClass extends EventTarget {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get settings() { return this.#settings }
  start() {
    this.dispatchEvent(new CustomEvent('start', { detail: this } ))
    return this
  }
  stop() {
    this.dispatchEvent(new CustomEvent('stop', { detail: this } ))
    return this
  }
}
