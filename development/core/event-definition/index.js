import outmatch from 'outmatch'
import Settings from './settings/index.js'
import { typeOf, propertyDirectory } from '../../coutil/index.js'
export default class EventDefinition {
  #settings
  #enable = false
  #listener
  #path
  #_target
  #_targets = []
  #_assign
  #_deassign
  constructor($settings) { 
    this.#settings = Object.assign({}, Settings, $settings)
    this.enable = this.settings.enable
  }
  get settings() { return this.#settings }
  get path() { return this.settings.path }
  get type() { return this.settings.type }
  get listener() { return this.settings.listener }
  get #context() { return this.settings.context }
  get #methods() { return this.settings.methods }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets
    let propertyDirectory = this.#propertyDirectory
    const targetPaths = []
    const targets = []
    const typeOfPath = typeOf(this.path)
    if(this.target) {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget?.path === this.path
      )
      if(pretargetElement !== undefined) {
        targets.push(pretargetElement)
      }
      else if(pretargetElement === undefined) {
        targets.push({
          path: this.path,
          target: this.target,
          enable: false,
        })
      }
    }
    else if(['array', 'string'].includes(typeOfPath)) {
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
          for(const $targetAccessor of this.settings.accessors) {
            if(target === undefined) { break iterateTargetAccessors }
            target = $targetAccessor(target, pathKey)
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
    }
    this.#_targets = targets
    return this.#_targets
  }
  get #propertyDirectory() {
    return propertyDirectory(this.#context, this.settings.propertyDirectory)
  }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets
    iterateTargetElements: 
    for(const targetElement of targets) {
      const { path, target, enable } = targetElement
      const settings = this.settings
      if(enable === $enable) { continue iterateTargetElements }
      try {
        if($enable === true) {
          this.#assign(target)
        }
        else if($enable === false) {
          this.#deassign(target)
        }
        targetElement.enable = $enable
      }
      catch($err) { console.error($err) }
    }
    this.#enable = $enable
  }
  get #assign() {
    if(this.#_assign !== undefined) { return this.#_assign }
    this.#_assign = this.settings.methods.assign[this.settings.assign].bind(this)
    return this.#_assign
  }
  get #deassign() {
    if(this.#_deassign !== undefined) { return this.#_deassign }
    this.#_deassign = this.settings.methods.deassign[this.settings.deassign].bind(this)
    return this.#_deassign
  }
}