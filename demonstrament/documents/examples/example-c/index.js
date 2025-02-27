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
    'serializableClassInstances.[0-9] start': eventLog,
    'serializableClassInstances.[0-9] stop': eventLog,
  },
}, { enableEvents: true })
core.serializableClassInstances.push({ name: 'serializableClassInstance05' })
iterateSerializableClassInstancesAStart: 
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
iterateSerializableClassInstancesAStop: 
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}
core.disableEvents({
  path: 'serializableClassInstances.[0-9]'
})
iterateSerializableClassInstancesBStart: 
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
iterateSerializableClassInstancesBStop: 
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
  path: 'serializableClassInstances.[0-9]'
})
iterateSerializableClassInstancesCStart: 
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
iterateSerializableClassInstancesCStop: 
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}
core.serializableClassInstances.splice(0)
core.removePropertyClasses({
  Name: 'serializableClassInstances'
})
console.log(core.serializableClassInstances)
console.log(core.addSerializableClassInstances)
console.log(core.removeSerializableClassInstances)
core.addPropertyClasses(PropertyClasses)
console.log(core.serializableClassInstances)
console.log(core.addSerializableClassInstances)
console.log(core.removeSerializableClassInstances)