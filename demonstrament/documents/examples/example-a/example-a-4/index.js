console.log(
  "\n", "------------",
  "\n", "Example A.4.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
class CustomCore extends Core {
  constructor($settings, $properties = {}) {
    super($settings)
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries($properties)) {
      if($propertyValue && typeof $propertyValue === 'object') {
        const subpropertySettings = Object.assign({}, {
          defineProperties: $settings.defineProperties
        })
        Object.defineProperty(this, $propertyKey, {
          enumerable: true, writable: false,
          value: new CustomCore({}, $propertyValue),
        })
      }
      else {
        Object.defineProperty(this, $propertyKey, {
          enumerable: true, writable: false,
          value: $propertyValue,
        })
      }
    }
    if($settings.enableEvents === true) { this.enableEvents() }
  }
}
const customCore = new CustomCore({
  events: {
    'propertyA customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyA.propertyB customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyD.[0-9] customEvent': ($event) => console.log($event.type, $event.detail),
  },
  enableEvents: true,
}, {
  propertyA: {
    propertyB: {
      propertyC: 333
    }
  },
  propertyD: [{
    propertyE: 555
  }, {
    propertyF: 666
  }, {
    propertyE: 777
  }]
})
customCore.getEvents().forEach(
  ($eventDefinition) => $eventDefinition.emit(
    new CustomEvent('customEvent', { detail: $eventDefinition })
  )
)