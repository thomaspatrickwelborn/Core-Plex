\# Core-Plex
**Class-Based Property Ventilation**  

## Impetus
Property ventilation configurable through objects.  

*Property Ventilation*  
 - Managing event addition/removal is necessary for most application development. 
 - Add/Remove event statements are usually disparately located throughout codebases. 
 - Event assignment, deassignment differentiate based on event-targetable class prototype. 

## Introduction
*Property Ventilation*  
 - Map Events To Event Targets With Property Paths (Supports **Path Globbing**)
 - Enable/Disable Events Dynamically

## Installation
```
npm install core-plex
```


## Importation
```
import { Core } from 'core-plex'
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

## Implementation
```
const targetObject = {
  eventTarget: new EventTarget()
}
Core.implement(targetObject, {
  events: {
    'eventTarget customEvent': function eventTargetCustomEvent($event) {
      console.log($event.type, $event.detail)
    }
  }
})
targetObject.enableEvents()
targetObject.eventTarget.dispatchEvent(
  new CustomEvent('customEvent', { detail: true })
)
```