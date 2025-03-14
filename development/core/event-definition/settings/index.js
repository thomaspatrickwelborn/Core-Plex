import { recursiveAssign, recursiveFreeze } from '../../../coutil/index.js'
export default ($settings = {}) => {
  const Settings = {
    propertyDirectory: { maxDepth: 10 },
    enable: false,
    accessors: [
      ($target, $property) => $target[$property],
      ($target, $property) => $target?.get($property),
    ],
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
          return $target['emit']($arguments)
        },
        send: function($target, $data) {
          return $target['send']($data)
        },
      },
    }
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
      case 'type': case 'path': case 'enable': 
      case 'target': case 'listener': 
      case 'assign': case 'deassign': case 'transsign': 
      // default: 
        Settings[$settingKey] = $settingValue
        break
    }
  }
  return Settings
}