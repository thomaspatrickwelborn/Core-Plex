console.log(
  "\n", "------------",
  "\n", "Example A.2.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
function eventLog($event) { console.log($event.type, $event.detail) }
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
  }],
  propertyDefinitions: {
    enableEvents: 'alterEnableEvents',
    getEvents: 'alterGetEvents',
    addEvents: 'alterAddEvents',
    removeEvents: 'alterRemoveEvents',
    enableEvents: 'alterEnableEvents',
    disableEvents: 'alterDisableEvents',
    reenableEvents: 'alterReenableEvents',
  },
}

const alterCore = new Core(coreSettings)
// Add Events
alterCore.alterAddEvents(coreSettings.events)
// Get Events
alterCore.alterGetEvents({ type: 'someEvent' })
console.log(
  "\n", `alterCore.alterAddEvents(coreSettings.events)`,
  "\n", alterCore.alterGetEvents({ type: 'someEvent' })
)
// Remove Events
alterCore.alterRemoveEvents({ path: ':scope' })
console.log(
  "\n", `alterCore.alterRemoveEvents({ path: ':scope' })`,
  "\n", alterCore.alterGetEvents({ type: 'someEvent' })
)
// Enable Events
alterCore.alterEnableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
console.log(
  "\n", `alterCore.alterEnableEvents([
    { path: 'some.property.path' },
    { path: 'some.array.[0-9]' },
  ])`,
  "\n", alterCore.alterGetEvents({ enable: true })
)
// Disable Events
alterCore.alterDisableEvents({ enable: true })
console.log(
  "\n", `alterDisableEvents({ enable: true })`,
  "\n", alterCore.alterGetEvents({ enable: false })
)
// Reenable Events
alterCore.alterReenableEvents()
console.log(
  "\n", `alterCore.alterReenableEvents()`,
  "\n", alterCore.alterGetEvents({ enable: true })
)
