function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview Dendrogram Tree Layout
 * @author huangtonger@aliyun.com
 */
var Hierarchy = require('@antv/hierarchy');

var TreeBase = require('./base');

var DendrogramTreeLayout =
/*#__PURE__*/
function (_TreeBase) {
  _inheritsLoose(DendrogramTreeLayout, _TreeBase);

  function DendrogramTreeLayout(options) {
    var _this;

    _this = _TreeBase.call(this, options) || this;
    _this.layout = Hierarchy.dendrogram;
    return _this;
  }

  return DendrogramTreeLayout;
}(TreeBase);

module.exports = DendrogramTreeLayout;