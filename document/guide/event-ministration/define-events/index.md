| [⁘ Core-Plex](../../../../README.md) | [Guide](../../index.md) | [Event Ministration](../index.md) | *Define Events* |
| :-- | :-- | :-- | :-- |
# ⁘ Core-Plex Guide \| Define Events
 - [Impanded `EventDefinition` Syntax](#impanded-eventdefinition-syntax)
 - [Expanded `EventDefinition` Syntax](#expanded-eventdefinition-syntax)
 - [`EventDefinition` Defaults](#event-definition-defaults)
   - [Automatic `EventTarget` Signment](#automatic-eventtarget-signment)
   - [Optional `EventEmitter` Signment](#optional-eventemitter-signment)
   - [Custom Event Target Signment](#custom-event-target-signment)
## Impanded `EventDefinition` Syntax
Configure Events With Impanded Syntax
### Impanded `EventDefinition` Schema
#### Implied Path Is `:scope`
```
{
  events: {
    [`${$eventDefinition.type}`]: $eventDefinition.listener }
  }
}
```
#### Explicit Path
```
{
  events: {
    [`${$eventDefinition.path} ${$eventDefinition.type}`]: $eventDefinition.listener }
  }
}
```

```
const coreSettings = {
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}
```
## Expanded `EventDefinition` Syntax
### Expanded `EventDefinition` Schema
```
{
  events: [{
    type: $eventDefinition.type,
    listener: $eventDefinition.listener,
  }]
}
```
Configure Events With Expanded Syntax
```
const coreSettings = {
  events: [{
    path: ":scope", type: "someEvent", listener: eventLog,
    assign: "on", deassign: "off",
  }, {
    path: "some.property.path", type: "someEvent", listener: eventLog,
    assign: "addEventListener", deassign: "off",
  }, {
    path: "some.array.[0-9]", type: "someEvent", listener: eventLog,
    assign: "addEventListener", deassign: "off",
  }]
}
```

## `EventDefinition` Defaults
### Automatic `EventTarget` Signment
Default [`Core` `Settings`](../../api/core/settings/index.md) and [EventDefinition Settings](../../api/core/event-definition/settings/index.md) automatically sign event listeners for `EventTarget` instances.   

#### **All event targets use `addEventListener`, `removeEventListener`**.  
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

### Optional `EventEmitter` Signment
Optional [`EventDefinition` `Settings`](../../api/core/event-definition/settings/index.md) support `EventEmitter` instance signment.  

#### **All event targets** use `on`, `off`, `emit` signment methods.  
```
const application = Object.assign(Core.implement(new EventEmitter(), {
  assign: 'on', deassign: 'off', 
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
#### **Some event targets** use `on`, `off`, `emit`, **remainder event targets** use `addEventListener`, `removeEventListener`.  
```
const application = Object.assign(Core.implement(new EventEmitter(), { // Event Emitter
  events: [{
    path: ':scope', type: 'application:event', listener: eventLogA, // Event Emitter
  }, {
    path: 'propertyA', type: 'application:event', listener: eventLogB,
    assign: 'addEventListener', deassign: 'removeEventListener', // Event Target
  }, {
    path: 'propertyB.[0-9]', type: 'application:event', listener: eventLogB, // Event Emitter
  }],
  assign: 'on', deassign: 'off',
}), {
  propertyA: new EventTarget(), // Event Target
  propertyB: [new EventEmitter()] // Event Emitter
})
```

### Custom Event Target Signment
```
class Application extends Core {
  constructor($settings) {
    super(Object.assign({
      assign: 'addListener', deassign: 'removeListener', 
      methods: {
        assign: {
          addListener: function addListener($eventDefinition, $target) {
            const { type, listener, settings } = $eventDefinition
            const { bubble } = settings
            return $target['addListener'](type, listener, bubble)
          },
        },
        deassign: {
          removeListener: function removeListener($eventDefinition, $target) {
            return $target['removeListener'](type)
          },
        },
      }
    }), $settings)
  }
}

```