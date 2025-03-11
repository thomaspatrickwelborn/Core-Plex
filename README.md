# ❖ Core-Plex
**JavaScript Property Ventilation For Node Or Browser Environments**  

 ⋄ Manage events for any project with plexible [inheritance](#-inheritance), [instantiation](#-instantiation), [implementation](#-implementation) techniques.  
 ⋄ Target events on any properties with path notation or direct references.  

## ⁘ Impetus
 ⋄ Managing event addition/removal is necessary for most application development.  
 ⋄ Add/Remove event statements are usually disparately located throughout codebases.  
 ⋄ Event assignment/deassignment differentiate based on event-targetable class prototype.  

## ⁘ Introduction
 - Map Events To Scoped Event Targets With Property Paths
 - Add/Remove, Enable/Disable Pathed Events 
 - Define Property Paths With Dot-Notation, Globbing, And Pattern Matching
   - Supports [Outmatch Syntax](https://www.npmjs.com/package/outmatch#syntax)
 - Enable/Disable Events Dynamically
 - Implement Core-Plex On Existing Objects, Class Instances
 - Extend Core-Plex On Custom Classes


## ⁘ Installation
Install `core-plex` via npm CLI.  
```
npm install core-plex
```

## ⁘ Importation
`Core` Class is an ES Module exported from `core-plex`.  
```
import { Core } from 'core-plex'
```

## ⁘ Illustrations
Core-Plex is an event management system with plexible configuration options. Manage events for any event-targetable properties such as HTML Elements, Chokidar Watchers, WebSocket Instances, Mongoose Connections, etc. 

### Browser HTML Example
**Core adds, enables `app` events**  
```
Core.implement(app, {
  events: {
    'qs.app click': function appClick($event) { console.log($event.type, $event.target) }
    'qs.menuButton.[0-9] click': function menuButtonClick($event) { console.log($event.type, $event.target) },
    'qs.sectionButton.[0-9] click': function sectionButtonClick($event) {
      console.log($event.type, $event.target)
    },
  },
  enableEvents: true,
})
```
**for some arbitray `app` structure**
```
const app = {
  parentElement: document.querySelector('body'),
  template: `
    <app>
      <nav class="menu">
        <button data-id="menu-a">Menu A</button>
        <button data-id="menu-b">Menu B</button>
        <button data-id="menu-c">Menu C</button>
      </nav>
      <nav class="section">
        <button data-id="section-a">Section A</button>
        <button data-id="section-b">Section B</button>
        <button data-id="section-c">Section C</button>
      </nav>
    </app>
  `,
  qs: Object.defineProperties({}, {
    app: { get() { return document.querySelector('app') } },
    menuButton: { get() { return document.querySelectorAll('app > nav.menu > button') } },
    sectionButton: { get() { return document.querySelectorAll('app > nav.section > button') } },
  }),
  render: function() {
    const app = this.qs.app
    if(app) app.removeChild()
    this.parentElement.insertAdjacentHTML('afterbegin', this.template)
    return this
  }
}.render()
```

### Node Chokidar Example
**Core ministrates some Chokidar watcher events**  
```
import chokidar from 'chokidar'
const watchers = {
  styleWatcher: chokidar.watch('**/.css')
  scriptWatcher: chokidar.watch('**/.js')
  structWatcher: chokidar.watch('**/.ejs')
}
const core = Core.implement(watchers, {
  events: {
    'styleWatcher change': function styleWatcherChange($path) { console.log($path) },
    'scriptWatcher change': function scriptWatcherChange($path) { console.log($path) },
    'structWatcher change': function structWatcherChange($path) { console.log($path) },
    '*Watcher error': function styleWatcherError($path) { console.log($path) },
  },
  enableEvents: true,
  assign: 'on', deassign: 'off', 
})
```

## ⁘ Implementation
### ⬦ Predefined `target` with event-targetable properties  
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
### ⬦ Add, enable `target` property events with `Core.implement`  
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
### ⬦ `dispatchEvent` from `target` properties  
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

## ⁘ Inheritance
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

## ⁘ Instantiation
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