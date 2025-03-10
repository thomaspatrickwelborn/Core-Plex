import typeOf from '../typeOf/index.js'
export default function recursiveAssign() {
  const $arguments = [...arguments]
  const $target = $arguments.shift()
  if(!$target) { return $target }
  const $sources = $arguments
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue)
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey])
      let target
      if(typeOfTargetPropertyValue === 'undefined') {
        if(typeOfSourcePropertyValue === 'array') { target = [] }
        else if(typeOfSourcePropertyValue === 'object') { target = {} }
      }
      else { target = $target[$sourcePropertyKey] }
      if(['array', 'object'].includes(typeOfSourcePropertyValue)) {
        $target[$sourcePropertyKey] = recursiveAssign(
          target, $sourcePropertyValue
        )
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue
      }
    }
  }
  return $target
}