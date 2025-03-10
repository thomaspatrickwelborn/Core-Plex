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
Install `core-plex` via npm CLI.  
```
npm install core-plex
```

## Importation
`Core` Class is an ES Module exported from `core-plex`.  
```
import { Core } from 'core-plex'
```

## Illustration
Core-Plex is an event management system with flexible configuration options.  
### Example A.1.
#### Instantiate `core` Instance
```
const core = new Core()
```
#### Configure Events With Impanded Syntax
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

#### Ministrate Events With API
```
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

### Example A.2.
#### Configure Events With Expanded Syntax, Property Definitions
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
  }],
  propertyDefinitions: {
    enableEvents: 'alterEnableEvents',
    getEvents: 'alterGetEvents',
    addEvents: 'alterAddEvents',
    removeEvents: 'alterRemoveEvents',
    enableEvents: 'alterEnableEvents',
    disableEvents: 'alterDisableEvents',
    reenableEvents: 'alterReenableEvents',
  },
}
```
#### Configure Method Names With Property Definitions
```
const alterCore = new Core(coreSettings)
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
### Example B.1.
#### Predefined `target` with event-targetable properties  
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
#### Add, enable `target` property events with `Core.implement`  
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
#### `dispatchEvent` from `target` properties  
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

## Inheritance
### Example C.1.
```
class CustomCore extends Core {
  static events = {
    'eventTarget customEvent': eventLog
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
### Example D.1.
```
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
  }]
})
coreInstance.enableEvents()
for(const $eventTarget of [
  eventTargetA, eventTargetB, eventTargetC
]) {
  $eventTarget.dispatchEvent(
    new CustomEvent('anotherEvent', { detail: {} })
  )
}
```

