import SerializableClass from '../serializable-class/index.js'
export default [{
  name: 'serializableClassInstances',
  names: {
    monople: {
      formal: 'SerializableClassInstance',
      nonformal: 'serializableClassInstance',
    },
    multiple: {
      formal: 'SerializableClassInstances',
      nonformal: 'serializableClassInstances',
    },
    minister: {
      ad: { formal: 'Add', nonformal: 'add' },
      dead: { formal: 'Remove', nonformal: 'remove' },
    },
  },
  states: {
    instate: function instate($propertyClass, $property, $value) {
      return new SerializableClass($value)
    },
    deinstate: function deinstate($propertyClass, $property) {
      const { core, name } = $propertyClass
      return core[name][$property].stop()
    },
  },
  definition: { object: "Object" },
}]
