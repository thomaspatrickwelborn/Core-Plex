function recursiveFreeze($target) {
  for(const [$propertyKey, $propertyValue] of Object.entries($target)) {
    if($propertyValue && typeof $propertyValue === 'object') {
      recursiveFreeze($target)
    }
  }
  return Object.freeze($target)
}
export default recursiveFreeze