console.log(
  "\n", "------------",
  "\n", "Example B.5.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
function listenerLogA($event) { console.log("listenerLogA", $event.detail.type, $event.detail.path) }
function listenerLogB($event) { console.log("listenerLogB", $event.detail.type, $event.detail.path) }
const application = Object.assign(new Core(), {
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 3
    })
  }),
  propertyD: [
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: 6
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: "6"
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: null
      })
    })
  ],
  propertyG: 7,
})
.addEvents({
  'application:event': listenerLogA,
  'propertyA.propertyB application:event': listenerLogB,
  'propertyD.[0-9].propertyE application:event': listenerLogB,
})
.enableEvents()
application.getEvents({ type: 'application:event' }).forEach(
  ($eventDefinition) => {
    $eventDefinition.emit(
      new CustomEvent('application:event', { detail: $eventDefinition })
    )
  }
)