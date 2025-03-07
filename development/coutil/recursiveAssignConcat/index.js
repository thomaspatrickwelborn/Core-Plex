import typeOf from '../typeOf/index.js'
export default function recursiveAssignConcat() {
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
      if(['array', 'object'].includes(typeOfSourcePropertyValue)) {
        if(typeOfTargetPropertyValue === 'array') {
          $target[$sourcePropertyKey] = $target[$sourcePropertyKey].concat($sourcePropertyValue)
        }
        else {
          $target[$sourcePropertyKey] = recursiveAssignConcat(
            $target[$sourcePropertyKey], $sourcePropertyValue
          )
        }
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue
      }
    }
  }
  return $target
}