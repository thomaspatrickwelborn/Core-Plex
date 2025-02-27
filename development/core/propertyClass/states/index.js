function Instate(
  $propertyClass, $property, $value
) { return $value }
function Deinstate(
  $propertyClass, $property
) { return $propertyClass.core[$property] }
export {
  Instate,
  Deinstate,
}