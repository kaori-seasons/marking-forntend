function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileOverview The BaseUtil method based on the lodash.
 * @author huangtonger@aliyun.com
 * @see https://github.com/lodash/lodash
 */
var MAX_LEVEL = 5;

var Util = require('@antv/util/lib');

Math.sign = function (x) {
  x = +x;

  if (x === 0 || isNaN(x)) {
    return x;
  }

  return x > 0 ? 1 : -1;
};

var BaseUtil = _objectSpread({}, Util, {
  throttle: require('lodash/throttle'),
  debounce: require('lodash/debounce'),

  /**
   * The opposite of pick; this method creates an object composed of the own and inherited enumerable property paths of object that are not omitted.
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   * omit(object, ['a', 'c']); // => { 'b': '2' }
   * @param  {object}      object - input object
   * @param  {function}    array - condition array
   * @return  {object}     result object
   */
  omit: function omit(object, array) {
    var rst = {};
    Util.each(object, function (value, key) {
      if (array.indexOf(key) === -1) {
        rst[key] = value;
      }
    });
    return rst;
  },

  /**
   * traverse tree
   * @param  {object}      parent      parent
   * @param  {function}    callback    callback
   * @param  {function}    getChild    get child function
   * @param  {boolean}     runSelf     callback run self or not
   */
  traverseTree: function traverseTree(parent, callback, getChild, runSelf) {
    if (runSelf === void 0) {
      runSelf = false;
    }

    var children = getChild(parent);
    runSelf && callback(parent, null, null);
    children && BaseUtil.each(children, function (child, index) {
      callback(child, parent, index);
      BaseUtil.traverseTree(child, callback, getChild);
    });
  },

  /**
   * turn padding into [top, right, bottom, right]
   * @param  {Number|Array} padding input padding
   * @return {array} output
   */
  toAllPadding: function toAllPadding(padding) {
    var top = 0;
    var left = 0;
    var right = 0;
    var bottom = 0;

    if (BaseUtil.isNumber(padding) || BaseUtil.isString(padding)) {
      top = left = right = bottom = padding;
    } else if (BaseUtil.isArray(padding)) {
      top = padding[0];
      right = !BaseUtil.isNil(padding[1]) ? padding[1] : padding[0];
      bottom = !BaseUtil.isNil(padding[2]) ? padding[2] : padding[0];
      left = !BaseUtil.isNil(padding[3]) ? padding[3] : right;
    }

    return [top, right, bottom, left];
  },

  /**
   * create random id
   * @return {string} random id
   */
  guid: function guid() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },

  /**
   * merge data
   * @return {object} merged data
   */
  mix: function mix() {
    var args = BaseUtil.toArray(arguments);
    var obj = args[0];
    var source;
    var i;

    if (obj === true) {
      obj = args[1];

      for (i = 2; i < args.length; i++) {
        source = args[i];
        deepMix(obj, source);
      }
    } else {
      for (i = 1; i < args.length; i++) {
        source = args[i];

        for (var k in source) {
          if (source.hasOwnProperty(k) && k !== 'constructor') {
            obj[k] = source[k];
          }
        }
      }
    }

    return obj;
  },

  /**
   * mix in
   * @param {function} c Function
   * @param {array} mixins mixin array
   */
  mixin: function mixin(c, mixins) {
    if (c && mixins) {
      c._mixins = mixins;
      c.ATTRS = c.ATTRS || {};
      var temp = {};
      BaseUtil.each(mixins, function (mixin) {
        BaseUtil.augment(c, mixin);
      });
      c.ATTRS = BaseUtil.mix(temp, c.ATTRS);
    }
  }
});

function deepMix(dst, src, level) {
  level = level || 0;

  for (var k in src) {
    if (src.hasOwnProperty(k)) {
      var value = src[k];

      if (value !== null && BaseUtil.isPlainObject(value)) {
        if (!BaseUtil.isPlainObject(dst[k])) {
          dst[k] = {};
        }

        if (level < MAX_LEVEL) {
          deepMix(dst[k], src[k], level + 1);
        } else {
          dst[k] = src[k];
        }
      } else if (BaseUtil.isArray(value)) {
        dst[k] = [];
        dst[k] = dst[k].concat(value);
      } else if (value !== undefined) {
        dst[k] = src[k];
      }
    }
  }
}

BaseUtil.Array = {
  remove: function remove(arr, obj) {
    var index = BaseUtil.indexOf(arr, obj);

    if (index !== -1) {
      arr.splice(index, 1);
    }
  }
};
module.exports = BaseUtil;