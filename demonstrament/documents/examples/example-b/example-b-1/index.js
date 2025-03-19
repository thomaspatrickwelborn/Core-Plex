function listenerLogA() { console.log("listenerLogA", $event.type, $event.detail) }
function listenerLogB() { console.log("listenerLogB", $event.type, $event.detail) }

const application = Core.implement(Object.defineProperties(new EventTarget(), {
  propertyA: { value: Object.defineProperties(new EventTarget(), {
    propertyB: { value: Object.defineProperties(new EventTarget(), {
      propertyC: 3
    }) }
  }) },
  propertyD: { value: [
    Object.defineProperties(new EventTarget(), {
      propertyE: { value: Object.defineProperties(new EventTarget(), {
        propertyF: { value: 6 }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { value: Object.defineProperties(new EventTarget(), {
        propertyF: { value: "6" }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { value: Object.defineProperties(new EventTarget(), {
        propertyF: { value: null }
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
console.log(application)