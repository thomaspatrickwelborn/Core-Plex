import typeOf from '../type-of/index.js'
export default function recursiveAssign($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey])
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue)
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = recursiveAssign($target[$sourcePropertyKey], $sourcePropertyValue)
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue
      }
    }
  }
  return $target
}