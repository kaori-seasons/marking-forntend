function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview
 * The base class for complex class
 * @author huangtonger@aliyun.com
 */
var Util = require('./util/');

var EventEmitter = require('wolfy87-eventemitter');

var Base =
/*#__PURE__*/
function (_EventEmitter) {
  _inheritsLoose(Base, _EventEmitter);

  var _proto = Base.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {};
  };

  function Base(cfg) {
    var _this;

    _this = _EventEmitter.call(this) || this;

    var defaultCfg = _this.getDefaultCfg();

    _this._cfg = Util.mix({}, defaultCfg, cfg);
    return _this;
  }

  _proto.get = function get(name) {
    return this._cfg[name];
  };

  _proto.set = function set(name, value) {
    this._cfg[name] = value;
  };

  _proto.destroy = function destroy() {
    this._cfg = {};
    this.removeAllListeners();
    this.destroyed = true;
  };

  return Base;
}(EventEmitter);

module.exports = Base;