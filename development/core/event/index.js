import outmatch from 'outmatch'
export default class CoreEvent {
  #settings
  #enable = false
  #_boundListener
  #_targets = []
  constructor($settings) { 
    this.#settings = $settings
    this.enable = this.#settings.enable
  }
  get type() { return this.#settings.type }
  get path() { return this.#settings.path }
  get #targets() {
    const pretargets = this.#_targets

    const propertyDirectory = this.#context.propertyDirectory
    const targetPaths = []
    const targets = []
    let pathTarget = this.#context
    iteratePathKeys: 
    for(const $pathKey of this.path.split('.')) {
      if(pathTarget === undefined) { continue iteratePathKeys }
      pathTarget = pathTarget[$pathKey]
    }
    if(pathTarget !== undefined && pathTarget !== this.#context) { targetPaths.push(this.path) }
    const propertyPathMatcher = outmatch(this.path, {
      separator: '.',
    })
    iteratePropertyPaths: 
    for(const $propertyPath of propertyDirectory) {
      const propertyPathMatch = propertyPathMatcher($propertyPath)
      if(propertyPathMatch === true) { targetPaths.push($propertyPath) }
    }
    iterateTargetPaths: 
    for(const $targetPath of targetPaths) {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget.path === $targetPath
      )
      let target
      let targetElement
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
        for(const $targetAccessor of this.#settings.target.accessors) {
          if($targetAccessor === '[]') {
            target = target[pathKey]
          }
          else if($targetAccessor === 'get') {
            target = target?.get(pathKey)
          }
          if(target !== undefined) { break iterateTargetAccessors }
        }
        pathKeysIndex++
      }
      if(target === pretargetElement?.target) {
        targetElement = pretargetElement
      }
      else {
        targetElement = {
          path: $targetPath,
          target: target,
          enable: false,
        }
      }
      targets.push(targetElement)
    }
    this.#_targets = targets
    return this.#_targets
  }
  get listener() { return this.#settings.listener }
  get options() { return this.#settings.options }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets
    if(this.#targets.length === 0) { return }
    const eventAbility = (
      $enable === true
    ) ? this.#settings.target.assign
      : this.#settings.target.deassign
    iterateTargets: 
    for(const { path, target, enable } of targets) {
      if(enable === eventAbility) { continue iterateTargets }
      try {
        target[eventAbility](this.type, this.#boundListener, this.options)
        target.enable = eventAbility
      } catch($err) {}
    }
    this.#enable = $enable
  }
  get #context() { return this.#settings.context }
  get #boundListener() {
    if(this.#_boundListener !== undefined) { return this.#_boundListener }
    this.#_boundListener = this.#settings.listener.bind(this.#context)
    return this.#_boundListener
  }
}