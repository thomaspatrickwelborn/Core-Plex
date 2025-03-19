function listenerLogA() { console.log("listenerLogA", $event.type, $event.detail) }
function listenerLogB() { console.log("listenerLogB", $event.type, $event.detail) }

class Application extends Core {
  constructor($settings, $properties) {
    super(Object.assign({}, $settings, {
      events: {
        'application:event': listenerLogA,
        'propertyA.propertyB application:event': listenerLogB,
        'propertyD.[0-9].propertyE application:event': listenerLogB,
      },
    }))
    Object.assign(this, $properties)
  }
}
const application = new Application({
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