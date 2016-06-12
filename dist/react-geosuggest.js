(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Geosuggest = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
/**
 * lodash 4.0.6 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @type {Function}
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred function to be invoked.
 */
var now = Date.now;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide an options object to indicate whether `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent calls
 * to the debounced function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime = 0,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (!lastCallTime || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    clearTimeout(timerId);
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastCallTime = lastInvokeTime = 0;
    lastArgs = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (window.React);

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _propTypes = require('./prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _filterInputAttributes = require('./filter-input-attributes');

var _filterInputAttributes2 = _interopRequireDefault(_filterInputAttributes);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _suggestList = require('./suggest-list');

var _suggestList2 = _interopRequireDefault(_suggestList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global window */

// Escapes special characters in user input for regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * Entry point for the Geosuggest component
 */

var Geosuggest = function (_React$Component) {
  _inherits(Geosuggest, _React$Component);

  /**
   * The constructor. Sets the initial state.
   * @param  {Object} props The properties object.
   */

  function Geosuggest(props) {
    _classCallCheck(this, Geosuggest);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Geosuggest).call(this, props));

    _this.state = {
      isSuggestsHidden: true,
      userInput: props.initialValue,
      activeSuggest: null,
      suggests: [],
      timer: null
    };

    _this.onInputChange = _this.onInputChange.bind(_this);
    _this.onAfterInputChange = _this.onAfterInputChange.bind(_this);

    if (props.queryDelay) {
      _this.onAfterInputChange = (0, _lodash2.default)(_this.onAfterInputChange, props.queryDelay);
    }
    return _this;
  }

  /**
   * Change inputValue if prop changes
   * @param {Object} props The new props
   */


  _createClass(Geosuggest, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (this.props.initialValue !== props.initialValue) {
        this.setState({ userInput: props.initialValue });
      }
    }

    /**
     * Called on the client side after component is mounted.
     * Google api sdk object will be obtained and cached as a instance property.
     * Necessary objects of google api will also be determined and saved.
     */

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}

    /**
     * When the component will unmount
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.state.timer);
    }

    /**
     * When the input got changed
     * @param {String} userInput The input value of the user
     */

  }, {
    key: 'onInputChange',
    value: function onInputChange(userInput) {
      this.setState({ userInput: userInput }, this.onAfterInputChange);
    }
  }, {
    key: 'onAfterInputChange',
    value: function onAfterInputChange() {
      this.showSuggests();
      this.props.onChange(this.state.userInput);
    }

    /**
     * When the input gets focused
     */

  }, {
    key: 'onInputFocus',
    value: function onInputFocus() {
      this.props.onFocus();
      this.showSuggests();
    }

    /**
     * When the input gets blurred
     */

  }, {
    key: 'onInputBlur',
    value: function onInputBlur() {
      if (!this.state.ignoreBlur) {
        this.hideSuggests();
      }
    }

    /**
     * Focus the input
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.refs.input.focus();
    }

    /**
     * Update the value of the user input
     * @param {String} userInput the new value of the user input
     */

  }, {
    key: 'update',
    value: function update(userInput) {
      this.setState({ userInput: userInput });
      this.props.onChange(userInput);
    }

    /*
     * Clear the input and close the suggestion pane
     */

  }, {
    key: 'clear',
    value: function clear() {
      var _this2 = this;

      this.setState({ userInput: '' }, function () {
        return _this2.hideSuggests();
      });
    }

    /**
     * Search for new suggests
     */

  }, {
    key: 'searchSuggests',
    value: function searchSuggests() {
      var _this3 = this;

      if (!this.state.userInput) {
        this.updateSuggests();
        return;
      }

      var options = {
        query: this.state.userInput,
        output: 'json',
        ak: 'zaGZEDHau49KNhe4lQGs7f75'
      };

      ['location', 'region'].forEach(function (option) {
        if (_this3.props[option]) {
          options[option] = _this3.props[option];
        }
      });

      window.$.ajax({
        type: 'get',
        url: 'http://api.map.baidu.com/place/v2/suggestion',
        data: options,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function success(data) {
          if (data.status === 0) {
            _this3.updateSuggests(data.result);
          } else {
            _this3.updateSuggests([]);
          }
          if (_this3.props.autoActivateFirstSuggest) {
            _this3.activateSuggest('next');
          }
        },
        error: function error() {
          _this3.updateSuggests([]);
          _this3.activateSuggest('next');
        }
      });
    }

    /**
     * Update the suggests
     * @param  {Array} suggestsGoogle The new google suggests
     */

  }, {
    key: 'updateSuggests',
    value: function updateSuggests() {
      var _this4 = this;

      var suggestsBaidu = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var suggests = [],
          regex = new RegExp(escapeRegExp(this.state.userInput), 'gim'),
          skipSuggest = this.props.skipSuggest,
          maxFixtures = 10,
          fixturesSearched = 0;

      this.props.fixtures.forEach(function (suggest) {
        if (fixturesSearched >= maxFixtures) {
          return;
        }

        if (!skipSuggest(suggest) && suggest.label.match(regex)) {
          fixturesSearched++;

          suggest.placeId = suggest.label;
          suggest.isFixture = true;
          suggests.push(suggest);
        }
      });

      suggestsBaidu.forEach(function (suggest) {
        if (!skipSuggest(suggest)) {
          suggests.push({
            label: _this4.props.getSuggestLabel(suggest),
            placeId: suggest.uid,
            isFixture: false,
            location: suggest.location,
            city: {
              id: suggest.cityid,
              name: suggest.name
            },
            business: suggest.business,
            district: suggest.district
          });
        }
      });

      this.setState({ suggests: suggests });
    }

    /**
     * Show the suggestions
     */

  }, {
    key: 'showSuggests',
    value: function showSuggests() {
      this.searchSuggests();
      this.setState({ isSuggestsHidden: false });
    }

    /**
     * Hide the suggestions
     */

  }, {
    key: 'hideSuggests',
    value: function hideSuggests() {
      var _this5 = this;

      this.props.onBlur(this.state.userInput);
      var timer = setTimeout(function () {
        _this5.setState({ isSuggestsHidden: true });
      }, 100);

      this.setState({ timer: timer });
    }

    /**
     * Activate a new suggest
     * @param {String} direction The direction in which to activate new suggest
     */

  }, {
    key: 'activateSuggest',
    value: function activateSuggest(direction) {
      // eslint-disable-line complexity
      if (this.state.isSuggestsHidden) {
        this.showSuggests();
        return;
      }

      var suggestsCount = this.state.suggests.length - 1,
          next = direction === 'next';
      var newActiveSuggest = null,
          newIndex = 0,
          i = 0;

      for (i; i <= suggestsCount; i++) {
        if (this.state.suggests[i] === this.state.activeSuggest) {
          newIndex = next ? i + 1 : i - 1;
        }
      }

      if (!this.state.activeSuggest) {
        newIndex = next ? 0 : suggestsCount;
      }

      if (newIndex >= 0 && newIndex <= suggestsCount) {
        newActiveSuggest = this.state.suggests[newIndex];
      }

      this.props.onActivateSuggest(newActiveSuggest);

      this.setState({ activeSuggest: newActiveSuggest });
    }

    /**
     * When an item got selected
     * @param {GeosuggestItem} suggest The selected suggest item
     */

  }, {
    key: 'selectSuggest',
    value: function selectSuggest(suggest) {
      if (!suggest) {
        suggest = {
          label: this.state.userInput
        };
      }

      this.setState({
        isSuggestsHidden: true,
        userInput: suggest.label
      });

      if (suggest.location) {
        this.setState({ ignoreBlur: false });
        this.props.onSuggestSelect(suggest);
        return;
      }

      this.props.onSuggestSelect(suggest);
    }

    /**
     * Render the view
     * @return {Function} The React element to render
     */

  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var attributes = (0, _filterInputAttributes2.default)(this.props),
          classes = (0, _classnames2.default)('geosuggest', this.props.className),
          input = _react2.default.createElement(_input2.default, _extends({ className: this.props.inputClassName,
        ref: 'input',
        value: this.state.userInput,
        ignoreTab: this.props.ignoreTab,
        onChange: this.onInputChange,
        onFocus: this.onInputFocus.bind(this),
        onBlur: this.onInputBlur.bind(this),
        style: this.props.style.input,
        onNext: function onNext() {
          return _this6.activateSuggest('next');
        },
        onPrev: function onPrev() {
          return _this6.activateSuggest('prev');
        },
        onSelect: function onSelect() {
          return _this6.selectSuggest(_this6.state.activeSuggest);
        },
        onEscape: this.hideSuggests.bind(this) }, attributes)),
          suggestionsList = _react2.default.createElement(_suggestList2.default, { isHidden: this.state.isSuggestsHidden,
        style: this.props.style.suggests,
        suggestItemStyle: this.props.style.suggestItem,
        suggests: this.state.suggests,
        activeSuggest: this.state.activeSuggest,
        onSuggestMouseDown: function onSuggestMouseDown() {
          return _this6.setState({ ignoreBlur: true });
        },
        onSuggestMouseOut: function onSuggestMouseOut() {
          return _this6.setState({ ignoreBlur: false });
        },
        onSuggestSelect: this.selectSuggest.bind(this) });

      return _react2.default.createElement(
        'div',
        { className: classes },
        _react2.default.createElement(
          'div',
          { className: 'geosuggest__input-wrapper' },
          input
        ),
        _react2.default.createElement(
          'div',
          { className: 'geosuggest__suggests-wrapper' },
          suggestionsList
        )
      );
    }
  }]);

  return Geosuggest;
}(_react2.default.Component);

/**
 * Types for the properties
 * @type {Object}
 */


Geosuggest.propTypes = _propTypes2.default;

/**
 * Default values for the properties
 * @type {Object}
 */
Geosuggest.defaultProps = _defaults2.default;

exports.default = Geosuggest;

},{"./defaults":4,"./filter-input-attributes":5,"./input":6,"./prop-types":7,"./suggest-list":9,"classnames":1,"lodash.debounce":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Default values
 */
exports.default = {
  fixtures: [],
  initialValue: '',
  placeholder: '搜索地名',
  disabled: false,
  className: '',
  inputClassName: '',
  location: null,
  radius: null,
  bounds: null,
  country: null,
  types: null,
  queryDelay: 250,
  googleMaps: null,
  onActivateSuggest: function onActivateSuggest() {},
  onSuggestSelect: function onSuggestSelect() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onChange: function onChange() {},
  skipSuggest: function skipSuggest() {},
  getSuggestLabel: function getSuggestLabel(suggest) {
    return suggest.name;
  },
  autoActivateFirstSuggest: false,
  style: {
    'input': {},
    'suggests': {},
    'suggestItem': {}
  },
  ignoreTab: false
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  var attributes = {};

  allowedAttributes.forEach(function (allowedAttribute) {
    if (props[allowedAttribute]) {
      attributes[allowedAttribute] = props[allowedAttribute];
    }
  });

  return attributes;
};

/**
 * Attributes allowed on input elements
 */
var allowedAttributes = ['autoFocus', 'disabled', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'height', 'id', 'inputMode', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'spellCheck', 'tabIndex'];

/**
 * Filter the properties for only allowed input properties
 * @param  {Object} props The properties to filter
 * @return {Object} The filtered, allowed properties
 */

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (window.React);

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _filterInputAttributes = require('./filter-input-attributes');

var _filterInputAttributes2 = _interopRequireDefault(_filterInputAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


/**
 * The input field
 * @param {Object} props The component's props
 * @return {JSX} The icon component.
 */

var Input = function (_React$Component) {
  _inherits(Input, _React$Component);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Input).apply(this, arguments));
  }

  _createClass(Input, [{
    key: 'onChange',

    /**
     * When the input got changed
     */
    value: function onChange() {
      this.props.onChange(this.refs.input.value);
    }

    /**
     * When a key gets pressed in the input
     * @param  {Event} event The keypress event
     */

  }, {
    key: 'onInputKeyDown',
    value: function onInputKeyDown(event) {
      switch (event.which) {
        case 40:
          // DOWN
          event.preventDefault();
          this.props.onNext();
          break;
        case 38:
          // UP
          event.preventDefault();
          this.props.onPrev();
          break;
        case 13:
          // ENTER
          event.preventDefault();
          this.props.onSelect();
          break;
        case 9:
          // TAB
          if (!this.props.ignoreTab) {
            this.props.onSelect();
          }
          break;
        case 27:
          // ESC
          this.props.onEscape();
          break;
        default:
          break;
      }
    }

    /**
     * Focus the input
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.refs.input.focus();
    }

    /**
     * Render the view
     * @return {Function} The React element to render
     */

  }, {
    key: 'render',
    value: function render() {
      var attributes = (0, _filterInputAttributes2.default)(this.props),
          classes = (0, _classnames2.default)('geosuggest__input', this.props.className);

      return _react2.default.createElement('input', _extends({ className: classes,
        ref: 'input',
        type: 'text',
        autoComplete: 'off'
      }, attributes, {
        value: this.props.value,
        style: this.props.style,
        onKeyDown: this.onInputKeyDown.bind(this),
        onChange: this.onChange.bind(this),
        onFocus: this.props.onFocus.bind(this),
        onBlur: this.props.onBlur.bind(this) }));
    }
  }]);

  return Input;
}(_react2.default.Component);

/**
 * Default values for the properties
 * @type {Object}
 */


Input.defaultProps = {
  className: '',
  value: '',
  ignoreTab: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onNext: function onNext() {},
  onPrev: function onPrev() {},
  onSelect: function onSelect() {},
  onEscape: function onEscape() {}
};

exports.default = Input;

},{"./filter-input-attributes":5,"classnames":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (window.React);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default values
 */
exports.default = {
  fixtures: _react2.default.PropTypes.array,
  initialValue: _react2.default.PropTypes.string,
  placeholder: _react2.default.PropTypes.string,
  disabled: _react2.default.PropTypes.bool,
  className: _react2.default.PropTypes.string,
  inputClassName: _react2.default.PropTypes.string,
  location: _react2.default.PropTypes.object,
  radius: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  bounds: _react2.default.PropTypes.object,
  country: _react2.default.PropTypes.string,
  types: _react2.default.PropTypes.array,
  queryDelay: _react2.default.PropTypes.number,
  googleMaps: _react2.default.PropTypes.object,
  onSuggestSelect: _react2.default.PropTypes.func,
  onFocus: _react2.default.PropTypes.func,
  onBlur: _react2.default.PropTypes.func,
  onChange: _react2.default.PropTypes.func,
  skipSuggest: _react2.default.PropTypes.func,
  getSuggestLabel: _react2.default.PropTypes.func,
  autoActivateFirstSuggest: _react2.default.PropTypes.bool,
  style: _react2.default.PropTypes.shape({
    input: _react2.default.PropTypes.object,
    suggests: _react2.default.PropTypes.object,
    suggestItem: _react2.default.PropTypes.object
  }),
  ignoreTab: _react2.default.PropTypes.bool
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (window.React);

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A single Geosuggest item in the list
 * @param {Object} props The component's props
 * @return {JSX} The icon component.
 */

exports.default = function (_ref) {
  var _ref$isActive = _ref.isActive;
  var isActive = _ref$isActive === undefined ? false : _ref$isActive;
  var _ref$className = _ref.className;
  var className = _ref$className === undefined ? '' : _ref$className;
  var _ref$suggest = _ref.suggest;
  var suggest = _ref$suggest === undefined ? {} : _ref$suggest;
  var _ref$onMouseDown = _ref.onMouseDown;
  var onMouseDown = _ref$onMouseDown === undefined ? function () {} : _ref$onMouseDown;
  var _ref$onMouseOut = _ref.onMouseOut;
  var onMouseOut = _ref$onMouseOut === undefined ? function () {} : _ref$onMouseOut;
  var _ref$onSelect = _ref.onSelect;
  var onSelect = _ref$onSelect === undefined ? function () {} : _ref$onSelect;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var classes = (0, _classnames2.default)('geosuggest-item', className, { 'geosuggest-item--active': isActive });

  return _react2.default.createElement(
    'li',
    { className: classes,
      style: style,
      onMouseDown: onMouseDown,
      onMouseOut: onMouseOut,
      onClick: function onClick(event) {
        event.preventDefault();
        onSelect();
      } },
    suggest.label
  );
}; // eslint-disable-line no-unused-vars

},{"classnames":1}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (window.React);

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _suggestItem = require('./suggest-item');

var _suggestItem2 = _interopRequireDefault(_suggestItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The list with suggestions. Either from an API or provided as fixture
 * @param {Object} props The component's props
 * @return {JSX} The icon component.
 */
// eslint-disable-line no-unused-vars

exports.default = function (_ref) {
  var _ref$isHidden = _ref.isHidden;
  var isHidden = _ref$isHidden === undefined ? true : _ref$isHidden;
  var _ref$suggests = _ref.suggests;
  var suggests = _ref$suggests === undefined ? [] : _ref$suggests;
  var activeSuggest = _ref.activeSuggest;
  var _ref$onSuggestMouseDo = _ref.onSuggestMouseDown;
  var onSuggestMouseDown = _ref$onSuggestMouseDo === undefined ? function () {} : _ref$onSuggestMouseDo;
  var _ref$onSuggestMouseOu = _ref.onSuggestMouseOut;
  var onSuggestMouseOut = _ref$onSuggestMouseOu === undefined ? function () {} : _ref$onSuggestMouseOu;
  var _ref$onSuggestSelect = _ref.onSuggestSelect;
  var onSuggestSelect = _ref$onSuggestSelect === undefined ? function () {} : _ref$onSuggestSelect;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var _ref$suggestItemStyle = _ref.suggestItemStyle;
  var suggestItemStyle = _ref$suggestItemStyle === undefined ? {} : _ref$suggestItemStyle;

  var classes = (0, _classnames2.default)('geosuggest__suggests', { 'geosuggest__suggests--hidden': isHidden || suggests.length === 0 });
  return _react2.default.createElement(
    'ul',
    { className: classes, style: style },
    suggests.map(function (suggest) {
      var isActive = activeSuggest && suggest.placeId === activeSuggest.placeId;

      return _react2.default.createElement(_suggestItem2.default, { key: suggest.placeId,
        className: suggest.className,
        suggest: suggest,
        style: suggestItemStyle,
        isActive: isActive,
        onMouseDown: onSuggestMouseDown,
        onMouseOut: onSuggestMouseOut,
        onSelect: function onSelect() {
          return onSuggestSelect(suggest);
        } });
    })
  );
};

},{"./suggest-item":8,"classnames":1}]},{},[3])(3)
});