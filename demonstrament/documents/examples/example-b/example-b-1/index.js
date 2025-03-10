import { Core } from '/dependencies/core-plex.js'
function eventLog($event) { console.log($event.type, $event.detail) }
const target = {
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
}
Core.implement(target, {
  events: {
    'propertyA customEvent': eventLog,
    'propertyB.propertyC.propertyD customEvent': eventLog,
    'propertyE.[0-9].propertyF customEvent': eventLog,
  },
  enableEvents: true
})
for(const $eventTarget of [
  target.propertyA,
  target.propertyB.propertyC.propertyD,
  target.propertyE[0].propertyF, 
  target.propertyE[1].propertyF, 
  target.propertyE[2].propertyF,
]) {
  $eventTarget.dispatchEvent(
    new CustomEvent('customEvent', { detail: $eventTarget })
  )
}
console.log(target)