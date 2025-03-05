import { Core } from '/dependencies/core-plex.js'
const core = new Core({
  events: {
    "element click": function elementClick($event) { console.log($event.type) }
  },
})
core.element = document.querySelector('body')
core.enableEvents()
core.element.dispatchEvent(new CustomEvent('click'))