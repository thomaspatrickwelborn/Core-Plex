import outmatch from 'outmatch'
import Settings from './settings/index.js'
import { typeOf, propertyDirectory } from '../../coutil/index.js'
export default class EventDefinition {
  #settings
  #context
  #listener
  #enable = false
  #path
  #assigned = []
  #deassigned = []
  #transsigned = []
  #nontranssigned = []
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
    const targets = this.#targets
    const assigned = this.#assigned
    const deassigned = this.#deassigned
    assigned.length = 0
    deassigned.length = 0
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { path, target, enable } = $targetElement
      const settings = this.settings
      if(enable === $enable) { continue iterateTargetElements }
      if($enable === true) {
        try {
          this.#assign(target)
          $targetElement.enable = $enable
          assigned.push($targetElement)
          
        }
        catch($err) { console.error($err) }
      }
      else if($enable === false) {
        try {
          this.#deassign(target)
          $targetElement.enable = $enable
          deassigned.push($targetElement)
        }
        catch($err) { console.error($err) }
      }
    }
    this.#enable = $enable
  }
  get assigned() { return this.#assigned }
  get deassigned() { return this.#deassigned }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets
    const targets = []
    if(this.#target) {
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
      const targetPaths = []
      if(this.path === this.#scopeKey) {
        const targetElement = {
          path: this.path,
          target: this.#context,
          enable: false,
        }
        targets.push(targetElement)
      }
      else {
        if(this.settings.propertyDirectory) {
          const propertyDirectory = this.#propertyDirectory
          const propertyPathMatcher = outmatch(this.path, {
            separator: '.',
          })
          iteratePropertyPaths: 
          for(const $propertyPath of propertyDirectory) {
            const propertyPathMatch = propertyPathMatcher($propertyPath)
            if(propertyPathMatch === true) { targetPaths.push($propertyPath) }
          }
          if(this.path.charAt(0) === '*') {
            targetPaths.unshift(this.#scopeKey)
          }
        }
        else {
          targetPaths.push(this.path)
        }
        iterateTargetPaths: 
        for(const $targetPath of targetPaths) {
          const pretargetElement = pretargets.find(
            ($pretarget) => $pretarget.path === $targetPath
          )
          let target = this.#context
          let targetElement
          const pathKeys = $targetPath.split('.')
          let pathKeysIndex = 0
          iterateTargetPathKeys: 
          while(pathKeysIndex < pathKeys.length) {
            let pathKey = pathKeys[pathKeysIndex]
            if(pathKey === this.#scopeKey) { break iterateTargetPathKeys }
            iterateTargetAccessors: 
            for(const $targetAccessor of this.settings.accessors) {
              target = $targetAccessor(target, pathKey)
              if(target !== undefined) { break iterateTargetAccessors }
            }
            pathKeysIndex++
          }
          if(target !== undefined) {
            if(target === pretargetElement?.target) {
              targetElement = pretargetElement
            }
            else if(typeof target === 'object') {
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
    }
    this.#_targets = targets
    return this.#_targets
  }
  get #scopeKey() { return this.settings.scopeKey }
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
    if(!this.settings.propertyDirectory) { return null }
    const propertyDirectorySettings = ({
      accessors: this.settings.accessors
    }, this.settings.propertyDirectory)
    return propertyDirectory(this.#context, propertyDirectorySettings)
  }
  emit() {
    const targets = this.#targets
    const transsigned = this.#transsigned
    const nontranssigned = this.#nontranssigned
    transsigned.length = 0
    nontranssigned.length = 0
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { target } = $targetElement
      try {
        this.#transsign(target, ...arguments)
        transsigned.push($targetElement)
      }
      catch($err) { nontranssigned.push($targetElement) }
    }
    return this
  }
}