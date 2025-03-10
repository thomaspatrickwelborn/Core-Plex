> [!WARNING]  
> Early Stage Development  

> [!CAUTION]  
> Use At Own Risk  

> [!NOTE]  
> Interested in Core-Plex? 
> thomas.patrick.welborn@outlook.com

# Core-Plex
**JavaScript Property Ventilation For Node Or Browser Environments**  
Manage events for any project with plexible inheritance, instantiation, and implementation techniques, Target events for any property with scoped path notation and direct references.  

## Impetus
 - Managing event addition/removal is necessary for most application development. 
 - Add/Remove event statements are usually disparately located throughout codebases. 
 - Event assignment/deassignment differentiate based on event-targetable class prototype. 

## Introduction
 - Map Events To Scoped Event Targets With Property Paths
 - Add/Remove, Enable/Disable Pathed Events 
 - Define Property Paths With Dot-Notation, Globbing, And Pattern Matching
   - Supports [Outmatch Syntax](https://www.npmjs.com/package/outmatch#syntax)
 - Enable/Disable Events Dynamically
 - Implement Core-Plex On Existing Objects
 - Extend Core-Plex On Custom Classes


## Installation
```
npm install core-plex
```

## Importation
```
import { Core } from 'core-plex'
```

## Illustration
### Configure Events With Impanded Syntax
```
function eventLog($event) { console.log($event.type, $event.detail) }
const coreSettings = {
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}
```
### Configure Events With Expanded Syntax
```
const coreSettings = {
  events: [{
    path: ":scope", type: "someEvent", listener: eventLog,
    assign: "on", deassign: "off",
  }, {
    path: "some.property.path", type: "someEvent", listener: eventLog,
    assign: "addEventListener", deassign: "removeEventListener",
  }, {
    path: "some.array.[0-9]", type: "someEvent", listener: eventLog,
    assign: "addEventListener", deassign: "removeEventListener",
  }]
}
```

### Ministrate Events With API
```
const core = new Core()
// Add Events
core.addEvents(coreSettings.events)
// Get Events
core.getEvents({ type: 'someEvent' })
// Remove Events
core.removeEvents({ path: ':scope' })
// Enable Events
core.enableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
// Disable Events
core.disableEvents({ listener: eventLog })
// Reenable Events
core.reenableEvents()
```

### Configure Method Names With Property Definitions
```
const alterCore = new Core(recursiveAssign({
  propertyDefinitions: {
    enableEvents: 'alterEnableEvents',
    getEvents: 'alterGetEvents',
    addEvents: 'alterAddEvents',
    removeEvents: 'alterRemoveEvents',
    enableEvents: 'alterEnableEvents',
    disableEvents: 'alterDisableEvents',
    reenableEvents: 'alterReenableEvents',
  }
}, $eventSettings))
// Add Events
alterCore.alterAddEvents(coreSettings.events)
// Get Events
alterCore.alterGetEvents({ type: 'someEvent' })
// Remove Events
alterCore.alterRemoveEvents({ path: ':scope' })
// Enable Events
alterCore.alterEnableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
// Disable Events
alterCore.alterDisableEvents({ listener: eventLog })
// Reenable Events
alterCore.alterReenableEvents()
```

## Implementation
### Define `target` with event-targetable properties  
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
Core.implement(target, {
  events: {
    'propertyA customEvent': eventLog,
    'propertyB.propertyC.propertyD customEvent': eventLog,
    'propertyE.[0-9].propertyF customEvent': eventLog,
  },
  enableEvents: true
})
```
### `dispatchEvent` from `target` properties  
```
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
```
### `target` property event capture log
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

