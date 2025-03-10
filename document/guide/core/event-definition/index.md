# Event Definition
Core-Plex \| Guide \| Core \| *Event Definition*  

## Event Definition Syntax
### Impanded/Expanded Event Syntax
Event Definitions are composed with "impanded", "expanded" syntax.  
#### Pathed Event Listener Syntax
Pathed event listeners describe an event type, path to an event target, and event listener.  
##### Impanded Pathed Event Listener
```
Events {
  [`${$eventDefinition.path} ${$event.type}`]: $eventDefinition.listener
}
```
*is*  
```
Events {
  'some.event.target someEvent': function someListener($event) {
    console.log($event.type, $event)
  }
}
```
##### Expanded Pathed Event Listener
```
Events [{
  path: $eventDefinition.path, type: $eventDefinition.type,
  listener: $eventDefinition.listener,
}]
```
*is*  
```
Events [{
  path: 'some.event.target', type: 'someEvent',
  listener: function someListener($event) {
    console.log($event.type, $event)
  }
}]
```
#### Scoped Event Listener Syntax
Scoped event listeners describe an event type and event listener while event target is either `core` instance **or** `$eventDefinition.target`.  
##### Impanded Scoped Event Listener
```
Events { [$eventDefinition.type]: $eventDefinition.listener }
```
*is*  
```
Events { 'someEvent': function someEventListener($event) {
  console.log($event.type, $event)
} }
```
*and equivilates*  
```
Events { `:scope $eventDefinition.type: $eventDefinition.listener }
```
*which is*  
```
Events { ':scope someEvent': function someEventListener($event) {
  console.log($event.type, $event)
} }
```

##### Expanded Scoped Event Listener
```
Events [{
  type: $eventDefinition.type, 
  listener: $eventDefinition.listener,
}]
```
*is*  
```
Events [{
  path: ':scope', type: 'someEvent',
  listener: function someListener($event) { console.log($event.type, $event) },
}]
```
**or**  
```
Events [{
  target: $eventDefinition.target, type: 'someEvent',
  listener: function someListener($event) { console.log($event.type, $event) },
}]
```
*is*  
```
const eventTarget = new EventTarget()
Events [{
  target: eventTarget, type: 'someEvent',
  listener: function someListener($event) { console.log($event.type, $event) },
}]
```

### Property Path Syntax
#### Direct Property Path
```
{ path: "path.to.property" }
```

#### Matching Property Paths
```
{ path: "path.to.array.[0-9].property" }
```

#### Array: Direct, Matching Property Paths
```
{ path: [
  "path.to.another.property",
  "path.to.yet.another.array.[0-9].property"
] }
```

#### `path`, `target` Defined
```
{
  path: 'eventTargetName'
  target: new EventTarget(),
}
```
