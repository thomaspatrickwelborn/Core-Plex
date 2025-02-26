import { Core } from '/dependencies/core-plex.js'
import PropertyClasses from './property-classes/index.js'
function eventLog($event) {
  console.log($event.type, $event.detail.settings.name)
}
const core = new Core({
  propertyClasses: PropertyClasses,
  serializableClassInstances: [
    { name: 'serializableClassInstance00' },
    { name: 'serializableClassInstance01' },
    { name: 'serializableClassInstance02' },
    { name: 'serializableClassInstance03' },
    { name: 'serializableClassInstance04' },
  ],
  events: {
    'serializableClassInstances.* start': eventLog,
    'serializableClassInstances.* stop': eventLog,
  },
}, { enableEvents: true })
core.serializableClassInstances.push({ name: 'serializableClassInstance05' })
console.log(core)
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}
core.disableEvents({
  path: 'serializableClassInstances.*'
})
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}
core.serializableClassInstances.push(
  { name: 'serializableClassInstance06' },
  { name: 'serializableClassInstance07' },
  { name: 'serializableClassInstance08' },
  { name: 'serializableClassInstance09' },
  { name: 'serializableClassInstance10' },
)
core.enableEvents({
  path: 'serializableClassInstances.*'
})
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}