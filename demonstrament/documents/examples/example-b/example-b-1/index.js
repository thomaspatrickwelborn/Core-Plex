console.log(
  "\n", "------------",
  "\n", "Example B.1.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
function listenerLogA($event) { console.log("listenerLogA", $event.detail.type, $event.detail.path) }
function listenerLogB($event) { console.log("listenerLogB", $event.detail.type, $event.detail.path) }
const application = Core.implement(Object.defineProperties(new EventTarget(), {
  propertyA: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
    propertyB: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
      propertyC: { enumerable: true, value: 3 }
    }) }
  }) },
  propertyD: { enumerable: true, value: [
    Object.defineProperties(new EventTarget(), {
      propertyE: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
        propertyF: { enumerable: true, value: 6 }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
        propertyF: { enumerable: true, value: "6" }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
        propertyF: { enumerable: true, value: null }
      } ) }
    }),
  ] },
  propertyG: { value: 7 },
}), {
  enableEvents: true,
  events: {
    'application:event': listenerLogA,
    'propertyA.propertyB application:event': listenerLogB,
    'propertyD.[0-9].propertyE application:event': listenerLogB,
  },
})
application.getEvents({ path: ':scope' }).forEach(
  ($eventDefinition) => $eventDefinition.emit(
    new CustomEvent('application:event', { detail: $eventDefinition })
  )
)
application.getEvents([
  { path: 'propertyA.propertyB' },
  { path: 'propertyD.[0-9].propertyE' },
]).forEach(
  ($eventDefinition) => $eventDefinition.emit(
    new CustomEvent('application:event', { detail: $eventDefinition })
  )
)
