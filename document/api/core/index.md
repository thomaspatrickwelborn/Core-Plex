| [⁘ Core-Plex](../../../README.md) | [API](../index.md) | *Core* |
| :-- | :-- | :-- |
# ⁘ Core-Plex API \| Core Class
| [Core Settings](./settings/index.md) | [Event Definition Class](./event-definition/index.md) |
| :-- | --- |

## `Core.constructor` Method
**Type**: `function`  
**Arguments**: `($settings = {})`  
**Returns** `Core.implement(this, $settings)`  
**Descript**:  
Implements `this` with `$settings`.  
### `Core.constructor` `$settings` Argument
**Type**: `object`  
**Required**: `false`  
**Default**: `{}`  
**Reference**:  
 - [Core Settings](./settings/index.md)  

## Static Methods
### `Core.implement` Method
**Type**: `function`  
**Arguments**: `($target, $settings)`  
**Descript**:  
Defines methods on `$target` (with optional custom method names):  
 - `getEvents`
 - `addEvents`
 - `removeEvents`
 - `enableEvents`
 - `disableEvents`
 - `reenableEvents`

#### `Core.implement` `$target` Argument
**Type**: `object` \| `array`  
**Required**: `true`  
**Default**:  `undefined`  
**Descript**:  
When `$target`:  
 - **is defined** Core methods are defined on `$target`;    
 - **is undefined** returns `undefined`.  

#### `Core.implement` `$settings` Argument
**Type**: `object`  
**Required**: `true`  
**Default**:  `undefined`  
**Descript**:  
When `$settings`:  
 - **is defined** Core methods are defined on `$target`;  
 - **is undefined** returns `undefined`.  

**Reference**:  
 - [Core Settings](./settings/index.md)  

## Public Methods
 - Public method names may be modified with [`$settings.propertyDefinitions`](./settings/index.md#settingspropertydefinitions-property) property.  
 - Public methods are **not** `enumerable` and **not** `writable`.  
### `getEvents` Method
**Type**: `function`  
**Arguments**: `($eventFilters)`  
**Returns**: `array[eventDefinition]`  
#### `getEvents` `$eventFilters` Argument
**Type**: `object`  
**Required**: `false`  
**Default**: `undefined`  
**Descript**:  
When `$filterEvents`:  
 - **is defined** iterates event definitions then returns select properties that match all `$eventFilters` properties;  
 - **is undefined** returns *all event definitions*.  

### `addEvents` Method
**Type**: `function`  
**Arguments**: `($eventDefinitions)`  
**Returns**: `this`  
#### `addEvents` `$eventDefinitions` Argument
**Type**: `object`  
**Default**: `undefined`  
**Required**: `true`  
**Descript**:  
When `$eventDefinitions`:  
 - **is defined** creates new `EventDefinition` class instances, pushes them to `Core.implement` `events` property;  
 - **is undefined** returns `$target`.  

### `removeEvents` Method
**Type**: `function`  
**Arguments**: `($eventFilters)`  
**Returns**: `this`  
#### `removeEvents` `$eventFilters` Argument
**Type**: `object`  
**Default**: `undefined`  
**Required**: `false`  
**Descript**:  
When `$eventFilters`:  
 - **is defined** removes *added* `EventDefinition` class instances from `this.getEvents($eventFilters)` invocation;  
 - **is undefined** removes *all* `EventDefinition` class instances from `this.getEvents()` invocation.  

### `enableEvents` Method
**Type**: `function`  
**Arguments**: `($eventFilters)`  
**Returns**: `this`  
#### `enableEvents` `$eventFilters` Argument
**Type**: `object`  
**Default**: `undefined`  
**Required**: `false`  
**Descript**:  
When `$eventFilters`:  
 - **is defined** enables *added* `EventDefinition` class instances from `this.getEvents($eventFilters)` invocation;  
 - **is undefined** enables *all* `EventDefinition` class instances from `this.getEvents()` invocation.  

### `disableEvents` Method
**Type**: `function`  
**Arguments**: `($eventFilters)`  
**Returns**: `this`  
#### `disableEvents` `$eventFilters` Argument
**Type**: `object`  
**Default**: `undefined`  
**Required**: `false`  
**Descript**:  
When `$eventFilters`:  
 - **is defined** disables *added* `EventDefinition` class instances from `this.getEvents($eventFilters)` invocation;  
 - **is undefined** disables *all* `EventDefinition` class instances from `this.getEvents()` invocation.  

### `reenableEvents` Method
**Type**: `function`  
**Arguments**: `($eventFilters)`  
**Returns**: `this`  
#### `reenableEvents` `$eventFilters` Argument
**Type**: `object`  
**Default**: `undefined`  
**Required**: `false`  
**Descript**:  
When `$eventFilters`:  
 - **is defined** reenables *added* `EventDefinition` class instances from `this.getEvents($eventFilters)` invocation;  
 - **is undefined** reenables *all* `EventDefinition` class instances from `this.getEvents()` invocation.  

