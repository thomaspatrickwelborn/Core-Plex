import { recursiveFreeze } from '../../../coutil/index.js'
export default recursiveFreeze({
  propertyDirectory: {
    maxDepth: 10,
  },
  path: undefined,
  enable: false,
  accessors: ['[]', 'get'],
  accessors: [
    ($target, $property) => $target[$property],
    ($target, $property) => $target?.get($property),
  ],
  target: undefined,
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
    transsign: {
      dispatchEvent: function($target, $event) {
        return $target['dispatchEvent']($event)
      },
      emit: function($target, ...$arguments) {
        console.log()
        return $target['emit']($arguments)
      },
      send: function($target, $data) {
        return $target['send']($data)
      },
    },
  },
})