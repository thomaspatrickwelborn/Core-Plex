import { Core } from '/dependencies/core-plex.js'
const core = new Core({
  events: {
    "element click": function elementClick($event) {
      console.log($event.type, $event.currentTarget)
    }
  },
})
core.element = document.querySelector('body')
core.enableEvents()
core.element.dispatchEvent(new CustomEvent('click'))
core.disableEvents()
core.element.dispatchEvent(new CustomEvent('click'))
core.enableEvents()
core.element.dispatchEvent(new CustomEvent('click'))
core.disableEvents()
core.element.dispatchEvent(new CustomEvent('click'))

class CustomCore extends Core {
  constructor() {
    super(...arguments)
    this.enableEvents()
  }
  get element() { return document.querySelector('body') }
}
const customCore = new CustomCore({
  events: {
    "element click": function elementClick($event) {
      console.log($event.type, $event.currentTarget)
    }
  }
})