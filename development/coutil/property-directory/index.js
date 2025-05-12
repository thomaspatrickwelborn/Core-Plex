import Accessors from '../accessors/index.js'
const Options = {
  depth: 0,
  maxDepth: 10,
  accessors: [Accessors.default],
  values: false,
}
export default function propertyDirectory($object, $options) {
  const _propertyDirectory = []
  const options = Object.assign({}, Options, $options)
  const { accessors, depth, maxDepth, values } = options
  options.depth++
  if(options.depth > options.maxDepth) { return _propertyDirectory }
  iterateAccessors: 
  for(const $accessor of options.accessors) {
    const object = $accessor($object)
    if(!object) continue iterateAccessors
    iterateObjectProperties: 
    for(const [$key, $value] of Object.entries(object)) {
      if(values) { _propertyDirectory.push([$key, $value]) }
      else { _propertyDirectory.push($key) }
      if(
        typeof $value === 'object' &&
        $value !== null &&
        $value !== object
      ) {
        const subtarget = propertyDirectory($value, options)
        for(const $subtarget of subtarget) {
          let path
          if(typeof $subtarget === 'object') {
            path = [$key, ...$subtarget].join('.')
          }
          else {
            path = [$key, $subtarget].join('.')
          }
          if(values) { _propertyDirectory.push([path, $value]) }
          else { _propertyDirectory.push(path) }
        }
      }
    }
  }
  return _propertyDirectory
}