| [⁘ Core-Plex](../../../../README.md) | [Guide](../../index.md) | [Event Ministration](../index.md) | *Manage Events* |
| :-- | :-- | :-- | :-- |
# ⁘ Core-Plex Guide \| Manage Events
 - [`core.addEvents`](#coreaddevents-method) - add event definitions with `path`/`target`, `type`, `listener`, and other settings;  
 - [`core.getEvents`](#coregetEvents-method) - get added event definitions by event definition properties; 
 - [`core.enableEvents`](#coreenableEvents-method) - enable added events (invoking `addEventListener`, `on`, `once`, etc.);  
 - [`core.disableEvents`](#coredisableEvents-method) - disable added events (invoking `removeEventListener`, `off`, etc.), 
 - [`core.removeEvents`](#coreremoveEvents-method) - remove added event definitions.  
 - [Custom Core API Method Names](#custom-core-api-method-names)

## `core.addEvents` Method
Events may be *added during* Core:  
 - [implementation](#during-core-implementation)
 - [inheritance](#during-core-inheritance)
 - instantiation
   - [superclass invocation](#during-core-class-inheritance-superclass-invocation)
   - [inheritance construction](#during-core-class-inheritance-construction)

Events may also be *added to* [existing core instances/implementations](#after-core-instantiation). 

### During Core Implementation
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

### During Core Class Inheritance \| Superclass Invocation
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

### During Core Class Inheritance \| Construction
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

### During Core Instantiation
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
### After Core Instantiation
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
## `core.getEvents` Method
[Example B.6.]()
Given some arbitrary application structure:  
```
const application = {
  parentElement: document.querySelector('body'),
  templates: {
    application: ($content) => `
      <app>
        <header>
          <h1>${$content.headline}</h1>
          ${$content.nav.map(($nav) => `
            <nav class="${$nav.class}">
              ${$nav.button.map(($button) => `
                <button
                  data-id="${$button.id}"
                  data-active="${$button.active}"
                >${$button.text}</button>
              `).join('\n')}
            </nav>
          `).join('\n')}
        </header>
        <main>
          ${$content.section.map(($section) => `
            <section
              data-id="${$section.id}"
              data-active="${$section.active}"
            >
              <article>
                <header>
                  <h2>${$section.headline}</h2>
                  <nav>
                    ${$section.nav.button.map(($sectionNavButton) => `
                      <button data-type="${$sectionNavButton.type}">${$sectionNavButton.text}</button>
                    `).join('\n')}
                  </nav>
                </header>
                <main>
                  ${$section.text}
                </main>
              </article>
            </section>
          `).join('\n')}
        </main>
      </app>
    `,
    style: () => `
      <style>
        * { box-sizing: border-box; }
        body { width: 100%; height: 100%; }
        app {
          display: flex; flex-direction: column; 
          header {
            nav.section-nav {
              button {
                &[data-active="true"] {
                  border: 2px solid black; 
                }
                &[data-active="false"] {
                  border: none; 
                }
              }
            }
          }
          main {
            display: flex; flex-direction: column; 
            section {
              &[data-active="false"] { display: none; }
            }
          }
        }
      </style>
    `
  },
  qs: Object.defineProperties({}, {
    app: { enumerable: true, get() { return document.querySelector('app') }, enumerable: true },
    sectionNavButton: { enumerable: true, get() { return document.querySelectorAll('app > header > nav.section-nav > button') } },
    section: { enumerable: true, get() { return document.querySelectorAll('app > main > section') } },
    style: { enumerable: true, get() { return document.querySelector('style') }, enumerable: true },
    sectionButton: { enumerable: true, get() { return document.querySelectorAll('section > article button') } },
  }),
  render: function($content) {
    const app = this.qs.app
    const style = this.qs.style
    if(app) app.removeChild()
    if(style) style.removeChild()
    const reenableEvents = this.getEvents({ enable: true })
    reenableEvents.forEach(($reenableEvent) => $reenableEvent.enable = false)
    this.parentElement.insertAdjacentHTML('afterbegin', [
      this.templates.application($content),
      this.templates.style(),
    ].join('\n'))
    reenableEvents.forEach(($reenableEvent) => $reenableEvent.enable = true)
    this.dispatchEvent(new CustomEvent('render', { detail: this }))
    return this
  },
}
Core.implement(application, {
  events: {
    'render': function($event) {
      console.log($event.type, $event.detail)
    },
    'qs.sectionButton.[0-9] click': function($event) {
      console.log($event.type, $event.currentTarget.getAttribute('data-type'))
    },
    'qs.sectionNavButton.[0-9] click': function($event) {
      const selectSectionNavButton = $event.currentTarget
      const selectSectionID = selectSectionNavButton.getAttribute('data-id')
      const collectSectionNavButton = this.qs.sectionNavButton
      for(const $sectionNavButton of collectSectionNavButton) {
        if($sectionNavButton === selectSectionNavButton) {
          $sectionNavButton.setAttribute('data-active', 'true')
        }
        else {
          $sectionNavButton.setAttribute('data-active', 'false')
        }
      }
      for(const $section of this.qs.section) {
        const sectionID = $section.getAttribute('data-id')
        if(sectionID === selectSectionID) {
          $section.setAttribute('data-active', true)
        }
        else {
          $section.setAttribute('data-active', false)
        }
      }
    }
  }
})
.render({
  headline: 'Example B.6.',
  nav: [{
    class: 'section-nav',
    button: [
      { id: 'section-a', text: 'Section A', active: true },
      { id: 'section-b', text: 'Section B', active: false },
      { id: 'section-c', text: 'Section C', active: false },
      { id: 'section-d', text: 'Section D', active: false },
      { id: 'section-e', text: 'Section E', active: false }
    ],
  }],
  section: [{
    id: 'section-a',  headline: 'Section A', active: true, 
    nav: { button: [{ type: 'type-a', text: 'Section A Button' }] },
    text: 'Section A'
  }, {
    id: 'section-b',  headline: 'Section B', active: false, 
    nav: { button: [{ type: 'type-b', text: 'Section B Button' }] },
    text: 'Section B'
  }, {
    id: 'section-c',  headline: 'Section C', active: false, 
    nav: { button: [{ type: 'type-c', text: 'Section C Button' }] },
    text: 'Section C'
  }, {
    id: 'section-d',  headline: 'Section D', active: false, 
    nav: { button: [{ type: 'type-d', text: 'Section D Button' }] },
    text: 'Section D'
  }, {
    id: 'section-e',  headline: 'Section E', active: false, 
    nav: { button: [{ type: 'type-e', text: 'Section E Button' }] },
    text: 'Section E'
  }], 
})
.enableEvents()
```

### Get All Events
```
application.getEvents()
```
### Get Filtered Events
#### Get Events By `type`
```
application.getEvents({
  type: 'application:event',
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
  type: 'application:event',
  listener: eventLogA,
})
```

#### Get Events By Multiple Filter Objects
```
application.getEvents([
  { listener: eventLogA },
  { listener: eventLogB },
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
  type: 'application:event'
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
