import recursiveGetOwnPropertyDescriptor from '../recursive-get-own-property-descriptor/index.js'
export default function recursiveGetOwnPropertyDescriptors($properties) {
  const propertyDescriptors = {}
  for(const $propertyKey of Object.keys(Object.getOwnPropertyDescriptors($properties))) {
    propertyDescriptors[$propertyKey] = recursiveGetOwnPropertyDescriptor($properties, $propertyKey)
  }
  return propertyDescriptors
}