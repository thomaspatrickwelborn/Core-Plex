console.log(
  "\n", "------------",
  "\n", "Example B.4.",
  "\n", "------------",
)
import Core from '/dependencies/core-plex.js'
const completed = {
  listenerLogA: [],
  listenerLogB: [],
  listenerLogC: [],
}
function listenerLogA($event) {
  completed.listenerLogA.push($event)
  console.log("listenerLogA", $event.detail.type, $event.detail.path)
}
function listenerLogB($event) {
  completed.listenerLogB.push($event)
  console.log("listenerLogB", $event.detail.type, $event.detail.path)
}
function listenerLogC($event) {
  completed.listenerLogC.push($event)
  console.log("listenerLogC", $event.detail.type, $event.detail.path)
}
const application = Object.assign(new Core({
  events: {
    'application:event': listenerLogA,
    'propertyA.propertyB application:event': listenerLogB,
    'propertyD.[0-9].propertyE application:event': listenerLogC,
  },
}), Object.assign({
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
}))
.enableEvents()
application.getEvents({ type: 'application:event' }).forEach(
  ($eventDefinition) => {
    $eventDefinition.emit(
      new CustomEvent('application:event', { detail: $eventDefinition })
    )
  }
)
console.log("pass", (
  (completed.listenerLogA.length === 1) &&
  (completed.listenerLogB.length === 1) &&
  (completed.listenerLogC.length === 3)
))