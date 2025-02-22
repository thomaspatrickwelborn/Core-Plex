function Instate(
  $propertyClass, $property, $value
) { return $value }
function Deinstate(
  $propertyClass, $property
) { return $propertyClass.target[$property] }
export {
  Instate,
  Deinstate,
}