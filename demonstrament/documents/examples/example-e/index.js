import { Core, Coutil } from '/dependencies/core-plex.js'
const { recursiveAssignConcat } = Coutil

class Body extends Core {
  static propertyClasses = [{
    Name: 'element',
    Names: {
      Monople: { Formal: 'Element', Nonformal: 'element' },
    },
    Events: {
      Assign: 'addEventListener',
      Deassign: 'removeEventListener',
      TargetAccessors: ['[]'],
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {
        console.log(document.querySelector('body'))
        return document.querySelector('body')
      },
      Deinstate: function Deinstate($propertyClass, $property) {},
    },
    Definition: {}
  }, {
    Name: 'elements',
    Names: {
      Monople: { Formal: 'Element' , Nonformal: 'element' },
      Multiple: { Formal: 'Elements' , Nonformal: 'elements' },
      Minister: {
        Ad: { Formal: 'Add', Nonformal: 'add' },
        Dead: { Formal: 'Remove', Nonformal: 'remove' },
      },
    },
    Events: {
      Assign: 'addEventListener',
      Deassign: 'removeEventListener',
      TargetAccessors: ['[]'],
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {
        const { core, Name } = $propertyClass
        const element = document.createElement($value)
        core.element.appendChild(element)
        return element
      },
      Deinstate: function Deinstate($propertyClass, $property) {
        const { core, Name } = $propertyClass
        const element = core[Name][$property]
        core.element.removeChild(element)
        return core[Name][$property]
      },
    },
    Definition: {
      Object: 'Object'
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