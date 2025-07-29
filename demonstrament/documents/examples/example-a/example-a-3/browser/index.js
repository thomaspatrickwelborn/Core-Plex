console.log(
  "\n", "----------------------",
  "\n", "Example A.3. (Browser)",
  "\n", "----------------------",
)
import Core from '/dependencies/core-plex.js'
const completedEventsSetA = []
const completedEventsSetB = []
const completedEventsSetC = []
const completedEventsSetD = []
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
    'customEvent': ($event) => {
      console.log($event.type, $event.detail)
      completedEventsSetA.push($event)
    },
    'propertyA customEvent': ($event) => {
      console.log($event.type, $event.detail)
      completedEventsSetB.push($event)
    },
    'propertyB.propertyC.propertyD customEvent': ($event) => {
      console.log($event.type, $event.detail)
      completedEventsSetC.push($event)
    },
    'propertyE.[0-9].propertyF customEvent': ($event) => {
      console.log($event.type, $event.detail)
      completedEventsSetD.push($event)
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

console.log("completedEventsSetA", completedEventsSetA.length, completedEventsSetA)
console.log("completedEventsSetB", completedEventsSetB.length, completedEventsSetB)
console.log("completedEventsSetC", completedEventsSetC.length, completedEventsSetC)
console.log("completedEventsSetD", completedEventsSetD.length, completedEventsSetD)
console.log("pass", (
  completedEventsSetA.length === 1 &&
  completedEventsSetB.length === 1 &&
  completedEventsSetC.length === 1 &&
  completedEventsSetD.length === 3
))