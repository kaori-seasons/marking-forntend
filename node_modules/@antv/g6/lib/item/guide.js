function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview guide item
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Item = require('./item');

var Guide =
/*#__PURE__*/
function (_Item) {
  _inheritsLoose(Guide, _Item);

  function Guide(cfg) {
    var defaultCfg = {
      type: 'guide',
      isGuide: true,
      zIndex: 4
    };
    Util.mix(defaultCfg, cfg);
    return _Item.call(this, defaultCfg) || this;
  }

  return Guide;
}(Item);

module.exports = Guide;