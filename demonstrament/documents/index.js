// import './examples/example-a/index.js'
import { Coutil } from '/dependencies/core-plex.js'
const { recursiveAssign, recursiveAssignConcat } = Coutil

const objectA = {
  propertyA: {
    propertyB: {
      propertyC: "propertyC"
    }
  },
  propertyM: ["propertyM0", "propertyM1", "propertyM2"],
  propertyN: {
    propertyO: {
      propertyP: ["propertyP0", "propertyP1",]
    }
  },
}
const objectB = {
  propertyA: {
    propertyB: {
      propertyD: "propertyD"
    }
  },
  propertyE: {
    propertyF: {
      propertyG: "propertyG"
    }
  },
  propertyM: ["propertyM3", "propertyM4", "propertyM5", "propertyM6"],
  propertyN: {
    propertyO: {
      propertyP: ["propertyP2", "propertyP3", "propertyP4"]
    }
  },
}
const objectC = {
  propertyA: {
    propertyB: {
      propertyH: "propertyH"
    }
  },
  propertyE: {
    propertyF: {
      propertyI: "propertyI"
    }
  },
  propertyJ: {
    propertyK: {
      propertyL: "propertyL"
    }
  }
}
const recursiveAssignAll = recursiveAssign({}, objectA, objectB, objectC)
const recursiveAssignConcatAll = recursiveAssignConcat({}, objectA, objectB, objectC)
console.log('-----')
console.log("objectA", objectA)
console.log("objectB", objectB)
console.log("objectC", objectC)
console.log("recursiveAssignAll", recursiveAssignAll)
console.log("recursiveAssignConcatAll", recursiveAssignConcatAll)