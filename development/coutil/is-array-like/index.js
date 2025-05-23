import typeOf from '../type-of/index.js'
export default ($source) => {
  let isArrayLike
  const typeOfSource = typeOf($source)
  if(typeOfSource === 'array') { isArrayLike = true }
  else if(
    typeOfSource === 'object' &&
    Number.isInteger($source.length) && $source.length >= 0
  ) {
    iterateSourceKeys: 
    for(const $sourceKey of Object.keys(
      Object.getOwnPropertyDescriptors($source)
    )) {
      if($sourceKey === 'length') { continue iterateSourceKeys }
      isArrayLike = !isNaN($sourceKey)
      if(!isArrayLike) { break iterateSourceKeys }
    }
  }
  else { isArrayLike = false }
  return isArrayLike
}