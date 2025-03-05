import {
  expandEvents, recursiveAssign, propertyDirectory
} from '../coutil/index.js'
import Settings from './settings/index.js'
import EventDefinition from './event-definition/index.js'
export default class Core extends EventTarget {
  #events = []
  #settings
  static implement = function ($target, $settings) {
    let events = []
    Object.defineProperties($target, {
      events: {
        enumerable: false, configurable: false,
        get() { return events },
      },
      getEvents: { value: configurable.getEvents.bind($target) },
      addEvents: { value: Core.addEvents.bind($target) },
      removeEvents: { value: Core.removeEvents.bind($target) },
      enableEvents: { value: Core.enableEvents.bind($target) },
    })
  }
  constructor($settings = {}) {
    super()
    this.addEvents($settings.events)
    if($settings.enableEvents) this.enableEvents($settings.enableEvents)
  }
  get events() { return this.#events }
  getEvents() {
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
  addEvents() {
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
  enableEvents() {
    let $events
    if(
      arguments.length === 0 ||
      arguments[0] === true
    ) { $events = this.events }
    else { $events = this.getEvents(arguments[0]) }
    iterateEvents: for(const $event of $events) { $event.enable = true }
  }
  disableEvents() {
    let $events
    if(arguments.length === 0) { $events = this.events }
    else { $events = this.getEvents(arguments[0]) }
    iterateEvents: for(const $event of $events) { $event.enable = false }
    return this
  }
  reenableEvents() {
    return this
    .disableEvents(...arguments)
    .enableEvents(...arguments)
  }
}