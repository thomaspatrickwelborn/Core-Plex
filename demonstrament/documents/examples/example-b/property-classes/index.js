import SerializableClass from '../serializable-class/index.js'
export default [{
  Name: 'serializableClassInstances',
  Names: {
    Monople: {
      Formal: 'SerializableClassInstance',
      Nonformal: 'serializableClassInstance',
    },
    Multiple: {
      Formal: 'SerializableClassInstances',
      Nonformal: 'serializableClassInstances',
    },
    Minister: {
      Ad: { Formal: 'Add', Nonformal: 'add' },
      Dead: { Formal: 'Remove', Nonformal: 'remove' },
    },
  },
  Events: {
    Assign: 'addEventListener',
    Deassign: 'removeEventListener',
    TargetAccessors: ['[]'],
  },
  States: {
    Instate: function Instate($propertyClass, $property, $value) {
      return new SerializableClass($value)
    },
    Deinstate: function Deinstate($propertyClass, $property) {
      const { core, Name } = $propertyClass
      return core[Name][$property].stop()
    },
  },
  Definition: {
    Object: "Object",
  },
}]
