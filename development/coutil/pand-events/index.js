function impandEvents($propEvents) {
  if(!Array.isArray($propEvents)) { return $propEvents }
  const propEvents = {}
  iteratePropEvents: 
  for(const $propEvent of $propEvents) {
    const { path, type, listener, options } = $propEvent
    const propEventSettings = `${$path} ${$type}`
    if(options !== undefined) {
      propEvents[propEventSettings] = [listener, options]
    }
    else {
      propEvents[propEventSettings] = listener
    }
  }
  return propEvents
}

function expandEvents($propEvents, $scopeKey = ':scope') {
  if(
    Array.isArray($propEvents) ||
    $propEvents === undefined
  ) { return $propEvents }
  const propEvents = []
  iteratePropEvents:
  for(const [
    $propEventSettings, $propEventListener
  ] of Object.entries($propEvents)) {
    const propEventSettings = $propEventSettings.trim().split(' ')
    let path, type, listener, options
    if(propEventSettings.length === 1) {
      path = $scopeKey
      type = propEventSettings[0]
    }
    else if(propEventSettings.length > 1) {
      path = propEventSettings[0]
      type = propEventSettings[1]
    }
    if(Array.isArray($propEventListener)) {
      listener = $propEventListener[0]
      options = $propEventListener[1]
    }
    else {
      listener = $propEventListener
    }
    const propEvent = {
      type,
      path,
      listener,
      enable: false,
    }
    propEvents.push(propEvent)
  }
  return propEvents
}

export { impandEvents, expandEvents }