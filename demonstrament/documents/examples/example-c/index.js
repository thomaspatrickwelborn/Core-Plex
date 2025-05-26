import { expandTree } from '/dependencies/recourse.js'
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