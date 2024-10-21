function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview Mind Map Layout
 * @author huangtonger@aliyun.com
 */
var Hierarchy = require('@antv/hierarchy');

var TreeBase = require('./base');

var MindmapLayout =
/*#__PURE__*/
function (_TreeBase) {
  _inheritsLoose(MindmapLayout, _TreeBase);

  function MindmapLayout(options) {
    var _this;

    _this = _TreeBase.call(this, options) || this;
    _this.layout = Hierarchy.mindmap;
    return _this;
  }

  return MindmapLayout;
}(TreeBase);

module.exports = MindmapLayout;