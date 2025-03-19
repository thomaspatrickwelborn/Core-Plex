| [⁘ Core-Plex](../../../README.md) | [Guide](../index.md) | *Event Ministration* |
| :-- | :-- | :-- |
# ⁘ Core-Plex Guide \| Event Ministration
| []() |
| :-- |
**Contents**  
[Manage events](#manage-events) through core instance API:  
 - [`core.addEvents`](#coreaddevents-method) - add event definitions with `path`/`target`, `type`, `listener`, and other settings;  
 - [`core.getEvents`](#coregetEvents-method) - get added event definitions by event definition properties; 
 - [`core.enableEvents`](#coreenableEvents-method) - enable added events (invoking `addEventListener`, `on`, `once`, etc.);  
 - [`core.disableEvents`](#coredisableEvents-method) - disable added events (invoking `removeEventListener`, `off`, etc.), 
 - [`core.removeEvents`](#coreremoveEvents-method) - remove added event definitions.  
 - [Custom Core API Method Names](#custom-core-api-method-names)

 [Define events](#define-events) for `EventTarget`, `EventEmitter`, and custom event-targetable instances.  
 - [Event Definition Defaults](#event-definition-defaults)
 - [Impanded EventDefinition Syntax](#impanded-eventDefinition-syntax)
 - [Expanded EventDefinition Syntax](#expanded-eventDefinition-syntax)
 - [Overwrite Event Definition Signment](#overwrite-event-definition-signment)
 - [Custom Event Definition Signment](#custom-event-definition-signment)
## Manage Events
### `core.addEvents` Method
Events may be *added during* Core:  
 - [implementation](#during-core-implementation)
 - [inheritance](#during-core-inheritance)
 - instantiation
   - [superclass invocation](#during-core-class-inheritance-superclass-invocation)
   - [inheritance construction](#during-core-class-inheritance-construction)

Events may also be *added to* [existing core instances/implementations](#after-core-instantiation). 

#### During Core Implementation
Events added **during core implementation** may be initially enabled through `enableEvents` property *when* the event targets are already instantiated.  
[Example B.1.]()
```
function listenerLogA() { console.log("listenerLogA", $event.type, $event.detail) }
function listenerLogB() { console.log("listenerLogB", $event.type, $event.detail) }
```
```
const application = Core.implement(Object.defineProperties(new EventTarget(), {
  propertyA: { value: Object.defineProperties(new EventTarget(), {
    propertyB: { value: Object.defineProperties(new EventTarget(), {
      propertyC: 3
    }) }
  }) },
  propertyD: { value: [
    Object.defineProperties(new EventTarget(), {
      propertyE: { value: Object.defineProperties(new EventTarget(), {
        propertyF: { value: 6 }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { value: Object.defineProperties(new EventTarget(), {
        propertyF: { value: "6" }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { value: Object.defineProperties(new EventTarget(), {
        propertyF: { value: null }
      } ) }
    }),
  ] },
  propertyG: { value: 7 },
}), {
  enableEvents: true,
  events: {
    'application:event': listenerLogA,
    'propertyA.propertyB application:event': listenerLogB,
    'propertyD.[0-9].propertyE application:event': listenerLogB,
  },
})
```

#### During Core Class Inheritance \| Superclass Invocation
Events added **during core superclass invocation** may be initially enabled through `enableEvents` property *when* the event targets are already instantiated.  
[Example B.2.]()
```
class Application extends Core {
  constructor($settings, $properties) {
    super(Object.assign({}, $settings, {
      events: {
        'application:event': listenerLogA,
        'propertyA.propertyB application:event': listenerLogB,
        'propertyD.[0-9].propertyE application:event': listenerLogB,
      },
    }))
    Object.assign(this, $properties)
  }
}
const application = new Application({
  enableEvents: true, 
}, {
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 3
    })
  }),
  propertyD: [
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: 6
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: "6"
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: null
      })
    })
  ],
  propertyG: 7,
})
```

#### During Core Class Inheritance \| Construction
Events added **during core superclass inheritance** may be initially enabled through `enableEvents` property *when* the event targets are already instantiated.  
[Example B.3.]()
```
class Application extends Core {
  constructor($settings, $properties) {
    super($settings)
    Object.assign(this, $properties)
    this.addEvents({
      'application:event': listenerLogA,
      'propertyA.propertyB application:event': listenerLogB,
      'propertyD.[0-9].propertyE application:event': listenerLogB,
    })
    if(this.settings.enableEvents) { this.enableEvents() }
  }
}
const application = new Application({ enableEvents: true }, {
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 3
    })
  }),
  propertyD: [
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: 6
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: "6"
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: null
      })
    })
  ],
  propertyG: 7,
})
```

#### During Core Instantiation
Events added **during core instantiation** may be enabled through `enableEvents` method *after* the event targets are instantiated.  
[Example B.4.]()
```
const application = Object.assign(new Core({
  events: {
    'application:event': listenerLogA,
    'propertyA.propertyB application:event': listenerLogB,
    'propertyD.[0-9].propertyE application:event': listenerLogB,
  },
}), Object.assign({
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 3
    })
  }),
  propertyD: [
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: 6
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: "6"
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: null
      })
    })
  ],
  propertyG: 7,
}))
.enableEvents()
```
#### After Core Instantiation
Events added **after core instantiation** may be enabled through `enableEvents` method *after* the event targets are instantiated.  
[Example B.5.]()
```
const application = Object.assign(new Core(), {
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 3
    })
  }),
  propertyD: [
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: 6
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: "6"
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: null
      })
    })
  ],
  propertyG: 7,
})
.addEvents({
  'application:event': listenerLogA,
  'propertyA.propertyB application:event': listenerLogB,
  'propertyD.[0-9].propertyE application:event': listenerLogB,
})
.enableEvents()
```
### `core.getEvents` Method
[Example B.6.]()
Given some arbitrary application structure:  
```
const application = {
  parentElement: document.querySelector('body'),
  templates: {
    application: ($content) => `
      <app>
        <header>
          ${$content.nav.map(($nav) => `
            <nav class="${$nav.class}">
              ${$nav.button.map(($button) => `
                <button data-id="${$button.id}">${$button.text}</button>
              `)}
            </nav>

          `)}
        </header>
        <main>
          ${$content.sections.map(($section) => `
            <section data-id="$section.id">${$section.text}</section>
          `)}
        </main>
      </app>
    `,
    style: `
      <style>
        * { box-sizing: border-box; display: flex; }
        body { width: 100%; height: 100%; }
        app {
          display: flex; flex-direction: row; 
        }
      </style>
    `
  },
  qs: Object.defineProperties({}, {
    app: { get() { return document.querySelector('app') }, enumerable: true },
    style: { get() { return document.querySelector('style') }, enumerable: true },
  }),
  render: function($content) {
    const app = this.qs.app
    const style = this.qs.style
    if(app) app.removeChild()
    if(style) style.removeChild()
    this.disableEvents()
    this.parentElement.insertAdjacentHTML('afterbegin', this.templates.application($content))
    this.parentElement.insertAdjacentHTML('afterbegin', this.templates.style())
    this.enableEvents()
    return this
  },
}
Core.implement(application, {
  events: {},
})
.render({
  nav: [{
    class: 'section-nav',
    button: [{
      id: 'button-a',
      text: 'Section A',
    }, {
      id: 'button-b',
      text: 'Section B',
    }, {
      id: 'button-c',
      text: 'Section C',
    }, {
      id: 'button-d',
      text: 'Section D',
    }, {
      id: 'button-d',
      text: 'Section D',
    }],
  }],
  section: [
    { text: 'Section A' },
    { text: 'Section B' },
    { text: 'Section C' },
    { text: 'Section D' },
    { text: 'Section E' }
  ], 
})
```

#### Get All Events
[Example B.5.]()
```
application.getEvents()
```
#### Get Filtered Events
##### Get Events By `type`
```
application.getEvents({
  type: 'application:event',
})
```
##### Get Events By `path` With `:scope`
```
application.getEvents({
  path: ':scope',
})
```
##### Get Events By `path` With Property Path
```
application.getEvents({
  path: 'propertyA.propertyB',
})
```
##### Get Events By Multiple Filter Object Properties
```
application.getEvents({
  type: 'application:event',
  listener: eventLogA,
})
```

##### Get Events By Multiple Filter Objects
```
application.getEvents([
  { listener: eventLogA },
  { listener: eventLogB },
])
```

### `core.enableEvents`/`core.disableEvents` Methods
#### Enable/Disable All Events
```
application.enableEvents()
application.disableEvents()
```
*or*  
```
application
.enableEvents()
.disableEvents()
```
#### Enable/Disable Some Events
Enabling/disabling some events is achieved using [filter objects](#get-filtered-events).  
```
application.enableEvents({
  path: 'propertyA.propertyB'
})
```
```
application.disableEvents({
  type: 'application:event'
})
```
```
application.enableEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
])
```

### `core.removeEvents` Method
#### Remove All Events
```
application.removeEvents()
```
#### Remove Some Events
Removing some events is achieved using [filter objects](#get-filtered-events).  
```
application.removeEvents({
  path: 'propertyA.propertyB'
})
```
```
application.removeEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
])
```

### Custom Core API Method Names
Define custom core API method names for compatibility with your existing application.  
```
const application = new Core({
  propertyDefinitions: {
    addEvents: 'alterAddEvents',
    getEvents: 'alterGetEvents',
    enableEvents: 'alterEnableEvents',
    disableEvents: 'alterDisableEvents',
    removeEvents: 'alterRemoveEvents',
    reenableEvents: 'alterReenableEvents',
  },
})
application.alterAddEvents(...)
application.alterGetEvents(...)
application.alterEnableEvents(...)
application.alterDisableEvents(...)
application.alterRemoveEvents(...)
application.alterReenableEvents(...)
```

## Define Events
### Event Definition Defaults
#### Automatic `EventTarget` Signment
Default [`Core` `Settings`](../../api/core/settings/index.md) and [EventDefinition Settings](../../api/core/event-definition/settings/index.md) automatically sign event listeners for `EventTarget` instances.   

**All event targets use `addEventListener`, `removeEventListener`, `dispatchEvent` methods**.  
```
const application = Object.assign(new Core(), {
  propertyA: new EventTarget(),
  propertyB: [new EventTarget()]
})
application.addEvents({
  'application:event': eventLogA,
  'propertyA application:event': eventLogB,
  'propertyB.[0-9] application:event': eventLogB,
})
.enableEvents()
```

#### Optional `EventEmitter` Signment
Default [`EventDefinition` `Settings`](../../api/core/event-definition/settings/index.md) support `EventEmitter` instance signment.  

**All event targets use `on`, `off`, `emit`** signment methods.  
```
const application = Object.assign(Core.implement(new EventEmitter(), {
  assign: 'on', deassign: 'off', transsign: 'emit'
}), {
  propertyA: new EventEmitter(),
  propertyB: [new EventEmitter()]
})
application.addEvents({
  'application:event': eventLogA,
  'propertyA application:event': eventLogB,
  'propertyB.[0-9] application:event': eventLogB,
})
.enableEvents()
```
### Overwrite Event Definition Signment
```
const application = Object.assign(Core.implement(new EventEmitter(), { // Event Emitter
  events: [{
    path: ':scope', type: 'application:event', listener: eventLogA, // Event Emitter
  }, {
    path: 'propertyA', type: 'application:event', listener: eventLogB,
    assign: 'addEventListener', deassign: 'removeEventListener', transsign: 'dispatchEvent', // Event Target
  }, {
    path: 'propertyB.[0-9]', type: 'application:event', listener: eventLogB, // Event Emitter
  }],
  assign: 'on', deassign: 'off', transsign: 'emit',
}), {
  propertyA: new EventTarget(), // Event Target
  propertyB: [new EventEmitter()] // Event Emitter
})
```
### Custom Event Definition Signment
```
const application = Object.assign(new Core.implement(new CustomEventTarget(), {
  
}), {
  propertyA: new CustomEventTarget(),
  propertyB: [new CustomEventTaret()],
})
```
### Impanded EventDefinition Syntax
### Expanded EventDefinition Syntax