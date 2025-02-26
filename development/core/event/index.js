import { minimatch } from 'minimatch'
export default class CoreEvent {
  #settings
  #enable = false
  #_boundListener
  #target = []
  constructor($settings) { 
    this.#settings = $settings
    this.enable = this.#settings.enable
  }
  get type() { return this.#settings.type }
  get path() { return this.#settings.path }
  get target() {
    const pretargets = this.#target
    const propertyDirectory = this.#context.propertyDirectory
    const targetPaths = []
    const targets = []
    iteratePropertyPaths: 
    for(const $propertyPath of propertyDirectory) {
      const propertyPathMatch = minimatch($propertyPath, this.path)
      if(propertyPathMatch === true) { targetPaths.push($propertyPath) }
    }
    iterateTargetPaths: 
    for(const $targetPath of targetPaths) {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget.path === $targetPath
      )
      let target
      let targetElement
      if(pretargetElement !== undefined) { targetElement = pretargetElement }
      else {
        target = this.#context
        const pathKeys = $targetPath.split('.')
        let pathKeysIndex = 0
        iterateTargetPathKeys: 
        while(pathKeysIndex < pathKeys.length) {
          let pathKey = pathKeys[pathKeysIndex]
          if(pathKeysIndex === 0 && pathKey === ':scope') {
            break iterateTargetPathKeys
          }
          iterateTargetAccessors: 
          for(const $TargetAccessor of this.#propertyClassEvents.TargetAccessors) {
            if($TargetAccessor === '[]') {
              target = target[pathKey]
            }
            else if($TargetAccessor === 'get') {
              target = target?.get(pathKey)
            }
            if(target !== undefined) { break iterateTargetAccessors }
          }
          pathKeysIndex++
        }
      }
      if(target !== undefined) {
        targetElement = {
          path: $targetPath,
          target: target,
          enable: false,
        }
      }
      targets.push(targetElement)
    }
    this.#target = targets
    return this.#target
  }
  get listener() { return this.#settings.listener }
  get options() { return this.#settings.options }
  get enable() { return this.#enable }
  set enable($enable) {
    if(
      $enable === this.#enable ||
      this.target.length === 0
    ) { return }
    const eventAbility = (
      $enable === true
    ) ? this.#propertyClassEvents.Assign
      : this.#propertyClassEvents.Deassign

    iterateTargets: 
    for(const { path, target, enable } of this.target) {
      if(enable === eventAbility) { continue iterateTargets }
      try {
        target[eventAbility](this.type, this.#boundListener, this.options)
        target.enable = eventAbility
      } catch($err) {}
    }
    this.#enable = $enable
  }
  get #propertyClassEvents() { return this.#settings.propertyClassEvents }
  get #context() { return this.#settings.context }
  get #boundListener() {
    if(this.#_boundListener !== undefined) { return this.#_boundListener }
    this.#_boundListener = this.#settings.listener.bind(this.#context)
    return this.#_boundListener
  }
}