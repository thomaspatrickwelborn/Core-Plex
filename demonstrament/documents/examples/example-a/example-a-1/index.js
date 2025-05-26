console.log(
  "\n", "------------",
  "\n", "Example A.1.",
  "\n", "------------",
)
import Core from '/dependencies/core-plex.js'
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
  events: {
    'qs.app click': function appClick($event) {
      console.log($event.type, $event.currentTarget.tagName)
     },
    'qs.menuButton.[0-9] click': function menuButtonClick($event) {
      console.log($event.type, $event.currentTarget.innerText)
    },
    'qs.sectionButton.[0-9] click': function sectionButtonClick($event) {
      console.log($event.type, $event.currentTarget.innerText)
    },
  },
})
.render()
app
.getEvents()
.forEach(($eventDefinition) => $eventDefinition.emit(
  new CustomEvent('click')
))