export default function keytree($object) {
  const target = []
  for(const [$key, $value] of Object.entries($object)) {
    if(typeof $value === 'object') {
      target.push([$key, keytree($value)])
    }
    else {
      target.push($key)
    }
  }
  return target
}
