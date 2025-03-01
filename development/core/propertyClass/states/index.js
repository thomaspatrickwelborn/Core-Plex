function instate(
  $propertyClass, $property, $value
) { return $value }
function deinstate(
  $propertyClass, $property
) { return $propertyClass.core[$property] }
export {
  instate,
  deinstate,
}