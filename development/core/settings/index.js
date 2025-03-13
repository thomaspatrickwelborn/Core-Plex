import { recursiveFreeze } from '../../coutil/index.js'
export default recursiveFreeze({
  events: {},
  enableEvents: false,
  propertyDefinitions: {
    getEvents: 'getEvents',
    addEvents: 'addEvents',
    removeEvents: 'removeEvents',
    enableEvents: 'enableEvents',
    disableEvents: 'disableEvents',
    reenableEvents: 'reenableEvents',
  },
  assign: 'addEventListener', 
  deassign: 'removeEventListener', 
  transsign: 'dispatchEvent',
})