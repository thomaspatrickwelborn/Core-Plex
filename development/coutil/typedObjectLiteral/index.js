import typeOf from "../typeOf/index.js"
export default function typedObjectLiteral($object) {
  const typeOfObject = typeOf($object)
  if(
    typeOfObject === 'object' ||
    $object === Object
  ) { return {} }
  else if(
    typeOfObject === 'array' ||
    $object === Array
  ) { return [] }
  else if(typeOfObject === 'string') { return (
    $object === 'Object' ||
    $object === 'object'
  ) ? {} 
    : (
    $object === 'Array' ||
    $object === 'array'
  ) ? []
    : undefined
  }
  else { return undefined }
}