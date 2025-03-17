| [⁘ Core-Plex](../../../../../README.md) | [API](../../../index.md) | [Core](../../index.md) | [Event Definition](../index.md) | *Settings* |
| :-- | :-- | :-- | :-- | :-- |
# ⁘ Core-Plex API \| Event Definition Settings
## `Settings` Method
**Type**: `function`  
**Arguments**: `($settings = {})`  
**Returns**: `Settings`  
**Descript**:  
Method assigns `$settings` argument properties to `Settings` property and returns to [`EventDefinition.constructor`](./index.md#constructor-method) invocation. 
Properties describe: 
 - how events `assign` (e.g. `addEventListener`, `on`, `once`), `deassign` (e.g. `removeEventListener`, `off`), and `transsign` (e.g. `dispatchEvent`, `emit`) from event targets and event types;  
 - how event targets are accessed - either `path` notation with customizable accessor API (`accessors`) or direct `target`/`array[target]`; 
 - and how event targets are `enabled` where `true` indicates events *assigned* to targets while `false` indicates events *deassigned* from targets.  
### `$settings` Argument
**Type**: `object`  
**Descript**:  
```
{
  // Required
  path: string, 
  type: string, 
  listener: function, 
  // Optional
  target: object | array[object] | undefined, 
  enable: boolean | object | array[object],
  // ...
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
    },
  },
}
```
**Required `$settings` Properties**  
 - `$settings.path`, `$settings.type`, and `$settings.listener`  

**Optional `$settings` Properties**  
 - `$settings.$target`, `$settings.$enable`,  
 - `$settings.assign`, `$settings.deassign`, `$settings.transsign`, `$settings.accessors`, and `$settings.methods`.  

**Custom-assign `Settings` properties from complementary `$settings` properties.**  
 - e.g. Define `$settings.useCapture` and assign value to `Settings.useCapture`.  

### `$settings.path` Property
**Type**: `string`  
**Required**: `true`  
**Default**: `undefined`  
**Descript**:  
 - Path to event-targetable properties or name of event target(s).   
   - Supports globbing with ["Outmatch"](https://www.npmjs.com/package/outmatch#syntax).  
 - When `EventDefinition.target`: 
   - **is not defined** `path` references matching targets from context;  
   - **is defined** `path` references target name.  

### `$settings.type` Property
**Type**: `string`  
**Required**: `true`  
**Default**: `undefined`  
**Descript**:  
Event type (e.g. `click`, `ready`, `message`) that is listened for. 

### `$settings.listener` Property
**Type**: `function`  
**Required**: `true`  
**Default**: `undefined`  
**Descript**:  
Function evoked when some event of `EventDefinition.type` occurs.  

### `$settings.target` Property
**Type**: `object` \| `array[object]` \| `undefined`  
**Required**: `false`  
**Default**: `undefined`  
**Descript**:  
 - Event-targetable object or array of event-targetable objects. 
 - When `target`: 
   - **is defined** `EventDefinition.path` references target name;  
   - **is not defined** `EventDefinition.path` references matching targets from context. 

### `$settings.enable` Property
**Type**: `boolean` \| `object` \| `array[object]`  
**Required**: `false`  
**Default**: `false`  
**Descript**:  
 - `enable` describes event definition targets that should be initially enabled.  
 - When `enable`:  
   - **is `true`** all events initially enabled; 
   - **is `object`**, all events matching `object` properties enabled;  
   - **is `array[object]`**, all events matching all `array[object]` properties enabled.  

### `$settings.assign` Property
**Type**: `string`  
**Required**: `false`  
**Default**:  `addEventListener`  
**Descript**:  
`assign` describes which event definition method class function to evoke during target event assignment.  

### `$settings.deassign` Property
**Type**: `string`  
**Required**: `false`  
**Default**:  `removeEventListener`  
**Descript**:  
`deassign` describes which event definition method class function to evoke during target event deassignment.  

### `$settings.transsign` Property
**Type**: `string`  
**Required**: `false`  
**Default**:  `dispatchEvent`  
**Descript**:  
`transsign` describes which event definition method class function to evoke during target event dispatch.  

### `$settings.accessors` Property
**Type**: `array[function]`  
**Required**: `false`  
**Default**: `[ ($target, $property) => $target[$property] ]`  
**Descript**:  
`accessors` are functions that return an Event Definition target property when `EventDefinition.enable` is set. Including additional accessors in settings concatenates functions. By default a direct property accessor is defined. For example, to access properties from target that is map:  
```
{ accessors: [ ($target, $property) => $target.get($property) ] }
```

### `$settings.methods` Property
**Type**: `array[function]`  
**Required**: `false`  
**Default**:  
```
{
  assign: {
    addEventListener: function addEventListener($eventDefinition, $target) { ... },
    on: function on($eventDefinition, $target) { ... },
    once: function once($eventDefinition, $target) { ... },
  },  
  deassign: {
    removeEventListener: function removeEventListener($eventDefinition, $target) { ... },
    off: function off($eventDefinition, $target) { ... },
  },
  transsign: {
    dispatchEvent: function dispatchEvent($eventDefinition, $target, $event) { ... },
    emit: function emit($eventDefinition, $target, $type, ...$arguments) { ... },
    send: function send($eventDefinition, $target, $data) { ... },
  },
}
```
**Descript**:  
There are three event definition method classes: `assign`, `deassign`, `transsign`. Each method class function evokes a target's event signment with arguments `$eventDefinition`, `$target`, others. Event definition methods may be replaced *and* **alternate** event definition methods may be applied. For example, to overwrite `assign.once` and add `transsign.broadcast`:  
```
{ methods: {
  assign: { once: function once($eventDefinition, $target) { ... } } },
  transsign: { broadcast: function broadcast($eventDefinition, $target, ...$arguments) { ... } } }
}
```

#### `$settings.methods.assign.addEventListener` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function addEventListener($eventDefinition, $target) {
  const { type, listener, settings } = $eventDefinition 
  const { options, useCapture } = settings
  return $target['addEventListener'](type, listener, options || useCapture)
}
```
**Descript**:  
`addEventListener` adds an event listener to a target with paramtered `type`, `listener`, and `options` or `useCapture` properties.  
 - [Browser EventTarget `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
 - [Node EventTarget `addEventListener`](https://nodejs.org/api/events.html#eventtargetaddeventlistenertype-listener-options)

#### `$settings.methods.assign.on` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function on($eventDefinition, $target) {
  const { type, listener, settings } = $eventDefinition
  return $target['on'](type, listener)
}
```
**Descript**:  
`on` adds an event listener to a target with paramtered `type`, `listener` properties.  
 - [Node EventEmitter `on`](https://nodejs.org/api/events.html#emitteroneventname-listener)

#### `$settings.methods.assign.once` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function once($eventDefinition, $target) {
  const { type, listener } = $eventDefinition
  return $target['once'](type, listener)
}
```
**Descript**:  
`once` adds an event listener to a target with paramtered `type`, `listener` properties that emits only once.  
 - [Node EventEmitter `once`](https://nodejs.org/api/events.html#emitteronceeventname-listener)
 
#### `$settings.methods.deassign.removeEventListener` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function removeEventListener($eventDefinition, $target) {
  const { type, listener, settings } = $eventDefinition
  const { options, useCapture } = settings
  return $target['removeEventListener'](type, listener, options || useCapture)
}
```
**Descript**:  
`removeEventListener` removes an event listener from a target with paramtered `type`, `listener`, and `options` or `useCapture` properties.  
 - [Browser EventTarget `removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
 - [Node EventTarget `removeEventListener`](https://nodejs.org/api/events.html#eventtargetremoveeventlistenertype-listener-options)

#### `$settings.methods.deassign.off` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function off($eventDefinition, $target) {
  const { type, listener } = $eventDefinition
  return $target['off'](type, listener)
}
```
**Descript**:  
`off` adds an event listener to a target with paramtered `type`, `listener` properties.  
 - [Node EventEmitter `off`](https://nodejs.org/api/events.html#emitteroffeventname-listener)


#### `$settings.methods.transsign.dispatchEvent` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function dispatchEvent($eventDefinition, $target, $event) {
  return $target['dispatchEvent']($event)
}
```
**Descript**:  
`dispatchEvent` emits an `Event` instance.  
 - [Browser EventTarget `dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
 - [Node EventTarget `dispatchEvent`](https://nodejs.org/api/events.html#eventtargetdispatcheventevent)


#### `$settings.methods.transsign.emit` Property
**Type**:  `function`  
**Required**: `false`  
**Default**:  
```
function emit($eventDefinition, $target, $type, ...$arguments) {
  return $target['emit']($type, ...$arguments)
}
```
**Descript**:  
`emit` emits an event type with other arguments.  
 - [Node EventEmitter `emit`](https://nodejs.org/api/events.html#emitteremiteventname-args)

