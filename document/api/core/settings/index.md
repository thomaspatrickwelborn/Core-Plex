| [⁘ Core-Plex](../../../../README.md) | [API](../../index.md) | [Core](../index.md) | *Settings* |
| :--- | :--- | :--- | :--- |
# ⁘ Core-Plex API \| Core Settings
## `Settings` Method
**Type**: `function`  
**Arguments**: `($settings)`  
**Returns**: `Settings`  
**Descript**:  
Method assigns `$settings` argument properties to `Settings` property and returns to [`Core.constructor`](./index.md#constructor-method) invocation. 
Properties describe: 
 - which `events` added initially; 
 - whether initial events are `enabled`; 
 - public method names (`propertyDefinitions`); 
 - target event method names (`assign`, `deassign`, `transsign`) applied as default to all new `EventDeifnition` class instances (overwritable by `EventDefinition` settings).  
### `$settings` Argument
**Type**: `object`  
**Descript**:  
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
 - Required `$settings` Properties
   - None
 - Optional `$settings` Properties
   - All
 - Custom-assign `Settings` properties from complementary `$settings` properties.  
   - e.g. Define `$settings.customAppVariable` and assign value to `Settings.customAppVariable`.  

### `$settings.events` Property
**Type**: `object` \| `array[eventDefinition]`  
**Required**: `false`  
**Default**: `{}`  
**Descript**:  
Impanded/expanded [Event Definition](../event-definition/index.md) formats. Impanded event definition contain event type, path, and listener while expanded event definitions contain the same properties, overwritable required properties, and customizable properties.  

### `$settings.enableEvents` Property
**Type**: `boolean`  
**Required**: `false`  
**Default**: `false`  
**Descript**:  
Indicates initial enabled state of events provided in settings. When event-targetable properties are defined at provided paths *or* when a direct `target` property is defined, an event is enabled.  

### `$settings.propertyDefinitions` Property
**Type**: `object`  
**Required**: `false`  
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

#### `$settings.propertyDefinitions.getEvents` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'getEvents'  
**Descript**:  
Specify alternate name of default `Core.getEvents` method.  

#### `$settings.propertyDefinitions.addEvents` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'addEvents'  
**Descript**:  
Specify alternate name of default `Core.addEvents` method.  

#### `$settings.propertyDefinitions.removeEvents` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'removeEvents'  
**Descript**:  
Specify alternate name of default `Core.removeEvents` method.  

#### `$settings.propertyDefinitions.enableEvents` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'enableEvents'  
**Descript**:  
Specify alternate name of default `Core.enableEvents` method.  

#### `$settings.propertyDefinitions.disableEvents` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'disableEvents'  
**Descript**:  
Specify alternate name of default `Core.disableEvents` method.  

#### `$settings.propertyDefinitions.reenableEvents` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'reenableEvents'  
**Descript**:  
Specify alternate name of default `Core.reenableEvents` method.  

### `$settings.assign` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'addEventListener'  
**Descript**:  
Specify alternate name of default `EventDefinition.assign` method. May be further overwritten by `EventDefinition` settings. 

### `$settings.deassign` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'removeEventListener'  
**Descript**:  
Specify alternate name of default `EventDefinition.deassign` method. May be further overwritten by `EventDefinition` settings. 

### `$settings.transsign` Property
**Type**: `string`  
**Required**: `false`  
**Default**: 'dispatchEvent'  
**Descript**:  
Specify alternate name of default `EventDefinition.transsign` method. May be further overwritten by `EventDefinition` settings. 
