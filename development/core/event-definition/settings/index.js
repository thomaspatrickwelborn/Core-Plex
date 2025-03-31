import { accessors, recursiveAssign, typeOf } from '../../../coutil/index.js'
export default ($settings = {}) => {
  const Settings = {
    enable: false,
    accessors: [accessors.default],
    propertyDirectory: { scopeKey: ':scope', maxDepth: 10 },
    assign: 'addEventListener', deassign: 'removeEventListener',
    bindListener: true,
    scopeKey: ':scope',
    methods: {
      assign: {
        // Event Target Add Event Listener
        addEventListener: function addEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition
          const { options, useCapture } = settings
          return $target['addEventListener'](type, listener, options || useCapture)
        },
        // Event Emitter On
        on: function on($eventDefinition, $target) {
          const { type, listener } = $eventDefinition
          return $target['on'](type, listener)
        },
        // Event Emitter Once
        once: function once($eventDefinition, $target) {
          const { type, listener } = $eventDefinition
          return $target['once'](type, listener)
        },
      },  
      deassign: {
        // Event Target Remove Event Listener
        removeEventListener: function removeEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition
          const { options, useCapture } = settings
          return $target['removeEventListener'](type, listener, options || useCapture)
        },
        // Event Emitter Off
        off: function off($eventDefinition, $target) {
          const { type, listener } = $eventDefinition
          return $target['off'](type, listener)
        },
      },
    },
  }
  for(const [$settingKey, $settingValue] of Object.entries($settings)) {
    switch($settingKey) {
      case 'propertyDirectory':
        Settings[$settingKey] = Object.assign(Settings[$settingKey], $settingValue)
        break
      case 'accessors':
        Settings[$settingKey] = $settingValue
        Settings.propertyDirectory[$settingKey] = $settingValue
        break
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