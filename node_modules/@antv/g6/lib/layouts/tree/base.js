function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview tree layout base
 * @author huangtonger@aliyun.com
 */
var Base = require('../base');

var CompactBoxTreeLayout =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(CompactBoxTreeLayout, _Base);

  function CompactBoxTreeLayout(options) {
    var _this;

    _this = _Base.call(this) || this;
    _this.options = options;
    return _this;
  }

  var _proto = CompactBoxTreeLayout.prototype;

  _proto.execute = function execute() {
    var _this2 = this;

    var options = this.options;
    var roots = this.roots;
    roots.forEach(function (root) {
      var layoutedRoot = _this2.layout(root, options);

      layoutedRoot.eachNode(function (node) {
        node.data.x = node.x + node.data.width / 2 + node.hgap;
        node.data.y = node.y + node.data.height / 2 + node.vgap;
      });
    });
  };

  return CompactBoxTreeLayout;
}(Base);

module.exports = CompactBoxTreeLayout;