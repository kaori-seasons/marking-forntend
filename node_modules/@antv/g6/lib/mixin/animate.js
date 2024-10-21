function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileOverview animate mixin
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Animate = require('../controller/animate');

var Mixin = {};
Mixin.INIT = '_initAnimate';
Mixin.CFG = {
  /**
   * animate switch
   * @type {boolean}
   */
  animate: false
};
Mixin.AUGMENT = {
  _initAnimate: function _initAnimate() {
    var animate = this.get('animate');

    if (animate) {
      var controllers = this.get('_controllers');
      var cfg = {
        graph: this
      };

      if (Util.isPlainObject(animate)) {
        cfg = _objectSpread({}, cfg, animate);
      }

      controllers.animate = new Animate(cfg);
    }
  }
};
module.exports = Mixin;