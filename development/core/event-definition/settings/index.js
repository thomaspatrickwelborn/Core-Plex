export default {
  propertyDirectory: {
    maxDepth: 10,
  },
  path: ':scope',
  enable: false,
  accessors: ['[]', 'get'],
  accessors: [
    ($target, $property) => $target[$property],
    ($target, $property) => $target?.get($property),
  ],
  target: undefined,
  assign: 'addEventListener',
  deassign: 'removeEventListener',
  methods: {
    assign: {
      addEventListener: function($target) {
        const { type, listener, settings } = this
        const { options, useCapture } = settings
        return $target['addEventListener'](type, listener, options || useCapture)
      },
      on: function($target) {
        const { type, listener, settings } = this
        return $target['on'](type, listener)
      },
      once: function($target) {
        const { type, listener } = this
        return $target['once'](type, listener)
      },
    },  
    deassign: {
      removeEventListener: function($target) {
        const { type, listener, settings } = this
        const { options, useCapture } = settings
        return $target['removeEventListener'](type, listener, options || useCapture)
      },
      off: function($target) {
        const { type, listener } = this
        return $target['off'](type, listener)
      },
    },
  },
}