| [⁘ Core-Plex](../../../../README.md) | [Guide](../../index.md) | [Event Ministration](../index.md) | *Define Events* |
| :-- | :-- | :-- | :-- |
# ⁘ Core-Plex Guide \| Define Events
 - [Event Definition Defaults](#event-definition-defaults)
 - [Impanded EventDefinition Syntax](#impanded-eventDefinition-syntax)
 - [Expanded EventDefinition Syntax](#expanded-eventDefinition-syntax)
 - [Overwrite Event Definition Signment](#overwrite-event-definition-signment)
 - [Custom Event Definition Signment](#custom-event-definition-signment)

## Event Definition Defaults
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
## Overwrite Event Definition Signment

## Custom Event Definition Signment
```
const application = Object.assign(new Core.implement(new CustomEventTarget(), {
  
}), {
  propertyA: new CustomEventTarget(),
  propertyB: [new CustomEventTaret()],
})
```
## Impanded EventDefinition Syntax
## Expanded EventDefinition Syntax