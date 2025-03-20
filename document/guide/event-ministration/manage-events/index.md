| [⁘ Core-Plex](../../../../README.md) | [Guide](../../index.md) | [Event Ministration](../index.md) | *Manage Events* |
| :-- | :-- | :-- | :-- |
# ⁘ Core-Plex Guide \| Manage Events
 - [`core.addEvents`](#coreaddevents-method) - Add event definitions with `path`/`target`, `type`, `listener`, and other settings. 
 - [`core.getEvents`](#coregetEvents-method) - Get added event definitions by event definition properties; 
 - [`core.enableEvents`](#coreenableEvents-method) - Enable added events (invoking `addEventListener`, `on`, `once`, etc.). 
 - [`core.disableEvents`](#coredisableEvents-method) - Disable added events (invoking `removeEventListener`, `off`, etc.).  
 - [`core.removeEvents`](#coreremoveEvents-method) - Remove added event definitions.  
 - [Custom Core API Method Names](#custom-core-api-method-names)

## `core.addEvents` Method
Event definitionss may be *added during* Core:  
 - [implementation](#during-core-implementation)
 - [inheritance](#during-core-inheritance)
 - instantiation
   - [superclass invocation](#during-core-class-inheritance-superclass-invocation)
   - [inheritance construction](#during-core-class-inheritance-construction)

Event definitions may also be *added to* [existing core instances/implementations](#after-core-instantiation). 

### During Core Implementation
Event definitions added **during core implementation** may be initially enabled through `enableEvents` property *when* the event targets are already instantiated.  
[Example B.1.](../../../../demonstrament/documents/examples/example-b/example-b-1/index.js)
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

### During Core Class Inheritance \| Superclass Invocation
Event definitions added **during core superclass invocation** may be initially enabled through `enableEvents` property *when* the event targets are already instantiated.  
[Example B.2.](../../../../demonstrament/documents/examples/example-b/example-b-2/index.js)
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

### During Core Class Inheritance \| Construction
Event definitions added **during core superclass inheritance** may be initially enabled through `enableEvents` property *when* the event targets are already instantiated.  
[Example B.3.](../../../../demonstrament/documents/examples/example-b/example-b-3/index.js)
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

### During Core Instantiation
Event definitions added **during core instantiation** may be enabled through `enableEvents` method *after* the event targets are instantiated.  
[Example B.4.](../../../../demonstrament/documents/examples/example-b/example-b-4/index.js)
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
### After Core Instantiation
Event definitions added **after core instantiation** may be enabled through `enableEvents` method *after* the event targets are instantiated.  
[Example B.5.](../../../../demonstrament/documents/examples/example-b/example-b-5/index.js)
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
## `core.getEvents` Method
[Example B.6.]()
Given some arbitrary application structure:  
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
  'application:eventA': listenerLogA,
  'propertyA.propertyB application:eventB': listenerLogB,
  'propertyD.[0-9].propertyE application:eventB': listenerLogB,
})
```

### Get All Events
```
application.getEvents()
```
### Get Filtered Events
#### Get Events By `type`
```
application.getEvents({
  type: 'application:eventA',
})
```
#### Get Events By `path` With `:scope`
```
application.getEvents({
  path: ':scope',
})
```
#### Get Events By `path` With Property Path
```
application.getEvents({
  path: 'propertyA.propertyB',
})
```
#### Get Events By Multiple Filter Object Properties
```
application.getEvents({
  type: 'application:eventB',
  listener: listenerLogB,
})
```

#### Get Events By Multiple Filter Objects
```
application.getEvents([
  { listener: listenerLogA },
  { listener: listenerLogB },
])
```

## `core.enableEvents`/`core.disableEvents` Methods
### Enable/Disable All Events
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
### Enable/Disable Some Events
Enabling/disabling some events is achieved using [filter objects](#get-filtered-events).  
```
application.enableEvents({
  path: 'propertyA.propertyB'
})
```
```
application.disableEvents({
  type: 'application:eventA'
})
```
```
application.enableEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
])
```

## `core.removeEvents` Method
### Remove All Events
```
application.removeEvents()
```
### Remove Some Events
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

## Custom Core API Method Names
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
