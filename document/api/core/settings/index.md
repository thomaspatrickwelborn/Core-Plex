| [⁘ Core-Plex](../../../../README.md) | [API](../../index.md) | [Core](../index.md) | *Settings* |
| :--- | :--- | :--- | :--- |
# ⁘ Core-Plex API \| Core Settings
## `Settings`
**Type**: `object`  
**Required**: `true`  
**Descript**:  
New `Core` instances, `Core.implement` assignments, and extended `Core` instances accept a `$settings` parameter.  
**Schema**:  
```
{
  events: object[eventDefinition] | array[eventDefinition],
  enableEvents: boolean, 
  propertyDefinitions: {
    getEvents: string, 
    addEvents: string, 
    removeEvents: string, 
    enableEvents: string, 
    disableEvents: string, 
    reenableEvents: string, 
  },
  assign: string, 
  deassign: string, 
  transsign: string, 
}
```

### `Settings.events` Property
**Type**: `object` \| `array[eventDefinition]`  
**Required**: `true`  
**Default**: `{}`  
**Descript**:  
Impanded/expanded [Event Definition](../event-definition/index.md) formats. Impanded event definition contain event type, path, and listener while expanded event definitions contain the same properties, overwritable required properties, and customizable properties.  

### `Settings.enableEvents` Property
**Type**: `boolean`  
**Required**: `true`  
**Default**: `false`  
**Descript**:  
Indicates initial enabled state of events provided in settings. When event-targetable properties are defined at provided paths *or* when a direct `target` property is defined, an event is enabled.  

### `Settings.propertyDefinitions` Property
**Type**: `object`  
**Required**: `true`  
**Default**:  
```
{
  getEvents: 'getEvents',
  addEvents: 'addEvents',
  removeEvents: 'removeEvents',
  enableEvents: 'enableEvents',
  disableEvents: 'disableEvents',
  reenableEvents: 'reenableEvents',
}
```
**Descript**:  
Customize names for `Core` instance methods that ministrate events. Used to gain compatibility with unknown applications.  

#### `Settings.propertyDefinitions.getEvents` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'getEvents'  
**Descript**:  
Specify alternate name of default `Core.getEvents` method.  

#### `Settings.propertyDefinitions.addEvents` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'addEvents'  
**Descript**:  
Specify alternate name of default `Core.addEvents` method.  

#### `Settings.propertyDefinitions.removeEvents` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'removeEvents'  
**Descript**:  
Specify alternate name of default `Core.removeEvents` method.  

#### `Settings.propertyDefinitions.enableEvents` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'enableEvents'  
**Descript**:  
Specify alternate name of default `Core.enableEvents` method.  

#### `Settings.propertyDefinitions.disableEvents` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'disableEvents'  
**Descript**:  
Specify alternate name of default `Core.disableEvents` method.  

#### `Settings.propertyDefinitions.reenableEvents` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'reenableEvents'  
**Descript**:  
Specify alternate name of default `Core.reenableEvents` method.  

### `Settings.assign` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'addEventListener'  
**Descript**:  
Specify alternate name of default `EventDefinition.assign` method. May be further overwritten by `EventDefinition` settings. 

### `Settings.deassign` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'removeEventListener'  
**Descript**:  
Specify alternate name of default `EventDefinition.deassign` method. May be further overwritten by `EventDefinition` settings. 

### `Settings.transsign` Property
**Type**: `string`  
**Required**: `true`  
**Default**: 'dispatchEvent'  
**Descript**:  
Specify alternate name of default `EventDefinition.transsign` method. May be further overwritten by `EventDefinition` settings. 
