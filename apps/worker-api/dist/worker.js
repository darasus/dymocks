/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/json-logic-js/logic.js":
/*!*************************************************!*\
  !*** ../../node_modules/json-logic-js/logic.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* globals define,module */
/*
Using a Universal Module Loader that should be browser, require, and AMD friendly
http://ricostacruz.com/cheatsheets/umdjs.html
*/
;(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function() {
  "use strict";
  /* globals console:false */

  if ( ! Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }

  /**
   * Return an array that contains no duplicates (original not modified)
   * @param  {array} array   Original reference array
   * @return {array}         New array with no duplicates
   */
  function arrayUnique(array) {
    var a = [];
    for (var i=0, l=array.length; i<l; i++) {
      if (a.indexOf(array[i]) === -1) {
        a.push(array[i]);
      }
    }
    return a;
  }

  var jsonLogic = {};
  var operations = {
    "==": function(a, b) {
      return a == b;
    },
    "===": function(a, b) {
      return a === b;
    },
    "!=": function(a, b) {
      return a != b;
    },
    "!==": function(a, b) {
      return a !== b;
    },
    ">": function(a, b) {
      return a > b;
    },
    ">=": function(a, b) {
      return a >= b;
    },
    "<": function(a, b, c) {
      return (c === undefined) ? a < b : (a < b) && (b < c);
    },
    "<=": function(a, b, c) {
      return (c === undefined) ? a <= b : (a <= b) && (b <= c);
    },
    "!!": function(a) {
      return jsonLogic.truthy(a);
    },
    "!": function(a) {
      return !jsonLogic.truthy(a);
    },
    "%": function(a, b) {
      return a % b;
    },
    "log": function(a) {
      console.log(a); return a;
    },
    "in": function(a, b) {
      if (!b || typeof b.indexOf === "undefined") return false;
      return (b.indexOf(a) !== -1);
    },
    "cat": function() {
      return Array.prototype.join.call(arguments, "");
    },
    "substr": function(source, start, end) {
      if (end < 0) {
        // JavaScript doesn't support negative end, this emulates PHP behavior
        var temp = String(source).substr(start);
        return temp.substr(0, temp.length + end);
      }
      return String(source).substr(start, end);
    },
    "+": function() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
        return parseFloat(a, 10) + parseFloat(b, 10);
      }, 0);
    },
    "*": function() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
        return parseFloat(a, 10) * parseFloat(b, 10);
      });
    },
    "-": function(a, b) {
      if (b === undefined) {
        return -a;
      } else {
        return a - b;
      }
    },
    "/": function(a, b) {
      return a / b;
    },
    "min": function() {
      return Math.min.apply(this, arguments);
    },
    "max": function() {
      return Math.max.apply(this, arguments);
    },
    "merge": function() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
        return a.concat(b);
      }, []);
    },
    "var": function(a, b) {
      var not_found = (b === undefined) ? null : b;
      var data = this;
      if (typeof a === "undefined" || a==="" || a===null) {
        return data;
      }
      var sub_props = String(a).split(".");
      for (var i = 0; i < sub_props.length; i++) {
        if (data === null || data === undefined) {
          return not_found;
        }
        // Descending into data
        data = data[sub_props[i]];
        if (data === undefined) {
          return not_found;
        }
      }
      return data;
    },
    "missing": function() {
      /*
      Missing can receive many keys as many arguments, like {"missing:[1,2]}
      Missing can also receive *one* argument that is an array of keys,
      which typically happens if it's actually acting on the output of another command
      (like 'if' or 'merge')
      */

      var missing = [];
      var keys = Array.isArray(arguments[0]) ? arguments[0] : arguments;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = jsonLogic.apply({"var": key}, this);
        if (value === null || value === "") {
          missing.push(key);
        }
      }

      return missing;
    },
    "missing_some": function(need_count, options) {
      // missing_some takes two arguments, how many (minimum) items must be present, and an array of keys (just like 'missing') to check for presence.
      var are_missing = jsonLogic.apply({"missing": options}, this);

      if (options.length - are_missing.length >= need_count) {
        return [];
      } else {
        return are_missing;
      }
    },
  };

  jsonLogic.is_logic = function(logic) {
    return (
      typeof logic === "object" && // An object
      logic !== null && // but not null
      ! Array.isArray(logic) && // and not an array
      Object.keys(logic).length === 1 // with exactly one key
    );
  };

  /*
  This helper will defer to the JsonLogic spec as a tie-breaker when different language interpreters define different behavior for the truthiness of primitives.  E.g., PHP considers empty arrays to be falsy, but Javascript considers them to be truthy. JsonLogic, as an ecosystem, needs one consistent answer.

  Spec and rationale here: http://jsonlogic.com/truthy
  */
  jsonLogic.truthy = function(value) {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return !! value;
  };


  jsonLogic.get_operator = function(logic) {
    return Object.keys(logic)[0];
  };

  jsonLogic.get_values = function(logic) {
    return logic[jsonLogic.get_operator(logic)];
  };

  jsonLogic.apply = function(logic, data) {
    // Does this array contain logic? Only one way to find out.
    if (Array.isArray(logic)) {
      return logic.map(function(l) {
        return jsonLogic.apply(l, data);
      });
    }
    // You've recursed to a primitive, stop!
    if ( ! jsonLogic.is_logic(logic) ) {
      return logic;
    }

    var op = jsonLogic.get_operator(logic);
    var values = logic[op];
    var i;
    var current;
    var scopedLogic;
    var scopedData;
    var initial;

    // easy syntax for unary operators, like {"var" : "x"} instead of strict {"var" : ["x"]}
    if ( ! Array.isArray(values)) {
      values = [values];
    }

    // 'if', 'and', and 'or' violate the normal rule of depth-first calculating consequents, let each manage recursion as needed.
    if (op === "if" || op == "?:") {
      /* 'if' should be called with a odd number of parameters, 3 or greater
      This works on the pattern:
      if( 0 ){ 1 }else{ 2 };
      if( 0 ){ 1 }else if( 2 ){ 3 }else{ 4 };
      if( 0 ){ 1 }else if( 2 ){ 3 }else if( 4 ){ 5 }else{ 6 };

      The implementation is:
      For pairs of values (0,1 then 2,3 then 4,5 etc)
      If the first evaluates truthy, evaluate and return the second
      If the first evaluates falsy, jump to the next pair (e.g, 0,1 to 2,3)
      given one parameter, evaluate and return it. (it's an Else and all the If/ElseIf were false)
      given 0 parameters, return NULL (not great practice, but there was no Else)
      */
      for (i = 0; i < values.length - 1; i += 2) {
        if ( jsonLogic.truthy( jsonLogic.apply(values[i], data) ) ) {
          return jsonLogic.apply(values[i+1], data);
        }
      }
      if (values.length === i+1) {
        return jsonLogic.apply(values[i], data);
      }
      return null;
    } else if (op === "and") { // Return first falsy, or last
      for (i=0; i < values.length; i+=1) {
        current = jsonLogic.apply(values[i], data);
        if ( ! jsonLogic.truthy(current)) {
          return current;
        }
      }
      return current; // Last
    } else if (op === "or") {// Return first truthy, or last
      for (i=0; i < values.length; i+=1) {
        current = jsonLogic.apply(values[i], data);
        if ( jsonLogic.truthy(current) ) {
          return current;
        }
      }
      return current; // Last
    } else if (op === "filter") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if ( ! Array.isArray(scopedData)) {
        return [];
      }
      // Return only the elements from the array in the first argument,
      // that return truthy when passed to the logic in the second argument.
      // For parity with JavaScript, reindex the returned array
      return scopedData.filter(function(datum) {
        return jsonLogic.truthy( jsonLogic.apply(scopedLogic, datum));
      });
    } else if (op === "map") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if ( ! Array.isArray(scopedData)) {
        return [];
      }

      return scopedData.map(function(datum) {
        return jsonLogic.apply(scopedLogic, datum);
      });
    } else if (op === "reduce") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      initial = typeof values[2] !== "undefined" ? values[2] : null;

      if ( ! Array.isArray(scopedData)) {
        return initial;
      }

      return scopedData.reduce(
        function(accumulator, current) {
          return jsonLogic.apply(
            scopedLogic,
            {current: current, accumulator: accumulator}
          );
        },
        initial
      );
    } else if (op === "all") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      // All of an empty set is false. Note, some and none have correct fallback after the for loop
      if ( ! Array.isArray(scopedData) || ! scopedData.length) {
        return false;
      }
      for (i=0; i < scopedData.length; i+=1) {
        if ( ! jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
          return false; // First falsy, short circuit
        }
      }
      return true; // All were truthy
    } else if (op === "none") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if ( ! Array.isArray(scopedData) || ! scopedData.length) {
        return true;
      }
      for (i=0; i < scopedData.length; i+=1) {
        if ( jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
          return false; // First truthy, short circuit
        }
      }
      return true; // None were truthy
    } else if (op === "some") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if ( ! Array.isArray(scopedData) || ! scopedData.length) {
        return false;
      }
      for (i=0; i < scopedData.length; i+=1) {
        if ( jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
          return true; // First truthy, short circuit
        }
      }
      return false; // None were truthy
    }

    // Everyone else gets immediate depth-first recursion
    values = values.map(function(val) {
      return jsonLogic.apply(val, data);
    });


    // The operation is called with "data" bound to its "this" and "values" passed as arguments.
    // Structured commands like % or > can name formal arguments while flexible commands (like missing or merge) can operate on the pseudo-array arguments
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
    if (operations.hasOwnProperty(op) && typeof operations[op] === "function") {
      return operations[op].apply(data, values);
    } else if (op.indexOf(".") > 0) { // Contains a dot, and not in the 0th position
      var sub_ops = String(op).split(".");
      var operation = operations;
      for (i = 0; i < sub_ops.length; i++) {
        if (!operation.hasOwnProperty(sub_ops[i])) {
          throw new Error("Unrecognized operation " + op +
            " (failed at " + sub_ops.slice(0, i+1).join(".") + ")");
        }
        // Descending into operations
        operation = operation[sub_ops[i]];
      }

      return operation.apply(data, values);
    }

    throw new Error("Unrecognized operation " + op );
  };

  jsonLogic.uses_data = function(logic) {
    var collection = [];

    if (jsonLogic.is_logic(logic)) {
      var op = jsonLogic.get_operator(logic);
      var values = logic[op];

      if ( ! Array.isArray(values)) {
        values = [values];
      }

      if (op === "var") {
        // This doesn't cover the case where the arg to var is itself a rule.
        collection.push(values[0]);
      } else {
        // Recursion!
        values.forEach(function(val) {
          collection.push.apply(collection, jsonLogic.uses_data(val) );
        });
      }
    }

    return arrayUnique(collection);
  };

  jsonLogic.add_operation = function(name, code) {
    operations[name] = code;
  };

  jsonLogic.rm_operation = function(name) {
    delete operations[name];
  };

  jsonLogic.rule_like = function(rule, pattern) {
    // console.log("Is ". JSON.stringify(rule) . " like " . JSON.stringify(pattern) . "?");
    if (pattern === rule) {
      return true;
    } // TODO : Deep object equivalency?
    if (pattern === "@") {
      return true;
    } // Wildcard!
    if (pattern === "number") {
      return (typeof rule === "number");
    }
    if (pattern === "string") {
      return (typeof rule === "string");
    }
    if (pattern === "array") {
      // !logic test might be superfluous in JavaScript
      return Array.isArray(rule) && ! jsonLogic.is_logic(rule);
    }

    if (jsonLogic.is_logic(pattern)) {
      if (jsonLogic.is_logic(rule)) {
        var pattern_op = jsonLogic.get_operator(pattern);
        var rule_op = jsonLogic.get_operator(rule);

        if (pattern_op === "@" || pattern_op === rule_op) {
          // echo "\nOperators match, go deeper\n";
          return jsonLogic.rule_like(
            jsonLogic.get_values(rule, false),
            jsonLogic.get_values(pattern, false)
          );
        }
      }
      return false; // pattern is logic, rule isn't, can't be eq
    }

    if (Array.isArray(pattern)) {
      if (Array.isArray(rule)) {
        if (pattern.length !== rule.length) {
          return false;
        }
        /*
          Note, array order MATTERS, because we're using this array test logic to consider arguments, where order can matter. (e.g., + is commutative, but '-' or 'if' or 'var' are NOT)
        */
        for (var i = 0; i < pattern.length; i += 1) {
          // If any fail, we fail
          if ( ! jsonLogic.rule_like(rule[i], pattern[i])) {
            return false;
          }
        }
        return true; // If they *all* passed, we pass
      } else {
        return false; // Pattern is array, rule isn't
      }
    }

    // Not logic, not array, not a === match for rule.
    return false;
  };

  return jsonLogic;
}));


/***/ }),

/***/ "../../node_modules/murmurhash/murmurhash.js":
/*!***************************************************!*\
  !*** ../../node_modules/murmurhash/murmurhash.js ***!
  \***************************************************/
/***/ ((module) => {

(function(){
  const _global = this;

  const createBuffer = (val) => new TextEncoder().encode(val)

  /**
   * JS Implementation of MurmurHash2
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {Uint8Array | string} str ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV2(str, seed) {
    if (typeof str === 'string') str = createBuffer(str);
    let
      l = str.length,
      h = seed ^ l,
      i = 0,
      k;

    while (l >= 4) {
      k =
        ((str[i] & 0xff)) |
        ((str[++i] & 0xff) << 8) |
        ((str[++i] & 0xff) << 16) |
        ((str[++i] & 0xff) << 24);

      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
      k ^= k >>> 24;
      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

      l -= 4;
      ++i;
    }

    switch (l) {
    case 3: h ^= (str[i + 2] & 0xff) << 16;
    case 2: h ^= (str[i + 1] & 0xff) << 8;
    case 1: h ^= (str[i] & 0xff);
            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    }

    h ^= h >>> 13;
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h ^= h >>> 15;

    return h >>> 0;
  };

  /*
   * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {Uint8Array | string} key ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV3(key, seed) {
    if (typeof key === 'string') key = createBuffer(key);

    let remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
          ((key[i] & 0xff)) |
          ((key[++i] & 0xff) << 8) |
          ((key[++i] & 0xff) << 16) |
          ((key[++i] & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
          h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
      case 3: k1 ^= (key[i + 2] & 0xff) << 16;
      case 2: k1 ^= (key[i + 1] & 0xff) << 8;
      case 1: k1 ^= (key[i] & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  }

  const murmur = MurmurHashV3;
  murmur.v2 = MurmurHashV2;
  murmur.v3 = MurmurHashV3;

  if (true) {
    module.exports = murmur;
  } else {}
}());


/***/ }),

/***/ "./datafile.ts":
/*!*********************!*\
  !*** ./datafile.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.datafile = void 0;
exports.datafile = {
    experiments: {
        'experiment.name.one': {
            id: 'experiment.name.one',
            percentage: 90,
            variations: [
                {
                    id: 'control',
                    percentage: 50,
                },
                {
                    id: 'variate-1',
                    percentage: 25,
                },
                {
                    id: 'variate-2',
                    percentage: 25,
                },
            ],
        },
        'experiment.name.two': {
            id: 'experiment.name.two',
            percentage: 100,
            variations: [
                {
                    id: 'control',
                    percentage: 50,
                },
                {
                    id: 'variate-1',
                    percentage: 50,
                },
            ],
            audience: {
                '==': [{ var: 'countryCode' }, 'us'],
            },
        },
    },
    features: {
        'feature.name.one': {
            id: 'feature.name.one',
            percentage: 50,
        },
    },
};


/***/ }),

/***/ "./src/handler.ts":
/*!************************!*\
  !*** ./src/handler.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleRequest = void 0;
const routes_1 = __webpack_require__(/*! ./routes */ "./src/routes.ts");
async function handleRequest(request) {
    const url = new URL(request.url);
    const handler = routes_1.routes[url.pathname];
    if (!handler) {
        return new Response('Not found', { status: 404 });
    }
    return handler(request);
}
exports.handleRequest = handleRequest;


/***/ }),

/***/ "./src/lib/exp/AudienceEvaluator.ts":
/*!******************************************!*\
  !*** ./src/lib/exp/AudienceEvaluator.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AudienceEvaluator = void 0;
const jsonLogic = __importStar(__webpack_require__(/*! json-logic-js */ "../../node_modules/json-logic-js/logic.js"));
class AudienceEvaluator {
    evaluate(audience = {}, attributes = {}) {
        return jsonLogic.apply(audience, attributes);
    }
}
exports.AudienceEvaluator = AudienceEvaluator;


/***/ }),

/***/ "./src/lib/exp/Bucketer.ts":
/*!*********************************!*\
  !*** ./src/lib/exp/Bucketer.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bucketer = void 0;
const murmurhash = __importStar(__webpack_require__(/*! murmurhash */ "../../node_modules/murmurhash/murmurhash.js"));
class Bucketer {
    static HASH_SEED = 1;
    static MAX_HASH_VALUE = Math.pow(2, 32) - 1;
    maxBuckets;
    constructor(maxBuckets) {
        this.maxBuckets = maxBuckets;
    }
    computeBucketId(id) {
        const hashValue = murmurhash.v3(id, Bucketer.HASH_SEED);
        const ratio = hashValue / Bucketer.MAX_HASH_VALUE;
        return Math.floor(ratio * this.maxBuckets);
    }
    bucket(key, allocations) {
        const bucketId = this.computeBucketId(key);
        const allocation = allocations.find((allocation) => bucketId < allocation.rangeEnd);
        if (allocation) {
            return allocation.id;
        }
        return null;
    }
}
exports.Bucketer = Bucketer;


/***/ }),

/***/ "./src/lib/exp/Config.ts":
/*!*******************************!*\
  !*** ./src/lib/exp/Config.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
class Config {
    datafile;
    maxBuckets;
    constructor(datafile, maxBuckets) {
        this.datafile = datafile;
        this.maxBuckets = maxBuckets;
    }
    computeRangeEnd(percentage) {
        return Math.floor((percentage * this.maxBuckets) / 100);
    }
    getExperiments() {
        const { experiments = {} } = this.datafile;
        return experiments;
    }
    getExperiment(id) {
        const experiments = this.getExperiments();
        return experiments[id];
    }
    getFeatures() {
        const { features = {} } = this.datafile;
        return features;
    }
    getFeature(id) {
        const features = this.getFeatures();
        return features[id];
    }
    getFeatureAllocation(id) {
        const feature = this.getFeature(id);
        if (!feature) {
            return;
        }
        const rangeEnd = this.computeRangeEnd(feature.percentage);
        return { id, rangeEnd };
    }
    getExperimentAllocation(id) {
        const experiment = this.getExperiment(id);
        if (!experiment) {
            return;
        }
        const rangeEnd = this.computeRangeEnd(experiment.percentage);
        return { id, rangeEnd };
    }
    getExperimentAllocations(id) {
        const experiment = this.getExperiment(id);
        let acc = 0;
        return experiment.variations.map(({ id, percentage }) => {
            acc += percentage;
            const rangeEnd = this.computeRangeEnd(acc);
            return { id, rangeEnd };
        });
    }
}
exports.Config = Config;


/***/ }),

/***/ "./src/lib/exp/Engine.ts":
/*!*******************************!*\
  !*** ./src/lib/exp/Engine.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Engine = void 0;
const AudienceEvaluator_1 = __webpack_require__(/*! ./AudienceEvaluator */ "./src/lib/exp/AudienceEvaluator.ts");
const Bucketer_1 = __webpack_require__(/*! ./Bucketer */ "./src/lib/exp/Bucketer.ts");
const Config_1 = __webpack_require__(/*! ./Config */ "./src/lib/exp/Config.ts");
class Engine {
    static TOTAL_BUCKETS = 10000;
    static TRAFFIC_ALLOCATION_SALT = 'tas';
    config;
    bucketer;
    evaluator;
    userId;
    attributes;
    storage;
    cache = {};
    constructor({ datafile, userId, attributes, storage, }) {
        this.config = new Config_1.Config(datafile, Engine.TOTAL_BUCKETS);
        this.bucketer = new Bucketer_1.Bucketer(Engine.TOTAL_BUCKETS);
        this.evaluator = new AudienceEvaluator_1.AudienceEvaluator();
        this.storage = storage;
        this.userId = userId;
        this.attributes = attributes;
    }
    computeKey(id, userId = '', salt = '') {
        return (userId || this.userId || '').concat(id).concat(salt);
    }
    getForcedVariation(experimentId) {
        console.log(JSON.stringify(this.cache));
        return this.cache[experimentId];
    }
    getUserId() {
        return this.userId;
    }
    getAttributes() {
        return this.attributes;
    }
    setUserId(userId) {
        this.userId = userId;
    }
    setAttributes(attributes = {}) {
        this.attributes = attributes;
    }
    setForcedVariation(experimentId, variationId) {
        this.cache[experimentId] = variationId;
    }
    isFeatureEnabled(featureId, userId, attributes) {
        const key = this.computeKey(featureId, userId);
        const feature = this.config.getFeature(featureId);
        if (!feature) {
            return null;
        }
        const { audience } = feature;
        const allocation = this.config.getFeatureAllocation(featureId);
        if (!allocation ||
            !this.evaluator.evaluate(audience, attributes || this.attributes)) {
            return null;
        }
        return !!this.bucketer.bucket(key, [allocation]);
    }
    getFeature(featureId) {
        return this.config.getFeature(featureId);
    }
    getEnabledFeatures(userId, attributes) {
        const features = this.config.getFeatures();
        return Object.keys(features).reduce((features, featureId) => {
            return {
                ...features,
                [featureId]: this.isFeatureEnabled(featureId, userId, attributes),
            };
        }, {});
    }
    async getVariationId(experimentId, userId, attributes) {
        let variationId = this.getForcedVariation(experimentId) ||
            (await this.storage?.get(experimentId));
        if (variationId) {
            return variationId;
        }
        const experiment = this.config.getExperiment(experimentId);
        if (!experiment) {
            return null;
        }
        const { audience } = experiment;
        if (!this.evaluator.evaluate(audience, attributes || this.attributes)) {
            return null;
        }
        let key = this.computeKey(experimentId, userId, Engine.TRAFFIC_ALLOCATION_SALT);
        const allocation = this.config.getExperimentAllocation(experimentId);
        if (!allocation || !this.bucketer.bucket(key, [allocation])) {
            return null;
        }
        key = this.computeKey(experimentId, userId);
        const allocations = this.config.getExperimentAllocations(experimentId);
        variationId = this.bucketer.bucket(key, allocations);
        await this.storage?.store(experimentId, variationId);
        return variationId;
    }
    async getVariationIds(userId, attributes) {
        const experiments = this.config.getExperiments();
        const keys = Object.keys(experiments);
        const results = await Promise.all(keys.map((key) => this.getVariationId(key, userId, attributes)));
        return keys.reduce((experiments, experimentId, i) => {
            return {
                ...experiments,
                [experimentId]: results[i],
            };
        }, {});
    }
}
exports.Engine = Engine;


/***/ }),

/***/ "./src/lib/exp/storage.ts":
/*!********************************!*\
  !*** ./src/lib/exp/storage.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.storage = void 0;
const storage = (userId) => ({
    get: async (key) => {
        const value = await EXPERIMENTS.get(`${userId}:${key}`);
        return value;
    },
    store: async (key, val) => {
        await EXPERIMENTS.put(`${userId}:${key}`, val);
    },
});
exports.storage = storage;


/***/ }),

/***/ "./src/routes.ts":
/*!***********************!*\
  !*** ./src/routes.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.routes = void 0;
const Engine_1 = __webpack_require__(/*! ./lib/exp/Engine */ "./src/lib/exp/Engine.ts");
const datafile_1 = __webpack_require__(/*! ../datafile */ "./datafile.ts");
const storage_1 = __webpack_require__(/*! ./lib/exp/storage */ "./src/lib/exp/storage.ts");
exports.routes = {
    '/api/experiment': async (request) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId') || undefined;
        const countryCode = url.searchParams.get('countryCode') || undefined;
        const engine = new Engine_1.Engine({
            datafile: datafile_1.datafile,
            ...(userId ? { storage: (0, storage_1.storage)(userId) } : {}),
        });
        const value = await engine.getVariationIds(userId, {
            countryCode,
        });
        return new Response(JSON.stringify(value) || null);
    },
    '/api/experiment/create': () => {
        return new Response(null);
    },
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const handler_1 = __webpack_require__(/*! ./handler */ "./src/handler.ts");
addEventListener('fetch', (event) => {
    event.respondWith((0, handler_1.handleRequest)(event.request));
});

})();

/******/ })()
;
//# sourceMappingURL=worker.js.map