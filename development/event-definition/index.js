import Settings from './settings/index.js'
import { typeOf, compand, get } from 'recourse'
export default class EventDefinition {
  #context
  #enable = false
  #nontranssigned = []
  #_targets = []
  #_assign
  #_deassign
  #_transsign
  constructor($settings, $context) { 
    if(!$settings || !$context) { return this }
    const settings = Settings($settings)
    const assigned = []
    const deassigned = []
    const transsigned = []
    Object.defineProperties(this, {
      'settings': { value: settings },
      'path': { value: settings.path },
      'type': { value: settings.type },
      'assigned': { value: assigned },
      'deassigned': { value: deassigned },
      'transsigned': { value: transsigned },
      'listener':  { configurable: true, get() {
        const typeOfListener = typeOf(settings.listener)
        let listener
        if(typeOfListener === 'string') {
          let listenerTarget = $context
          iterateListenerPathKeys: 
          for(const $pathKey of settings.listener.split('.')) {
            const value = listenerTarget[$pathKey]
            if(value !== undefined) { listenerTarget = listenerTarget[$pathKey] }
            else { break iterateListenerPathKeys }
          }
          if(typeOf(listenerTarget) === 'function') {
            listener = listenerTarget
          }
        }
        else { listener = settings.listener }
        if(settings.bindListener === true) {
          listener = listener.bind(this.#context)
        }
        Object.defineProperty(this, 'listener', { value: listener })
        return listener
      } }
    })
    this.#context = $context
    this.enable = this.settings.enable
  }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets
    const assigned = this.assigned
    const deassigned = this.deassigned
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
        catch($err) { if(this.settings.errorLog) { console.error($err) } }
      }
      else if($enable === false) {
        try {
          this.#deassign(target)
          $targetElement.enable = $enable
          deassigned.push($targetElement)
        }
        catch($err) { if(this.settings.errorLog) { console.error($err) } }
      }
    }
    this.#enable = $enable
  }
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
        else if(pretargetElement === undefined) { targets.push({
            path: this.path,
            target: $target,
            enable: false,
          })
        }
      }
    }
    else if(typeOf(this.path) === 'string') {
      // Refactoring
      const targetPaths = []
      if(this.settings.pathMatch) {
        targetPaths.push(...get(this.#context, this.path, {
          pathMatch: this.settings.pathMatch, nonenumerable: true
        }))
      }
      else {
        targetPaths.push([
          this.path, get(this.#context, this.path, {
            pathMatch: this.settings.pathMatch, nonenumerable: true
          })
        ])
      }
        if(this.path.charAt(0) === '*') {
          targetPaths.unshift([this.#scopeKey, this.#context])
        }
        iterateTargetPaths: 
        for(const [$targetPath, $targetValue] of targetPaths) {
          const pretargetElement = pretargets.find(
            ($pretarget) => $pretarget.path === $targetPath
          )
          let target = $targetValue
          let targetElement
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
      // }
      if(this.path === this.#scopeKey) {
        const targetElement = {
          path: this.path,
          target: this.#context,
          enable: false,
        }
        targets.push(targetElement)
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
  emit() {
    const targets = this.#targets
    const transsigned = this.transsigned
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