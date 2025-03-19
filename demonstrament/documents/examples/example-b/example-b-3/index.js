class Application extends Core {
  constructor($settings, $properties) {
    super($settings)
    Object.assign(this, $properties)
    this.addEvents({
      'application:event': listenerLogA,
      'propertyA.propertyB application:event': listenerLogB,
      'propertyD.[0-9].propertyE application:event': listenerLogB,
    })
    if(this.settings.enableEvents) { this.enableEvents() }
  }
}
const application = new Application({ enableEvents: true }, {
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