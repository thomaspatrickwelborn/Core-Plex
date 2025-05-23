import typeOf from '../type-of/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
import recursiveDefineProperties from '../recursive-define-properties'
export default function recursiveDefineProperty($target, $property, $propertyDescriptor) {
  if(['array', 'object'].includes(typeOf($propertyDescriptor.value))) {
    $target[$propertyKey] = recursiveDefineProperties(typedObjectLiteral($propertyDescriptor.value), $propertyDescriptor)
  }
  else {
    Object.defineProperty($target, $propertyKey, $propertyDescriptor)
  }
  return $target
}