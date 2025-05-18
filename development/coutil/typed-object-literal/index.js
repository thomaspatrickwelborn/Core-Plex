import typeOf from '../type-of/index.js'
export default function typedObjectLiteral($value) {
  let _typedObjectLiteral
  const typeOfValue = typeOf($value)
  if(typeOfValue === 'object') { _typedObjectLiteral = {} }
  else if(typeOfValue === 'array') { _typedObjectLiteral = [] }
  else if(typeOfValue === 'string') {
    if($value?.toLowerCase() === 'object') { _typedObjectLiteral = {} }
    else if($value?.toLowerCase() === 'array') { _typedObjectLiteral = [] }
  }
  else { _typedObjectLiteral = undefined }
  return _typedObjectLiteral
}