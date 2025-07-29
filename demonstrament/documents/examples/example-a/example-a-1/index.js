console.log(
  "\n", "------------",
  "\n", "Example A.1.",
  "\n", "------------",
)
import Core from '/dependencies/core-plex.js'
import { Recourse } from '/dependencies/recourse.js'
const completed = {
  appClick: [],
  menuButtonClick: [],
  sectionButtonClick: [],
}
const app = {
  parentElement: document.querySelector('body'),
  template: `
    <app>
      <nav class="menu">
        <button data-id="menu-a">Menu A</button>
        <button data-id="menu-b">Menu B</button>
        <button data-id="menu-c">Menu C</button>
      </nav>
      <nav class="section">
        <button data-id="section-a">Section A</button>
        <button data-id="section-b">Section B</button>
        <button data-id="section-c">Section C</button>
      </nav>
    </app>
  `,
  qs: Object.defineProperties({}, {
    app: { get() { return document.querySelector('app') }, enumerable: true },
    menuButton: { get() { return document.querySelectorAll('app > nav.menu > button') }, enumerable: true },
    sectionButton: { get() { return document.querySelectorAll('app > nav.section > button') }, enumerable: true },
  }),
  render: function() {
    const app = this.qs.app
    this.disableEvents()
    if(app) app.removeChild()
    this.parentElement.insertAdjacentHTML('afterbegin', this.template)
    this.enableEvents()
    return this
  }
}
Core.implement(app, {
  enableEvents: true,
  events: {
    'qs.app click': function appClick($event) {
      console.log("appClick", $event)
      completed.appClick.push($event)
     },
    'qs.menuButton.[0-9] click': function menuButtonClick($event) {
      console.log("menuButtonClick", $event)
      completed.menuButtonClick.push($event)
    },
    'qs.sectionButton.[0-9] click': function sectionButtonClick($event) {
      console.log("sectionButtonClick", $event)
      completed.sectionButtonClick.push($event)
    },
  },
})
app.render()
app
.getEvents()
.forEach(($eventDefinition) => {
  $eventDefinition.emit(new CustomEvent('click'))
})
console.log(`appClick`, completed.appClick.length, completed.appClick)
console.log(`menuButtonClick`, completed.menuButtonClick.length, completed.menuButtonClick)
console.log(`sectionButtonClick`, completed.sectionButtonClick.length, completed.sectionButtonClick)
console.log("pass", (
  completed.appClick.length === 1 &&
  completed.menuButtonClick.length === 3 &&
  completed.sectionButtonClick.length === 3
))