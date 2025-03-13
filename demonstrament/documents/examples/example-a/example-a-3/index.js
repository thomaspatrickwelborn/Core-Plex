console.log(
  "\n", "------------",
  "\n", "Example A.3.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
const app = Core.implement(Object.assign(new EventTarget(), {
  propertyA: new EventTarget(),
  propertyB: {
    propertyC: {
      propertyD: new EventTarget(),
    }
  },
  propertyE: [{
    propertyF: new EventTarget()
  }, {
    propertyF: new EventTarget()
  }, {
    propertyF: new EventTarget()
  }]
}), {
  events: {
    'customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyA customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyB.propertyC.propertyD customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyE.[0-9].propertyF customEvent': ($event) => console.log($event.type, $event.detail),
  },
  enableEvents: true
})
for(const $eventDefinition of app.getEvents([
  { path: ':scope' },
  { path: 'propertyA' },
  { path: 'propertyB.propertyC.propertyD' },
  { path: 'propertyE.[0-9].propertyF' },
])) {
  $eventDefinition.emit(
    new CustomEvent('customEvent', { detail: $eventDefinition })
  )
}