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
    const Instate = this.#propertyClass.States.Instate || States.Instate
    const Definition = this.#propertyClass.Definition
    return function set($target, $property, $value) {
      if(
        Definition.Object === "Array" && 
        $property === 'length'
      ) {
        $target[$property] = $value
      }
      else {
        $target[$property] = Instate(this.#propertyClass, $property, $value)
      }
      return true
    }
  }
  get deleteProperty() {
    const Deinstate = this.#propertyClass.States.Deinstate || States.Deinstate
    return function deleteProperty($target, $property) {
      Deinstate(this.#propertyClass, $property)
      delete $target[$property]
      return true
    }
  }
}