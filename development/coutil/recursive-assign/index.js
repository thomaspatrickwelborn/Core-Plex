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
      if(typeOfTargetPropertyValue === 'undefined') {
        if(typeOfSourcePropertyValue === 'array') {
          $target[$sourcePropertyKey] = $sourcePropertyValue
        }
        else if(typeOfSourcePropertyValue === 'object') {
          $target[$sourcePropertyKey] = Object.assign({}, $sourcePropertyValue)
        }
        else {
          $target[$sourcePropertyKey] = $sourcePropertyValue
        }
      }
      else if(typeOfSourcePropertyValue === 'array') {
        $target[$sourcePropertyKey] = $sourcePropertyValue
      }
      else if(typeOfSourcePropertyValue === 'object') {
        $target[$sourcePropertyKey] = recursiveAssign(
          $target[$sourcePropertyKey], $sourcePropertyValue
        )
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue
      }
    }
  }
  return $target
}