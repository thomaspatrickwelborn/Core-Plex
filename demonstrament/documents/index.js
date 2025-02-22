import { Core, Coutil } from '/dependencies/core-plex.js'
const { pathkeyTree } = Coutil

const core = new Core({
  propertyClasses: [{
    Name: "body",
    Names: {
      Monople: { Formal: "Body", Nonformal: "body" },
    },
    Events: {
      Assign: "addEventListener", 
      Deassign: "removeEventListener", 
      TargetAccessors: ["[]", "get"],
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {
        return document.querySelector($value)
      },
      Deinstate: function Deinstate($propertyClass, $property) {
        const { core } = $propertyClass
        return  core[$property]
      },
    },
  }, {
    Name: "divisions",
    Names: {
      Multiple: { Formal: "Divisions", Nonformal: "divisions" },
      Minister: {
        Ad: { Formal: "Add", Nonformal: "add" },
        Dead: { Formal: "Remove", Nonformal: "remove" },
      },
    },
    Events: {
      Assign: "addEventListener", 
      Deassign: "removeEventListener", 
      TargetAccessors: ["[]", "get"],
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {
        return document.createElement($value)
      },
      Deinstate: function Deinstate($propertyClass, $property) {
        const { core } = $propertyClass
        return  core[$property]
      },
    },
    Definition: {
      Object: Object,
    }
  }],
  events: {
    'body click': function bodyClick($event) {
      console.log($event.type, $event)
      this.disableEvents()
    },
  }
}, { enableEvents: true })
core.body = 'body'
console.log(core)
core.divisions.divisionA = 'div'