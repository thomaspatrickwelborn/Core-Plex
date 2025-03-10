import { Core } from '/dependencies/core-plex.js'
function eventLog($event) { console.log($event.type, $event.detail) }
const coreSettings = {
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}
const core = new Core()
// Add Events
core.addEvents(coreSettings.events)

// Get Events
core.getEvents({ type: 'someEvent' })
console.log(core.getEvents({ type: 'someEvent' }))
// (3) [EventDefinition, EventDefinition, EventDefinition]

// Remove Events
core.removeEvents({ path: ':scope' })
console.log(core.getEvents({ type: 'someEvent' }))
// (2) [EventDefinition, EventDefinition]

// Enable Events
core.enableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
console.log(core.getEvents({ enable: true }))
// (2) [EventDefinition, EventDefinition]

// Disable Events
core.disableEvents({ listener: eventLog })
console.log(core.getEvents({ enable: false }))
// (2) [EventDefinition, EventDefinition]

// Reenable Events
core.reenableEvents()
console.log(core.getEvents())
// (2) [EventDefinition, EventDefinition]

/*
const coreSettings = {
  events: [{
    path: ":scope", type: "someEvent", listener: eventLog,
    assign: "on", deassign: "off",
  }, {
    path: "some.property.path", type: "someEvent", listener: eventLog,
    assign: "addEventListener", deassign: "removeEventListener",
  }, {
    path: "some.array.[0-9]", type: "someEvent", listener: eventLog,
    assign: "addEventListener", deassign: "removeEventListener",
  }]
}
*/