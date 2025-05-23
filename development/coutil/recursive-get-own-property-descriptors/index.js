import typeOf from '../type-of/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
import recursiveGetOwnPropertyDescriptor from '../recursive-get-own-property-descriptor/index.js'
export default function recursiveGetOwnPropertyDescriptors($properties) {
  const propertyDescriptors = {}
  for(const $propertyKey of Object.keys($properties)) {
    propertyDescriptors[$propertyKey] = recursiveGetOwnPropertyDescriptor($properties, $propertyKey)
  }
  return propertyDescriptors
}