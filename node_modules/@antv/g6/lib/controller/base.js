/**
 * @fileOverview controller base
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Base =
/*#__PURE__*/
function () {
  var _proto = Base.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {};
  };

  function Base(cfg) {
    var defaultCfg = this.getDefaultCfg();
    Util.mix(this, defaultCfg, cfg);

    this._init();
  }

  _proto._init = function _init() {};

  _proto.destroy = function destroy() {};

  return Base;
}();

module.exports = Base;