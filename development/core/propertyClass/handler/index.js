import * as States from '../states/index.js'
export default class Handler {
  #propertyClass
  constructor($propertyClass) {
    this.#propertyClass = $propertyClass
  }
  get get() {
    return function get($target, $property) {
      return $target[$property]
    }
  }
  get set() {
    const instate = this.#propertyClass.states.instate || states.instate
    const definition = this.#propertyClass.definition
    return function set($target, $property, $value) {
      if(
        definition.object === "Array" && 
        $property === 'length'
      ) {
        $target[$property] = $value
      }
      else {
        $target[$property] = instate(this.#propertyClass, $property, $value)
      }
      return true
    }
  }
  get deleteProperty() {
    const deinstate = this.#propertyClass.states.deinstate || states.deinstate
    return function deleteProperty($target, $property) {
      deinstate(this.#propertyClass, $property)
      delete $target[$property]
      return true
    }
  }
}