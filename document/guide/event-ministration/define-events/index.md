| [⁘ Core-Plex](../../../../README.md) | [Guide](../../index.md) | [Event Ministration](../index.md) | *Define Events* |
| :-- | :-- | :-- | :-- |
# ⁘ Core-Plex Guide \| Define Events
 - [`EventDefinition` Defaults](#event-definition-defaults)
 - [Impanded EventDefinition Syntax](#impanded-eventDefinition-syntax)
 - [Expanded EventDefinition Syntax](#expanded-eventDefinition-syntax)
 - [Overwrite `EventDefinition` Signment](#overwrite-event-definition-signment)
 - [Custom `EventDefinition` Signment](#custom-event-definition-signment)

## `EventDefinition` Defaults
### Automatic `EventTarget` Signment
Default [`Core` `Settings`](../../api/core/settings/index.md) and [EventDefinition Settings](../../api/core/event-definition/settings/index.md) automatically sign event listeners for `EventTarget` instances.   

#### **All event targets use `addEventListener`, `removeEventListener`, `dispatchEvent` methods**.  
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
#### **Some event targets** use `on`, `off`, `emit`, **remainder event targets** use `addEventListener`, `removeEventListener`, `dispatchEvent`.  
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
    target: {
      assign: "on", deassign: "off",
    }
  }, {
    path: "some.property.path", type: "someEvent", listener: eventLog,
    target: {
      assign: "addEventListener", deassign: "off",
    }
  }, {
    path: "some.array.[0-9]", type: "someEvent", listener: eventLog,
    target: {
      assign: "addEventListener", deassign: "off",
    }
  }]
}
```

## Overwrite `EventDefinition` Signment

## Custom `EventDefinition` Signment
```
const application = Object.assign(new Core.implement(new CustomEventTarget(), {
  
}), {
  propertyA: new CustomEventTarget(),
  propertyB: [new CustomEventTaret()],
})
```
