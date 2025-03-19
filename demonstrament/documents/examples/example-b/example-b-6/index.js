import { Core } from '/dependencies/core-plex.js'
const application = {
  parentElement: document.querySelector('body'),
  templates: {
    application: ($content) => `
      <app>
        <header>
          <h1>${$content.headline}</h1>
          ${$content.nav.map(($nav) => `
            <nav class="${$nav.class}">
              ${$nav.button.map(($button) => `
                <button
                  data-id="${$button.id}"
                  data-active="${$button.active}"
                >${$button.text}</button>
              `).join('\n')}
            </nav>
          `).join('\n')}
        </header>
        <main>
          ${$content.section.map(($section) => `
            <section
              data-id="${$section.id}"
              data-active="${$section.active}"
            >${$section.text}</section>
          `).join('\n')}
        </main>
      </app>
    `,
    style: () => `
      <style>
        * { box-sizing: border-box; }
        body { width: 100%; height: 100%; }
        app {
          display: flex; flex-direction: column; 
          header {
            nav.section-nav {
              button {
                &[data-active="true"] {
                  border: 2px solid black; 
                }
                &[data-active="false"] {
                  border: none; 
                }
              }
            }
          }
          main {
            display: flex; flex-direction: column; 
            section {
              &[data-active="false"] { display: none; }
            }
          }
        }
      </style>
    `
  },
  qs: Object.defineProperties({}, {
    app: { enumerable: true, get() { return document.querySelector('app') }, enumerable: true },
    sectionNavButton: { enumerable: true, get() { return document.querySelectorAll('app > header > nav.section-nav > button') } },
    section: { enumerable: true, get() { return document.querySelectorAll('app > main > section') } },
    style: { get() { return document.querySelector('style') }, enumerable: true },
  }),
  render: function($content) {
    const app = this.qs.app
    const style = this.qs.style
    if(app) app.removeChild()
    if(style) style.removeChild()
    this.disableEvents()
    this.parentElement.insertAdjacentHTML('afterbegin', [
      this.templates.application($content),
      this.templates.style(),
    ].join('\n'))
    this.enableEvents()
    return this
  },
}
Core.implement(application, {
  events: {
    'qs.sectionNavButton.[0-9] click': function($event) {
      const selectSectionNavButton = $event.currentTarget
      const selectSectionID = selectSectionNavButton.getAttribute('data-id')
      const collectSectionNavButton = this.qs.sectionNavButton
      for(const $sectionNavButton of collectSectionNavButton) {
        if($sectionNavButton === selectSectionNavButton) {
          $sectionNavButton.setAttribute('data-active', 'true')
        }
        else {
          $sectionNavButton.setAttribute('data-active', 'false')
        }
      }
      for(const $section of this.qs.section) {
        const sectionID = $section.getAttribute('data-id')
        if(sectionID === selectSectionID) {
          $section.setAttribute('data-active', true)
        }
        else {
          $section.setAttribute('data-active', false)
        }
      }
    }
  }
})
.render({
  headline: 'Example A.6.',
  nav: [{
    class: 'section-nav',
    button: [
      { id: 'section-a', text: 'Section A', active: true },
      { id: 'section-b', text: 'Section B', active: false },
      { id: 'section-c', text: 'Section C', active: false },
      { id: 'section-d', text: 'Section D', active: false },
      { id: 'section-e', text: 'Section E', active: false }
    ],
  }],
  section: [
    { id: 'section-a', text: 'Section A', active: true },
    { id: 'section-b', text: 'Section B', active: false },
    { id: 'section-c', text: 'Section C', active: false },
    { id: 'section-d', text: 'Section D', active: false },
    { id: 'section-e', text: 'Section E', active: false }
  ], 
})
