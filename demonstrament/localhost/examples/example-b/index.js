import { Core } from '/dependencies/core-plex.js';

function listenerLogA() { console.log('listenerLogA', $event.type, $event.detail); }
function listenerLogB() { console.log('listenerLogB', $event.type, $event.detail); }
const events = {
  'application:eventA': listenerLogA,
  'propertyA.propertyB application:eventB': listenerLogB,
  'propertyD.[0-9].propertyE application:eventB': listenerLogB,
};
const application = Object.assign(new Core(), {
  propertyA: Object.assign(new EventTarget(), {
    propertyB: Object.assign(new EventTarget(), {
      propertyC: 3
    })
  }),
  propertyD: [
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: 6
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: '6'
      })
    }),
    Object.assign(new EventTarget(), {
      propertyE: Object.assign(new EventTarget(), {
        propertyF: null
      })
    })
  ],
  propertyG: 7,
})
.addEvents(events);

const consoleLog = ($eventDefinition) => console.log(
  `> ${$eventDefinition.path}    ${$eventDefinition.type}    ${$eventDefinition.enable}`
);

console.log('#####');
console.log('Get All Events');
console.log(`application.getEvents()`);
console.log('-----');
application.getEvents().forEach(consoleLog);

console.log('#####');
console.log('Get Filtered Events');
console.log('Get Events By `type`');
console.log(`application.getEvents({
  type: 'application:eventA',
})`);
console.log('-----');
application.getEvents({
  type: 'application:eventA',
}).forEach(consoleLog);

console.log('#####');
console.log('Get Events By `path` With `:scope`');
console.log(`application.getEvents({
  path: ':scope',
})`);
console.log('-----');
application.getEvents({
  path: ':scope',
}).forEach(consoleLog);

console.log('#####');
console.log('Get Events By `path` With Property Path');
console.log(
  `application.getEvents({
    path: 'propertyA.propertyB',
  })`
);
console.log('-----');
application.getEvents({
  path: 'propertyA.propertyB',
}).forEach(consoleLog);

console.log('#####');
console.log('Get Events By Multiple Filter Object Properties');
console.log(`application.getEvents({
  type: 'application:eventB',
  listener: listenerLogB,
})`);
console.log('-----');
application.getEvents({
  type: 'application:eventB',
  listener: listenerLogB,
}).forEach(consoleLog);

console.log('#####');
console.log('Get Events By Multiple Filter Objects');
console.log([
  `application.getEvents([
    { listener: listenerLogA },
    { listener: listenerLogB },
  ])`,
]);
console.log('-----');
application.getEvents([
  { listener: listenerLogA },
  { listener: listenerLogB },
]).forEach(consoleLog);

console.log('#####');
console.log('`core.enableEvents`/`core.disableEvents` Methods');
console.log('Enable/Disable All Events');
console.log(`application.enableEvents()`);
console.log('-----');
application.enableEvents();
application.getEvents({ enable: true }).forEach(consoleLog);

console.log('#####');
console.log(`application.disableEvents()`);
application.disableEvents();
console.log('-----');
application.getEvents({ enable: false }).forEach(consoleLog);

console.log('#####');
console.log('Enable/Disable Some Events');
console.log(`application.enableEvents({
  path: 'propertyA.propertyB'
})`);
application.enableEvents({
  path: 'propertyA.propertyB'
});
console.log('-----');
application.getEvents({ path: 'propertyA.propertyB' }).forEach(consoleLog);

console.log('#####');
console.log(`application.disableEvents({
  type: 'application:eventA'
})`);
application.disableEvents({
  type: 'application:eventA'
});
console.log('-----');
application.getEvents({ path: 'propertyA.propertyB' }).forEach(consoleLog);

console.log('#####');
console.log(`application.enableEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
])`);

application.enableEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
]);
console.log('-----');
application.getEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
]).forEach(consoleLog);

console.log('#####');
console.log('`core.removeEvents` Method');
console.log('Remove All Events');
console.log(`application.removeEvents()`);
application.removeEvents();
console.log('-----');
console.log(
  '\n', `application.getEvents().length === 0`,
  '\n', `${application.getEvents().length} === ${0}`, 
  '\n', application.getEvents().length === 0,
);

application.addEvents(events);

console.log('#####');
console.log('Remove Some Events');
console.log(`application.removeEvents({
  path: 'propertyA.propertyB'
})`);
application.removeEvents({
  path: 'propertyA.propertyB'
});
console.log('-----');
application.getEvents().forEach(consoleLog);

console.log('#####');
console.log('Remove Some More Events');
console.log(`application.removeEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
])`);
application.removeEvents([
  { path: ':scope' },
  { path: 'propertyD.[0-9].propertyE' },
]);
console.log('-----');
console.log(
  '\n', `application.getEvents().length === 0`,
  '\n', `${application.getEvents().length} === ${0}`, 
  '\n', application.getEvents().length === 0,
);
//# sourceMappingURL=index.js.map
