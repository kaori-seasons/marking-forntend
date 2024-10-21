function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview Compact Box Tree Layout
 * @author huangtonger@aliyun.com
 */
var Hierarchy = require('@antv/hierarchy');

var TreeBase = require('./base');

var CompactBoxTreeLayout =
/*#__PURE__*/
function (_TreeBase) {
  _inheritsLoose(CompactBoxTreeLayout, _TreeBase);

  function CompactBoxTreeLayout(options) {
    var _this;

    _this = _TreeBase.call(this, options) || this;
    _this.layout = Hierarchy.compactBox;
    return _this;
  }

  return CompactBoxTreeLayout;
}(TreeBase);

module.exports = CompactBoxTreeLayout;