import { expandEvents, recursiveAssign } from '../coutil/index.js'
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
          if(!arguments[0]) { return events }
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
                let eventFilterMatch
                if($filterEventPropertyKey === 'listener') {
                  eventFilterMatch = (
                    $event.settings[$filterEventPropertyKey] === $filterEventPropertyValue
                  )
                }
                else {
                  eventFilterMatch = (
                    $event[$filterEventPropertyKey] === $filterEventPropertyValue
                  )
                }
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
            const event = {}
            for(const $settingKey of [
              'accessors', 'assign', 'deassign', 'propertyDirectory'
            ]) {
              const settingValue = settings[$settingKey]
              if(settingValue !== undefined) { event[$settingKey] = settingValue }
            }
            recursiveAssign(event, $addEvent)
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
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0])
          if($events.length === 0) return $target
          let eventsIndex = events.length - 1
          while(eventsIndex > -1) {
            const event = events[eventsIndex]
            if($events.includes(event)) {
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
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0])
          if($events.length === 0) return $target
          iterateEvents: for(const $event of $events) { $event.enable = true }
          return $target
        },
      },
      // Disable Events
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: function disableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0])
          if($events.length === 0) return $target
          iterateEvents: for(const $event of $events) { $event.enable = false }
          return $target
        },
      },
      // Reenable Events
      [settings.propertyDefinitions.reenableEvents]: {
        enumerable: false, writable: false, 
        value: function reenableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0])
          for(const $event of $events) {
            $event.enable = false
            $event.enable = true
          }
          return $target
        },
      },
    })
    if(settings.events) { $target[settings.propertyDefinitions.addEvents](settings.events) }
    if(settings.enableEvents === true) { $target[settings.propertyDefinitions.enableEvents]() }
    return $target
  }
  constructor($settings = {}) {
    super()
    return Core.implement(this, $settings)
  }
}