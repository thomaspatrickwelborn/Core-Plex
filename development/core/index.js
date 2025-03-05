import { expandEvents, recursiveAssign, pathDirectory } from '../coutil/index.js'
import CoreEvent from './event/index.js'
import Settings from './settings/index.js' 
import Options from './options/index.js' 
export default class Core extends EventTarget {
  #settings
  #options
  #_events
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = Object.assign({}, Settings, $settings)
    this.#options = recursiveAssign(structuredClone(Options), $options)
    this.addEvents(this.settings.events)
    if(this.options.enableEvents) this.enableEvents(this.options.enableEvents) 
  }
  get propertyDirectory() { return pathDirectory(this, this.options.propertyDirectory) }
  get settings() { return this.#settings }
  get options() { return this.#options }
  get #events() {
    if(this.#_events !== undefined) return this.#_events
    this.#_events = []
    return this.#_events
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