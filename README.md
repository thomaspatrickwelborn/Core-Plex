# ⁘ Core-Plex
**JavaScript Property Ventilation For Node Or Browser Environments**  
&emsp;⋄&emsp;Manage events for any project with plexible [implementation](#implementation), [inheritance](#implementation), [instantiation](#inheritance).  
&emsp;⋄&emsp;Target events on any event-targetable properties with path notation or direct references.  
&emsp;&emsp;&emsp;⬥&emsp;Supports [Outmatch Syntax](https://www.npmjs.com/package/outmatch#syntax)  
&emsp;⋄&emsp;Default event-target API support:  
&emsp;&emsp;&emsp;⬥&emsp;Browser [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) (including [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)),  
&emsp;&emsp;&emsp;⬥&emsp;Node [`EventTarget`](https://nodejs.org/api/events.html#class-eventtarget), [`EventEmitter`](https://nodejs.org/api/events.html#class-eventemitter).  
&emsp;⋄&emsp;Custom event target API support for anything else.    

## ❖&ensp;Impetus
&emsp;⋄&emsp;Managing event addition/removal/dispatch is necessary for *most* application development.  
&emsp;⋄&emsp;Add/Remove/Dispatch event statements are *usually* disparately located throughout codebases.  
&emsp;⋄&emsp;Event assignment/deassignment/transsignment *differentiate* based on event-targetable class prototype.  
&emsp;&emsp;&emsp;⬥&emsp;e.g. `EventTarget` versus `EventEmitter`.  

## ❖&ensp;Introduction
**Core-Plex Is An Event Management System For Frontend/backend Applications.**  
&emsp;⋄&emsp;Map Events To Scoped Event Targets With Property Paths  
&emsp;⋄&emsp;Add/Remove, Enable/Disable Pathed Events   
&emsp;⋄&emsp;Define Property Paths With Dot-Notation, Globbing, And Pattern Matching  
&emsp;⋄&emsp;Enable/Disable Events, Emit Events Dynamically  
&emsp;⋄&emsp;Implement Core-Plex On Existing Objects, Class Instances  
&emsp;⋄&emsp;Extend Core-Plex On Custom Classes  


## ❖&ensp;Installation
Install `core-plex` via npm CLI.  
```
npm install core-plex
```

## ❖&ensp;Importation
`Core` Class is an ES Module exported from `core-plex`.  
```
import { Core } from 'core-plex'
```

## ❖&ensp;Implementation
Manage events for properties on **provided `$target`**. 
### ⬦&ensp;Example A.1. - Browser HTML Event Management
[Example A.1. Code](./demonstrament/documents/examples/example-a/example-a-1/index.js)  
**`Core.implement` adds, enables `click` events...**  
```
import { Core } from 'core-plex'
Core.implement(app, {
  events: {
    'qs.app click': function appClick($event) {
      console.log($event.type, $event.target
     }
    'qs.menuButton.[0-9] click': function menuButtonClick($event) {
      console.log($event.type, $event.target)
    },
    'qs.sectionButton.[0-9] click': function sectionButtonClick($event) {
      console.log($event.type, $event.target)
    },
  },
  enableEvents: true,
})
```
**...for arbitray HTML `app` structure.**
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
    app: { get() {
      return document.querySelector('app')
    }, enumerable: true },
    menuButton: { get() {
      return document.querySelectorAll('app > nav.menu > button')
    }, enumerable: true },
    sectionButton: { get() {
      return document.querySelectorAll('app > nav.section > button')
    }, enumerable: true },
  }),
  render: function() {
    const app = this.qs.app
    this.disableEvents()
    if(app) app.removeChild()
    this.parentElement.insertAdjacentHTML('afterbegin', this.template)
    this.enableEvents()
    return this
  }
}.render()
```

### ⬦&ensp;Example A.2. - Node Chokidar Event Management
[Example A.2. Code](./demonstrament/documents/examples/example-a/example-a-2/index.js)  
**Core ministrates Chokidar watcher events.**  
```
import chokidar from 'chokidar'
import { Core } from 'core-plex'
const watchers = {
  styleWatcher: chokidar.watch(path.join(__dirname, 'some-files/index.css')),
  scriptWatcher: chokidar.watch(path.join(__dirname, 'some-files/index.js')),
  structWatcher: chokidar.watch(path.join(__dirname, 'some-files/index.html')),
}
const core = Core.implement(watchers, {
  events: {
    // Styles
    'styleWatcher add': function styleWatcherAdd($path) {
      console.log("add", $path)
    },
    'styleWatcher change': function styleWatcherChange($path) {
      console.log("change", $path)
    },
    'styleWatcher unlink': function styleWatcherUnlink($path) {
      console.log("unlink", $path)
    },
    // Scripts
    'scriptWatcher add': function scriptWatcherAdd($path) {
      console.log("add", $path)
    },
    'scriptWatcher change': function scriptWatcherChange($path) {
      console.log("change", $path)
    },
    'scriptWatcher unlink': function scriptWatcherUnlink($path) {
      console.log("unlink", $path)
    },
    // Structs
    'structWatcher add': function structWatcherAdd($path) {
      console.log("add", $path)
    },
    'structWatcher change': function structWatcherChange($path) {
      console.log("change", $path)
    },
    'structWatcher unlink': function structWatcherUnlink($path) {
      console.log("unlink", $path)
    },
  },
  enableEvents: true,
  assign: 'on', deassign: 'off', 
})
```

### ⬦&ensp;Example A.3. - Node, Browser EventTarget
[Example A.3. Browser Code](./demonstrament/documents/examples/example-a/example-a-3/browser/index.js)  
[Example A.3. Node Code](./demonstrament/documents/examples/example-a/example-a-3/node/index.js)  
**Add, enable `target` property events with `Core.implement`...**  
```
import { Core } from 'core-plex'
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
```
**...then `dispatchEvent` from `target` properties.**    
```
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
```

## ❖&ensp;Inheritance
Manage events for properties on **new extended Core instance**.  
### ⬦&ensp;Example A.4. - `CustomCore` With `CustomCore` Subproperties
[Example A.4. Code](./demonstrament/documents/examples/example-a/example-a-4/index.js)  
`CustomCore` accepts a `$properties` argument that populates instance with nested `CustomCore` instances.  
```
import { Core } from 'core-plex'
class CustomCore extends Core {
  constructor($settings, $properties = {}) {
    super($settings)
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries($properties)) {
      if($propertyValue && typeof $propertyValue === 'object') {
        const subpropertySettings = Object.assign({}, {
          defineProperties: $settings.defineProperties
        })
        Object.defineProperty(this, $propertyKey, {
          enumerable: true, writable: false,
          value: new CustomCore({}, $propertyValue),
        })
      }
      else {
        Object.defineProperty(this, $propertyKey, {
          enumerable: true, writable: false,
          value: $propertyValue,
        })
      }
    }
    if($settings.enableEvents === true) { this.enableEvents() }
  }
}
const customCore = new CustomCore({
  events: {
    'propertyA customEvent': ($event) => {
      console.log($event.type, $event.detail),
    },
    'propertyA.propertyB customEvent': ($event) => {
      console.log($event.type, $event.detail),
    },
    'propertyD.[0-9] customEvent': ($event) => {
      console.log($event.type, $event.detail),
    },
  },
  enableEvents: true,
}, {
  propertyA: {
    propertyB: {
      propertyC: 333
    }
  },
  propertyD: [{
    propertyE: 555
  }, {
    propertyF: 666
  }, {
    propertyE: 777
  }]
})
```

## ❖&ensp;Instantiation
Manage events for properties defined on **Core instance events**.
### ⬦&ensp;Example A.5. - `Core` Instance With `EventDefinition.target` Definitions
[Example A.5. Code](./demonstrament/documents/examples/example-a/example-a-5/index.js)  
```
import chokidar from 'chokidar'
import { Core } from 'core-plex'
const styleWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.css'))
const scriptWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.js'))
const structWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.html'))
const coreInstance = new Core({ assign: 'on', deassign: 'off' })
// Struct Events
coreInstance.addEvents([{
  path: "styleWatcher", type: "add", 
  target: styleWatcher, listener: ($path) => console.log("add", $path),
}, {
  path: "styleWatcher", type: "change", 
  target: styleWatcher, listener: ($path) => console.log("change", $path),
}, {
  path: "styleWatcher", type: "unlink", 
  target: styleWatcher, listener: ($path) => console.log("unlink", $path),
}, {
  path: "styleWatcher", type: "error", 
  target: styleWatcher, listener: ($err) => console.log("error", $err),
}])
// Script Events
coreInstance.addEvents([{
  path: "scriptWatcher", type: "add", 
  target: scriptWatcher, listener: ($path) => console.log("add", $path),
}, {
  path: "scriptWatcher", type: "change", 
  target: scriptWatcher, listener: ($path) => console.log("change", $path),
}, {
  path: "scriptWatcher", type: "unlink", 
  target: scriptWatcher, listener: ($path) => console.log("unlink", $path),
}, {
  path: "scriptWatcher", type: "error", 
  target: scriptWatcher, listener: ($err) => console.log("error", $err),
}])
// Struct Events
coreInstance.addEvents([{
  path: "structWatcher", type: "add", 
  target: structWatcher, listener: ($path) => console.log("add", $path),
}, {
  path: "structWatcher", type: "change", 
  target: structWatcher, listener: ($path) => console.log("change", $path),
}, {
  path: "structWatcher", type: "unlink", 
  target: structWatcher, listener: ($path) => console.log("unlink", $path),
}, {
  path: "structWatcher", type: "error", 
  target: structWatcher, listener: ($err) => console.log("error", $err),
}])
.enableEvents()
```