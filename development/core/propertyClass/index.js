import { typedObjectLiteral } from '../../coutil/index.js'
import Handler from './handler/index.js'
export default class PropertyClass {
  #settings
  #core
  #_target
  #_handler
  #_proxy
  constructor($settings, $core) {
    this.#settings = $settings
    this.#core = $core
    return this.#proxy
  }
  get #target() {
    if(this.#_target !== undefined) { return this.#_target }
    this.#_target = typedObjectLiteral(this.definition.object)
    return this.#_target
  }
  get #handler() {
    if(this.#_handler !== undefined) { return this.#_handler }
    this.#_handler = new Handler(this)
    return this.#_handler
  }
  get #proxy() {
    if(this.#_proxy !== undefined) { return this.#_proxy }
    this.#_proxy = new Proxy(this.#target, this.#handler)
    return this.#_proxy
  }
  get core() { return this.#core }
  get name() { return this.#settings.name }
  get names() { return this.#settings.names }
  get states() { return this.#settings.states }
  get definition() { return this.#settings.definition }
}