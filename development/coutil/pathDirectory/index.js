const Options = {
  depth: 0,
  maxDepth: 10,
}
export default function pathDirectory($object, $options) {
  const target = []
  const options = Object.assign({}, Options, $options)
  options.depth++
  if(options.depth > options.maxDepth) { return target }
  iterateObjectProperties: 
  for(const [$key, $value] of Object.entries($object)) {
    target.push($key)
    if(
      typeof $value === 'object' &&
      $value !== null &&
      $value !== $object
    ) {
      const subtarget = pathDirectory($value, options)
      for(const $subtarget of subtarget) {
        let path
        if(typeof $subtarget === 'object') {
          path = [$key, ...$subtarget].join('.')
        }
        else {
          path = [$key, $subtarget].join('.')
        }
        target.push(path)
      }
    }
  }
  return target
}