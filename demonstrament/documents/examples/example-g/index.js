import { Core } from '/dependencies/core-plex.js'
const core = new Core({
  propertyClasses: [{
    // Element
    name: 'element',
    names: {
      monople: { formal: 'Element', nonformal: 'element' },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {
        return document.querySelector($value)
      },
      deinstate: function deinstate($propertyClass, $property) {},
    },
    definition: {},
  }, {
    // Elements
    name: 'elements',
    names: {
      multiple: { formal: 'Elements', nonformal: 'elements' },
      minister: {
        ad: { formal: 'Add', nonformal: 'add' },
        dead: { formal: 'Remove', nonformal: 'remove' },
      },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {
        const { core, name } = $propertyClass
        const element = document.createElement($value)
        document.querySelector('body').appendChild(element)
        return element
      },
      deinstate: function deinstate($propertyClass, $property) {
        const { core, name } = $propertyClass
        const element = core[name][$property]
        return element.parentElement.removeChild(element)
      },
    },
    definition: {
      object: "Object"
    }
  }],
  element: 'body',
  elements: {
    header: 'header',
    main: 'main',
    footer: 'footer',
  },
  events: {
    'elements.* click': function elementClick($event) {
      console.log($event.type, $event.target)
    }
  },
}, {
  enableEvents: true
})
console.log(core.getEvents({ path: 'elements.*' })[0])