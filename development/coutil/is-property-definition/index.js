import { variables } from '../index.js'
export default function isPropertyDefinition($propertyDefinition) {
  if(
    Object.getOwnPropertyDescriptor($propertyDefinition, 'type') &&
    (
      variables.TypeValues.includes($propertyDefinition.type) ||
      variables.TypeKeys.includes($propertyDefinition.type)
    ) || (
      typeof $propertyDefinition.type === 'object' &&
      Object.getOwnPropertyDescriptor($propertyDefinition.type, 'value') &&
      (
        variables.TypeValues.includes($propertyDefinition.type.value) ||
        variables.TypeKeys.includes($propertyDefinition.type.value)
      )
    )
  ) { return true } 
  else { return false }
}