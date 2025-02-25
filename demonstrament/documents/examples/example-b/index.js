import { Core } from '/dependencies/core-plex.js'
import PropertyClasses from './property-classes/index.js'
function eventLog($event) { console.log($event.type, $event.detail.settings.name )}
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
  { path: 'serializableClassInstances.serializableClassInstance00' },
  { path: 'serializableClassInstances.serializableClassInstance01' },
  { path: 'serializableClassInstances.serializableClassInstance02' },
  { path: 'serializableClassInstances.serializableClassInstance03' },
  { path: 'serializableClassInstances.serializableClassInstance04' },
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
.enableEvents()

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


core.removeEvents([
  { path: 'serializableClassInstances.serializableClassInstance05' },
  { path: 'serializableClassInstances.serializableClassInstance06' },
  { path: 'serializableClassInstances.serializableClassInstance07' },
  { path: 'serializableClassInstances.serializableClassInstance08' },
  { path: 'serializableClassInstances.serializableClassInstance09' },
])
