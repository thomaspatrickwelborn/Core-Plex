import { expandEvents, recursiveAssign, typedObjectLiteral, typeOf, pathkeyTree } from '../coutil/index.js'
import PropertyClass from './propertyClass/index.js'
import { instate, deinstate } from './propertyClass/states/index.js'
import CoreEvent from './event/index.js'
import Settings from './settings/index.js' 
import Options from './options/index.js' 
export default class Core extends EventTarget {
  #settings
  #options
  #_events
  #_propertyClasses = []
  static propertyClasses = []
  constructor($settings = {}, $options = {}) {
    super()
    this.settings = $settings
    this.options = $options
    this.addPropertyClasses(this.settings.propertyClasses)
    this.#addProperties(this.settings)
    this.addEvents(this.settings.events)
    if(this.options.enableEvents) this.enableEvents(this.options.enableEvents) 
  }
  get propertyDirectory() { return pathkeyTree(this) }
  get settings() { return this.#settings }
  set settings($settings) {
    if(this.#settings !== undefined) returnd
    this.#settings = Object.assign({}, Settings, $settings)
  }
  get options() { return this.#options }
  set options($options) {
    if(this.#options !== undefined) return
    this.#options = recursiveAssign(structuredClone(Options), $options)
  }
  get #events() {
    if(this.#_events !== undefined) return this.#_events
    this.#_events = []
    return this.#_events
  }
  get #propertyClasses() { return this.#_propertyClasses }
  #getPropertyClasses() {
    let $getPropertyClasses
    if(arguments.length === 0) $getPropertyClasses = this.#propertyClasses
    else { $getPropertyClasses = [].concat(...arguments) }
    const getPropertyClasses = []
    let propertyClassIndex = 0
    iteratePropertyClasses: 
    for(const $propertyClass of this.#propertyClasses) {
      for(const $getPropertyClass of $getPropertyClasses) {
        if($propertyClass.name === $getPropertyClass.name) {
          getPropertyClasses.push({
            propertyClassIndex: propertyClassIndex,
            propertyClass: $propertyClass
          })
        }
      }
      propertyClassIndex++
    }
    return getPropertyClasses
  }
  #addProperties($properties) {
    iteratePropertyClasses: 
    for(const $propertyClass of this.#propertyClasses) {
      const { name, names, definition } = $propertyClass
      if(!definition) { continue iteratePropertyClasses }
      if($properties[name] === undefined) { continue iteratePropertyClasses }
      if(definition.object !== undefined) {
        this[`${names.minister.ad.nonformal}${names.multiple.formal}`](this.settings[name])
      }
      else if(this.settings[name] !== undefined) {
        this[name] = this.settings[name]
      }
    }
    return this
  }
  addPropertyClasses() {
    const $this = this
    let $addPropertyClasses = (arguments.length === 0)
      ? this.settings.propertyClasses
      : [].concat(...arguments)
    const propertyClasses = this.#propertyClasses
    iteratePropertyClasses: 
    for(const $addPropertyClass of $addPropertyClasses) {
      if(!$addPropertyClass.definition) {
        propertyClasses.push($addPropertyClass)
        continue iteratePropertyClasses
      }
      // Class States
      $addPropertyClass.states = $addPropertyClass.states || {}
      $addPropertyClass.definition = $addPropertyClass.definition || {}
      // Class instate
      if($addPropertyClass?.states.instate === undefined) {
        $addPropertyClass.states.instate = instate 
      }
      // Class deinstate
      if($addPropertyClass.states.deinstate === undefined) {
        $addPropertyClass.states.deinstate = deinstate 
      }
      const {
        name,
        names,
        states,
        definition,
      } = $addPropertyClass
      let propertyValue
      if(
        definition.object === 'Array' || 
        definition.object === 'Object'
      ) {
        Object.defineProperties(this, {
          // Property Class Instances
          [name]: {
            configurable: true, enumerable: true,  
            get() {
              if(propertyValue !== undefined) {
                return propertyValue
              }
              propertyValue = new PropertyClass($addPropertyClass, $this)
              return propertyValue
            },
            set($propertyValue) {
              const propertyClassInstances = $this[name]
              let propertyClassInstancesEntries
              if($propertyValue) {
                if(Array.isArray($propertyValue)) {
                  propertyClassInstancesEntries = $propertyValue
                }
                else {
                  propertyClassInstancesEntries = Object.entries($propertyValue)
                }
              } else { propertyClassInstancesEntries = [] }
              iteratePropertyClassInstances: 
              for(const [
                $propertyClassInstanceName, $propertyClassInstance
              ] of propertyClassInstancesEntries) {
                propertyClassInstances[$propertyClassInstanceName] = $propertyClassInstance
              }
            }
          },
          // Add Property Class Instances
          [`${names.minister.ad.nonformal}${names.multiple.formal}`]: {
            configurable: true, enumerable: false, writable: false, 
            value: function() {
              const $arguments = [...arguments]
              if($arguments.length === 1) {
                const [$values] = $arguments
                if(definition.object === 'Array') {
                  $this[name] = Object.entries($values)
                }
                else {
                  if(Array.isArray($values)) {
                    $this[name] = Object.fromEntries($values)
                  }
                  else {
                    $this[name] = $values
                  }
                }
              }
              else if($arguments.length === 2) {
                const [$key, $value] = $arguments
                $this[name] = { [$key]: $value }
              }
              return $this
            }
          },
          // Remove Property Class Instances
          [`${names.minister.dead.nonformal}${names.multiple.formal}`]: {
            configurable: true, enumerable: false, writable: false, 
            value: function() {
              const [$removeKeys] = [...arguments]
              const removeKeys = []
              const typeofRemoveKeys = typeof $arguments[0]
              if(typeofRemoveKeys === 'string') { removeKeys.push($arguments[0]) }
              else if(typeofRemoveKeys === 'object') {
                if(Array.isArray($removeKeys)) { removeKeys.push(...$removeKeys) }
                else { removeKeys.push(...Object.keys($removeKeys)) }
              }
              else if(typeofRemoveKeys === 'undefined') {
                removeKeys.push(...Object.keys($this[name]))
              }
              for(const $removeKey of $removeKeys) {
                delete $this[name][$removeKey]
              }
              return $this
            }
          },
        })
      }
      else if(
        definition !== undefined &&
        names?.monople.nonformal !== undefined
      ) {
        Object.defineProperties(this, {
          [names.monople.nonformal]: {
            get() {
              return propertyValue
            },
            set($propertyValue) {
              propertyValue = states.instate(Object.assign({
                core: this
              }, $addPropertyClass), name, $propertyValue)
              }
          },
        })
      }
      propertyClasses.push($addPropertyClass)
    }
    return this
  }
  removePropertyClasses() {
    const removePropertyClasses = this.#getPropertyClasses(...arguments)
    let removePropertyClassIndex = removePropertyClasses.length - 1
    iterateRemovePropertyClasses: 
    while(removePropertyClassIndex > -1) {
      const { propertyClassIndex, propertyClass } = removePropertyClasses[removePropertyClassIndex]
      const { names, definition } = propertyClass
      const propertyClassInstances = this[names.multiple.nonformal]
      if(definition.object) {
        if(definition.object === 'Array') {
          let propertyClassInstanceIndex = propertyClassInstances.length - 1
          iteratePropertyClassInstances: 
          while(propertyClassInstanceIndex > -1) {
            propertyClassInstances.splice(propertyClassInstanceIndex, 1)
            propertyClassInstanceIndex--
          }
        }
        else if(definition.object === 'Object') {
          iteratePropertyClassInstances: 
          for(const [
            $propertyClassInstanceName, $propertyClassInstance
          ] of Object.entries(this[names.multiple.nonformal])) {
            delete propertyClassInstances[$propertyClassInstanceName]
          }
        }
        delete this[`_${names.multiple.nonformal}`]
        Object.defineProperty(this, names.multiple.nonformal, {
          configurable: true, enumerable: false, writable: true, 
          value: undefined
        })
        delete this[names.multiple.nonformal]
        delete this[`${names.minister.ad.nonformal}${names.multiple.formal}`]
        delete this[`${names.minister.dead.nonformal}${names.multiple.formal}`]
      }
      else {
        delete this[names.monople.nonformal]
        Object.defineProperty(this, names.monople.nonformal, {
          configurable: true, enumerable: false, writable: true, 
          value: undefined
        })
      }
      this.#propertyClasses.splice(propertyClassIndex, 1)
      removePropertyClassIndex--
    }
    return this
  }
  getEvents() {
    const getEvents = []
    const events = this.#events
    const $events = [].concat(arguments[0])
    iterateEvents: 
    for(const $event of $events) {
      const { type, path, listener, enable } = $event
      const eventFilterProperties = []
      if(type !== undefined) { eventFilterProperties.push(['type', type]) }
      if(path !== undefined) { eventFilterProperties.push(['path', path]) }
      if(listener !== undefined) { eventFilterProperties.push(['listener', listener]) }
      if(enable !== undefined) { eventFilterProperties.push(['enable', enable]) }
      getEvents.push(
        ...events.filter(($existingEvent) => {
          return eventFilterProperties.reduce(($match, [
            $eventFilterPropertyKey, $eventFilterPropertyValue
          ]) => {
            const match = (
              $existingEvent[$eventFilterPropertyKey] === $eventFilterPropertyValue
            ) ? true : false
            if($match !== false) { $match = match }
            return $match
          }, undefined)
        })
      )
    }
    return getEvents
  }
  addEvents() {
    if(arguments[0] === undefined) { return this }
    const $events = expandEvents(arguments[0])
    const events = this.#events
    iterateEvents: 
    for(let $event of $events) {
      $event = recursiveAssign(
        {
          target: {
            assign: 'addEventListener',
            deassign: 'removeEventListener',
            accessors: ['[]', 'get']
          },
          context: this
        }, 
        $event,
      )
      const coreEvent = new CoreEvent($event)
      events.push(coreEvent)
    }
    return this
  }
  removeEvents() {
    let $events
    if(arguments.length === 0) { $events = this.getEvents() }
    else if(arguments.length === 1) {
      $events = this.getEvents(arguments[0])
    }
    if($events.length === 0) return this
    let eventsIndex = $events.length - 1
    iterateEvents: 
    while(eventsIndex > -1) {
      const event = $events[eventsIndex]
      const removeEventIndex = this.#events.findIndex(
        ($event) => $event === event
      )
      if(removeEventIndex !== -1) {
        event.enable = false
        this.#events.splice(eventsIndex, 1)
      }
      eventsIndex--
    }
    return this
  }
  enableEvents() {
    let $events
    if(
      arguments.length === 0 ||
      arguments[0] === true
    ) { $events = this.#events }
    else { $events = this.getEvents(arguments[0]) }
    return this.#toggleEventAbility('Assign', $events)
  }
  disableEvents() {
    let $events
    if(arguments.length === 0) { $events = this.#events }
    else { $events = this.getEvents(arguments[0]) }
    return this.#toggleEventAbility('Deassign', $events)
  }
  reenableEvents() {
    return this
    .disableEvents(...arguments)
    .enableEvents(...arguments)
  }
  #toggleEventAbility($eventListenerMethod, $events) {
    let enability
    if($eventListenerMethod === 'Assign') { enability = true }
    else if($eventListenerMethod === 'Deassign') { enability = false }
    else { return this }
    iterateEvents: for(const $event of $events) { $event.enable = enability }
    return this
  }
}