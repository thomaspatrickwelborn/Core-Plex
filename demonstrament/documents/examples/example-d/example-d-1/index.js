console.log(
  "\n", "------------",
  "\n", "Example D.1.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
function eventLog($event) { console.log($event.type, $event.detail) }
const eventTargetA = new EventTarget()
const eventTargetB = new EventTarget()
const eventTargetC = new EventTarget()
const coreInstance = new Core({
  events: [{
    path: "eventTargetA", type: "anotherEvent", 
    target: eventTargetA, listener: eventLog,
  }, {
    path: "eventTargetB", type: "anotherEvent", 
    target: eventTargetB, listener: eventLog,
  }, {
    path: "eventTargetC", type: "anotherEvent", 
    target: eventTargetC, listener: eventLog,
  }],
  enableEvents: true,
})
for(const $eventTarget of [
  eventTargetA, eventTargetB, eventTargetC
]) {
  console.log($eventTarget)
  $eventTarget.dispatchEvent(
    new CustomEvent('anotherEvent', { detail: {} })
  )
}
console.log(coreInstance.getEvents())
