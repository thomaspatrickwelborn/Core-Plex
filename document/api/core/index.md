# ❖ Core-Plex API \| Core
Core-Plex \| API \| *Core*  

## Core `Settings`
**Type**: `object`  
**Default**:  
```
{
  events: {},
  enableEvents: false,
  propertyDefinitions: {
    getEvents: 'getEvents',
    addEvents: 'addEvents',
    removeEvents: 'removeEvents',
    enableEvents: 'enableEvents',
    disableEvents: 'disableEvents',
    reenableEvents: 'reenableEvents',
  },
  assign: 'addEventListener', 
  deassign: 'removeEventListener', 
  transsign: 'dispatchEvent',
} 
```
### `Settings.events`
**Type**: `object` \| `array[object]`  
**Descript**: Object/array of impanded/expanded Event Definitions.  
### `Settings.enableEvents`
**Type**: `boolean`  
**Descript**: Enable events after addition.  
### `Settings.propertyDefinitions`
**Type**: `object`  
**Descript**: Key/value pairs are default/custom property names.  
#### `Settings.propertyDefinitions.getEvents`
**Type**: `string`  
**Descript**: `getEvents` name.  
#### `Settings.propertyDefinitions.addEvents`
**Type**: `string`  
**Descript**: `addEvents` name.  
#### `Settings.propertyDefinitions.removeEvents`
**Type**: `string`  
**Descript**: `removeEvents` name.  
#### `Settings.propertyDefinitions.enableEvents`
**Type**: `string`  
**Descript**: `enableEvents` name.  
#### `Settings.propertyDefinitions.disableEvents`
**Type**: `string`  
**Descript**: `disableEvents` name.  
#### `Settings.propertyDefinitions.reenableEvents`
**Type**: `string`  
**Descript**: `reenableEvents` name.  
### Settings.assign
**Type**: `string`  
**Descript**: Default event addition method name such as `addEventListener`, `on`.  
### Settings.deassign
**Type**: `string`  
**Descript**: Default event removal method name such as `removeEventListener`, `off`.  
### Settings.transsign
**Type**: `string`  
**Descript**: Default event dispatch method name such as `dispatchEvent`, `emit`.  

## `Core.constructor`
**Type**: `function`  
**Arguments**: `$settings`  

## Static Methods
### `static` `Core.implement`
**Type**: `function`  
**Arguments**: `($target, $settings)`  
**Descript**:  
Defines methods on a `$target` (with optional custom method names):  
 - `getEvents`
 - `addEvents`
 - `removeEvents`
 - `enableEvents`
 - `disableEvents`
 - `reenableEvents`

#### `static` `Core.implement` `$target`
**Type**: `object` \| `array`  
**Descript**: `$target` is where Core methods are defined.  
#### `static` `Core.implement` `$settings`
**Type**: `object`  
**Descript**: [Core Settings](#core-settings)

## Public Methods
### `getEvents` Method
**Type**: `function`  
**Arguments**: (eventFilters)

### `addEvents` Method
**Type**: `function`  
**Arguments**: ($eventDefinitions)  

### `removeEvents` Method
**Type**: `function`  
**Arguments**: ($eventFilters)  

### `enableEvents` Method
**Type**: `function`  
**Arguments**: ($eventFilters)  

### `disableEvents` Method
**Type**: `function`  
**Arguments**: ($eventFilters)  

### `reenableEvents` Method
**Type**: `function`  
**Arguments**: ($eventFilters)  

