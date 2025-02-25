> [!WARNING]  
> Early Stage Development  

> [!CAUTION]  
> Use At Own Risk  

> [!NOTE]  
> Interested in Core-Plex? 
> thomas.patrick.welborn@outlook.com


# Core-Plex
**Class-Based Property Ministration, Ventilation**  
 - Classified property groups stantiate serialized properties with custom methods.  
 - Targeted property events sign stantiated serialized properties with custom events.  

## Installation
```
npm install core-plex
```

## Generic Utilization
**`serializable-class/index.js`**  
```
export default class SerializableClass extends EventTarget {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get settings() { return this.#settings }
  start() {
    this.dispatchEvent(new CustomEvent('start', { detail: this } ))
    return this
  }
  stop() {
    this.dispatchEvent(new CustomEvent('stop', { detail: this } ))
    return this
  }
}
```

**`property-classes/index.js`**  
```
import SerializableClass from '../serializable-class/index.js'
export default {
  propertyClasses: [{
    Name: 'serializableClassInstances',
    Names: {
      Multiple: {
        Formal: 'SerializableClassInstances',
        Nonformal: 'serializableClassInstances',
      },
      Minister: {
        Ad: { Formal: 'Add', Nonformal: 'add' },
        Dead: { Formal: 'Remove', Nonformal: 'remove' },
      },
    },
    Events: {
      Assign: 'addEventListener',
      Deassign: 'removeEventListener',
      TargetAccessors: ['[]'],
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {
        return new SerializableClass(...$value)
      },
      Deinstate: function Deinstate($propertyClass, $property) {
        const { core } = $propertyClass
        return core[$property].stop()
      },
    },
    Definition: {
      Object: "Object",
    },
  }]
}
```

**`index.js`**  
```
import { Core } from 'core-plex'
import PropertyClasses from './property-classes/index.js'
function eventLog() { console.log($event.type, $event.detail.settings.name )}
const core = new Core({
  propertyClasses: PropertyClasses,
  serializableClassInstances: {
    serializableClassInstance00: { name: 'serializableClassInstance00' },
    serializableClassInstance01: { name: 'serializableClassInstance01' },
    serializableClassInstance02: { name: 'serializableClassInstance02' },
    serializableClassInstance03: { name: 'serializableClassInstance03' },
    serializableClassInstance04: { name: 'serializableClassInstance04' },
  },
  events: {
    'serializableClassInstances.serializableClassInstance00 start': eventLog,
    'serializableClassInstances.serializableClassInstance01 start': eventLog,
    'serializableClassInstances.serializableClassInstance02 start': eventLog,
    'serializableClassInstances.serializableClassInstance03 start': eventLog,
    'serializableClassInstances.serializableClassInstance04 start': eventLog,
    'serializableClassInstances.serializableClassInstance00 stop': eventLog,
    'serializableClassInstances.serializableClassInstance01 stop': eventLog,
    'serializableClassInstances.serializableClassInstance02 stop': eventLog,
    'serializableClassInstances.serializableClassInstance03 stop': eventLog,
    'serializableClassInstances.serializableClassInstance04 stop': eventLog,
  }
}, { enableEvents: true })

for(const $serializableClassInstance of [
  'serializableClassInstance00',
  'serializableClassInstance01',
  'serializableClassInstance02',
  'serializableClassInstance03',
  'serializableClassInstance04',
]) {
  core.serializableClassInstances[$serializableClassInstance].start()
}

delete core.serializableClassInstances.serializableClassInstance00
delete core.serializableClassInstances.serializableClassInstance01
delete core.serializableClassInstances.serializableClassInstance02
delete core.serializableClassInstances.serializableClassInstance03
delete core.serializableClassInstances.serializableClassInstance04

core.removeEvents([
  { path: serializableClassInstances.serializableClassInstance00 },
  { path: serializableClassInstances.serializableClassInstance01 },
  { path: serializableClassInstances.serializableClassInstance02 },
  { path: serializableClassInstances.serializableClassInstance03 },
  { path: serializableClassInstances.serializableClassInstance04 },
])

core.addSerializableClassInstances({
  serializableClassInstance05: { name: 'serializableClassInstance05' },
  serializableClassInstance06: { name: 'serializableClassInstance06' },
  serializableClassInstance07: { name: 'serializableClassInstance07' },
  serializableClassInstance08: { name: 'serializableClassInstance08' },
  serializableClassInstance09: { name: 'serializableClassInstance09' },
})
.addEvents({
  'serializableClassInstances.serializableClassInstance05 start': eventLog,
  'serializableClassInstances.serializableClassInstance06 start': eventLog,
  'serializableClassInstances.serializableClassInstance07 start': eventLog,
  'serializableClassInstances.serializableClassInstance08 start': eventLog,
  'serializableClassInstances.serializableClassInstance09 start': eventLog,
  'serializableClassInstances.serializableClassInstance05 stop': eventLog,
  'serializableClassInstances.serializableClassInstance06 stop': eventLog,
  'serializableClassInstances.serializableClassInstance07 stop': eventLog,
  'serializableClassInstances.serializableClassInstance08 stop': eventLog,
  'serializableClassInstances.serializableClassInstance09 stop': eventLog,
})

for(const $serializableClassInstance of [
  'serializableClassInstance05',
  'serializableClassInstance06',
  'serializableClassInstance07',
  'serializableClassInstance08',
  'serializableClassInstance09',
]) {
  core.serializableClassInstances[$serializableClassInstance].start()
}

delete core.serializableClassInstances.serializableClassInstance05
delete core.serializableClassInstances.serializableClassInstance06
delete core.serializableClassInstances.serializableClassInstance07
delete core.serializableClassInstances.serializableClassInstance08
delete core.serializableClassInstances.serializableClassInstance09
```

*console logs*:  
```
start serializableClassInstance00
start serializableClassInstance01
start serializableClassInstance02
start serializableClassInstance03
start serializableClassInstance04
stop serializableClassInstance00
stop serializableClassInstance01
stop serializableClassInstance02
stop serializableClassInstance03
stop serializableClassInstance04
start serializableClassInstance05
start serializableClassInstance06
start serializableClassInstance07
start serializableClassInstance08
start serializableClassInstance09
stop serializableClassInstance05
stop serializableClassInstance06
stop serializableClassInstance07
stop serializableClassInstance08
stop serializableClassInstance09
```

