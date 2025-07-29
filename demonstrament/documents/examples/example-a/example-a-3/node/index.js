console.log(
  "\n", "-------------------",
  "\n", "Example A.3. (Node)",
  "\n", "-------------------",
)
import Core from '../../../../../../distributement/core-plex.js'
const completed = {
  ':scope': [],
  'customEvent': [],
  'propertyA customEvent': [],
  'propertyB.propertyC.propertyD customEvent': [],
  'propertyE.[0-9].propertyF customEvent': [],
}
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
    ':scope customEvent': ($event) => {
      console.log(':scope', $event.type, $event.detail)
      completed[':scope'].push($event)
    },
    'customEvent': ($event) => {
      console.log('customEvent', $event.type, $event.detail)
      completed['customEvent'].push($event)
    },
    'propertyA customEvent': ($event) => {
      console.log('propertyA customEvent', $event.type, $event.detail)
      completed['propertyA customEvent'].push($event)
    },
    'propertyB.propertyC.propertyD customEvent': ($event) => {
      console.log('propertyB.propertyC.propertyD customEvent', $event.type, $event.detail)
      completed['propertyB.propertyC.propertyD customEvent'].push($event)
    },
    'propertyE.[0-9].propertyF customEvent': ($event) => {
      console.log('propertyE.[0-9].propertyF customEvent', $event.type, $event.detail)
      completed['propertyE.[0-9].propertyF customEvent'].push($event)
    },
  },
  enableEvents: true
})
for(const $eventDefinition of app.getEvents([
  { path: ':scope' },
  { path: 'propertyA' },
  { path: 'propertyB.propertyC.propertyD' },
  { path: 'propertyB.propertyC.propertyE' },
  { path: 'propertyE.[0-9].propertyF' },
])) {
  $eventDefinition.emit(
    new CustomEvent('customEvent', { detail: $eventDefinition })
  )
}
const { promise, resolve } = Promise.withResolvers()
setTimeout(resolve, 1000)
console.log(app)
console.log(app.getEvents())
await promise
console.log(completed)
console.log("pass", (
  completed[':scope'].length === 2 &&
  completed['customEvent'].length === 2 &&
  completed['propertyA customEvent'].length === 1 &&
  completed['propertyB.propertyC.propertyD customEvent'].length === 1 &&
  completed['propertyE.[0-9].propertyF customEvent'].length === 3
))