import { expandEvents, recursiveAssign, typedObjectLiteral, typeOf } from '../coutil/index.js'
import PropertyClass from './propertyClass/index.js'
import Events from './propertyClass/events/index.js'
import { Instate, Deinstate } from './propertyClass/states/index.js'
import CoreEvent from './event/index.js'
import Settings from './settings/index.js' 
import Options from './options/index.js' 
export default class Core extends EventTarget {
  #settings
  #options
  #_events
  #_propertyClassEvents
  #_propertyClasses = []
  static propertyClasses = []
  constructor($settings = {}, $options = {}) {
    super()
    this.settings = $settings
    this.options = $options
    this.addPropertyClasses(this.settings.propertyClasses)
    this.#addProperties(this.settings)
    this.addEvents(this.settings.events)
    this.#defineProperties(this.options.defineProperties)
    this.#assign(...this.options.assign)
    if(this.options.enableEvents) this.enableEvents(this.options.enableEvents) 
  }
  get #propertyClassEvents() {
    if(this.#_propertyClassEvents !== undefined) return this.#_propertyClassEvents
    this.#_propertyClassEvents = {}
    for(const $propertyClass of this.#propertyClasses) {
      this.#_propertyClassEvents[$propertyClass.Name] = $propertyClass.Events
    }
    return this.#_propertyClassEvents
  }
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
  getPropertyClass() {
    const { ID, Name } = arguments[0]
    let propertyClass
    iteratePropertyClasses: 
    for(const $propertyClass of this.#propertyClasses) {
      if(
        ID && $propertyClass.ID === ID ||
        Name && $propertyClass.Name === Name
      ) { propertyClass = $propertyClass }
    }
    return propertyClass
  }
  #addProperties() {
    for(const $propertyClass of this.#propertyClasses) {
      const { Name, Names, Definition } = $propertyClass
      if(Definition.Object !== undefined) {
        this[`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`](this.settings[Name])
      }
      else if(this.settings[Name] !== undefined) {
        this[Name] = this.settings[Name]
      }
    }
    return this
  }
  addPropertyClasses() {
    const $this = this
    let $propertyClasses = (arguments.length === 0)
      ? this.settings.propertyClasses
      : arguments[0]
    if(
      !Array.isArray($propertyClasses) &&
      typeof $propertyClasses === 'object'
    ) {
      $propertyClasses = Object.values(arguments[0])
    }
    const propertyClasses = this.#propertyClasses
    iteratePropertyClasses: 
    for(const $propertyClass of $propertyClasses) {
      // Class States
      $propertyClass.States = $propertyClass.States || {}
      $propertyClass.Definition = $propertyClass.Definition || {}
      // Class Instate
      if($propertyClass.States.Instate === undefined) {
        $propertyClass.States.Instate = Instate 
      }
      // Class Deinstate
      if($propertyClass.States.Deinstate === undefined) {
        $propertyClass.States.Deinstate = Deinstate 
      }
      const {
        ID,
        Name,
        Names,
        Events,
        States,
        Definition,
      } = $propertyClass
      let propertyValue
      if([
        [], {},
        'Array', 'Object', 'array', 'object',
        Array, Object, 
        '[]', '{},'
      ].includes(Definition.Object)) {
        Object.defineProperties(this, {
          // Property Class Instances
          [Name]: {
            configurable: true, enumerable: true,  
            get() {
              if(propertyValue !== undefined) {
                return propertyValue
              }
              propertyValue = new PropertyClass($propertyClass, $this)
              return propertyValue
            },
            set($propertyClassInstances) {
              const propertyClassInstances = $this[Name]
              let propertyClassInstancesEntries
              if($propertyClassInstances) {
                if(Array.isArray($propertyClassInstances)) {
                  propertyClassInstancesEntries = $propertyClassInstances
                }
                else {
                  propertyClassInstancesEntries = Object.entries($propertyClassInstances)
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
          [`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`]: {
            configurable: true, enumerable: true, writable: false, 
            value: function() {
              const $arguments = [...arguments]
              if($arguments.length === 1) {
                const [$values] = $arguments
                if(Array.isArray($values)) {
                  $this[Name] = Object.fromEntries($values)
                }
                else {
                  $this[Name] = $values
                }
              }
              else if($arguments.length === 2) {
                const [$key, $value] = $arguments
                $this[Name] = { [$key]: $value }
              }
            }
          },
          // Remove Property Class Instances
          [`${Names.Minister.Dead.Nonformal}${Names.Multiple.Formal}`]: {
            configurable: true, enumerable: true, writable: false, 
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
                removeKeys.push(...Object.keys($this[Name]))
              }
              for(const $removeKey of $removeKeys) {
                delete $this[Name][$removeKey]
              }
            }
          },
        })
      }
      else {
        Object.defineProperties(this, {
          [Names.Monople.Nonformal]: {
            get() {
              return propertyValue
            },
            set($propertyClassInstance) {
              propertyValue = States.Instate(Object.assign({
                core: this
              }, $propertyClass), Name, $propertyClassInstance)
            }
          },
        })
      }
      propertyClasses.push($propertyClass)
    }
    return this
  }
  removePropertyClasses() {
    let removePropertyClasses = []
    if(arguments.length === 0) { removePropertyClasses = removePropertyClasses.concat(
      Object.keys(this.#propertyClasses)
    ) }
    else if(arguments.length === 1) {
      const $removePropertyClasses = arguments[0]
      const typeofRemovePropertyClasses = typeOf($removePropertyClasses)
      if(
        typeofRemovePropertyClasses === 'string'
      ) {
        removePropertyClasses = removePropertyClasses.concat($removePropertyClasses)
      }
      else if(typeofRemovePropertyClasses === 'array') {
        removePropertyClasses = removePropertyClasses.concat($removePropertyClasses)
      }
      else if(typeofRemovePropertyClasses === 'object') {
        removePropertyClasses = removePropertyClasses.concat(Object.keys($removePropertyClasses))
      }
    }
    iterateRemovePropertyClasses: 
    for(const $removePropertyClassName of removePropertyClasses) {
      const { Names, Definition } = this.getPropertyClass({ Name: $removePropertyClassName })
      const propertyClassInstances = this[Names.Multiple.Nonformal]
      iteratePropertyClassInstances: 
      for(const [
        $propertyClassInstanceName, $propertyClassInstance
      ] of Object.entries(this[Names.Multiple.Nonformal])) {
        delete propertyClassInstances[$propertyClassInstanceName]
      }
      delete this[`_${Names.Multiple.Nonformal}`]
      Object.defineProperty(this, Names.Multiple.Nonformal, {
        configurable: true, enumerable: false, writable: true, 
        value: undefined
      })
      delete this[Names.Multiple.Nonformal]
      delete this[`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`]
      delete this[`${Names.Minister.Dead.Nonformal}${Names.Multiple.Formal}`]
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
    for(let $event of $events) {
      const propertyClassName = $event.path.split('.').shift()
      const propertyClassEvents = Object.assign(
        {}, 
        this.#propertyClassEvents[propertyClassName],
        $event?.sign, 
      )
      $event = Object.assign(
        {}, 
        $event,
        {
          context: this,
          propertyClassEvents,
        }
      )
      const coreEvent = new CoreEvent($event)
      events.push(coreEvent)
    }
    return this
  }
  removeEvents() {
    const { events } = this
    let $events
    if(arguments.length === 0) { $events = events }
    else if(arguments.length === 1) {
      $events = this.getEvents(arguments[0])
    }
    if($events.length === 0) return this
    let eventsIndex = events.length - 1
    iterateEvents: 
    while(eventsIndex > -1) {
      const event = events[eventsIndex]
      const removeEventIndex = $events.findIndex(
        ($event) => $event === event
      )
      if(removeEventIndex !== -1) {
        event.enable = false
        events.splice(eventsIndex, 1)
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
  #assign() {
    Object.assign(this, ...arguments)
    return this
  }
  #defineProperties() {
    Object.defineProperties(this, arguments[0])
    return this
  }
  #toggleEventAbility($eventListenerMethod, $events) {
    let enability
    if($eventListenerMethod === 'Assign') { enability = true }
    else if($eventListenerMethod === 'Deassign') { enability = false }
    else { return this }
    iterateEvents:
    for(const $event of $events) { $event.enable = enability }
    return this
  }
}