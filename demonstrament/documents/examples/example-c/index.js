import { Core } from '/dependencies/core-plex.js'
const body = new Core({
  propertyClasses: [{
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
    definition: {}
  }],
  element: 'body',
})