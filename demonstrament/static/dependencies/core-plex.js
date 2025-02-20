function impandEvents($propEvents) {
  if(!Array.isArray($propEvents)) { return $propEvents }
  const propEvents = {};
  for(const $propEvent of $propEvents) {
    const { path, type, listener, options } = $propEvent;
    const propEventSettings = `${$path} ${$type}`;
    if(options !== undefined) {
      propEvents[propEventSettings] = [listener, options];
    }
    else {
      propEvents[propEventSettings] = listener;
    }
  }
  return propEvents
}

function expandEvents($propEvents) {
  const propEvents = [];
  if(Array.isArray($propEvents)) { return $propEvents }
  else if($propEvents === undefined) { return propEvents }
  for(const [
    $propEventSettings, $propEventListener
  ] of Object.entries($propEvents)) {
    const propEventSettings = $propEventSettings.split(' ');
    let path, type, listener;
    if(propEventSettings.length === 1) {
      path = ':scope';
      type = propEventSettings[0];
    }
    else if(propEventSettings.length > 1) {
      path = propEventSettings[0];
      type = propEventSettings[1];
    }
    if(Array.isArray($propEventListener)) {
      listener = $propEventListener[0];
      $propEventListener[1];
    }
    else {
      listener = $propEventListener;
    }
    const propEvent = {
      type,
      path,
      listener,
      enable: false,
    };
    propEvents.push(propEvent);
  }
  return propEvents
}

const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'undefined': undefined,
  'null': null,
};
const PrimitiveKeys = Object.keys(Primitives);
const PrimitiveValues = Object.values(Primitives);
const Objects = {
  'object': Object,
  'array': Array,
};
const ObjectKeys = Object.keys(Objects);
const ObjectValues = Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
const TypeKeys = Object.keys(Types);
const TypeValues = Object.values(Types);
const TypeMethods = [
 Primitives.String, Primitives.Number, Primitives.Boolean, 
 Objects.Object, Objects.Array
];

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ObjectKeys: ObjectKeys,
  ObjectValues: ObjectValues,
  Objects: Objects,
  PrimitiveKeys: PrimitiveKeys,
  PrimitiveValues: PrimitiveValues,
  Primitives: Primitives,
  TypeKeys: TypeKeys,
  TypeMethods: TypeMethods,
  TypeValues: TypeValues,
  Types: Types
});

var regularExpressions = {
  quotationEscape: /\.(?=(?:[^"]*"[^"]*")*[^"]*$)/,
};

function subpaths($path) {
  return $path.split(
    new RegExp(regularExpressions.quotationEscape)
  )
}
function keypaths($path) {
  const _subpaths = subpaths($path);
  _subpaths.pop();
  return _subpaths
}
function key($path) {
  return subpaths($path).pop()
}
function root($path) {
  return subpaths($path).shift()
}
function typeofRoot($path) {
  return (Number(root($path))) ? 'array' : 'object'
}
function parse($path) {
  return {
    subpaths: subpaths($path),
    keypaths: keypaths($path),
    key: key($path),
    root: root($path),
    typeofRoot: typeofRoot($path),
  }
}

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  key: key,
  keypaths: keypaths,
  parse: parse,
  root: root,
  subpaths: subpaths,
  typeofRoot: typeofRoot
});

const typeOf = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function typedObjectLiteral($object) {
  if(typeOf($object) === 'object') { return {} }
  else if(typeOf($object) === 'array') { return [] }
  else if(typeOf($object) === 'string') { return (
    $object === 'object'
  ) ? {} : (
    $object === 'array'
  ) ? []
    : undefined
  }
  else { return undefined }
}

function get($path, $value) {
  const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape));
  const key = subpaths.pop();
  const tree = $value;
  let treeNode = tree;
  for(const $subpath of subpaths) {
    treeNode = treeNode[$subpath];
  }
  return treeNode[key]
}
function set($path, $value) {
  const {
    keypaths, key, typeofRoot
  } = parse($path);
  const tree = typedObjectLiteral(typeofRoot);
  let treeNode = tree;
  for(const $subpath of keypaths) {
    if(Number($subpath)) { treeNode[$subpath] = []; }
    else { treeNode[$subpath] = {}; }
    treeNode = treeNode[$subpath];
  }
  treeNode[key] = $value;
  return tree
}

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get,
  set: set
});

function impandTree($root, $tree) {
  const typeofTree = typeof $tree;
  const typeofRoot = typeof $root;
  if(
    !['string', 'function'].includes(typeofTree) ||
    typeofRoot && typeofRoot !== 'object'
  ) { return undefined /*$root*/ }
  let tree = typedObjectLiteral($root);
  if(typeofRoot === 'object') {
    for(const [$rootKey, $rootValue] of Object.entries($root)) {
      if(typeofTree === 'string') { tree[$rootKey] = get($tree, $rootValue); }
      else if(typeofTree === 'function') { tree = $tree($rootValue); }
    }
  }
  return tree
}

function expandTree($root, $tree) {
  const typeofRoot = typeof $root;
  const typeofTree = typeof $tree;
  if(
    !['string', 'function'].includes(typeofTree)
  ) { return undefined }
  let tree;
  if($root && typeofRoot === 'object') {
    for(const [$rootKey, $rootValue] of Object.entries($root)) {
      if(typeofTree === 'string') { tree = set($tree, $rootValue); }
      else if(typeofTree === 'function') { tree = $tree($rootValue); }
    }
  }
  else {
    if(typeofTree === 'string') { tree = set($tree, $root); }
    else if(typeofTree === 'function') { tree = $tree($root); }
  }
  return tree
}

function keytree($object) {
  const target = [];
  for(const [$key, $value] of Object.entries($object)) {
    if(typeof $value === 'object') {
      target.push([$key, keytree($value)]);
    }
    else {
      target.push($key);
    }
  }
  return target
}

function recursiveAssign() {
  const $arguments = [...arguments];
  const $target = $arguments.shift();
  const $sources = $arguments;
  iterateSources: 
  for(const $source of $sources) {
    if(
      $source === null ||
      $source === undefined
    ) { continue iterateSources }
    for(let [
      $sourcePropKey, $sourcePropValue
    ] of Object.entries($source)) {
      // Type: Non-Null Object
      if(
        $target[$sourcePropKey] !== null &&
        typeof $sourcePropValue === 'object'
      ) {
        if($target[$sourcePropKey] === undefined) {
          $target[$sourcePropKey] = $sourcePropValue;
        } else {
          $target[$sourcePropKey] = recursiveAssign(
            $target[$sourcePropKey], $sourcePropValue
          );
        }
      }
      // Type: Primitive
      else {
        $target[$sourcePropKey] = $sourcePropValue;
      }
    }
  }
  return $target
}

function recursiveAssignConcat() {
  const $arguments = [...arguments];
  const $target = $arguments.shift();
  const $sources = $arguments;
  iterateSources: 
  for(const $source of $sources) {
    if(
      $source === null ||
      $source === undefined
    ) { continue iterateSources }
    for(let [
      $sourcePropKey, $sourcePropValue
    ] of Object.entries($source)) {
      // Type: Non-Null Object
      if(
        $target[$sourcePropKey] !== null &&
        typeof $sourcePropValue === 'object'
      ) {
        if($target[$sourcePropKey] === undefined) {
          $target[$sourcePropKey] = $sourcePropValue;
        }
        else {
          if(Array.isArray($sourcePropValue)) {
            $target[$sourcePropKey] = $target[$sourcePropKey]
              .concat(recursiveAssignConcat($sourcePropValue));
          }
          else {
            $target[$sourcePropKey] = recursiveAssignConcat(
              $target[$sourcePropKey], $sourcePropValue
            );
          }
        }
      }
      // Type: Primitive
      else {
        $target[$sourcePropKey] = $sourcePropValue;
      }
    }
  }
  return $target
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  expandEvents: expandEvents,
  expandTree: expandTree,
  impandEvents: impandEvents,
  impandTree: impandTree,
  keytree: keytree,
  path: index$2,
  recursiveAssign: recursiveAssign,
  recursiveAssignConcat: recursiveAssignConcat,
  regularExpressions: regularExpressions,
  tree: index$1,
  typeOf: typeOf,
  typedObjectLiteral: typedObjectLiteral,
  variables: index$3
});

var CoreClassEvents = {
  Assign: "addEventListener",
  Deassign: "removeEventListener"
};

// Core Class Instantiation
function CoreClassInstantiator($propertyClass, $property, $value) {
  const { core, target, Class, Names } = $propertyClass;
  const valueInstanceOfClass = $value instanceof Class;
  let value;
  const parent = core;
  const path = (core.path)
    ? [core.path, Names.Multiple.Nonformal, $property].join('.')
    : [Names.Multiple.Nonformal, $property].join('.');
  if(valueInstanceOfClass === false) {
    const propertyClassInstanceParameters = [].concat($value);
    const $settings = Object.assign({ path, parent }, propertyClassInstanceParameters.shift());
    const $options = propertyClassInstanceParameters.shift();
    value = new Class($settings, $options);
  }
  else if(valueInstanceOfClass === true) {
    if($value.parent === undefined && $value.path === undefined) {
      $value.parent = parent;
      $value.path = path;
    }
    value = $value;
  }
  return value
}
// Core Class Deinstantiation
function CoreClassDeinstantiator($propertyClass, $property) {
  const { target } = $propertyClass;
  // NOOP
  return target[$property]
}

// import Content from '../../model/content/index.js'
class CoreEvent {
  #settings
  #enable = false
  #_boundListener
  constructor($settings) { 
    this.#settings = $settings;
    this.enable = this.#settings.enable;
  }
  get type() { return this.#settings.type }
  get path() { return this.#settings.path }
  get target() {
    let target = this.#context;
    const pathKeys = this.path.split('.');
    let pathKeysIndex = 0;
    iterateTargetPathKeys: 
    while(pathKeysIndex < pathKeys.length) {
      if(target === undefined) { break iterateTargetPathKeys }
      const pathKey = pathKeys[pathKeysIndex];
      if(pathKeysIndex === 0 && pathKey === ':scope') {
        break iterateTargetPathKeys
      }
      // if(target.classToString === Content.toString()) {
      //   target = target.get(pathKey)
      // }
      // else {
        target = target[pathKey];
      // }
      pathKeysIndex++;
    }
    return target
  }
  get listener() { return this.#settings.listener }
  get options() { return this.#settings.options }
  get enable() { return this.#enable }
  set enable($enable) {
    if(
      $enable === this.#enable ||
      this.target === undefined
    ) { return }
    const eventAbility = (
      $enable === true
    ) ? this.#propertyClassEvents.Assign
      : this.#propertyClassEvents.Deassign;
    if(
      this.target instanceof NodeList ||
      Array.isArray(this.target)
    ) {
      for(const $target of this.target) {
        $target[eventAbility](this.type, this.#boundListener, this.options);
      }
      this.#enable = $enable;
    }
    else if(this.target instanceof EventTarget) {
      this.target[eventAbility](this.type, this.#boundListener, this.options);
      this.#enable = $enable;
    }
    else {
      try {
        this.target[eventAbility](this.type, this.#boundListener, this.options);
        this.#enable = $enable;
      } catch($err) {}
    }
  }
  get #propertyClassEvents() { return this.#settings.propertyClassEvents }
  get #context() { return this.#settings.context }
  get #boundListener() {
    if(this.#_boundListener !== undefined) { return this.#_boundListener }
    this.#_boundListener = this.#settings.listener.bind(this.#context);
    return this.#_boundListener
  }
}

class Handler {
  #propertyClass
  constructor($propertyClass) {
    this.#propertyClass = $propertyClass;
  }
  get get() {
    return function($target, $property) {
      return $target[$property]
    }
  }
  get set() {
    const { ClassInstantiator } = this.#propertyClass;
    return function($target, $property, $value) {
      $target[$property] = ClassInstantiator(this.#propertyClass, $property, $value);
      return true
    }
  }
  get deleteProperty() {
    const { ClassDeinstantiator } = this.#propertyClass;
    return function($target, $property) {
      ClassDeinstantiator(this.#propertyClass, $property);
      delete $target[$property];
      return true
    }
  }
}

class PropertyClass {
  #settings
  #core
  #target
  #handler
  #proxy
  constructor($settings, $core) {
    this.#settings = $settings;
    this.core = $core;
    if([
      this.ID, this.Name, this.Class, 
      this.Names.Monople.Formal, this.Names.Monople.Nonformal,
      this.Names.Multiple.Formal, this.Names.Multiple.Nonformal,
    ].includes(undefined)) { return undefined }
    return this.proxy
  }
  get core() { return this.#core }
  set core($core) {
    if(this.#core !== undefined) return
    this.#core = $core;
  }
  get target() {
    if(this.#target !== undefined) { return this.#target }
    this.#target = {};
    return this.#target
  }
  get handler() {
    if(this.#handler !== undefined) { return this.#handler }
    this.#handler = new Handler(this);
    return this.#handler
  }
  get proxy() {
    if(this.#proxy !== undefined) { return this.#proxy }
    this.#proxy = new Proxy(this.target, this.handler);
    return this.#proxy
  }
  get ID() { return this.#settings.ID }
  get Name() { return this.#settings.Name }
  get Class() { return this.#settings.Class }
  get ClassInstantiator() { return this.#settings.ClassInstantiator }
  get ClassDeinstantiator() { return this.#settings.ClassDeinstantiator }
  get Names() { return this.#settings.Names }
  get Events() { return this.#settings.Events }
}

var Settings = {
  events: {},
  propertyClasses: {},
};

var Options = {
  assign: [],
  defineProperties: {},
};

class Core extends EventTarget {
  #settings
  #options
  #events
  #key
  #path
  #parent
  #_propertyClassEvents
  #propertyClasses
  static propertyClasses = []
  constructor($settings = {}, $options = {}) {
    super();
    this.settings = $settings;
    this.options = $options;
    this.addPropertyClasses(this.settings.propertyClasses);
    for(const $propertyClass of this.propertyClasses) {
      const { Name, Names } = $propertyClass;
      this[`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`](this.settings[Name]);
      if(this.settings[Name] !== undefined) {
        this[Name] = this.settings[Name];
      }
    }
    this.addEvents(this.settings.events);
    this.#defineProperties(this.options.defineProperties);
    this.#assign(...this.options.assign);
  }
  get #propertyClassEvents() {
    if(this.#_propertyClassEvents !== undefined) return this.#_propertyClassEvents
    this.#_propertyClassEvents = {};
    for(const [$propertyClassName, $propertyClass] of Object.entries(this.propertyClasses)) {
      this.#_propertyClassEvents[$propertyClassName] = $propertyClass.Events;
    }
    return this.#_propertyClassEvents
  }
  get settings() { return this.#settings }
  set settings($settings) {
    if(this.#settings !== undefined) returnd;
    this.#settings = Object.assign({}, Settings, $settings);
  }
  get options() { return this.#options }
  set options($options) {
    if(this.#options !== undefined) return
    this.#options = recursiveAssign(structuredClone(Options), $options);
  }
  get key() {
    if(this.#key !== undefined) return this.#key
    this.#key = this.path?.split('.').pop() || null;
    return this.#key
  }
  get path() {
    if(this.#path !== undefined) return this.#path
    this.#path = (this.settings.path !== undefined)
      ? this.settings.path
      : undefined;
    return this.#path
  }
  set path($path) {
    if(this.#path !== undefined) return
    this.#path = $path;
  }
  get parent() {
    if(this.#parent !== undefined) return this.#parent
    this.#parent = (
      this.settings.parent !== undefined
    ) ? this.settings.parent
      : undefined;
    return this.#parent
  }
  set parent($parent) {
    if(this.#parent !== undefined) return
    this.#parent = $parent;
  }
  get root() {
    let root = this;
    iterateRoots: 
    while(root) {
      if([undefined, null].includes(root.parent)) break iterateRoots
      root = root.parent;
    }
    return root
  }
  get events() {
    if(this.#events !== undefined) return this.#events
    this.#events = [];
    return this.#events
  }
  get propertyClasses() {
    if(this.#propertyClasses !== undefined) return this.#propertyClasses
    this.#propertyClasses = [];
    return this.#propertyClasses
  }
  getPropertyClass() {
    const { ID, Name } = arguments[0];
    let propertyClass;
    for(const $propertyClass of this.propertyClasses) {
      if(
        ID && $propertyClass.ID === ID ||
        Name && $propertyClass.Name === Name
      ) { propertyClass = $propertyClass; }
    }
    return propertyClass
  }
  addPropertyClasses() {
    if(!arguments[0]) { return this }
    const $this = this;
    let $propertyClasses;
    if(Array.isArray(arguments[0])) { $propertyClasses = arguments[0]; }
    else if(typeof arguments[0] === 'object') { $propertyClasses = Object.values(arguments[0]); }
    const propertyClasses = this.propertyClasses;
    for(const $propertyClass of $propertyClasses) {
      const propertyClassName = $propertyClass.Name;
      // Class Instantiator
      if($propertyClass.ClassInstantiator === undefined) {
        $propertyClass.ClassInstantiator = CoreClassInstantiator; 
      }
      // Class Deinstantiator
      if($propertyClass.ClassDeinstantiator === undefined) {
        $propertyClass.ClassDeinstantiator = CoreClassDeinstantiator; 
      }
      const { Events, Names } = $propertyClass;
      const propertyClassStoreName = `_${propertyClassName}`;
      Object.defineProperties(this, {
        // Property Class Store
        [propertyClassStoreName]: {
          configurable: true, enumerable: false, writable: true,
          value: undefined,
        },
        // Property Class
        [propertyClassName]: {
          configurable: true, enumerable: true,  
          get() {
            if($this[propertyClassStoreName] !== undefined) {
              return $this[propertyClassStoreName]
            }
            $this[propertyClassStoreName] = new PropertyClass(
              $propertyClass, $this
            );
            return $this[propertyClassStoreName]
          },
          set($propertyClassInstances) {
            const propertyClassInstances = $this[propertyClassName];
            let propertyClassInstancesEntries;
            if($propertyClassInstances) {
              if(Array.isArray($propertyClassInstances)) {
                propertyClassInstancesEntries = $propertyClassInstances;
              }
              else {
                propertyClassInstancesEntries = Object.entries($propertyClassInstances);
              }
            } else { propertyClassInstancesEntries = []; }
            for(const [
              $propertyClassInstanceName, $propertyClassInstance
            ] of propertyClassInstancesEntries) {
              propertyClassInstances[$propertyClassInstanceName] = $propertyClassInstance;
            }
          }
        },
        // Add Property Class Instance
        [`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`]: {
          configurable: true, enumerable: true, writable: false, 
          value: function() {
            const $arguments = [...arguments];
            if($arguments.length === 1) {
              const [$values] = $arguments;
              if(Array.isArray($values)) {
                $this[propertyClassName] = Object.fromEntries($values);
              }
              else {
                $this[propertyClassName] = $values;
              }
            }
            else if($arguments.length === 2) {
              const [$key, $value] = $arguments;
              $this[propertyClassName] = { [$key]: $value };
            }
          }
        },
        // Remove Property Class Instance
        [`${Names.Minister.Dead.Nonformal}${Names.Multiple.Formal}`]: {
          configurable: true, enumerable: true, writable: false, 
          value: function() {
            const [$removeKeys] = [...arguments];
            const removeKeys = [];
            const typeofRemoveKeys = typeof $arguments[0];
            if(typeofRemoveKeys === 'string') { removeKeys.push($arguments[0]); }
            else if(typeofRemoveKeys === 'object') {
              if(Array.isArray($removeKeys)) { removeKeys.push(...$removeKeys); }
              else { removeKeys.push(...Object.keys($removeKeys)); }
            }
            else if(typeofRemoveKeys === 'undefined') {
              removeKeys.push(...Object.keys($this[propertyClassName]));
            }
            for(const $removeKey of $removeKeys) {
              delete $this[propertyClassName][$removeKey];
            }
          }
        },
      });
      propertyClasses.push($propertyClass);
    }
    return this
  }
  removePropertyClasses() {
    let removePropertyClasses = [];
    if(arguments.length === 0) { removePropertyClasses = removePropertyClasses.concat(
      Object.keys(this.propertyClasses)
    ); }
    else if(arguments.length === 1) {
      const $removePropertyClasses = arguments[0];
      const typeofRemovePropertyClasses = typeof $removePropertyClasses;
      if(
        typeofRemovePropertyClasses === 'string'
      ) {
        removePropertyClasses = removePropertyClasses.concat($removePropertyClasses);
      }
      else if(typeofRemovePropertyClasses === 'object') {
        if(Array.isArray($removePropertyClasses)) {
          removePropertyClasses = removePropertyClasses.concat($removePropertyClasses);
        }
        else {
          removePropertyClasses = removePropertyClasses.concat(Object.keys($removePropertyClasses));
        }
      }
    }
    iterateRemovePropertyClasses: 
    for(const $removePropertyClassName of removePropertyClasses) {
      const { Names } = this.getPropertyClass({ Name: $removePropertyClassName });
      if(!Names) break iterateRemovePropertyClasses
      const propertyClassInstances = this[Names.Multiple.Nonformal];
      for(const [
        $propertyClassInstanceName, $propertyClassInstance
      ] of Object.entries(this[Names.Multiple.Nonformal])) {
        delete propertyClassInstances[$propertyClassInstanceName];
      }
      delete this[`_${Names.Multiple.Nonformal}`];
      Object.defineProperty(this, Names.Multiple.Nonformal, {
        configurable: true, enumerable: false, writable: true, 
        value: undefined
      });
      delete this[Names.Multiple.Nonformal];
      delete this[`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`];
      delete this[`${Names.Minister.Dead.Nonformal}${Names.Multiple.Formal}`];
    }
    return this
  }
  getEvents() {
    const getEvents = [];
    const { events } = this;
    const $events = [].concat(arguments[0]);
    for(const $event of $events) {
      const { type, path, listener, enable } = $event;
      const eventFilterProperties = [];
      if(type !== undefined) { eventFilterProperties.push(['type', type]); }
      if(path !== undefined) { eventFilterProperties.push(['path', path]); }
      if(listener !== undefined) { eventFilterProperties.push(['listener', listener]); }
      if(enable !== undefined) { eventFilterProperties.push(['enable', enable]); }
      getEvents.push(
        ...events.filter(($existingEvent) => {
          return eventFilterProperties.reduce(($match, [
            $eventFilterPropertyKey, $eventFilterPropertyValue
          ]) => {
            const match = (
              $existingEvent[$eventFilterPropertyKey] === $eventFilterPropertyValue
            ) ? true : false;
            if($match !== false) { $match = match; }
            return $match
          }, undefined)
        })
      );
    }
    return getEvents
  }
  addEvents() {
    if(arguments[0] === undefined) { return this }
    const $events = expandEvents(arguments[0]);
    const { events } = this;
    for(let $event of $events) {
      const propertyClassName = $event.path.split('.').shift();
      const propertyClassEvents = Object.assign(
        {}, 
        CoreClassEvents,
        this.#propertyClassEvents[propertyClassName],
        $event?.sign, 
      );
      $event = Object.assign(
        {}, 
        $event,
        {
          context: this,
          propertyClassEvents,
        }
      );
      const coreEvent = new CoreEvent($event);
      events.push(coreEvent);
    }
    return this
  }
  removeEvents() {
    const { events } = this;
    let $events;
    if(arguments.length === 0) { $events = events; }
    else if(arguments.length === 1) {
      $events = this.getEvents(arguments[0]);
    }
    if($events.length === 0) return this
    let eventsIndex = events.length - 1;
    while(eventsIndex > -1) {
      const event = events[eventsIndex];
      const removeEventIndex = $events.findIndex(
        ($event) => $event === event
      );
      if(removeEventIndex !== -1) {
        event.enable = false;
        events.splice(eventsIndex, 1);
      }
      eventsIndex--;
    }
    return this
  }
  enableEvents() {
    let $events;
    if(arguments.length === 0) { $events = this.events; }
    else { $events = this.getEvents(arguments[0]); }
    return this.#toggleEventAbility('addEventListener', $events)
  }
  disableEvents() {
    let $events;
    if(arguments.length === 0) { $events = this.events; }
    else { $events = this.getEvents(arguments[0]); }
    return this.#toggleEventAbility('removeEventListener', $events)
  }
  #assign() {
    Object.assign(this, ...arguments);
    return this
  }
  #defineProperties() {
    Object.defineProperties(this, arguments[0]);
    return this
  }
  #toggleEventAbility($eventListenerMethod, $events) {
    let enability;
    if($eventListenerMethod === 'addEventListener') { enability = true; }
    else if($eventListenerMethod === 'removeEventListener') { enability = false; }
    else { return this }
    for(const $event of $events) {
      $event.enable = enability;
    }
    return this
  }
}

export { Core, index as Coutil };
//# sourceMappingURL=core-plex.js.map
