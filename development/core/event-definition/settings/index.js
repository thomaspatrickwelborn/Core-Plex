import { recursiveAssign } from '../../../coutil/index.js'
export default ($settings = {}) => {
  const Settings = {
    propertyDirectory: { maxDepth: 10 },
    enable: false,
    accessors: [
      ($target, $property) => $target[$property],
    ],
    assign: 'addEventListener', deassign: 'removeEventListener', transsign: 'dispatchEvent',
    bindListener: true,
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
      transsign: {
        // Event Target Dispatch Event
        dispatchEvent: function dispatchEvent($eventDefinition, $target, $event) {
          return $target['dispatchEvent']($event)
        },
        // Event Emitter Emit
        emit: function emit($eventDefinition, $target, $type, ...$arguments) {
          return $target['emit']($type, ...$arguments)
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
        Settings[$settingKey] = Settings[$settingKey].concat($settingValue)
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