import outmatch from 'outmatch'
import Settings from './settings/index.js'
import { typeOf, propertyDirectory } from '../../coutil/index.js'
export default class EventDefinition {
  #settings
  #context
  #listener
  #enable = false
  #path
  #enabled = []
  #disabled = []
  #_targets = []
  #_assign
  #_deassign
  #_transsign
  constructor($settings, $context) { 
    if(!$settings || !$context) { return this }
    this.#settings = Settings($settings)
    this.#context = $context
    this.enable = this.settings.enable
  }
  get settings() { return this.#settings }
  get path() { return this.settings.path }
  get type() { return this.settings.type }
  get listener() {
    if(this.#listener !== undefined) { return this.#listener }
    const listener = this.settings.listener
    if(this.settings.bindListener === true) {
      this.#listener = listener.bind(this.#context)
    }
    else { this.#listener = listener }
    return this.#listener
  }
  get enable() { return this.#enable }
  set enable($enable) {
    if(![true, false].includes($enable)) { return }
    const targets = this.#targets
    if(targets.length === 0) { return }
    const enabled = this.#enabled
    const disabled = this.#disabled
    enabled.length = 0
    disabled.length = 0
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { path, target, enable } = $targetElement
      const settings = this.settings
      if(enable === $enable) { continue iterateTargetElements }
      if($enable === true) {
        try {
          this.#assign(target)
          $targetElement.enable = $enable
          enabled.push($targetElement)
        }
        catch($err) {
          throw $err
          disabled.push($targetElement)
        }
      }
      else if($enable === false) {
        try {
          this.#deassign(target)
          $targetElement.enable = $enable
          disabled.push($targetElement)
        }
        catch($err) { enabled.push($targetElement) }
      }
    }
    if((
      $enable === true && 
      disabled.length === 0 &&
      enabled.length > 0
    ) || (
      $enable === false && 
      enabled.length === 0 && 
      disabled.length > 0
    )) { this.#enable = $enable }
    else if(
      disabled.length === 0 &&
      enabled.length === 0
    ) { this.#enable = null }
    else if(
      disabled.length > 0 &&
      enabled.length > 0
    ) { this.#enable = null }
  }
  get enabled() { return this.#enabled }
  get disabled() { return this.#disabled }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets
    let propertyDirectory = this.#propertyDirectory
    const targetPaths = []
    const targets = []
    if(this.path === ':scope') {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget?.path === this.path
      )
      if(pretargetElement !== undefined) {
        targets.push(pretargetElement)
      }
      else if(pretargetElement === undefined) {
        targets.push({
          path: this.path,
          target: this.#context,
          enable: false,
        })
      }
    }
    else if(this.#target !== undefined) {
      for(const $target of [].concat(this.#target)) {
        const pretargetElement = pretargets.find(
          ($pretarget) => $pretarget?.path === this.path
        )
        if(pretargetElement !== undefined) {
          targets.push(pretargetElement)
        }
        else if(pretargetElement === undefined) {
          targets.push({
            path: this.path,
            target: $target,
            enable: false,
          })
        }
      }
    }
    else if(typeOf(this.path) === 'string') {
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
  get #assign() {
    if(this.#_assign !== undefined) { return this.#_assign }
    this.#_assign = this.settings.methods.assign[this.settings.assign].bind(null, this)
    return this.#_assign
  }
  get #deassign() {
    if(this.#_deassign !== undefined) { return this.#_deassign }
    this.#_deassign = this.settings.methods.deassign[this.settings.deassign].bind(null, this)
    return this.#_deassign
  }
  get #transsign() {
    if(this.#_transsign !== undefined) { return this.#_transsign }
    this.#_transsign = this.settings.methods.transsign[this.settings.transsign].bind(null, this)
    return this.#_transsign
  }
  get #methods() { return this.settings.methods }
  get #propertyDirectory() {
    return propertyDirectory(this.#context, this.settings.propertyDirectory)
  }
  emit() {
    const targets = this.#targets
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { target } = $targetElement
      this.#transsign(target, ...arguments)
    }
    return this
  }
}