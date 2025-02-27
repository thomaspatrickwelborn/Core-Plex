import { Core } from '/dependencies/core-plex.js'
import PropertyClasses from './property-classes/index.js'
function eventLog($event) { console.log($event.type, $event.detail) }
const core = new Core({
  propertyClasses: PropertyClasses,
  serializableClassInstances: [
    { Name: 'serializableClassInstance00' },
    { Name: 'serializableClassInstance01' },
    { Name: 'serializableClassInstance02' },
    { Name: 'serializableClassInstance03' },
    { Name: 'serializableClassInstance04' },
  ],
  events: [{
    type: 'start',
    path: 'serializableClassInstances.[0-9]',
    listener: eventLog,
  }, {
    type: 'stop',
    path: 'serializableClassInstances.[0-9]',
    listener: eventLog,
  }]
}, { enableEvents: true })
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}
core.serializableClassInstances[0] = { Name: 'serializableClassInstance00A' },
core.enableEvents({
  path: 'serializableClassInstances.[0-9]'
})
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}
console.log("core.serializableClassInstances", core.serializableClassInstances)
console.log("core.addSerializableClassInstances", core.addSerializableClassInstances)
console.log("core.removeSerializableClassInstances", core.removeSerializableClassInstances)
core.removePropertyClasses()
console.log("core.serializableClassInstances", core.serializableClassInstances)
console.log("core.addSerializableClassInstances", core.addSerializableClassInstances)
console.log("core.removeSerializableClassInstances", core.removeSerializableClassInstances)
core.addPropertyClasses(PropertyClasses)
console.log("core.serializableClassInstances", core.serializableClassInstances)
console.log("core.addSerializableClassInstances", core.addSerializableClassInstances)
console.log("core.removeSerializableClassInstances", core.removeSerializableClassInstances)
core.addSerializableClassInstances([
  { Name: 'serializableClassInstance00' },
  { Name: 'serializableClassInstance01' },
  { Name: 'serializableClassInstance02' },
  { Name: 'serializableClassInstance03' },
  { Name: 'serializableClassInstance04' },
])
core.enableEvents()
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.start()
}
for(const $serializableClassInstance of core.serializableClassInstances) {
  $serializableClassInstance.stop()
}