console.log(
  "\n", "------------",
  "\n", "Example A.1.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
function eventLog($event) { console.log($event.type, $event.detail) }
const coreSettings = {
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}
console.log(`const coreSettings = {
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}`)
console.log(`{
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}`)
const core = new Core()
// Add Events
core.addEvents(coreSettings.events)

// Get Events
core.getEvents({ type: 'someEvent' })
console.log(
  "\n", `core.addEvents(coreSettings.events)`,
  "\n", core.getEvents({ type: 'someEvent' })
)
// Remove Events
core.removeEvents({ path: ':scope' })
console.log(
  "\n", `core.removeEvents({ path: ':scope' })`,
  "\n", core.getEvents({ type: 'someEvent' })
)
// Enable Events
core.enableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
console.log(
  "\n", `core.enableEvents([
    { path: 'some.property.path' },
    { path: 'some.array.[0-9]' },
  ])`,
  "\n", core.getEvents({ enable: true })
)
// Disable Events
core.disableEvents({ enable: true })
console.log(
  "\n", `disableEvents({ enable: true })`,
  "\n", core.getEvents({ enable: false })
)
// Reenable Events
core.reenableEvents()
console.log(
  "\n", `core.reenableEvents()`,
  "\n", core.getEvents({ enable: true })
)