export default () => Object.assign(new EventTarget(), {
  some: {
    property: {
      path: new EventTarget(),
    },
    array: [
      new EventTarget(),
      new EventTarget(),
      new EventTarget(),
      new EventTarget(),
    ]
  }
})