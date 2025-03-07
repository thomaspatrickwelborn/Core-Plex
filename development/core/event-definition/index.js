import outmatch from 'outmatch'
import Settings from './settings/index.js'
console.log("Settings", Settings)
import { propertyDirectory } from '../../coutil/index.js'
export default class EventDefinition {
  #settings
  #enable = false
  #_boundListener
  #_targets = []
  constructor($settings) { 
    this.#settings = Object.assign({}, Settings, $settings)
    this.enable = this.#settings.enable
  }
  get propertyDirectory() {
    return propertyDirectory(this.#context, this.#settings.propertyDirectory)
  }
  get type() { return this.#settings.type }
  get path() { return this.#settings.path }
  get #targets() {
    const pretargets = this.#_targets
    let propertyDirectory = this.propertyDirectory
    const targetPaths = []
    const targets = []
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
        ($pretarget) => $pretarget?.path === $targetPath
      )
      let target = this.#context
      let targetElement
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
          if(target === undefined) { break iterateTargetAccessors }
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
      if(target !== undefined) {
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
      }
      if(targetElement !== undefined) { targets.push(targetElement) }
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
    const eventSign = (
      $enable === true
    ) ? this.#settings.target.assign
      : this.#settings.target.deassign
    iterateTargets: 
    for(const targetElement of targets) {
      const { path, target, enable } = targetElement
      if(enable === $enable) { continue iterateTargets }
      if(target[eventSign]) {
        target[eventSign](this.type, this.#boundListener, this.options)
        targetElement.enable = $enable
      }
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