import typeOf from '../type-of/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
import recursiveDefineProperties from '../recursive-define-properties'
import isArrayLike from '../is-array-like/index.js'
export default function recursiveDefineProperty($target, $propertyKey, $propertyDescriptor) {
  const typeOfPropertyValue = typeOf($propertyDescriptor.value)
  if(['array', 'object'].includes(typeOfPropertyValue)) {
    const propertyValue = isArrayLike(Object.defineProperties(
      typedObjectLiteral(typeOfPropertyValue), $propertyDescriptor.value
    )) ? [] : {}
    $propertyDescriptor.value = recursiveDefineProperties(propertyValue, $propertyDescriptor.value)
  }
  Object.defineProperty($target, $propertyKey, $propertyDescriptor)
  return $target
}