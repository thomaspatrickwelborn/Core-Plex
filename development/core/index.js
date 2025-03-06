import {
  expandEvents, recursiveAssign, propertyDirectory
} from '../coutil/index.js'
import Settings from './settings/index.js'
import EventDefinition from './event-definition/index.js'
export default class Core extends EventTarget {
  #events = []
  static implement = function ($target, $settings) {
    const settings = recursiveAssign({}, Settings, $settings)
    const events = []
    Object.defineProperties($target, {
      [settings.propertyDefinitions.events]: {
        enumerable: false, configurable: false, 
        get() { return events },
      },
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: Core.getEvents.bind($target),
      },
      [settings.propertyDefinitions.addEvents]: {
        enumerable: false, writable: false, 
        value: Core.addEvents.bind($target),
      },
      [settings.propertyDefinitions.removeEvents]: {
        enumerable: false, writable: false, 
        value: Core.removeEvents.bind($target),
      },
      [settings.propertyDefinitions.enableEvents]: {
        enumerable: false, writable: false, 
        value: Core.enableEvents.bind($target),
      },
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: Core.disableEvents.bind($target),
      },
      [settings.propertyDefinitions.reenableEvents]: {
        enumerable: false, writable: false, 
        value: Core.reenableEvents.bind($target),
      },
    })
    $target[settings.propertyDefinitions.addEvents](
      settings[
        settings.propertyDefinitions.events || settings.events
      ]
    )
    if(settings.enableEvents) $target.enableEvents(settings.enableEvents)
    return $target
  }
  constructor($settings = {}) {
    super()
    return Core.implement(this, $settings)
  }
  static getEvents() {
    const getEvents = []
    const events = this.events
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
  static addEvents() {
    if(arguments[0] === undefined) { return this }
    const $events = expandEvents(arguments[0])
    const events = this.events
    iterateEvents: 
    for(let $event of $events) {
      $event = recursiveAssign(
        {
          target: {
            assign: 'addEventListener',
            deassign: 'removeEventListener',
            accessors: ['[]', 'get']
          },
          context: this,
        }, 
        $event,
      )
      const eventDefinition = new EventDefinition($event)
      events.push(eventDefinition)
    }
    return this
  }
  static removeEvents() {
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
      const removeEventIndex = this.events.findIndex(
        ($event) => $event === event
      )
      if(removeEventIndex !== -1) {
        event.enable = false
        this.events.splice(eventsIndex, 1)
      }
      eventsIndex--
    }
    return this
  }
  static enableEvents() {
    let $events
    if(
      arguments.length === 0 ||
      arguments[0] === true
    ) { $events = this.events }
    else { $events = this.getEvents(arguments[0]) }
    iterateEvents: for(const $event of $events) { $event.enable = true }
  }
  static disableEvents() {
    let $events
    if(arguments.length === 0) { $events = this.events }
    else { $events = this.getEvents(arguments[0]) }
    iterateEvents: for(const $event of $events) { $event.enable = false }
    return this
  }
  static reenableEvents() {
    return this
    .disableEvents(...arguments)
    .enableEvents(...arguments)
  }
}