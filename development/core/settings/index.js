export default ($settings = {}) => {
  const Settings = {
    events: {},
    enableEvents: false,
    propertyDefinitions: {
      getEvents: 'getEvents',
      addEvents: 'addEvents',
      removeEvents: 'removeEvents',
      enableEvents: 'enableEvents',
      disableEvents: 'disableEvents',
      reenableEvents: 'reenableEvents',
    },
    assign: 'addEventListener', 
    deassign: 'removeEventListener', 
    transsign: 'dispatchEvent',
  }
  for(const [$settingKey, $settingValue] of Object.entries($settings)) {
    switch($settingKey) {
      case 'enableEvents': 
      case 'assign': case 'deassign': case 'transsign': 
      case 'events': 
      // default: 
        Settings[$settingKey] = $settingValue
        break
      case 'propertyDefinitions':
        Settings[$settingKey] = Object.assign(Settings[$settingKey], $settingValue)
        break
    }
  }
  return Settings
}