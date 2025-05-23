import typeOf from '../type-of/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
import recursiveGetOwnPropertyDescriptors from '../recursive-get-own-property-descriptors/index.js'
export default function recursiveGetOwnPropertyDescriptor($properties, $propertyKey) {
  const propertyDescriptor = Object.getOwnPropertyDescriptor($properties, $propertyKey)
  if(['array', 'object'].includes(typeOf(propertyDescriptor.value))) {
    propertyDescriptor.value = recursiveGetOwnPropertyDescriptors(propertyDescriptor.value)
  }
  return propertyDescriptor
}