import accessors from '../accessors/index.js'
export default ($settings = {}) => {
  const Settings = {
    events: {},
    enableEvents: false,
    compandTree: {
      accessors: [accessors.default],
      scopeKey: ':scope', 
      maxDepth: 10,
    },
    propertyDefinitions: {
      getEvents: 'getEvents',
      addEvents: 'addEvents',
      removeEvents: 'removeEvents',
      enableEvents: 'enableEvents',
      disableEvents: 'disableEvents',
      reenableEvents: 'reenableEvents',
      emitEvents: 'emitEvents',
    },
  }
  iterateSettingEntries: 
  for(const [$settingKey, $settingValue] of Object.entries($settings)) {
    switch($settingKey) {
      case 'propertyDefinitions':
      case 'compandTree':
        Settings[$settingKey] = Object.assign(Settings[$settingKey], $settingValue)
        break
      default: 
        Settings[$settingKey] = $settingValue
        break
    }
  }
  return Settings
}