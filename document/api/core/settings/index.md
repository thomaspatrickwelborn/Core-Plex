# ❖ Core-Plex API \| Core \| Settings
Core-Plex \| API \| Core \| *Settings*  

## Core Settings
**Type**: `object`  
**Schema**:  
```
{
  events: object[eventDefinition] | array[eventDefinition],
  enableEvents: boolean, // false,
  propertyDefinitions: {
    getEvents: string, // 'getEvents',
    addEvents: string, // 'addEvents',
    removeEvents: string, // 'removeEvents',
    enableEvents: string, // 'enableEvents',
    disableEvents: string, // 'disableEvents',
    reenableEvents: string, // 'reenableEvents',
  },
  assign: string, // 'addEventListener', 
  deassign: string, // 'removeEventListener', 
  transsign: string, // 'dispatchEvent',
}
```

### `Core.events`
**Type**: `object` \| `array[eventDefinition]`  
**Default**: `{}`  
**Descript**:  
Impanded/expanded event definition formats.  
#### Impanded Events Format
```
{
  events: {
    [`${path} ${type}`]: listener,
    [`${type}`]: listener,
  }
}
```
**is**  
```
{
  events: {
    'event.targets.[0-9] eventName': function($event) { ... },
    'eventName': function($event) { ... },
  }
}
```
#### Expanded Events Format
```
{
  events: [
    { path, type, listener }
    { path, type, listener }
  ]
}
```
**is**
```
{
  events: [
    { path: 'event.targets.[0-9]', type: 'eventName', listener: function($event) { ... } },
    { path: ':scope', type: 'eventName', listener: function($event) { ... } },
  ]
}
```

**Default**: `false`  
### `Core.propertyDefinitions`
#### `Core.propertyDefinitionsgetEvents`
**Type**: `string`  
**Default**: 'getEvents'  
#### `Core.propertyDefinitionsaddEvents`
**Type**: `string`  
**Default**: 'addEvents'  
#### `Core.propertyDefinitionsremoveEvents`
**Type**: `string`  
**Default**: 'removeEvents'  
#### `Core.propertyDefinitionsenableEvents`
**Type**: `string`  
**Default**: 'enableEvents'  
#### `Core.propertyDefinitionsdisableEvents`
**Type**: `string`  
**Default**: 'disableEvents'  
#### `Core.propertyDefinitionsreenableEvents`
**Type**: `string`  
**Default**: 'reenableEvents'  
### `Core.assign`
**Type**: `string`  
**Default**: 'addEventListener'  
### `Core.deassign`
**Type**: `string`  
**Default**: 'removeEventListener'  
### `Core.transsign`
**Type**: `string`  
**Default**: 'dispatchEvent'  
