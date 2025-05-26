console.log(
  "\n", "------------",
  "\n", "Example B.3.",
  "\n", "------------",
)
import Core from '/dependencies/core-plex.js'
function listenerLogA($event) { console.log("listenerLogA", $event.detail.type, $event.detail.path) }
function listenerLogB($event) { console.log("listenerLogB", $event.detail.type, $event.detail.path) }
class Application extends Core {
  constructor($settings, $properties) {
    super()
    Object.assign(this, $properties)
    this.addEvents($settings.events)
    if($settings.enableEvents) { this.enableEvents() }
  }
}
const application = new Application({
  events: {
    'application:event': listenerLogA,
    'propertyA.propertyB application:event': listenerLogB,
    'propertyD.[0-9].propertyE application:event': listenerLogB,
  },
  enableEvents: true,
}, {
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
application.getEvents({ type: 'application:event' }).forEach(
  ($eventDefinition) => {
    $eventDefinition.emit(
      new CustomEvent('application:event', { detail: $eventDefinition })
    )
  }
)
