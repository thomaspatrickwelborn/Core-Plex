import { Core, Coutil } from '/dependencies/core-plex.js'
const { recursiveAssignConcat } = Coutil

class Body extends Core {
  static propertyClasses = [{
    name: 'element',
    names: {
      monople: { formal: 'Element', nonformal: 'element' },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {
        console.log(document.querySelector('body'))
        return document.querySelector('body')
      },
      deinstate: function deinstate($propertyClass, $property) {},
    },
    definition: {}
  }, {
    name: 'elements',
    names: {
      monople: { formal: 'Element' , nonformal: 'element' },
      multiple: { formal: 'Elements' , nonformal: 'elements' },
      minister: {
        ad: { formal: 'Add', nonformal: 'add' },
        dead: { formal: 'Remove', nonformal: 'remove' },
      },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {
        const { core, name } = $propertyClass
        const element = document.createElement($value)
        core.element.appendChild(element)
        return element
      },
      deinstate: function deinstate($propertyClass, $property) {
        const { core, name } = $propertyClass
        const element = core[name][$property]
        core.element.removeChild(element)
        return core[name][$property]
      },
    },
    definition: {
      object: 'Object'
    },
  }]
  static events = [{
    path: 'elements.*',
    type: 'click',
    listener: function($event) { console.log($event.type, $event.currentTarget) },
  }]
  constructor($settings, $options) {
    super(recursiveAssignConcat({
      propertyClasses: Body.propertyClasses,
      events: Body.events,
    }, $settings), $options)
  }
}
const body = new Body({
  element: 'body'
})
body.elements["division"] = "div"
body.elements["section"] = "section"
body.enableEvents()
body.elements.division.dispatchEvent(new CustomEvent('click'))
body.elements.section.dispatchEvent(new CustomEvent('click'))
console.log('body', body)
console.log('body.elements.division', body.elements.division)
console.log('body.elements.section', body.elements.section)
body.disableEvents()
body.elements.division.dispatchEvent(new CustomEvent('click'))
body.elements.section.dispatchEvent(new CustomEvent('click'))
body.enableEvents()
body.elements.division.dispatchEvent(new CustomEvent('click'))
body.elements.section.dispatchEvent(new CustomEvent('click'))