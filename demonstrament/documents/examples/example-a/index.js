import './example-a-1/index.js'
import { Core } from '/dependencies/core-plex.js'
const core = new Core({
  propertyDefinitions: {
    events: 'alterEvents',
    getEvents: 'alterGetEvents',
    addEvents: 'alterAddEvents',
    removeEvents: 'alterRemoveEvents',
    enableEvents: 'alterEnableEvents',
    disableEvents: 'alterDisableEvents',
    reenableEvents: 'alterReenableEvents',
  }
})
console.log(core)