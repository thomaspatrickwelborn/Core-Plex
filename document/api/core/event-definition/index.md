# ❖ Core-Plex API \| Event Definition
Core-Plex \| API \| Core \| *Event Definition*  

## Overview
Event Definitions contain properties that describe an event including:
 - path to event-target **or** an event-target.  
 - event type, 
 - event listener, 

## Event Definition Settings
Required settings are listener and either path *or* target.  
```
EventDefinition {
  path: string | array[string] | undefined, 
  type: string | undefined, 
  listener: function, 
  target: object | array[object] | undefined, 
}
```
### `eventDefinition.path`
**Type**: `string` \| `array[string]` \| `undefined`  
**Required**: `true`  
**Descript**:  
 - Path or array of paths to event-targetable properties. 
   - Supports path globbing with ["Outmatch"](https://www.npmjs.com/package/outmatch#syntax).  
 - When `eventDefinition.target`: 
   - **is defined** `path` references target name.  
   - **is not defined** `path` references matching targets from context.   

### `eventDefinition.type`
**Type**: `string` \| `undefined`  
**Required**: `false`  
**Default**: `undefined`  
**Descript**:  

### `eventDefinition.listener`
**Type**: `function`  
**Required**: `true`  
**Descript**:  

### `eventDefinition.target`
**Type**: `object` \| array[object] \| `undefined`  
**Required**: `false` when `eventDefinition.path` defined  
**Default**: `undefined`  
**Descript**:  

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