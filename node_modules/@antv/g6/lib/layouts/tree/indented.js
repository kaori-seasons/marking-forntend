function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview Indented Tree Layout
 * @author huangtonger@aliyun.com
 */
var Hierarchy = require('@antv/hierarchy');

var TreeBase = require('./base');

var IndentedTreeLayout =
/*#__PURE__*/
function (_TreeBase) {
  _inheritsLoose(IndentedTreeLayout, _TreeBase);

  function IndentedTreeLayout(options) {
    var _this;

    _this = _TreeBase.call(this, options) || this;
    _this.layout = Hierarchy.indented;
    return _this;
  }

  return IndentedTreeLayout;
}(TreeBase);

module.exports = IndentedTreeLayout;