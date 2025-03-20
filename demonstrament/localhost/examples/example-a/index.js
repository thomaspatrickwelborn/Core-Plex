import { Core } from '/dependencies/core-plex.js';

console.log(
  "\n", "------------",
  "\n", "Example A.1.",
  "\n", "------------",
);
const app$1 = {
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
    const app = this.qs.app;
    this.disableEvents();
    if(app) app.removeChild();
    this.parentElement.insertAdjacentHTML('afterbegin', this.template);
    this.enableEvents();
    return this
  }
};
Core.implement(app$1, {
  events: {
    'qs.app click': function appClick($event) {
      console.log($event.type, $event.currentTarget.tagName);
     },
    'qs.menuButton.[0-9] click': function menuButtonClick($event) {
      console.log($event.type, $event.currentTarget.innerText);
    },
    'qs.sectionButton.[0-9] click': function sectionButtonClick($event) {
      console.log($event.type, $event.currentTarget.innerText);
    },
  },
})
.render();
app$1
.getEvents()
.forEach(($eventDefinition) => $eventDefinition.emit(
  new CustomEvent('click')
));

console.log(
  "\n", "----------------------",
  "\n", "Example A.3. (Browser)",
  "\n", "----------------------",
);
const app = Core.implement(Object.assign(new EventTarget(), {
  propertyA: new EventTarget(),
  propertyB: {
    propertyC: {
      propertyD: new EventTarget(),
    }
  },
  propertyE: [{
    propertyF: new EventTarget()
  }, {
    propertyF: new EventTarget()
  }, {
    propertyF: new EventTarget()
  }]
}), {
  events: {
    'customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyA customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyB.propertyC.propertyD customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyE.[0-9].propertyF customEvent': ($event) => console.log($event.type, $event.detail),
  },
  enableEvents: true
});
for(const $eventDefinition of app.getEvents([
  { path: ':scope' },
  { path: 'propertyA' },
  { path: 'propertyB.propertyC.propertyD' },
  { path: 'propertyB.propertyC.propertyE' },
  { path: 'propertyE.[0-9].propertyF' },
])) {
  $eventDefinition.emit(
    new CustomEvent('customEvent', { detail: $eventDefinition })
  );
}

console.log(
  "\n", "------------",
  "\n", "Example A.4.",
  "\n", "------------",
);
class CustomCore extends Core {
  constructor($settings, $properties = {}) {
    super($settings);
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries($properties)) {
      if($propertyValue && typeof $propertyValue === 'object') {
        Object.assign({}, {
          defineProperties: $settings.defineProperties
        });
        Object.defineProperty(this, $propertyKey, {
          enumerable: true, writable: false,
          value: new CustomCore({}, $propertyValue),
        });
      }
      else {
        Object.defineProperty(this, $propertyKey, {
          enumerable: true, writable: false,
          value: $propertyValue,
        });
      }
    }
    if($settings.enableEvents === true) { this.enableEvents(); }
  }
}
const customCore = new CustomCore({
  events: {
    'propertyA customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyA.propertyB customEvent': ($event) => console.log($event.type, $event.detail),
    'propertyD.[0-9] customEvent': ($event) => console.log($event.type, $event.detail),
  },
  enableEvents: true,
}, {
  propertyA: {
    propertyB: {
      propertyC: 333
    }
  },
  propertyD: [{
    propertyE: 555
  }, {
    propertyF: 666
  }, {
    propertyE: 777
  }]
});
customCore.getEvents().forEach(
  ($eventDefinition) => $eventDefinition.emit(
    new CustomEvent('customEvent', { detail: $eventDefinition })
  )
);
//# sourceMappingURL=index.js.map
