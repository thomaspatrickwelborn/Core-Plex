# Core-Plex
**Property Ventilation**  
## Impetus
 - Managing event addition/removal is necessary for most application development. 
 - Add/Remove event statements are usually disparately located throughout codebases. 
 - Event assignment/deassignment differentiate based on event-targetable class prototype. 

## Introduction
 - Map Events To Event Targets With Property Paths
 - Add/Remove, Enable/Disable Pathed Events 
 - Define Property Paths With Dot-Notation, Globbing, And Pattern Matching (Supports [Outmatch Syntax](https://www.npmjs.com/package/outmatch#syntax). 
 - Enable/Disable Events Dynamically
 - Extend Core-Plex Class *OR* Implement Core-Plex On Existing Object

## Installation
```
npm install core-plex
```

## Importation
```
import { Core } from 'core-plex'
```

## Implementation
### Example A
#### `target` has several event-targetable properties
```
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
```
### Add, enable `target` property events with `Core.implement`
```
function eventLog($event) { console.log($event.type, $event.detail) }
Core.implement(target, {
  events: {
    'propertyA customEvent': eventLog,
    'propertyB.propertyC.propertyD customEvent': eventLog,
    'propertyE.[0-9].propertyF customEvent': eventLog,
  },
  enableEvents: true
})
```
### Dispatch events from `target` properties
```
for(const $eventTarget of [
  target.propertyA,
  target.propertyB.propertyC.propertyD,
  target.propertyE[0].propertyF, 
  target.propertyE[1].propertyF, 
  target.propertyE[2].propertyF,
]) {
  console.log()
  $eventTarget.dispatchEvent(
    new CustomEvent('customEvent', { detail: $eventTarget })
  )
}
```
### Example A Event Log
```
customEvent EventTarget {}
customEvent EventTarget {}
customEvent EventTarget {}
customEvent EventTarget {}
customEvent EventTarget {}
```

## Inheritance
```
class CustomCore extends Core {
  static events = {
    'eventTarget customEvent': function eventTargetCustomEvent($event) {
      console.log($event.type, $event.detail)
    }
  }
  eventTarget = new EventTarget()
  constructor() {
    super({
      events: CustomCore.events
    })
  }
}
const customCore = new CustomCore()
customCore.enableEvents()
customCore.eventTarget.dispatchEvent(
  new CustomEvent('customEvent', { detail: true })
)
```

## Instantiation
```
const coreInstance = new Core({
  events: {
    'eventTarget customEvent': function eventTargetCustomEvent($event) {
      console.log($event.type, $event.detail)
    }
  }
})
coreInstance.eventTarget = new EventTarget()
coreInstance.enableEvents()
coreInstance.eventTarget.dispatchEvent(
  new CustomEvent('customEvent', { detail: true })
)
```

