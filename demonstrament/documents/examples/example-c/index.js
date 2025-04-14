import { Coutil } from '/dependencies/core-plex.js'
const {
  expandTree, isPropertyDefinition, typedObjectLiteral, typeOf, variables
} = Coutil
const expandedTree = expandTree({
  propertyA: {
    propertyB: {
      propertyC: Number,
      propertyH: null,
    }
  },
  propertyD: [
    [{
      propertyE: Number,
      propertyF: Boolean,
    }],
  ],
  propertyG: String
}, 'type.value')

console.log("expandedTree", expandedTree)