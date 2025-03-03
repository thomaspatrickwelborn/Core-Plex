export default function pathkeyTree($object) {
  const target = []
  for(const [$key, $value] of Object.entries($object)) {
    target.push($key)
    if(typeof $value === 'object' && $value !== null) {
      const subtarget = pathkeyTree($value)
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