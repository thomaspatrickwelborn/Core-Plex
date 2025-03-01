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
console.log("body", body)
body.addPropertyClasses([{
  name: 'subelements',
  names: {
    monople: { formal: 'Subelements', nonformal: 'subelement' },
    multiple: { formal: 'Subelementss', nonformal: 'subelements' },
    minister: {
      ad: { formal: "Add", nonformal: "add" },
      dead: { formal: "Remove", nonformal: "remove" },
    },
  },
  states: {
    instate: function instate($propertyClass, $property, $value) {
      const { core } = $propertyClass
      const subelement = document.createElement($value)
      core.element.appendChild(subelement)
      return subelement
    },
    deinstate: function deinstate($propertyClass, $property) {
      const { core, name } = $propertyClass
      const subelement = core[name][$property]
      return subelement.parentElement.removeChild(subelement)
    },
  },
  definition: { object: 'Array' },
}])
body.subelements.push('header', 'main', 'section')