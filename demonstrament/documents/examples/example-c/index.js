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
  events: {},
}, { enableEvents: true })
core.serializableClassInstances.push({ name: 'serializableClassInstance05' })
console.log(core)
