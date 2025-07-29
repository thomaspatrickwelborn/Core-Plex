console.log(
  "\n", "------------",
  "\n", "Example A.6.",
  "\n", "------------",
)
import Core from '/dependencies/core-plex.js'
const completed = {
  '**CustomEvent': []
}
const application = Object.assign(new EventTarget(), {
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 333
    })
  }),
  propertyD: Object.assign(new EventTarget(), [
    Object.assign(new EventTarget(), {
      propertyF: Object.assign(new EventTarget(), {
        propertyG: 777
      })
    }),
    Object.assign(new EventTarget(), {
      propertyF: Object.assign(new EventTarget(), {
        propertyG: 777777
      })
    }),
    Object.assign(new EventTarget(), {
      propertyF: Object.assign(new EventTarget(), {
        propertyG: 777777777
      })
    })
  ])
})
Core.implement(application, {
  events: {
    '** customEvent': function($event) {
      console.log($event.type, $event.currentTarget)
      completed['**CustomEvent'].push($event)
     }
  },
  enableEvents: true, 
})

application
.getEvents()
.forEach(($eventDefinition) => {
  return $eventDefinition
  .assigned
  .forEach(($event) => {
    $event.target.dispatchEvent(new CustomEvent('customEvent'))
  })
})
console.log("pass", (completed['**CustomEvent'].length === 10))