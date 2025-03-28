const defaultAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target[$property] }
}
export default {
  default: defaultAccessor,
}