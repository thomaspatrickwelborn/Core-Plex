# Core-Plex
**Class-Based Property Ventilation, Ministration**  

## Impetus
Property ventilation, ministration configurable through objects.  

*Property Ventilation*  
 - Managing event addition/removal is necessary for most application development. 
 - Add/Remove event statements are usually disparately located throughout codebases. 
 - Event assignment, deassignment differentiate based on event-targetable class prototype. 

*Property Ministration*  
  - Managing serialized class instances is popular for applications. 
  - Redundantly authoring code that serializes class instances is wasteful.  
  - Property set/delete methods differentiate based on property class instance parameters.  

## Introduction
*Property Ventilation*  
 - Map Events To Targets With Property Paths (Supports **Path Globbing**)
 - Enable/Disable Events Dynamically

*Property Ministration*  
 - Define Properties And Property Classes With Serializable Subproperties 
 - Instantiate/Deinstantiate Properties Dynamically



## Installation
```
npm install core-plex
```

## Importation
```
import { Core } from 'core-plex'
```

## Instantiation
```
const core = new Core({
  events: {
    "element click": function elementClick($event) { console.log($event.type) }
  },
})
core.element = document.querySelector('body')
core.enableEvents()
core.element.dispatchEvent(new CustomEvent('click'))
```

## Extension
```
class CustomCore extends Core {
  constructor() {
    super(...arguments)
    this.enableEvents()
  }
  get element() { return document.querySelector('body') }
}
const customCore = new CustomCore({
  events: {
    "element click": function elementClick($event) { console.log($event.type) }
  }
})
```

## Propriation
### Single Property
```
const body = new Core({
  propertyClasses: [{
    name: 'element',
    names: {
      monople: { formal: 'Element', nonformal: 'element' },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {
        return document.querySelector($value)
      },
      deinstate: function deinstate($propertyClass, $property) {},
    },
    definition: {}
  }],
  element: 'body',
})
```
### Multiple Properties
```
const core = new Core({
  propertyClasses: [{
    name: 'elements',
    names: {
      monople: { formal: 'Element', nonformal: 'element' },
      multiple: { formal: 'Elements', nonformal: 'elements' },
      minister: {
        ad: { formal: 'Add', nonformal: 'add' },
        dead: { formal: 'Remove', nonformal: 'remove' },
      },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {
        const { core, name } = $propertyClass
        const element = new document.createElement($value)
        document.querySelector('body').appendChild(element)
        return element
      },
      deinstate: function deinstate($propertyClass, $property) {
        const { core, name } = $propertyClass
        const element = core[name][$property]
        return element.parentElement.removeChild(element)
      },
    },
    definition: {
      object: "Object"
    }
  }],
})
```