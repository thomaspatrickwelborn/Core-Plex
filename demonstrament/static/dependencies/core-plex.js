function impandEvents($propEvents) {
  if(!Array.isArray($propEvents)) { return $propEvents }
  const propEvents = {};
  iteratePropEvents: 
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
  iteratePropEvents:
  for(const [
    $propEventSettings, $propEventListener
  ] of Object.entries($propEvents)) {
    const propEventSettings = $propEventSettings.split(' ');
    let path, type, listener, options;
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
      options = $propEventListener[1];
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

const Options = {
  depth: 0,
  maxDepth: 10,
};
function propertyDirectory($object, $options) {
  const target = [];
  const options = Object.assign({}, Options, $options);
  options.depth++;
  if(options.depth > options.maxDepth) { return target }
  iterateObjectProperties: 
  for(const [$key, $value] of Object.entries($object)) {
    target.push($key);
    if(
      typeof $value === 'object' &&
      $value !== null &&
      $value !== $object
    ) {
      const subtarget = propertyDirectory($value, options);
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

const typeOf = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function recursiveAssign() {
  const $arguments = [...arguments];
  const $target = $arguments.shift();
  if(!$target) { return $target }
  const $sources = $arguments;
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue);
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey]);
      let target;
      if(typeOfTargetPropertyValue === 'undefined') {
        if(typeOfSourcePropertyValue === 'array') { target = []; }
        else if(typeOfSourcePropertyValue === 'object') { target = {}; }
      }
      else { target = $target[$sourcePropertyKey]; }
      if(['array', 'object'].includes(typeOfSourcePropertyValue)) {
        $target[$sourcePropertyKey] = recursiveAssign(
          target, $sourcePropertyValue
        );
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue;
      }
    }
  }
  return $target
}

function recursiveAssignConcat() {
  const $arguments = [...arguments];
  const $target = $arguments.shift();
  if(!$target) { return $target }
  const $sources = $arguments;
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue);
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey]);
      if(typeOfTargetPropertyValue === 'undefined') {
        if(typeOfSourcePropertyValue === 'array') {
          $target[$sourcePropertyKey] = Array.prototype.concat([], $sourcePropertyValue);
        }
        else if(typeOfSourcePropertyValue === 'object') {
          $target[$sourcePropertyKey] = Object.assign({}, $sourcePropertyValue);
        }
        else {
          $target[$sourcePropertyKey] = $sourcePropertyValue;
        }
      }
      else if(typeOfSourcePropertyValue === 'array') {
        $target[$sourcePropertyKey] = $target[$sourcePropertyKey].concat($sourcePropertyValue);
      }
      else if(typeOfSourcePropertyValue === 'object') {
        $target[$sourcePropertyKey] = recursiveAssignConcat(
          $target, $sourcePropertyValue
        );
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue;
      }
    }
  }
  return $target
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  expandEvents: expandEvents,
  impandEvents: impandEvents,
  propertyDirectory: propertyDirectory,
  recursiveAssign: recursiveAssign,
  recursiveAssignConcat: recursiveAssignConcat,
  typeOf: typeOf
});

var Settings$1 = Object.freeze({
  events: {},
  enableEvents: false,
  propertyDefinitions: Object.freeze({
    getEvents: 'getEvents',
    addEvents: 'addEvents',
    removeEvents: 'removeEvents',
    enableEvents: 'enableEvents',
    disableEvents: 'disableEvents',
    reenableEvents: 'reenableEvents',
  })
});

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

var Settings = {
  propertyDirectory: {
    maxDepth: 10,
  },
  path: ':scope',
  enable: false,
  accessors: ['[]', 'get'],
  accessors: [
    ($target, $property) => $target[$property],
    ($target, $property) => $target?.get($property),
  ],
  target: undefined,
  assign: 'addEventListener',
  deassign: 'removeEventListener',
  methods: {
    assign: {
      addEventListener: function($target) {
        const { type, listener, settings } = this;
        const { options, useCapture } = settings;
        return $target['addEventListener'](type, listener, options || useCapture)
      },
      on: function($target) {
        const { type, listener, settings } = this;
        return $target['on'](type, listener)
      },
      once: function($target) {
        const { type, listener } = this;
        return $target['once'](type, listener)
      },
    },  
    deassign: {
      removeEventListener: function($target) {
        const { type, listener, settings } = this;
        const { options, useCapture } = settings;
        return $target['removeEventListener'](type, listener, options || useCapture)
      },
      off: function($target) {
        const { type, listener } = this;
        return $target['off'](type, listener)
      },
    },
  },
};

class EventDefinition {
  #settings
  #enable = false
  #listener
  #path
  #_target
  #_targets = []
  #_assign
  #_deassign
  constructor($settings) { 
    this.#settings = Object.assign({}, Settings, $settings);
    this.enable = this.settings.enable;
  }
  get settings() { return this.#settings }
  get path() { return this.settings.path }
  get type() { return this.settings.type }
  get listener() { return this.settings.listener }
  get #context() { return this.settings.context }
  get #methods() { return this.settings.methods }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets;
    let propertyDirectory = this.#propertyDirectory;
    const targetPaths = [];
    const targets = [];
    const typeOfPath = typeOf(this.path);
    if(this.target) {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget?.path === this.path
      );
      if(pretargetElement !== undefined) {
        targets.push(pretargetElement);
      }
      else if(pretargetElement === undefined) {
        targets.push({
          path: this.path,
          target: this.target,
          enable: false,
        });
      }
    }
    else if(['array', 'string'].includes(typeOfPath)) {
      const propertyPathMatcher = outmatch(this.path, {
        separator: '.',
      });
      iteratePropertyPaths: 
      for(const $propertyPath of propertyDirectory) {
        const propertyPathMatch = propertyPathMatcher($propertyPath);
        if(propertyPathMatch === true) { targetPaths.push($propertyPath); }
      }
      iterateTargetPaths: 
      for(const $targetPath of targetPaths) {
        const pretargetElement = pretargets.find(
          ($pretarget) => $pretarget?.path === $targetPath
        );
        let target = this.#context;
        let targetElement;
        const pathKeys = $targetPath.split('.');
        let pathKeysIndex = 0;
        iterateTargetPathKeys: 
        while(pathKeysIndex < pathKeys.length) {
          let pathKey = pathKeys[pathKeysIndex];
          if(pathKeysIndex === 0 && pathKey === ':scope') {
            break iterateTargetPathKeys
          }
          iterateTargetAccessors: 
          for(const $targetAccessor of this.settings.accessors) {
            if(target === undefined) { break iterateTargetAccessors }
            target = $targetAccessor(target, pathKey);
            if(target !== undefined) { break iterateTargetAccessors }
          }
          pathKeysIndex++;
        }
        if(target !== undefined) {
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
        }
        if(targetElement !== undefined) { targets.push(targetElement); }
      }
    }
    this.#_targets = targets;
    return this.#_targets
  }
  get #propertyDirectory() {
    return propertyDirectory(this.#context, this.settings.propertyDirectory)
  }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets;
    iterateTargetElements: 
    for(const targetElement of targets) {
      const { path, target, enable } = targetElement;
      const settings = this.settings;
      if(enable === $enable) { continue iterateTargetElements }
      try {
        if($enable === true) {
          this.#assign(target);
        }
        else if($enable === false) {
          this.#deassign(target);
        }
        targetElement.enable = $enable;
      }
      catch($err) { console.error($err); }
    }
    this.#enable = $enable;
  }
  get #assign() {
    if(this.#_assign !== undefined) { return this.#_assign }
    this.#_assign = this.settings.methods.assign[this.settings.assign].bind(this);
    return this.#_assign
  }
  get #deassign() {
    if(this.#_deassign !== undefined) { return this.#_deassign }
    this.#_deassign = this.settings.methods.deassign[this.settings.deassign].bind(this);
    return this.#_deassign
  }
}

class Core extends EventTarget {
  static implement = function ($target, $settings) {
    const settings = recursiveAssign({}, Settings$1, $settings);
    const events = [];
    Object.defineProperties($target, {
      // Get Events
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: function getEvents() {
          if(arguments.length === 0) { return events }
          const getEvents = [];
          const $events = [].concat(arguments[0]);
          iterateEvents: 
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
      },
      // Add Events
      [settings.propertyDefinitions.addEvents]: {
        enumerable: false, writable: false, 
        value: function addEvents() {
          let $events;
          if(arguments[0] === undefined) {
            $events = expandEvents(settings.events);
          }
          else {
            $events = expandEvents(arguments[0]);
          }
          iterateEvents: 
          for(let $event of $events) {
            $event = recursiveAssign({ context: $target }, $event);
            const eventDefinition = new EventDefinition($event);
            events.push(eventDefinition);
          }
          return $target
        },
      },
      // Remove Events
      [settings.propertyDefinitions.removeEvents]: {
        enumerable: false, writable: false, 
        value: function removeEvents() {
          let $events;
          if(arguments.length === 0) { $events = $target[settings.propertyDefinitions.getEvents](); }
          else if(arguments.length === 1) {
            $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          }
          if($events.length === 0) return $target
          let eventsIndex = $events.length - 1;
          iterateEvents: 
          while(eventsIndex > -1) {
            const event = $events[eventsIndex];
            const removeEventIndex = events.findIndex(
              ($event) => $event === event
            );
            if(removeEventIndex !== -1) {
              event.enable = false;
              events.splice(eventsIndex, 1);
            }
            eventsIndex--;
          }
          return $target
        }
      },
      // Enable Events
      [settings.propertyDefinitions.enableEvents]: {
        enumerable: false, writable: false, 
        value: function enableEvents() {
          let $events;
          if(
            arguments.length === 0 ||
            arguments[0] === true
          ) { $events = events; }
          else { $events = $target[settings.propertyDefinitions.getEvents](arguments[0]); }
          iterateEvents: for(const $event of $events) { $event.enable = true; }
          return $target
        },
      },
      // Disable Events
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: function disableEvents() {
          let $events;
          if(arguments.length === 0) { $events = events; }
          else { $events = $target[settings.propertyDefinitions.getEvents](arguments[0]); }
          iterateEvents: for(const $event of $events) { $event.enable = false; }
          return $target
        },
      },
      // Reenable Events
      [settings.propertyDefinitions.reenableEvents]: {
        enumerable: false, writable: false, 
        value: function reenableEvents() {
          $target[settings.propertyDefinitions.disableEvents](...arguments);
          $target[settings.propertyDefinitions.enableEvents](...arguments);
          return $target
        },
      },
    });
    if(settings.events) { $target[settings.propertyDefinitions.addEvents](settings.events); }
    if(settings.enableEvents) { $target[settings.propertyDefinitions.enableEvents](settings.enableEvents); }
    return $target
  }
  constructor($settings = {}) {
    super();
    return Core.implement(this, $settings)
  }
}

export { Core, index as Coutil };
//# sourceMappingURL=core-plex.js.map
