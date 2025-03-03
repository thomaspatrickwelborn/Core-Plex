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
  const typeOfObject = typeOf($object);
  if(
    typeOfObject === 'object' ||
    $object === Object
  ) { return {} }
  else if(
    typeOfObject === 'array' ||
    $object === Array
  ) { return [] }
  else if(typeOfObject === 'string') { return (
    $object === 'Object' ||
    $object === 'object'
  ) ? {} 
    : (
    $object === 'Array' ||
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

function pathkeyTree($object) {
  const target = [];
  for(const [$key, $value] of Object.entries($object)) {
    target.push($key);
    if(typeof $value === 'object' && $value !== null) {
      const subtarget = pathkeyTree($value);
      for(const $subtarget of subtarget) {
        let path;
        if(typeof $subtarget === 'object') {
          path = [$key, ...$subtarget].join('.');
        }
        else {
          path = [$key, $subtarget].join('.');
        }
        target.push(path);
      }
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
  pathkeyTree: pathkeyTree,
  recursiveAssign: recursiveAssign,
  recursiveAssignConcat: recursiveAssignConcat,
  regularExpressions: regularExpressions,
  tree: index$1,
  typeOf: typeOf,
  typedObjectLiteral: typedObjectLiteral,
  variables: index$3
});

function instate(
  $propertyClass, $property, $value
) { return $value }
function deinstate(
  $propertyClass, $property
) { return $propertyClass.core[$property] }

class Handler {
  #propertyClass
  constructor($propertyClass) {
    this.#propertyClass = $propertyClass;
  }
  get get() {
    return function get($target, $property) {
      return $target[$property]
    }
  }
  get set() {
    const instate = this.#propertyClass.states.instate || states.instate;
    const definition = this.#propertyClass.definition;
    return function set($target, $property, $value) {
      if(
        definition.object === "Array" && 
        $property === 'length'
      ) {
        $target[$property] = $value;
      }
      else {
        $target[$property] = instate(this.#propertyClass, $property, $value);
      }
      return true
    }
  }
  get deleteProperty() {
    const deinstate = this.#propertyClass.states.deinstate || states.deinstate;
    return function deleteProperty($target, $property) {
      deinstate(this.#propertyClass, $property);
      delete $target[$property];
      return true
    }
  }
}

class PropertyClass {
  #settings
  #core
  #_target
  #_handler
  #_proxy
  constructor($settings, $core) {
    this.#settings = $settings;
    this.#core = $core;
    return this.#proxy
  }
  get #target() {
    if(this.#_target !== undefined) { return this.#_target }
    this.#_target = typedObjectLiteral(this.definition.object);
    return this.#_target
  }
  get #handler() {
    if(this.#_handler !== undefined) { return this.#_handler }
    this.#_handler = new Handler(this);
    return this.#_handler
  }
  get #proxy() {
    if(this.#_proxy !== undefined) { return this.#_proxy }
    this.#_proxy = new Proxy(this.#target, this.#handler);
    return this.#_proxy
  }
  get core() { return this.#core }
  get name() { return this.#settings.name }
  get names() { return this.#settings.names }
  get states() { return this.#settings.states }
  get definition() { return this.#settings.definition }
}

function handleNoCommaBraces(span) {
    if (span.length < 3) {
        return "{" + span + "}";
    }
    var separatorI = -1;
    for (var i = 2; i < span.length; i++) {
        if (span[i] === '.' && span[i - 1] === '.' && (i < 2 || span[i - 2] !== '\\')) {
            if (separatorI > -1) {
                return "{" + span + "}";
            }
            separatorI = i - 1;
        }
    }
    if (separatorI > -1) {
        var rangeStart = span.substr(0, separatorI);
        var rangeEnd = span.substr(separatorI + 2);
        if (rangeStart.length > 0 && rangeEnd.length > 0) {
            return "[" + span.substr(0, separatorI) + "-" + span.substr(separatorI + 2) + "]";
        }
    }
    return "{" + span + "}";
}
function expand(pattern) {
    if (typeof pattern !== 'string') {
        throw new TypeError("A pattern must be a string, but " + typeof pattern + " given");
    }
    var scanning = false;
    var openingBraces = 0;
    var closingBraces = 0;
    var handledUntil = -1;
    var results = [''];
    var alternatives = [];
    var span;
    for (var i = 0; i < pattern.length; i++) {
        var char = pattern[i];
        if (char === '\\') {
            i++;
            continue;
        }
        if (char === '{') {
            if (scanning) {
                openingBraces++;
            }
            else if (i > handledUntil && !openingBraces) {
                span = pattern.substring(handledUntil + 1, i);
                for (var j = 0; j < results.length; j++) {
                    results[j] += span;
                }
                alternatives = [];
                handledUntil = i;
                scanning = true;
                openingBraces++;
            }
            else {
                openingBraces--;
            }
        }
        else if (char === '}') {
            if (scanning) {
                closingBraces++;
            }
            else if (closingBraces === 1) {
                span = pattern.substring(handledUntil + 1, i);
                if (alternatives.length > 0) {
                    var newResults = [];
                    alternatives.push(expand(span));
                    for (var j = 0; j < results.length; j++) {
                        for (var k = 0; k < alternatives.length; k++) {
                            for (var l = 0; l < alternatives[k].length; l++) {
                                newResults.push(results[j] + alternatives[k][l]);
                            }
                        }
                    }
                    results = newResults;
                }
                else {
                    span = handleNoCommaBraces(span);
                    for (var j = 0; j < results.length; j++) {
                        results[j] += span;
                    }
                }
                handledUntil = i;
                closingBraces--;
            }
            else {
                closingBraces--;
            }
        }
        else if (!scanning && char === ',' && closingBraces - openingBraces === 1) {
            span = pattern.substring(handledUntil + 1, i);
            alternatives.push(expand(span));
            handledUntil = i;
        }
        if (scanning && (closingBraces === openingBraces || i === pattern.length - 1)) {
            scanning = false;
            i = handledUntil - 1;
        }
    }
    if (handledUntil === -1) {
        return [pattern];
    }
    var unhandledFrom = pattern[handledUntil] === '{' ? handledUntil : handledUntil + 1;
    if (unhandledFrom < pattern.length) {
        span = pattern.substr(unhandledFrom);
        for (var j = 0; j < results.length; j++) {
            results[j] += span;
        }
    }
    return results;
}

function negate(pattern, options) {
    var supportNegation = options['!'] !== false;
    var supportParens = options['()'] !== false;
    var isNegated = false;
    var i;
    if (supportNegation) {
        for (i = 0; i < pattern.length && pattern[i] === '!'; i++) {
            if (supportParens && pattern[i + 1] === '(') {
                i--;
                break;
            }
            isNegated = !isNegated;
        }
        if (i > 0) {
            pattern = pattern.substr(i);
        }
    }
    return { pattern: pattern, isNegated: isNegated };
}

function escapeRegExpChar(char) { if (char === '-' ||
    char === '^' ||
    char === '$' ||
    char === '+' ||
    char === '.' ||
    char === '(' ||
    char === ')' ||
    char === '|' ||
    char === '[' ||
    char === ']' ||
    char === '{' ||
    char === '}' ||
    char === '*' ||
    char === '?' ||
    char === '\\') {
    return "\\" + char;
}
else {
    return char;
} }
function escapeRegExpString(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += escapeRegExpChar(str[i]);
    }
    return result;
}

function Pattern(source, options, excludeDot) {
    var separator = typeof options.separator === 'undefined' ? true : options.separator;
    var separatorSplitter = '';
    var separatorMatcher = '';
    var wildcard = '.';
    if (separator === true) {
        separatorSplitter = '/';
        separatorMatcher = '[/\\\\]';
        wildcard = '[^/\\\\]';
    }
    else if (separator) {
        separatorSplitter = separator;
        separatorMatcher = escapeRegExpString(separatorSplitter);
        if (separatorMatcher.length > 1) {
            separatorMatcher = "(?:" + separatorMatcher + ")";
            wildcard = "((?!" + separatorMatcher + ").)";
        }
        else {
            wildcard = "[^" + separatorMatcher + "]";
        }
    }
    else {
        wildcard = '.';
    }
    var requiredSeparator = separator ? separatorMatcher + "+?" : '';
    var optionalSeparator = separator ? separatorMatcher + "*?" : '';
    var segments = separator ? source.split(separatorSplitter) : [source];
    var support = {
        qMark: options['?'] !== false,
        star: options['*'] !== false,
        globstar: separator && options['**'] !== false,
        brackets: options['[]'] !== false,
        extglobs: options['()'] !== false,
        excludeDot: excludeDot && options.excludeDot !== false,
    };
    return {
        source: source,
        segments: segments,
        options: options,
        separator: separator,
        separatorSplitter: separatorSplitter,
        separatorMatcher: separatorMatcher,
        optionalSeparator: optionalSeparator,
        requiredSeparator: requiredSeparator,
        wildcard: wildcard,
        support: support,
    };
}
function Segment(source, pattern, isFirst, isLast) { return {
    source: source,
    isFirst: isFirst,
    isLast: isLast,
    end: source.length - 1,
}; }
function Result() {
return {
    match: '',
    unmatch: '',
    useUnmatch: false,
}; }
function State(pattern, segment, result) { return {
    pattern: pattern,
    segment: segment,
    result: result,
    openingBracket: segment.end + 1,
    closingBracket: -1,
    openingParens: 0,
    closingParens: 0,
    parensHandledUntil: -1,
    extglobModifiers: [],
    scanningForParens: false,
    escapeChar: false,
    addToMatch: true,
    addToUnmatch: pattern.support.extglobs,
    dotHandled: false,
    i: -1,
    char: '',
    nextChar: '',
}; }

var EXCLUDE_DOT_PATTERN = '(?!\\.)';
function add(state, addition, excludeDot) {
    if (state.addToUnmatch) {
        state.result.unmatch += addition;
    }
    if (state.addToMatch) {
        if (excludeDot && !state.dotHandled) {
            addition = EXCLUDE_DOT_PATTERN + addition;
        }
        state.dotHandled = true;
        state.result.match += addition;
    }
    return state.result;
}
function convertSegment(pattern, segment, result) {
    var support = pattern.support;
    var state = State(pattern, segment, result);
    var separatorMatcher = segment.isLast
        ? pattern.optionalSeparator
        : pattern.requiredSeparator;
    if (!support.excludeDot) {
        state.dotHandled = true;
    }
    if (segment.end === -1) {
        return segment.isLast && !segment.isFirst ? result : add(state, separatorMatcher);
    }
    if (support.globstar && segment.source === '**') {
        var prefix = !state.dotHandled ? EXCLUDE_DOT_PATTERN : '';
        var globstarSegment = prefix + pattern.wildcard + "*?" + separatorMatcher;
        return add(state, "(?:" + globstarSegment + ")*?");
    }
    while (++state.i <= segment.end) {
        state.char = state.segment.source[state.i];
        state.nextChar = state.i < segment.end ? segment.source[state.i + 1] : '';
        if (state.char === '\\') {
            if (state.i < state.segment.end) {
                state.escapeChar = true;
                continue;
            }
            else {
                state.char = '';
            }
        }
        var pattern = state.pattern, segment = state.segment, char = state.char, i = state.i;
        if (pattern.support.brackets && !state.scanningForParens) {
            if (i > state.openingBracket && i <= state.closingBracket) {
                if (state.escapeChar) {
                    add(state, escapeRegExpChar(char));
                }
                else if (i === state.closingBracket) {
                    add(state, ']');
                    state.openingBracket = segment.source.length;
                }
                else if (char === '-' && i === state.closingBracket - 1) {
                    add(state, '\\-');
                }
                else if (char === '!' && i === state.openingBracket + 1) {
                    add(state, '^');
                }
                else if (char === ']') {
                    add(state, '\\]');
                }
                else {
                    add(state, char);
                }
                state.escapeChar = false;
                continue;
            }
            if (i > state.openingBracket) {
                if (char === ']' &&
                    !state.escapeChar &&
                    i > state.openingBracket + 1 &&
                    i > state.closingBracket) {
                    state.closingBracket = i;
                    state.i = state.openingBracket;
                    if (pattern.separator) {
                        add(state, "(?!" + pattern.separatorMatcher + ")[", true);
                    }
                    else {
                        add(state, '[', true);
                    }
                }
                else if (i === segment.end) {
                    add(state, '\\[');
                    state.i = state.openingBracket;
                    state.openingBracket = segment.source.length;
                    state.closingBracket = segment.source.length;
                }
                state.escapeChar = false;
                continue;
            }
            if (char === '[' &&
                !state.escapeChar &&
                i > state.closingBracket &&
                i < segment.end) {
                state.openingBracket = i;
                state.escapeChar = false;
                continue;
            }
        }
        if (state.pattern.support.extglobs) {
            var extglobModifiers = state.extglobModifiers, char = state.char, nextChar = state.nextChar, i = state.i;
            if (nextChar === '(' &&
                !state.escapeChar &&
                (char === '@' || char === '?' || char === '*' || char === '+' || char === '!')) {
                if (state.scanningForParens) {
                    state.openingParens++;
                }
                else if (i > state.parensHandledUntil && !state.closingParens) {
                    state.parensHandledUntil = i;
                    state.scanningForParens = true;
                    state.openingParens++;
                }
                else if (state.closingParens >= state.openingParens) {
                    if (char === '!') {
                        state.addToMatch = true;
                        state.addToUnmatch = false;
                        add(state, state.pattern.wildcard + "*?", true);
                        state.addToMatch = false;
                        state.addToUnmatch = true;
                        state.result.useUnmatch = true;
                    }
                    extglobModifiers.push(char);
                    add(state, '(?:', true);
                    state.openingParens--;
                    state.i++;
                    continue;
                }
                else {
                    state.openingParens--;
                }
            }
            else if (char === ')' && !state.escapeChar) {
                if (state.scanningForParens) {
                    state.closingParens++;
                }
                else if (extglobModifiers.length) {
                    var modifier_1 = extglobModifiers.pop();
                    if (modifier_1 === '!' && extglobModifiers.indexOf('!') !== -1) {
                        throw new Error("Nested negated extglobs aren't supported");
                    }
                    modifier_1 = modifier_1 === '!' || modifier_1 === '@' ? '' : modifier_1;
                    add(state, ")" + modifier_1);
                    state.addToMatch = true;
                    state.addToUnmatch = true;
                    state.closingParens--;
                    continue;
                }
            }
            else if (char === '|' && state.closingParens &&
                !state.scanningForParens &&
                !state.escapeChar) {
                add(state, '|');
                continue;
            }
            if (state.scanningForParens) {
                if (state.closingParens === state.openingParens || i === state.segment.end) {
                    state.scanningForParens = false;
                    state.i = state.parensHandledUntil - 1;
                }
                state.escapeChar = false;
                continue;
            }
        }
        var pattern = state.pattern;
        var support = pattern.support;
        if (!state.escapeChar && support.star && state.char === '*') {
            if (state.i === state.segment.end || state.nextChar !== '*') {
                add(state, pattern.wildcard + "*?", true);
            }
        }
        else if (!state.escapeChar && support.qMark && state.char === '?') {
            add(state, pattern.wildcard, true);
        }
        else {
            add(state, escapeRegExpChar(state.char));
        }
        state.escapeChar = false;
    }
    return add(state, separatorMatcher);
}
function convert(source, options, excludeDot) {
    var pattern = Pattern(source, options, excludeDot);
    var result = Result();
    var segments = pattern.segments;
    for (var i = 0; i < segments.length; i++) {
        var segment = Segment(segments[i], pattern, i === 0, i === segments.length - 1);
        convertSegment(pattern, segment, result);
    }
    if (result.useUnmatch) {
        return "(?!^" + result.unmatch + "$)" + result.match;
    }
    else {
        return result.match;
    }
}

function flatMap(array, predicate) {
    var results = [];
    for (var i = 0; i < array.length; i++) {
        var mappedValue = predicate(array[i]);
        for (var j = 0; j < mappedValue.length; j++) {
            results.push(mappedValue[j]);
        }
    }
    return results;
}
function compile(patterns, options) {
    patterns = Array.isArray(patterns) ? patterns : [patterns];
    if (options['{}'] !== false) {
        patterns = flatMap(patterns, expand);
    }
    var positiveResults = [];
    var negativeResults = [];
    var result = '';
    for (var i = 0; i < patterns.length; i++) {
        var negatedPattern = negate(patterns[i], options);
        var convertedPattern = convert(negatedPattern.pattern, options, !negatedPattern.isNegated);
        if (negatedPattern.isNegated) {
            negativeResults.push(convertedPattern);
        }
        else {
            positiveResults.push(convertedPattern);
        }
    }
    if (negativeResults.length) {
        result = "(?!(?:" + negativeResults.join('|') + ")$)";
    }
    if (positiveResults.length > 1) {
        result += "(?:" + positiveResults.join('|') + ")";
    }
    else if (positiveResults.length === 1) {
        result += positiveResults[0];
    }
    else if (result.length) {
        result += convert('**', options, true);
    }
    return "^" + result + "$";
}
function isMatch(regexp, sample) { if (typeof sample !== 'string') {
    throw new TypeError("Sample must be a string, but " + typeof sample + " given");
} return regexp.test(sample); }
/**
 * Compiles one or more glob patterns into a RegExp and returns an isMatch function.
 * The isMatch function takes a sample string as its only argument and returns true
 * if the string matches the pattern(s).
 *
 * ```js
 * outmatch('src/*.js')('src/index.js') //=> true
 * ```
 *
 * ```js
 * const isMatch = outmatch('*.example.com', '.')
 * isMatch('foo.example.com') //=> true
 * isMatch('foo.bar.com') //=> false
 * ```
 */
function outmatch(pattern, options) {
    if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
        throw new TypeError("The first argument must be a single pattern string or an array of patterns, but " + typeof pattern + " given");
    }
    if (typeof options === 'string' || typeof options === 'boolean') {
        options = { separator: options };
    }
    if (arguments.length === 2 &&
        !(typeof options === 'undefined' ||
            (typeof options === 'object' && options !== null && !Array.isArray(options)))) {
        throw new TypeError("The second argument must be an options object or a string/boolean separator, but " + typeof options + " given");
    }
    options = options || {};
    if (options.separator === '\\') {
        throw new Error('\\ is not a valid separator');
    }
    var regexpPattern = compile(pattern, options);
    var regexp = new RegExp(regexpPattern, options.flags);
    var fn = isMatch.bind(null, regexp);
    fn.options = options;
    fn.pattern = pattern;
    fn.regexp = regexp;
    return fn;
}

class CoreEvent {
  #settings
  #enable = false
  #_boundListener
  #_targets = []
  constructor($settings) { 
    this.#settings = $settings;
  }
  get type() { return this.#settings.type }
  get path() { return this.#settings.path }
  get #targets() {
    const pretargets = this.#_targets;
    const propertyDirectory = this.#context.propertyDirectory; 
   const targetPaths = [];
    const targets = [];
    const propertyPathMatcher = outmatch(this.path, {
      separator: '.',
    });
    for(const $propertyPath of propertyDirectory) {
      const propertyPathMatch = propertyPathMatcher($propertyPath);
      if(propertyPathMatch === true) { targetPaths.push($propertyPath); }
    }
    for(const $targetPath of targetPaths) {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget?.path === $targetPath
      );
      let target;
      let targetElement;
      target = this.#context;
      const pathKeys = $targetPath.split('.');
      let pathKeysIndex = 0;
      iterateTargetPathKeys: 
      while(pathKeysIndex < pathKeys.length) {
        let pathKey = pathKeys[pathKeysIndex];
        if(pathKeysIndex === 0 && pathKey === ':scope') {
          break iterateTargetPathKeys
        }
        iterateTargetAccessors: 
        for(const $targetAccessor of this.#settings.target.accessors) {
          if($targetAccessor === '[]') {
            target = target[pathKey];
          }
          else if($targetAccessor === 'get') {
            target = target?.get(pathKey);
          }
          if(target !== undefined) { break iterateTargetAccessors }
        }
        pathKeysIndex++;
      }
      if(target === pretargetElement?.target) {
        targetElement = pretargetElement;
      }
      else {
        targetElement = {
          path: $targetPath,
          target: target,
          enable: false,
        };
      }
      targets.push(targetElement);
    }
    this.#_targets = targets;
    return this.#_targets
  }
  get listener() { return this.#settings.listener }
  get options() { return this.#settings.options }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets;
    if(this.#targets.length === 0) { return }
    const eventAbility = (
      $enable === true
    ) ? this.#settings.target.assign
      : this.#settings.target.deassign;
    iterateTargets: 
    for(const { path, target, enable } of targets) {
      if(enable === eventAbility) { continue iterateTargets }
      try {
        target[eventAbility](this.type, this.#boundListener, this.options);
        target.enable = eventAbility;
      } catch($err) {}
    }
    this.#enable = $enable;
  }
  get #context() { return this.#settings.context }
  get #boundListener() {
    if(this.#_boundListener !== undefined) { return this.#_boundListener }
    this.#_boundListener = this.#settings.listener.bind(this.#context);
    return this.#_boundListener
  }
}

var Settings = {
  events: [/*{
    type: "click",
    path "views.",
    listener: function listener($event) {},
    enable: false,
    target: {
      accessors: ["[]", "get"], 
      assign: "addEventListener", 
      deassign: "removeEventListener", 
    }
    targetAccessors: [],
  }*/],
  propertyClasses: [/* {
    id: "VIEW",
    name: "views",
    class: View,
    names: {
      monople: { formal: "View", nonformal: "view" },
      multiple: { formal: "Views", nonformal: "views" },
      minister: {
        ad: { formal: "Add", nonformal: "add" },
        dead: { formal: "Remove", nonformal: "remove" },
      },
    },
    states: {
      instate: function instate($propertyClass, $property, $value) {},
      deinstate: function deinstate($propertyClass, $property) {},
    },
    definition: {
      object: Array, // Object, // undefined,
    }
  } */],
};

var Options = {
  assign: [],
  defineProperties: {},
  enableEvents: false,
};

class Core extends EventTarget {
  #settings
  #options
  #_events
  #_propertyClasses = []
  static propertyClasses = []
  constructor($settings = {}, $options = {}) {
    super();
    this.settings = $settings;
    this.options = $options;
    this.addPropertyClasses(this.settings.propertyClasses);
    this.#addProperties(this.settings);
    this.addEvents(this.settings.events);
    if(this.options.enableEvents) this.enableEvents(this.options.enableEvents); 
  }
  get propertyDirectory() { return pathkeyTree(this) }
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
  get #events() {
    if(this.#_events !== undefined) return this.#_events
    this.#_events = [];
    return this.#_events
  }
  get #propertyClasses() { return this.#_propertyClasses }
  #getPropertyClasses() {
    let $getPropertyClasses;
    if(arguments.length === 0) $getPropertyClasses = this.#propertyClasses;
    else { $getPropertyClasses = [].concat(...arguments); }
    const getPropertyClasses = [];
    let propertyClassIndex = 0;
    for(const $propertyClass of this.#propertyClasses) {
      for(const $getPropertyClass of $getPropertyClasses) {
        if($propertyClass.name === $getPropertyClass.name) {
          getPropertyClasses.push({
            propertyClassIndex: propertyClassIndex,
            propertyClass: $propertyClass
          });
        }
      }
      propertyClassIndex++;
    }
    return getPropertyClasses
  }
  #addProperties($properties) {
    iteratePropertyClasses: 
    for(const $propertyClass of this.#propertyClasses) {
      const { name, names, definition } = $propertyClass;
      if(!definition) { continue iteratePropertyClasses }
      if($properties[name] === undefined) { continue iteratePropertyClasses }
      if(definition.object !== undefined) {
        this[`${names.minister.ad.nonformal}${names.multiple.formal}`](this.settings[name]);
      }
      else if(this.settings[name] !== undefined) {
        this[name] = this.settings[name];
      }
    }
    return this
  }
  addPropertyClasses() {
    const $this = this;
    let $addPropertyClasses = (arguments.length === 0)
      ? this.settings.propertyClasses
      : [].concat(...arguments);
    const propertyClasses = this.#propertyClasses;
    iteratePropertyClasses: 
    for(const $addPropertyClass of $addPropertyClasses) {
      if(!$addPropertyClass.definition) {
        propertyClasses.push($addPropertyClass);
        continue iteratePropertyClasses
      }
      // Class States
      $addPropertyClass.states = $addPropertyClass.states || {};
      $addPropertyClass.definition = $addPropertyClass.definition || {};
      // Class instate
      if($addPropertyClass?.states.instate === undefined) {
        $addPropertyClass.states.instate = instate; 
      }
      // Class deinstate
      if($addPropertyClass.states.deinstate === undefined) {
        $addPropertyClass.states.deinstate = deinstate; 
      }
      const {
        name,
        names,
        states,
        definition,
      } = $addPropertyClass;
      let propertyValue;
      if(
        definition.object === 'Array' || 
        definition.object === 'Object'
      ) {
        Object.defineProperties(this, {
          // Property Class Instances
          [name]: {
            configurable: true, enumerable: true,  
            get() {
              if(propertyValue !== undefined) {
                return propertyValue
              }
              propertyValue = new PropertyClass($addPropertyClass, $this);
              return propertyValue
            },
            set($propertyValue) {
              const propertyClassInstances = $this[name];
              let propertyClassInstancesEntries;
              if($propertyValue) {
                if(Array.isArray($propertyValue)) {
                  propertyClassInstancesEntries = $propertyValue;
                }
                else {
                  propertyClassInstancesEntries = Object.entries($propertyValue);
                }
              } else { propertyClassInstancesEntries = []; }
              for(const [
                $propertyClassInstanceName, $propertyClassInstance
              ] of propertyClassInstancesEntries) {
                propertyClassInstances[$propertyClassInstanceName] = $propertyClassInstance;
              }
            }
          },
          // Add Property Class Instances
          [`${names.minister.ad.nonformal}${names.multiple.formal}`]: {
            configurable: true, enumerable: false, writable: false, 
            value: function() {
              const $arguments = [...arguments];
              if($arguments.length === 1) {
                const [$values] = $arguments;
                if(definition.object === 'Array') {
                  $this[name] = Object.entries($values);
                }
                else {
                  if(Array.isArray($values)) {
                    $this[name] = Object.fromEntries($values);
                  }
                  else {
                    $this[name] = $values;
                  }
                }
              }
              else if($arguments.length === 2) {
                const [$key, $value] = $arguments;
                $this[name] = { [$key]: $value };
              }
              return $this
            }
          },
          // Remove Property Class Instances
          [`${names.minister.dead.nonformal}${names.multiple.formal}`]: {
            configurable: true, enumerable: false, writable: false, 
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
                removeKeys.push(...Object.keys($this[name]));
              }
              for(const $removeKey of $removeKeys) {
                delete $this[name][$removeKey];
              }
              return $this
            }
          },
        });
      }
      else if(
        definition !== undefined &&
        names?.monople.nonformal !== undefined
      ) {
        Object.defineProperties(this, {
          [names.monople.nonformal]: {
            get() {
              return propertyValue
            },
            set($propertyValue) {
              propertyValue = states.instate(Object.assign({
                core: this
              }, $addPropertyClass), name, $propertyValue);
              }
          },
        });
      }
      propertyClasses.push($addPropertyClass);
    }
    return this
  }
  removePropertyClasses() {
    const removePropertyClasses = this.#getPropertyClasses(...arguments);
    let removePropertyClassIndex = removePropertyClasses.length - 1;
    while(removePropertyClassIndex > -1) {
      const { propertyClassIndex, propertyClass } = removePropertyClasses[removePropertyClassIndex];
      const { names, definition } = propertyClass;
      const propertyClassInstances = this[names.multiple.nonformal];
      if(definition.object) {
        if(definition.object === 'Array') {
          let propertyClassInstanceIndex = propertyClassInstances.length - 1;
          while(propertyClassInstanceIndex > -1) {
            propertyClassInstances.splice(propertyClassInstanceIndex, 1);
            propertyClassInstanceIndex--;
          }
        }
        else if(definition.object === 'Object') {
          for(const [
            $propertyClassInstanceName, $propertyClassInstance
          ] of Object.entries(this[names.multiple.nonformal])) {
            delete propertyClassInstances[$propertyClassInstanceName];
          }
        }
        delete this[`_${names.multiple.nonformal}`];
        Object.defineProperty(this, names.multiple.nonformal, {
          configurable: true, enumerable: false, writable: true, 
          value: undefined
        });
        delete this[names.multiple.nonformal];
        delete this[`${names.minister.ad.nonformal}${names.multiple.formal}`];
        delete this[`${names.minister.dead.nonformal}${names.multiple.formal}`];
      }
      else {
        delete this[names.monople.nonformal];
        Object.defineProperty(this, names.monople.nonformal, {
          configurable: true, enumerable: false, writable: true, 
          value: undefined
        });
      }
      this.#propertyClasses.splice(propertyClassIndex, 1);
      removePropertyClassIndex--;
    }
    return this
  }
  getEvents() {
    const getEvents = [];
    const events = this.#events;
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
    const events = this.#events;
    for(let $event of $events) {
      $event = recursiveAssign(
        {
          target: {
            assign: 'addEventListener',
            deassign: 'removeEventListener',
            accessors: ['[]', 'get']
          },
          context: this
        }, 
        $event,
      );
      const coreEvent = new CoreEvent($event);
      events.push(coreEvent);
    }
    return this
  }
  removeEvents() {
    let $events;
    if(arguments.length === 0) { $events = this.getEvents(); }
    else if(arguments.length === 1) {
      $events = this.getEvents(arguments[0]);
    }
    if($events.length === 0) return this
    let eventsIndex = $events.length - 1;
    while(eventsIndex > -1) {
      const event = $events[eventsIndex];
      const removeEventIndex = this.#events.findIndex(
        ($event) => $event === event
      );
      if(removeEventIndex !== -1) {
        event.enable = false;
        this.#events.splice(eventsIndex, 1);
      }
      eventsIndex--;
    }
    return this
  }
  enableEvents() {
    let $events;
    if(
      arguments.length === 0 ||
      arguments[0] === true
    ) { $events = this.#events; }
    else { $events = this.getEvents(arguments[0]); }
    return this.#toggleEventAbility('Assign', $events)
  }
  disableEvents() {
    let $events;
    if(arguments.length === 0) { $events = this.#events; }
    else { $events = this.getEvents(arguments[0]); }
    return this.#toggleEventAbility('Deassign', $events)
  }
  reenableEvents() {
    return this
    .disableEvents(...arguments)
    .enableEvents(...arguments)
  }
  #toggleEventAbility($eventListenerMethod, $events) {
    let enability;
    if($eventListenerMethod === 'Assign') { enability = true; }
    else if($eventListenerMethod === 'Deassign') { enability = false; }
    else { return this }
    for(const $event of $events) { $event.enable = enability; }
    return this
  }
}

export { Core, index as Coutil };
//# sourceMappingURL=core-plex.js.map
