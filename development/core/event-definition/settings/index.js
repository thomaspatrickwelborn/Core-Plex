import { accessors, recursiveAssign, typeOf } from '../../../coutil/index.js'
export default ($settings = {}) => {
  const Settings = {
    enable: false,
    assign: 'addEventListener', deassign: 'removeEventListener', transsign: 'dispatchEvent',
    bindListener: true,
    errorLog: false,
    methods: {
      assign: {
        addEventListener: function addEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition
          const { options, useCapture } = settings
          return $target['addEventListener'](type, listener, options || useCapture)
        },
        on: function on($eventDefinition, $target) {
          const { type, listener } = $eventDefinition
          return $target['on'](type, listener)
        },
        once: function once($eventDefinition, $target) {
          const { type, listener } = $eventDefinition
          return $target['once'](type, listener)
        },
      }, 
      deassign: {
        removeEventListener: function removeEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition
          const { options, useCapture } = settings
          return $target['removeEventListener'](type, listener, options || useCapture)
        },
        off: function off($eventDefinition, $target) {
          const { type, listener } = $eventDefinition
          return $target['off'](type, listener)
        },
      },
      transsign: {
        dispatchEvent: function dispatchEvent($eventDefinition, $target, $event) {
          return $target['dispatchEvent']($event)
        },
        emit: function emit($eventDefinition, $target, $type, ...$arguments) {
          return $target['emit']($type, ...$arguments)
        },
      },
    },
  }
  for(const [$settingKey, $settingValue] of Object.entries($settings)) {
    switch($settingKey) {
      case 'methods': 
        Settings[$settingKey] = recursiveAssign(Settings[$settingKey], $settingValue)
        break
      case 'enableEvents': break
      default: 
        Settings[$settingKey] = $settingValue
        break
    }
  }
  return Settings
}