### ⬦ Instantiate `core` Instance
```
const core = new Core({
  events: {
    "someEvent": eventLog,
    "some.property.path someEvent": eventLog,
    "some.array.[0-9] someEvent": eventLog,
  }
}, new EventTarget({
  some: {
    property: path: new EventTarget(),
    array: [
      new EventTarget(), new EventTarget(), new EventTarget(),
    ],
  },
}))
```

### ⬦ Ministrate Events With API
```
// Add Events
core.addEvents(coreSettings.events)
// Get Events
core.getEvents({ type: 'someEvent' })
// Remove Events
core.removeEvents({ path: ':scope' })
// Enable Events
core.enableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
// Disable Events
core.disableEvents({ listener: eventLog })
// Reenable Events
core.reenableEvents()

```

### ⬦ Configure Events With Expanded Syntax, Property Definitions
```
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
```
### ⬦ Configure Method Names With Property Definitions
```
const alterCore = new Core(coreSettings)
// Add Events
alterCore.alterAddEvents(coreSettings.events)
// Get Events
alterCore.alterGetEvents({ type: 'someEvent' })
// Remove Events
alterCore.alterRemoveEvents({ path: ':scope' })
// Enable Events
alterCore.alterEnableEvents([
  { path: 'some.property.path' },
  { path: 'some.array.[0-9]' },
])
// Disable Events
alterCore.alterDisableEvents({ listener: eventLog })
// Reenable Events
alterCore.alterReenableEvents()
```

