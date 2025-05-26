const defaultAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target[$property] }
}
const getAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target.get($property) }
}
export default {
  default: defaultAccessor,
  get: getAccessor,
}