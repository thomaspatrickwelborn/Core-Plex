import recursiveDefineProperty from '../recursive-define-property/index.js'
export default function recursiveDefineProperties($target, $propertyDescriptors) {
  for(const [
    $propertyKey, $propertyDescriptor
  ] of Object.entries($propertyDescriptors)) {
    recursiveDefineProperty($target, $propertyKey, $propertyDescriptor)
  }
  return $target
}