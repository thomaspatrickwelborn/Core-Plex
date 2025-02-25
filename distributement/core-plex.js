var dist = {};

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	Object.defineProperty(dist, "__esModule", { value: true });
	dist.TokenData = void 0;
	dist.parse = parse;
	dist.compile = compile;
	dist.match = match;
	dist.pathToRegexp = pathToRegexp;
	dist.stringify = stringify;
	const DEFAULT_DELIMITER = "/";
	const NOOP_VALUE = (value) => value;
	const ID_START = /^[$_\p{ID_Start}]$/u;
	const ID_CONTINUE = /^[$\u200c\u200d\p{ID_Continue}]$/u;
	const DEBUG_URL = "https://git.new/pathToRegexpError";
	const SIMPLE_TOKENS = {
	    // Groups.
	    "{": "{",
	    "}": "}",
	    // Reserved.
	    "(": "(",
	    ")": ")",
	    "[": "[",
	    "]": "]",
	    "+": "+",
	    "?": "?",
	    "!": "!",
	};
	/**
	 * Escape text for stringify to path.
	 */
	function escapeText(str) {
	    return str.replace(/[{}()\[\]+?!:*]/g, "\\$&");
	}
	/**
	 * Escape a regular expression string.
	 */
	function escape(str) {
	    return str.replace(/[.+*?^${}()[\]|/\\]/g, "\\$&");
	}
	/**
	 * Tokenize input string.
	 */
	function* lexer(str) {
	    const chars = [...str];
	    let i = 0;
	    function name() {
	        let value = "";
	        if (ID_START.test(chars[++i])) {
	            value += chars[i];
	            while (ID_CONTINUE.test(chars[++i])) {
	                value += chars[i];
	            }
	        }
	        else if (chars[i] === '"') {
	            let pos = i;
	            while (i < chars.length) {
	                if (chars[++i] === '"') {
	                    i++;
	                    pos = 0;
	                    break;
	                }
	                if (chars[i] === "\\") {
	                    value += chars[++i];
	                }
	                else {
	                    value += chars[i];
	                }
	            }
	            if (pos) {
	                throw new TypeError(`Unterminated quote at ${pos}: ${DEBUG_URL}`);
	            }
	        }
	        if (!value) {
	            throw new TypeError(`Missing parameter name at ${i}: ${DEBUG_URL}`);
	        }
	        return value;
	    }
	    while (i < chars.length) {
	        const value = chars[i];
	        const type = SIMPLE_TOKENS[value];
	        if (type) {
	            yield { type, index: i++, value };
	        }
	        else if (value === "\\") {
	            yield { type: "ESCAPED", index: i++, value: chars[i++] };
	        }
	        else if (value === ":") {
	            const value = name();
	            yield { type: "PARAM", index: i, value };
	        }
	        else if (value === "*") {
	            const value = name();
	            yield { type: "WILDCARD", index: i, value };
	        }
	        else {
	            yield { type: "CHAR", index: i, value: chars[i++] };
	        }
	    }
	    return { type: "END", index: i, value: "" };
	}
	class Iter {
	    constructor(tokens) {
	        this.tokens = tokens;
	    }
	    peek() {
	        if (!this._peek) {
	            const next = this.tokens.next();
	            this._peek = next.value;
	        }
	        return this._peek;
	    }
	    tryConsume(type) {
	        const token = this.peek();
	        if (token.type !== type)
	            return;
	        this._peek = undefined; // Reset after consumed.
	        return token.value;
	    }
	    consume(type) {
	        const value = this.tryConsume(type);
	        if (value !== undefined)
	            return value;
	        const { type: nextType, index } = this.peek();
	        throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}: ${DEBUG_URL}`);
	    }
	    text() {
	        let result = "";
	        let value;
	        while ((value = this.tryConsume("CHAR") || this.tryConsume("ESCAPED"))) {
	            result += value;
	        }
	        return result;
	    }
	}
	/**
	 * Tokenized path instance.
	 */
	class TokenData {
	    constructor(tokens) {
	        this.tokens = tokens;
	    }
	}
	dist.TokenData = TokenData;
	/**
	 * Parse a string for the raw tokens.
	 */
	function parse(str, options = {}) {
	    const { encodePath = NOOP_VALUE } = options;
	    const it = new Iter(lexer(str));
	    function consume(endType) {
	        const tokens = [];
	        while (true) {
	            const path = it.text();
	            if (path)
	                tokens.push({ type: "text", value: encodePath(path) });
	            const param = it.tryConsume("PARAM");
	            if (param) {
	                tokens.push({
	                    type: "param",
	                    name: param,
	                });
	                continue;
	            }
	            const wildcard = it.tryConsume("WILDCARD");
	            if (wildcard) {
	                tokens.push({
	                    type: "wildcard",
	                    name: wildcard,
	                });
	                continue;
	            }
	            const open = it.tryConsume("{");
	            if (open) {
	                tokens.push({
	                    type: "group",
	                    tokens: consume("}"),
	                });
	                continue;
	            }
	            it.consume(endType);
	            return tokens;
	        }
	    }
	    const tokens = consume("END");
	    return new TokenData(tokens);
	}
	/**
	 * Compile a string to a template function for the path.
	 */
	function compile(path, options = {}) {
	    const { encode = encodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
	    const data = path instanceof TokenData ? path : parse(path, options);
	    const fn = tokensToFunction(data.tokens, delimiter, encode);
	    return function path(data = {}) {
	        const [path, ...missing] = fn(data);
	        if (missing.length) {
	            throw new TypeError(`Missing parameters: ${missing.join(", ")}`);
	        }
	        return path;
	    };
	}
	function tokensToFunction(tokens, delimiter, encode) {
	    const encoders = tokens.map((token) => tokenToFunction(token, delimiter, encode));
	    return (data) => {
	        const result = [""];
	        for (const encoder of encoders) {
	            const [value, ...extras] = encoder(data);
	            result[0] += value;
	            result.push(...extras);
	        }
	        return result;
	    };
	}
	/**
	 * Convert a single token into a path building function.
	 */
	function tokenToFunction(token, delimiter, encode) {
	    if (token.type === "text")
	        return () => [token.value];
	    if (token.type === "group") {
	        const fn = tokensToFunction(token.tokens, delimiter, encode);
	        return (data) => {
	            const [value, ...missing] = fn(data);
	            if (!missing.length)
	                return [value];
	            return [""];
	        };
	    }
	    const encodeValue = encode || NOOP_VALUE;
	    if (token.type === "wildcard" && encode !== false) {
	        return (data) => {
	            const value = data[token.name];
	            if (value == null)
	                return ["", token.name];
	            if (!Array.isArray(value) || value.length === 0) {
	                throw new TypeError(`Expected "${token.name}" to be a non-empty array`);
	            }
	            return [
	                value
	                    .map((value, index) => {
	                    if (typeof value !== "string") {
	                        throw new TypeError(`Expected "${token.name}/${index}" to be a string`);
	                    }
	                    return encodeValue(value);
	                })
	                    .join(delimiter),
	            ];
	        };
	    }
	    return (data) => {
	        const value = data[token.name];
	        if (value == null)
	            return ["", token.name];
	        if (typeof value !== "string") {
	            throw new TypeError(`Expected "${token.name}" to be a string`);
	        }
	        return [encodeValue(value)];
	    };
	}
	/**
	 * Transform a path into a match function.
	 */
	function match(path, options = {}) {
	    const { decode = decodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
	    const { regexp, keys } = pathToRegexp(path, options);
	    const decoders = keys.map((key) => {
	        if (decode === false)
	            return NOOP_VALUE;
	        if (key.type === "param")
	            return decode;
	        return (value) => value.split(delimiter).map(decode);
	    });
	    return function match(input) {
	        const m = regexp.exec(input);
	        if (!m)
	            return false;
	        const path = m[0];
	        const params = Object.create(null);
	        for (let i = 1; i < m.length; i++) {
	            if (m[i] === undefined)
	                continue;
	            const key = keys[i - 1];
	            const decoder = decoders[i - 1];
	            params[key.name] = decoder(m[i]);
	        }
	        return { path, params };
	    };
	}
	function pathToRegexp(path, options = {}) {
	    const { delimiter = DEFAULT_DELIMITER, end = true, sensitive = false, trailing = true, } = options;
	    const keys = [];
	    const sources = [];
	    const flags = sensitive ? "" : "i";
	    const paths = Array.isArray(path) ? path : [path];
	    const items = paths.map((path) => path instanceof TokenData ? path : parse(path, options));
	    for (const { tokens } of items) {
	        for (const seq of flatten(tokens, 0, [])) {
	            const regexp = sequenceToRegExp(seq, delimiter, keys);
	            sources.push(regexp);
	        }
	    }
	    let pattern = `^(?:${sources.join("|")})`;
	    if (trailing)
	        pattern += `(?:${escape(delimiter)}$)?`;
	    pattern += end ? "$" : `(?=${escape(delimiter)}|$)`;
	    const regexp = new RegExp(pattern, flags);
	    return { regexp, keys };
	}
	/**
	 * Generate a flat list of sequence tokens from the given tokens.
	 */
	function* flatten(tokens, index, init) {
	    if (index === tokens.length) {
	        return yield init;
	    }
	    const token = tokens[index];
	    if (token.type === "group") {
	        const fork = init.slice();
	        for (const seq of flatten(token.tokens, 0, fork)) {
	            yield* flatten(tokens, index + 1, seq);
	        }
	    }
	    else {
	        init.push(token);
	    }
	    yield* flatten(tokens, index + 1, init);
	}
	/**
	 * Transform a flat sequence of tokens into a regular expression.
	 */
	function sequenceToRegExp(tokens, delimiter, keys) {
	    let result = "";
	    let backtrack = "";
	    let isSafeSegmentParam = true;
	    for (let i = 0; i < tokens.length; i++) {
	        const token = tokens[i];
	        if (token.type === "text") {
	            result += escape(token.value);
	            backtrack += token.value;
	            isSafeSegmentParam || (isSafeSegmentParam = token.value.includes(delimiter));
	            continue;
	        }
	        if (token.type === "param" || token.type === "wildcard") {
	            if (!isSafeSegmentParam && !backtrack) {
	                throw new TypeError(`Missing text after "${token.name}": ${DEBUG_URL}`);
	            }
	            if (token.type === "param") {
	                result += `(${negate(delimiter, isSafeSegmentParam ? "" : backtrack)}+)`;
	            }
	            else {
	                result += `([\\s\\S]+)`;
	            }
	            keys.push(token);
	            backtrack = "";
	            isSafeSegmentParam = false;
	            continue;
	        }
	    }
	    return result;
	}
	function negate(delimiter, backtrack) {
	    if (backtrack.length < 2) {
	        if (delimiter.length < 2)
	            return `[^${escape(delimiter + backtrack)}]`;
	        return `(?:(?!${escape(delimiter)})[^${escape(backtrack)}])`;
	    }
	    if (delimiter.length < 2) {
	        return `(?:(?!${escape(backtrack)})[^${escape(delimiter)}])`;
	    }
	    return `(?:(?!${escape(backtrack)}|${escape(delimiter)})[\\s\\S])`;
	}
	/**
	 * Stringify token data into a path string.
	 */
	function stringify(data) {
	    return data.tokens
	        .map(function stringifyToken(token, index, tokens) {
	        if (token.type === "text")
	            return escapeText(token.value);
	        if (token.type === "group") {
	            return `{${token.tokens.map(stringifyToken).join("")}}`;
	        }
	        const isSafe = isNameSafe(token.name) && isNextNameSafe(tokens[index + 1]);
	        const key = isSafe ? token.name : JSON.stringify(token.name);
	        if (token.type === "param")
	            return `:${key}`;
	        if (token.type === "wildcard")
	            return `*${key}`;
	        throw new TypeError(`Unexpected token: ${token}`);
	    })
	        .join("");
	}
	function isNameSafe(name) {
	    const [first, ...rest] = name;
	    if (!ID_START.test(first))
	        return false;
	    return rest.every((char) => ID_CONTINUE.test(char));
	}
	function isNextNameSafe(token) {
	    if ((token === null || token === void 0 ? void 0 : token.type) !== "text")
	        return true;
	    return !ID_CONTINUE.test(token.value[0]);
	}
	
	return dist;
}

requireDist();

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
    if(typeof $value === 'object') {
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

function Instate(
  $propertyClass, $property, $value
) { return $value }
function Deinstate(
  $propertyClass, $property
) { return $propertyClass.target[$property] }

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
    const Instate$1 = this.#propertyClass.States.Instate || Instate;
    const Definition = this.#propertyClass.Definition;
    return function set($target, $property, $value) {
      if(
        Definition.Object === "Array" && 
        $property === 'length'
      ) {
        $target[$property] = $value;
      }
      else {
        $target[$property] = Instate$1(this.#propertyClass, $property, $value);
      }
      return true
    }
  }
  get deleteProperty() {
    const Deinstate$1 = this.#propertyClass.States.Deinstate || Deinstate;
    return function deleteProperty($target, $property) {
      Deinstate$1(this.#propertyClass, $property);
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
    this.#_target = typedObjectLiteral(this.Definition.Object);
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
  get ID() { return this.#settings.ID }
  get Name() { return this.#settings.Name }
  get Names() { return this.#settings.Names }
  get Events() { return this.#settings.Events }
  get States() { return this.#settings.States }
  get Definition() { return this.#settings.Definition }
}

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
      iterateTargetAccessors: 
      for(const $TargetAccessor of this.#propertyClassEvents.TargetAccessors) {
        if($TargetAccessor === '[]') {
          target = target[pathKey];
        }
        else if($TargetAccessor === 'get') {
          target = target?.get(pathKey);
        }
        if(target !== undefined) { break iterateTargetAccessors }
      }
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

var Settings = {
  events: [/* {
    type: "click",
    target "views.",
  } */],
  propertyClasses: [/* {
    ID: "VIEW",
    Name: "views",
    Class: View,
    Names: {
      Monople: { Formal: "View", Nonformal: "view" },
      Multiple: { Formal: "Views", Nonformal: "views" },
      Minister: {
        Ad: { Formal: "Add", Nonformal: "add" },
        Dead: { Formal: "Remove", Nonformal: "remove" },
      },
    },
    Events: {
      Assign: "addEventListener", // "on",
      Deassign: "removeEventListener", // "off",
      TargetAccessors: ["[]", "get"],
    },
    States: {
      Instate: function Instate($propertyClass, $property, $value) {},
      Deinstate: function Deinstate($propertyClass, $property) {},
    },
    Definition: {
      Object: Array, // Object, // undefined,
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
  #_propertyClassEvents
  #_propertyClasses = []
  static propertyClasses = []
  constructor($settings = {}, $options = {}) {
    super();
    this.settings = $settings;
    this.options = $options;
    this.addPropertyClasses(this.settings.propertyClasses);
    this.#addProperties(this.settings);
    this.addEvents(this.settings.events);
    this.#defineProperties(this.options.defineProperties);
    this.#assign(...this.options.assign);
    if(this.options.enableEvents) this.enableEvents(this.options.enableEvents); 
  }
  get #propertyDirectory() { return pathkeyTree(this) }
  get #propertyClassEvents() {
    if(this.#_propertyClassEvents !== undefined) return this.#_propertyClassEvents
    this.#_propertyClassEvents = {};
    for(const $propertyClass of this.#propertyClasses) {
      this.#_propertyClassEvents[$propertyClass.Name] = $propertyClass.Events;
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
  get #events() {
    if(this.#_events !== undefined) return this.#_events
    this.#_events = [];
    return this.#_events
  }
  get #propertyClasses() { return this.#_propertyClasses }
  #getPropertyClass() {
    const { ID, Name } = arguments[0];
    let propertyClass;
    for(const $propertyClass of this.#propertyClasses) {
      if(
        ID && $propertyClass.ID === ID ||
        Name && $propertyClass.Name === Name
      ) { propertyClass = $propertyClass; }
    }
    return propertyClass
  }
  #addProperties() {
    for(const $propertyClass of this.#propertyClasses) {
      const { Name, Names, Definition } = $propertyClass;
      if(Definition.Object !== undefined) {
        this[`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`](this.settings[Name]);
      }
      else if(this.settings[Name] !== undefined) {
        this[Name] = this.settings[Name];
      }
    }
    return this
  }
  addPropertyClasses() {
    const $this = this;
    let $propertyClasses = (arguments.length === 0)
      ? this.settings.propertyClasses
      : arguments[0];
    if(
      !Array.isArray($propertyClasses) &&
      typeof $propertyClasses === 'object'
    ) {
      $propertyClasses = Object.values(arguments[0]);
    }
    const propertyClasses = this.#propertyClasses;
    for(const $propertyClass of $propertyClasses) {
      // Class States
      $propertyClass.States = $propertyClass.States || {};
      $propertyClass.Definition = $propertyClass.Definition || {};
      // Class Instate
      if($propertyClass.States.Instate === undefined) {
        $propertyClass.States.Instate = Instate; 
      }
      // Class Deinstate
      if($propertyClass.States.Deinstate === undefined) {
        $propertyClass.States.Deinstate = Deinstate; 
      }
      const {
        ID,
        Name,
        Names,
        Events,
        States,
        Definition,
      } = $propertyClass;
      let propertyValue;
      if(
        Definition.Object === "Array" || 
        Definition.Object === "Object"
      ) {
        Object.defineProperties(this, {
          // Property Class Instances
          [Name]: {
            configurable: true, enumerable: true,  
            get() {
              if(propertyValue !== undefined) {
                return propertyValue
              }
              propertyValue = new PropertyClass($propertyClass, $this);
              return propertyValue
            },
            set($propertyClassInstances) {
              const propertyClassInstances = $this[Name];
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
          // Add Property Class Instances
          [`${Names.Minister.Ad.Nonformal}${Names.Multiple.Formal}`]: {
            configurable: true, enumerable: false, writable: false, 
            value: function() {
              const $arguments = [...arguments];
              if($arguments.length === 1) {
                const [$values] = $arguments;
                if(Definition.Object === "Array") {
                  $this[Name] = Object.entries($values);
                }
                else {
                  if(Array.isArray($values)) {
                    $this[Name] = Object.fromEntries($values);
                  }
                  else {
                    $this[Name] = $values;
                  }
                }
              }
              else if($arguments.length === 2) {
                const [$key, $value] = $arguments;
                $this[Name] = { [$key]: $value };
              }
              return $this
            }
          },
          // Remove Property Class Instances
          [`${Names.Minister.Dead.Nonformal}${Names.Multiple.Formal}`]: {
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
                removeKeys.push(...Object.keys($this[Name]));
              }
              for(const $removeKey of $removeKeys) {
                delete $this[Name][$removeKey];
              }
              return $this
            }
          },
        });
      }
      else {
        Object.defineProperties(this, {
          [Names.Monople.Nonformal]: {
            get() {
              return propertyValue
            },
            set($propertyClassInstance) {
              propertyValue = States.Instate(Object.assign({
                core: this
              }, $propertyClass), Name, $propertyClassInstance);
            }
          },
        });
      }
      propertyClasses.push($propertyClass);
    }
    return this
  }
  removePropertyClasses() {
    let removePropertyClasses = [];
    if(arguments.length === 0) { removePropertyClasses = removePropertyClasses.concat(
      Object.keys(this.#propertyClasses)
    ); }
    else if(arguments.length === 1) {
      const $removePropertyClasses = arguments[0];
      const typeofRemovePropertyClasses = typeOf($removePropertyClasses);
      if(
        typeofRemovePropertyClasses === 'string'
      ) {
        removePropertyClasses = removePropertyClasses.concat($removePropertyClasses);
      }
      else if(typeofRemovePropertyClasses === 'array') {
        removePropertyClasses = removePropertyClasses.concat($removePropertyClasses);
      }
      else if(typeofRemovePropertyClasses === 'object') {
        removePropertyClasses = removePropertyClasses.concat(Object.keys($removePropertyClasses));
      }
    }
    for(const $removePropertyClassName of removePropertyClasses) {
      const { Names, Definition } = this.#getPropertyClass({ Name: $removePropertyClassName });
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
      const propertyClassName = $event.path.split('.').shift();
      const propertyClassEvents = Object.assign(
        {}, 
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
    if($eventListenerMethod === 'Assign') { enability = true; }
    else if($eventListenerMethod === 'Deassign') { enability = false; }
    else { return this }
    for(const $event of $events) { $event.enable = enability; }
    return this
  }
}

export { Core, index as Coutil };
//# sourceMappingURL=core-plex.js.map
