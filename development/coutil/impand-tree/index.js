import * as Variables from '../variables/index.js'
import * as Path from '../path/index.js'
import * as Tree from '../tree/index.js'
import typeOf from '../type-of/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
export default function impandTree($source, $property) {
  const typeOfProperty = typeOf($property)
  const typeOfSource = typeOf($source)
  if(
    !['string', 'function'].includes(typeOfProperty) ||
    !['array', 'object'].includes(typeOfSource)
  ) { return $source }
  let target = typedObjectLiteral($source)
  iterateSourceEntries: 
  for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
    if(typeOfProperty === 'string') { target[$sourceKey] = Tree.get($property, $sourceValue) }
    else if(typeOfProperty === 'function') { target[$sourceKey] = $property($sourceValue) }
    if(target[$sourceKey] && typeof target[$sourceKey] === 'object') {
      target[$sourceKey] = impandTree(target[$sourceKey], $property)
    }
  }
  return target
}