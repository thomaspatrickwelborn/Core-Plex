import { expandEvents, propertyDirectory } from '../coutil/index.js'
import Settings from './settings/index.js'
import EventDefinition from './event-definition/index.js'
export default class Core extends EventTarget {
  static implement = function ($target, $settings) {
    if(!$target || !$settings) { return undefined }
    const settings = Settings($settings)
    const events = []
    Object.defineProperties($target, {
      // Get Events
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: function getEvents() {
          if(arguments.length === 0) { return events }
          const getEvents = []
          const $filterEvents = [].concat(arguments[0])
          iterateFilterEvents: 
          for(const $filterEvent of $filterEvents) {
            iterateEvents: 
            for(const $event of events) {
              let match
              iterateEventFilterProperties: 
              for(const [
                $filterEventPropertyKey, $filterEventPropertyValue
              ] of Object.entries($filterEvent)) {
                const eventFilterMatch = (
                  $event[$filterEventPropertyKey] === $filterEventPropertyValue
                )
                if(match !== false) { match = eventFilterMatch }
                else { break iterateEventFilterProperties }
              }
              if(match === true) { getEvents.push($event) }
            }
          }
          return getEvents
        }
      },
      // Add Events
      [settings.propertyDefinitions.addEvents]: {
        enumerable: false, writable: false, 
        value: function addEvents() {
          if(!arguments.length) { return $target }
          let $addEvents = expandEvents(arguments[0])
          iterateAddEvents: 
          for(let $addEvent of $addEvents) {
            const event = Object.assign({}, settings, $addEvent)
            const eventDefinition = new EventDefinition(event, $target)
            events.push(eventDefinition)
          }
          return $target
        },
      },
      // Remove Events
      [settings.propertyDefinitions.removeEvents]: {
        enumerable: false, writable: false, 
        value: function removeEvents() {
          let $events
          if(arguments.length === 0) { $events = $target[settings.propertyDefinitions.getEvents]() }
          else if(arguments.length === 1) {
            $events = $target[settings.propertyDefinitions.getEvents](arguments[0])
          }
          if($events.length === 0) return $target
          let eventsIndex = $events.length - 1
          iterateEvents: 
          while(eventsIndex > -1) {
            const event = $events[eventsIndex]
            const removeEventIndex = events.findIndex(
              ($event) => $event === event
            )
            if(removeEventIndex !== -1) {
              event.enable = false
              events.splice(eventsIndex, 1)
            }
            eventsIndex--
          }
          return $target
        }
      },
      // Enable Events
      [settings.propertyDefinitions.enableEvents]: {
        enumerable: false, writable: false, 
        value: function enableEvents() {
          let $events
          if(arguments.length === 0) { $events = events }
          else { $events = $target[settings.propertyDefinitions.getEvents](arguments[0]) }
          iterateEvents: for(const $event of $events) { $event.enable = true }
          return $target
        },
      },
      // Disable Events
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: function disableEvents() {
          let $events
          if(arguments.length === 0) { $events = events }
          else { $events = $target[settings.propertyDefinitions.getEvents](arguments[0]) }
          iterateEvents: for(const $event of $events) { $event.enable = false }
          return $target
        },
      },
      // Reenable Events
      [settings.propertyDefinitions.reenableEvents]: {
        enumerable: false, writable: false, 
        value: function reenableEvents() {
          $target[settings.propertyDefinitions.disableEvents](arguments[0])
          $target[settings.propertyDefinitions.enableEvents](arguments[0])
          return $target
        },
      },
    })
    if(settings.events) { $target[settings.propertyDefinitions.addEvents](settings.events) }
    if(settings.enableEvents === true) {
      $target[settings.propertyDefinitions.enableEvents]()
    }
    else if(typeof settings.enableEvents === 'object') {
      $target[settings.propertyDefinitions.enableEvents](settings.enableEvents)
    }
    return $target
  }
  constructor($settings = {}) {
    super()
    return Core.implement(this, $settings)
  }
}