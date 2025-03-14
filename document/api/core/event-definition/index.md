# ❖ Core-Plex API \| Event Definition
Core-Plex \| API \| Core \| *Event Definition*  

## Overview
Event Definitions contain properties that describe an event including:
 - path to event-target **or** an event-target.  
 - event type, 
 - event listener, 

## Event Definition Settings
**Type**: `object`  
**Schema**:  
```
EventDefinition {
  path: string | array[string] | undefined, 
  type: string | undefined, 
  listener: function, 
  target: object | array[object] | undefined, 
  enable: boolean,
  assign: string,
  deassign: string,
  transsign: string,
  accessors: array[function],
  methods: {
    assign: {
      addEventListener: function,
      on: function,
      once: function,
    },
    deassign: {
      removeEventListener: function,
      off: function,
    },
    transsign: {
      dispatchEvent: function,
      emit: function,
      send: function,
    },
  },
}
```
### `EventDefinition.path`
**Type**: `string` \| `array[string]` \| `undefined`  
**Descript**:  
 - Path or array of paths to event-targetable properties. 
   - Supports path globbing with ["Outmatch"](https://www.npmjs.com/package/outmatch#syntax).  
 - When `EventDefinition.target`: 
   - **is defined** `path` references target name; 
   - **is not defined**, `path` references matching targets from context.  

### `EventDefinition.type`
**Type**: `string` \| `undefined`  
**Default**: `undefined`  
**Descript**:  
Event type (e.g. `click`, `ready`, `message`) that is listened for. Used in `assign`, `deassign` method classes.  

### `EventDefinition.listener`
**Type**: `function`  
**Default**: `undefined`  
**Descript**:  
Function evoked when some event of `EventDefinition.type` occurs.  

### `EventDefinition.target`
**Type**: `object` \| array[object] \| `undefined`  
**Default**: `undefined`  
**Descript**:  
 - Event-targetable object or array of event-targetable objects. 
 - When `target`: 
   - **is defined**, `EventDefinition.path` references target name;  
   - **is not defined**, `EventDefinition.path` references matching targets from context. 

### `EventDefinition.enable`
**Type**: `boolean`  
**Default**: `false`  
**Descript**:  


### `EventDefinition.assign`
**Type**: `string`  
**Default**:  `addEventListener`  
**Descript**:  

### `EventDefinition.deassign`
**Type**: `string`  
**Default**:  `removeEventListener`  
**Descript**:  

### `EventDefinition.transsign`
**Type**: `string`  
**Default**:  `dispatchEvent`  
**Descript**:  

### `EventDefinition.accessors`
**Type**: `array[function]`  
**Default**:  
**Descript**:  

### `EventDefinition.methods`
**Type**: `array[function]`  
**Default**:  
```
{
  assign: {
    addEventListener: function addEventListener($target) {},
    on: function on($target) {},
    once: function once($target) {},
  },  
  deassign: {
    removeEventListener: function removeEventListener($target) {},
    off: function off($target) {},
  },
  transsign: {
    dispatchEvent: function dispatchEvent($target, $event) {},
    emit: function emit($target, $type, ...$arguments) {},
    send: function send($target, $data) {},
  },
}
```
**Descript**:  
There are three event definition method classes: `assign`, `deassign`, and `transsign`. Each method class function evokes a target's event signment with parametered properties from scoped `EventDefinition` instance (`this`). Event definition methods may be replaced *and* alternate event definition methods may be applied.  

#### `EventDefinition.methods.assign.addEventListener`
**Type**:  `function`  
**Descript**:  
`addEventListener` adds an event listener to a target with paramtered `type`, `listener`, and `options` or `useCapture` properties.  
 - [Browser `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
 - [Node `addEventListener`](https://nodejs.org/api/events.html#eventtargetaddeventlistenertype-listener-options)

**Default**:  
```
function addEventListener($target) {
  const { type, listener, settings } = this 
  const { options, useCapture } = settings
  return $target['addEventListener'](type, listener, options || useCapture)
}
```
#### `EventDefinition.methods.assign.on`
**Type**:  `function`  
**Descript**:  
`on` adds an event listener to a target with paramtered `type`, `listener` properties.  
 - [Node `on`](https://nodejs.org/api/events.html#emitteroneventname-listener)

**Default**:  
```
function on($target) {
  const { type, listener, settings } = this
  return $target['on'](type, listener)
}
```
#### `EventDefinition.methods.assign.once`
**Type**:  `function`  
**Descript**:  
`once` adds an event listener to a target with paramtered `type`, `listener` properties that emits only once.  
 - [Node `once`](https://nodejs.org/api/events.html#emitteronceeventname-listener)
 
**Default**:  
```
function once($target) {
  const { type, listener } = this
  return $target['once'](type, listener)
}
```
#### `EventDefinition.methods.deassign.removeEventListener`
**Type**:  `function`  
**Descript**:  
`removeEventListener` removes an event listener from a target with paramtered `type`, `listener`, and `options` or `useCapture` properties.  
 - [Browser `removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
 - [Node `removeEventListener`](https://nodejs.org/api/events.html#eventtargetremoveeventlistenertype-listener-options)

**Default**:  
```
function removeEventListener($target) {
  const { type, listener, settings } = this
  const { options, useCapture } = settings
  return $target['removeEventListener'](type, listener, options || useCapture)
}
```
#### `EventDefinition.methods.deassign.off`
**Type**:  `function`  
**Descript**:  
`off` adds an event listener to a target with paramtered `type`, `listener` properties.  
 - [Node `off`](https://nodejs.org/api/events.html#emitteroffeventname-listener)

**Default**:  
```
function off($target) {
  const { type, listener } = this
  return $target['off'](type, listener)
}
```

#### `EventDefinition.methods.transsign.dispatchEvent`
**Type**:  `function`  
**Descript**:  
`dispatchEvent` emits an `Event` instance.  
 - [Browser `dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
 - [Node `dispatchEvent`](https://nodejs.org/api/events.html#eventtargetdispatcheventevent)

**Default**:  
```
function dispatchEvent($target, $event) {
  return $target['dispatchEvent']($event)
}
```

#### `EventDefinition.methods.transsign.emit`
**Type**:  `function`  
**Default**:  
```
function emit($target, $type, ...$arguments) {
  return $target['emit']($type, ...$arguments)
}
```
#### `EventDefinition.methods.transsign.send`
**Type**:  `function`  
**Default**:  
```
function send($target, $data) {
  return $target['send']($data)
}
```

## Event Definition Syntax Formats
### Format A
```
{
  [$eventDefinition.type]: $eventDefinition.listener,
}
```
```
{
  [`${$eventDefinition.path} ${$event.type}`]: $eventDefinition.listener,
}
```
### Format B
```
{
  'some.event.target.path someOtherEvent': function someOtherEventListener($event) {
    console.log($event.type, $event)
  }
}
```
```
{
  'someEvent': function someEventListener($event) {
    console.log($event.type, $event)
  },
}
```
### Format C
```
[{
  type: $eventDefinition.type,
  listener: $eventDefinition.listener,
}]
```

```
[{
  path: ':scope',
  type: $eventDefinition.type,
  listener: $eventDefinition.listener,
}, {
  path: 'some.event.target.path',
  type: $eventDefinition.type,
  listener: $eventDefinition.listener,
}]
```