| [⁘ Core-Plex](../../../../README.md) | [API](../../index.md) | [Core](../index.md) | *Event Definition* |
| :-- | :-- | :-- | :-- |
# ⁘ Core-Plex API \| Event Definition Class
| [Event Definition Settings](./settings/index.md) |
| :-- |

## `EventDefinition.constructor` Method
**Type**: `function`  
**Arguments**: `($settings, $context)`  
**Returns**: `this`  
**Descript**:  
Assigns:  
 - `$settings`, `$context` to `this.#settings`, `this.#context` (respectively); 
 - `this.settings.enable` to `this.enable`. 
### `EventDefinition.constructor` `$settings` Argument
**Type**: `object`  
**Required**: `true`  
**Reference**:  
 - [Event Definition Settings](./settings/index.md)
### `EventDefinition.constructor` `$context` Argument
**Type**: `object`  
**Required**: `true`  
**Descript**:  
`$context` specifies which property `this.path` is rooted.  
 - New `EventDefinition` class instances invoked by `Core.addEvents` specify `$context` is [**`$target` argument**](../index.md#coreimplement-target-argument).  
 - New `EventDefinition` class instances invoked directly specify `$context` is **some provided `object`**.  

## Public Properties
### `EventDefinition.settings` Property
**Type**: `get`  
**Returns**: `this.#settings`  
### `EventDefinition.path` Property
**Type**: `get`  
**Returns**: `this.#settings.path`  
### `EventDefinition.type` Property
**Type**: `get`  
**Returns**: `this.#settings.type`  
### `EventDefinition.listener` Property
**Type**: `get`  
**Returns**: `this.#settings.listener`  
### `EventDefinition.enable` Property
**Type**: `get`, `set`    
**Arguments**: `($enable)`  
**Returns**: `this.#enable`  
**Descript**:  
 - Iterates `this.#targets`:  
   - evoking **`this.#assign` or `this.#deassign`** *with* `$targetElement.target`;  
   - assigning **`true` or `false`** *to* `$targetElement.enable`;  
   - pushing enabled/disabled `$targetElement`s to `this.#enabled`/`this.#disabled`. 
 - Defines `this.#enable` as:  
   - `true` when:  
     - `$enable` is `true`,
     - there are no disabled `$targetElement`s,
     - and there is at least one enabled `$targetElement`.  
   - `false` when:  
     - `$enable` is `false`, 
     - there are no enabled `$targetElement`s,
     - and there is at least one disabled `$targetElement`.  
   - `null` when: 
     - there are no disabled and no enabled `$targetElements`, 
     - or when there is one or more disabled `$targetElements` and one or more enabled `$targetElements`.   
#### `EventDefinition.enable` `$enable` Argument
**Type**: `boolean`  
**Required**: `true`  
**Descript**:  
Value used for signing events on target, settings `enable` state of `$targetElement`s, pushing to `enabled`/`disabled` arrays.  

### `EventDefinition.enabled` Property
**Type**: `get`  
**Returns**: `this.#enabled`  
### `EventDefinition.disabled` Property
**Type**: `get`  
**Returns**: `this.#disabled`  

## Public Methods
### `EventDefinition.emit` Method
## Private Properties
### `EventDefinition.#settings` Property
**Type**: `object`  
**Descript**:  
Stored value is
### `EventDefinition.#context` Property
**Type**: `object`  
**Descript**:  
Stored value is [`EventDefinition.constructor` `$context` Argument](#eventdefinitionconstructor-context-argument)
### `EventDefinition.#enable`  Property
**Type**: `boolean` \| `null`  
**Descript**:  
Stored value defined by [`EventDefinition.enable`](#eventdefinitionenable-property)
### `EventDefinition.#path` Property
**Type**: `string`  
**Descript**:  
Stored value is period-delimited path to property from `this.#context` or name of `this.target` property (when defined).  
### `EventDefinition.#enabled` Property
**Type**: `array`  
**Descript**:  
Each time `this.enable` is set, array is populated with `enabled` `$targetElements` (if any).  
### `EventDefinition.#disabled` Property
**Type**: `array`  
**Descript**:  
Each time `this.enable` is set, array is populated with `disabled` `$targetElements` (if any).  
### `EventDefinition.#target` Property
**Type**: `object` \| `array[object]` \| `undefined`  
**Descript**:  
Stored value is event-targetable object or array of event-targetable objects.  
### `EventDefinition.#_targets` Property
**Type**: `array[object]`  
**Descript**:  
Stored value is array of `targetElements` defined by `EventDefinition.#targets` getter.  
### `EventDefinition.#targets` Property
**Type**: `get`  
**Returns**: `this.#_targets`  
**Descript**:  
Each time property is accessed method creates new `targetElement` objects or references existing `targetElement` objects with `path`, `target`, and `enable` properties that populate `this.#targets` array.  
 - When `this.#target` **is defined** `targetElement.target` is populated by one or more `this.#target` properties.  
 - When `this.#target` **is undefined**, property is collection of all properties from `this.#context` with paths that match `this.path`.  

### `EventDefinition.#_assign` Property
**Type**: `function`  
**Descript**:  
Stored value is bound function defined by `EventDefinition.#assign` getter.  
### `EventDefinition.#assign` Property
**Type**: `get`  
**Returns**: `EventDefinition.#_assign`  
**Descript**:  
Assigns function from `this.settings.methods.assign` to `this.#_assign` bound with `this` as first argument.   
### `EventDefinition.#_deassign` Property
**Type**: `function`  
**Descript**:  
Stored value is bound function defined by `EventDefinition.#deassign` getter.  
### `EventDefinition.#deassign` Property
**Type**: `get`  
**Returns**: `EventDefinition.#_deassign`  
**Descript**:  
Assigns function from `this.settings.methods.deassign` to `this.#_deassign` bound with `this` as first argument.   
### `EventDefinition.#_transsign` Property
**Type**: `function`  
**Descript**:  
Stored value is bound function defined by `EventDefinition.#transsign` getter.  
### `EventDefinition.#transsign` Property
**Type**: `get`  
**Returns**: `EventDefinition.#_transsign`  
**Descript**:  
Assigns function from `this.settings.methods.transsign` to `this.#_transsign` bound with `this` as first argument.   
### `EventDefinition.#methods` Property
**Type**: `get`  
**Returns**: `this.settings.methods`  
### `EventDefinition.#propertyDirectory` Property
**Type**: `get`  
**Returns**: `propertyDirectory`  
**Descript**:  
Returns invocation of `propertyDirectory` with `this.#context`, `this.settings.propertyDirectory` parameters.  