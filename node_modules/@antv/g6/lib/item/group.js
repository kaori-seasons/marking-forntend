function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview group item
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Node = require('./node');

var Group =
/*#__PURE__*/
function (_Node) {
  _inheritsLoose(Group, _Node);

  function Group(cfg) {
    var defaultCfg = {
      type: 'group',
      isNode: false,
      isGroup: true,
      zIndex: 1
    };
    Util.mix(defaultCfg, cfg);
    return _Node.call(this, defaultCfg) || this;
  }

  var _proto = Group.prototype;

  _proto._beforeDraw = function _beforeDraw() {
    this.deepEach(function (child, parent) {
      if (parent) {
        child.zIndex = parent.zIndex + 1;
      }

      child.updateCollapsedParent();

      if (child.collapsedParent) {
        child.hide();
      } else {
        child.show();
      }
    });
    this.getInnerEdges().forEach(function (child) {
      var bool = child.linkedItemVisible();

      if (bool) {
        child.show();
      } else {
        child.hide();
      }
    });

    _Node.prototype._beforeDraw.call(this);
  };

  _proto.updatePosition = function updatePosition() {};

  _proto._shouldDraw = function _shouldDraw() {
    return true;
  }
  /**
   * get cross group edge
   * @return {array} edges
   */
  ;

  _proto.getCrossEdges = function getCrossEdges() {
    var allChildrenIds = [];
    var innerEdges = this.getInnerEdges();
    this.deepEach(function (child) {
      allChildrenIds.push(child.id);
    });
    var rst = innerEdges.filter(function (edge) {
      var edgeModel = edge.getModel();
      return allChildrenIds.indexOf(edgeModel.source) === -1 || allChildrenIds.indexOf(edgeModel.target) === -1;
    });
    return Util.uniq(rst);
  }
  /**
   * get all inner edges
   * @return {array} edges
   */
  ;

  _proto.getInnerEdges = function getInnerEdges() {
    var edges = [];
    this.deepEach(function (child) {
      child.getEdges().forEach(function (edge) {
        edges.push(edge);
      });
    });
    return Util.uniq(edges);
  }
  /**
   * get children BBox
   * @return {object} box
   */
  ;

  _proto.getChildrenBBox = function getChildrenBBox() {
    var children = this.getChildren();
    var graphicChildren = children.map(function (child) {
      return child.getGraphicGroup();
    });
    return Util.getChildrenBBox(graphicChildren);
  };

  return Group;
}(Node);

module.exports = Group;