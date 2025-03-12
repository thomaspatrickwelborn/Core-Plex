import { expandEvents, recursiveAssign, propertyDirectory } from '../coutil/index.js'
import Settings from './settings/index.js'
import EventDefinition from './event-definition/index.js'
export default class Core extends EventTarget {
  static implement = function ($target, $settings) {
    const settings = recursiveAssign({}, Settings, $settings)
    const events = []
    Object.defineProperties($target, {
      // Get Events
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: function getEvents() {
          if(arguments.length === 0) { return events }
          const getEvents = []
          const $events = [].concat(arguments[0])
          iterateEvents: 
          for(const $event of $events) {
            const eventFilterProperties = []
            iterateFilterProperties: 
            for(const [
              $propertyKey, $propertyValue
            ] of Object.entries($event)) {
              eventFilterProperties.push([$propertyKey, $propertyValue])
            }
            iterateExistingEvents: 
            for(const $existingEvent of events) {
              let match
              iterateEventFilterProperty: 
              for(const [
                $eventFilterPropertyKey, $eventFilterPropertyValue
              ] of eventFilterProperties) {
                const eventFilterMatch = (
                  $existingEvent[$eventFilterPropertyKey] === $eventFilterPropertyValue
                )
                if(match !== false) { match = eventFilterMatch }
                else { break iterateEventFilterProperty }
              }
              if(match === true) { getEvents.push($existingEvent) }
            }
          }
          return getEvents
        }
      },
      // Add Events
      [settings.propertyDefinitions.addEvents]: {
        enumerable: false, writable: false, 
        value: function addEvents() {
          let $events = expandEvents(arguments[0])
          iterateEvents: 
          for(let $event of $events) {
            const event = recursiveAssign({
              assign: settings.assign,
              deassign: settings.deassign,
              transsign: settings.transsign,
            }, $event)
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
          if(
            arguments.length === 0 ||
            arguments[0] === true
          ) { $events = events }
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
          $target[settings.propertyDefinitions.disableEvents](...arguments)
          $target[settings.propertyDefinitions.enableEvents](...arguments)
          return $target
        },
      },
    })
    if(settings.events) { $target[settings.propertyDefinitions.addEvents](settings.events) }
    if(settings.enableEvents) { $target[settings.propertyDefinitions.enableEvents](settings.enableEvents) }
    return $target
  }
  constructor($settings = {}) {
    super()
    return Core.implement(this, $settings)
  }
}