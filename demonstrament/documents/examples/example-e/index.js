import { Core } from '/dependencies/core-plex.js'

class Body extends Core {
  static propertyClasses = [{
    Name: 'element',
    Names: {
      Monople: { Formal: 'Element', Nonformal: 'element' },
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {
        return document.querySelector('body')
      },
      Deinstate: function Deinstate($propertyClass, $property) {},
    },
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
  static events = []
  constructor($settings, $options) {
    super(...arguments)
    this.addPropertyClasses(Body.propertyClasses)
    this.addEvents(Body.events)
  }
}
const body = new Body()
console.log('body.element', body.element)