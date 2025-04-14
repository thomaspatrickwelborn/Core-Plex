import typedObjectLiteral from '../typed-object-literal/index.js'
function createSubtarget($sourceValue, $path) {
  const subpaths = $path.split('.')
  let subpathIndex = 0
  const subtarget = {}
  let subtargetTerminal = subtarget
  for(const $subpath of subpaths) {
    if(subpathIndex === subpaths.length - 1) {
      if($sourceValue && typeof $sourceValue === 'object') {
        subtargetTerminal[$subpath] = expandTree($sourceValue, $path)
      }
      else {
        subtargetTerminal[$subpath] = $sourceValue
      }
    }
    else {
      subtargetTerminal[$subpath] = {}
      subtargetTerminal = subtargetTerminal[$subpath]
    }
    subpathIndex++
  }
  return subtarget
}

function expandTree($source, $path) {
  const target = {}
  const typeofSource = typeof $source
  const typeofPath = typeof $path
  if($source && typeofSource === 'object') {
    for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
      if(typeofPath === 'function') {
        $path(target, $sourceKey, $sourceValue)
      }
      else {
        const subtarget = createSubtarget($sourceValue, $path)
        target[$sourceKey] = subtarget
      }
    }
  }
  else {
    Object.assign(target, createSubtarget($source, $path))
  }
  return target
}

export default expandTree

