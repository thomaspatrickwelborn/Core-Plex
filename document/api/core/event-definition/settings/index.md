# ❖ Core-Plex API \| Event Definition \| Settings
Core-Plex \| API \| Core \| Event Definition \| *Settings*  

## Event Definition Settings
**Type**: `object`  
**Schema**:  
```
EventDefinition {
  path: string, 
  type: string, 
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
**Type**: `string`  
**Required**: `true`  
**Default**: `undefined`  
**Descript**:  
 - Path to event-targetable properties. 
   - Supports path globbing with ["Outmatch"](https://www.npmjs.com/package/outmatch#syntax).  
 - When `EventDefinition.target`: 
   - **is defined** `path` references target name; 
   - **is not defined**, `path` references matching targets from context.  

### `EventDefinition.type`
**Type**: `string`  
**Required**: `true`  
**Default**: `undefined`  
**Descript**:  
Event type (e.g. `click`, `ready`, `message`) that is listened for. Used in `assign`, `deassign` method classes.  

### `EventDefinition.listener`
**Type**: `function`  
**Required**: `true`  
**Default**: `undefined`  
**Descript**:  
Function evoked when some event of `EventDefinition.type` occurs.  

### `EventDefinition.target`
**Type**: `object` \| array[object] \| `undefined`  
**Required**: `false`  
**Default**: `undefined`  
**Descript**:  
 - Event-targetable object or array of event-targetable objects. 
 - When `target`: 
   - **is defined**, `EventDefinition.path` references target name;  
   - **is not defined**, `EventDefinition.path` references matching targets from context. 

### `EventDefinition.enable`
**Type**: `boolean`  
**Required**: `true`  
**Default**: `false`  
**Descript**:  
`enable` describes whether event definition target should be initially enabled. When `enable` is `true` and there are no/some event target paths defined, `enable` sets to `false` or `null`.  

### `EventDefinition.assign`
**Type**: `string`  
**Required**: `true`  
**Default**:  `addEventListener`  
**Descript**:  
`assign` describes which event definition method class function to evoke during target event assignment.  

### `EventDefinition.deassign`
**Type**: `string`  
**Required**: `true`  
**Default**:  `removeEventListener`  
**Descript**:  
`deassign` describes which event definition method class function to evoke during target event deassignment.  

### `EventDefinition.transsign`
**Type**: `string`  
**Required**: `true`  
**Default**:  `dispatchEvent`  
**Descript**:  
`transsign` describes which event definition method class function to evoke during target event dispatch.  

### `EventDefinition.accessors`
**Type**: `array[function]`  
**Required**: `true`  
**Default**: `[ ($target, $property) => $target[$property] ]`  
**Descript**:  
`accessors` are functions that return an Event Definition target property when `EventDefinition.enable` is set. Including additional accessors in settings concatenates functions. By default a direct property accessor is defined. For example, to access properties from target that is map:  
```
{ accessors: [ ($target, $property) => $target.get($property) ] }
```

### `EventDefinition.methods`
**Type**: `array[function]`  
**Required**: `true`  
**Default**:  
```
{
  assign: {
    addEventListener: function addEventListener($target) { ... },
    on: function on($target) { ... },
    once: function once($target) { ... },
  },  
  deassign: {
    removeEventListener: function removeEventListener($target) { ... },
    off: function off($target) { ... },
  },
  transsign: {
    dispatchEvent: function dispatchEvent($target, $event) { ... },
    emit: function emit($target, $type, ...$arguments) { ... },
    send: function send($target, $data) { ... },
  },
}
```
**Descript**:  
There are three event definition method classes: `assign`, `deassign`, and `transsign`. Each method class function evokes a target's event signment with parametered properties from scoped `EventDefinition` instance (`this`). Event definition methods may be replaced *and* alternate event definition methods may be applied. For example, to overwrite `assign.once` and add `transsign.broadcast`:  
```
{ methods: {
  assign: { once: function once($target) { ... } } },
  transsign: { broadcast: function broadcast($target, ...$arguments) { ... } } }
}
```

#### `EventDefinition.methods.assign.addEventListener`
**Type**:  `function`  
**Default**:  
```
function addEventListener($target) {
  const { type, listener, settings } = this 
  const { options, useCapture } = settings
  return $target['addEventListener'](type, listener, options || useCapture)
}
```
**Descript**:  
`addEventListener` adds an event listener to a target with paramtered `type`, `listener`, and `options` or `useCapture` properties.  
 - [Browser EventTarget `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
 - [Node EventTarget `addEventListener`](https://nodejs.org/api/events.html#eventtargetaddeventlistenertype-listener-options)

#### `EventDefinition.methods.assign.on`
**Type**:  `function`  
**Default**:  
```
function on($target) {
  const { type, listener, settings } = this
  return $target['on'](type, listener)
}
```
**Descript**:  
`on` adds an event listener to a target with paramtered `type`, `listener` properties.  
 - [Node EventEmitter `on`](https://nodejs.org/api/events.html#emitteroneventname-listener)

#### `EventDefinition.methods.assign.once`
**Type**:  `function`  
**Default**:  
```
function once($target) {
  const { type, listener } = this
  return $target['once'](type, listener)
}
```
**Descript**:  
`once` adds an event listener to a target with paramtered `type`, `listener` properties that emits only once.  
 - [Node EventEmitter `once`](https://nodejs.org/api/events.html#emitteronceeventname-listener)
 
#### `EventDefinition.methods.deassign.removeEventListener`
**Type**:  `function`  
**Default**:  
```
function removeEventListener($target) {
  const { type, listener, settings } = this
  const { options, useCapture } = settings
  return $target['removeEventListener'](type, listener, options || useCapture)
}
```
**Descript**:  
`removeEventListener` removes an event listener from a target with paramtered `type`, `listener`, and `options` or `useCapture` properties.  
 - [Browser EventTarget `removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
 - [Node EventTarget `removeEventListener`](https://nodejs.org/api/events.html#eventtargetremoveeventlistenertype-listener-options)

#### `EventDefinition.methods.deassign.off`
**Type**:  `function`  
**Default**:  
```
function off($target) {
  const { type, listener } = this
  return $target['off'](type, listener)
}
```
**Descript**:  
`off` adds an event listener to a target with paramtered `type`, `listener` properties.  
 - [Node EventEmitter `off`](https://nodejs.org/api/events.html#emitteroffeventname-listener)


#### `EventDefinition.methods.transsign.dispatchEvent`
**Type**:  `function`  
**Default**:  
```
function dispatchEvent($target, $event) {
  return $target['dispatchEvent']($event)
}
```
**Descript**:  
`dispatchEvent` emits an `Event` instance.  
 - [Browser EventTarget `dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
 - [Node EventTarget `dispatchEvent`](https://nodejs.org/api/events.html#eventtargetdispatcheventevent)


#### `EventDefinition.methods.transsign.emit`
**Type**:  `function`  
**Default**:  
```
function emit($target, $type, ...$arguments) {
  return $target['emit']($type, ...$arguments)
}
```
**Descript**:  
`emit` emits an event type with other arguments.  
 - [Node EventEmitter `emit`](https://nodejs.org/api/events.html#emitteremiteventname-args)

#### `EventDefinition.methods.transsign.send`
**Type**:  `function`  
**Default**:  
```
function send($target, $data) {
  return $target['send']($data)
}
```
**Descript**:  
`send` sends message to a server websocket.  
 - [Browser WebSocket `send`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send)

## Event Definition Syntax Formats
### Format A - Impanded Event Definition Syntax
#### Target path **not specified**
**Format**:  
```
{
  [$eventDefinition.type]: $eventDefinition.listener,
}
```
**Example**:  
```
{
  'someEvent': function someEventListener($event) {
    console.log($event.type, $event)
  },
}
```
#### Target path **specified**
**Format**:  
```
{
  [`${$eventDefinition.path} ${$event.type}`]: $eventDefinition.listener,
}
```
**Example**:  
```
{
  'some.event.target.path someOtherEvent': function someOtherEventListener($event) {
    console.log($event.type, $event)
  }
}
```
### Format B - Expanded Event Definition Syntax
#### **Target path** specified
**Format**:  
```
[{
  path: $eventDefinition.path,
  type: $eventDefinition.type,
  listener: $eventDefinition.listener,
}]
```
**Example**:  
```
[{
  path: ':scope',
  type: 'ready',
  listener: function($application) { ... },
}, {
  path: 'some.event.target.path',
  type: 'connection',
  listener: function($database) { ... },
}]
```
#### **Target** specified
**Format**:  
```
[{
  path: $eventDefinition.path,
  target: $eventDefinition.target,
  type: $eventDefinition.type,
  listener: $eventDefinition.listener,
}]
```
**Example**:  
```
const someEventTarget = new EventTarget()
const someOtherEventTarget = new EventTarget()
[{
  path: 'someEventTargetName',
  target: someEventTarget,
  type: 'click',
  listener: function($event) { ... },
}, {
  path: 'someOtherEventTargetname',
  target: someOtherEventTarget,
  type: 'input',
  listener: function($event) { ... },
}]
```