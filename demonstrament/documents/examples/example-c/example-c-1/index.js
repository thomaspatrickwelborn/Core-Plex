console.log(
  "\n", "------------",
  "\n", "Example C.1.",
  "\n", "------------",
)
import { Core } from '/dependencies/core-plex.js'
function eventLog($event) { console.log($event.type, $event.detail) }
class CustomCore extends Core {
  static events = {
    'eventTarget customEvent': eventLog
  }
  eventTarget = new EventTarget()
  constructor() {
    super({
      events: CustomCore.events
    })
  }
}
const customCore = new CustomCore()
customCore.enableEvents()
customCore.eventTarget.dispatchEvent(
  new CustomEvent('customEvent', { detail: true })
)