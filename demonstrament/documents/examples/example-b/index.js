import { Core } from '/dependencies/core-plex.js'
class CustomCore extends Core {
  constructor() {
    super(...arguments)
    this.enableEvents()
  }
  get element() { return document.querySelector('body') }
}
const customCore = new CustomCore({
  events: {
    "element click": function elementClick($event) { console.log($event.type) }
  }
})
customCore.element.dispatchEvent(new CustomEvent('click', { detail: customCore }))