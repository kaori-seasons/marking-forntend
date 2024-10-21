function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview node item
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Item = require('./item');

var Node =
/*#__PURE__*/
function (_Item) {
  _inheritsLoose(Node, _Item);

  function Node(cfg) {
    var defaultCfg = {
      type: 'node',
      isNode: true,
      zIndex: 3,
      edges: [],
      linkable: true
    };
    Util.mix(defaultCfg, cfg);
    return _Item.call(this, defaultCfg) || this;
  }

  var _proto = Node.prototype;

  _proto.updatePosition = function updatePosition() {
    var group = this.group;
    var model = this.model;
    group.setMatrix([1, 0, 0, 0, 1, 0, model.x ? model.x : 0, model.y ? model.y : 0, 1]);
    this.bbox = this._calculateBBox();
  };

  _proto._shouldDraw = function _shouldDraw() {
    var diff = this._getDiff();

    var superBool = _Item.prototype._shouldDraw.call(this);

    return diff && !(diff.length === 2 && diff.indexOf('x') !== -1 && diff.indexOf('y') !== -1) && !(diff.length === 1 && (diff[0] === 'x' || diff[0] === 'y')) && superBool;
  };

  _proto._afterDraw = function _afterDraw() {
    this.updatePosition();

    _Item.prototype._afterDraw.call(this);
  };

  _proto.layoutUpdate = function layoutUpdate() {
    this._beforeDraw();

    this._afterDraw();
  };

  _proto.getEdges = function getEdges() {
    var _this = this;

    var graph = this.graph;
    var edges = graph.getEdges();
    return edges.filter(function (edge) {
      var model = edge.getModel();
      return model.source === _this.id || model.target === _this.id;
    });
  };

  _proto.getInEdges = function getInEdges() {
    var _this2 = this;

    return this.getEdges().filter(function (edge) {
      return edge.target === _this2;
    });
  };

  _proto.getOutEdges = function getOutEdges() {
    var _this3 = this;

    return this.getEdges().filter(function (edge) {
      return edge.source === _this3;
    });
  }
  /**
    * get anchor points, if there is anchors return the points sorted by arc , others return the link point
    * @param {Object | Number} point - start point
    * @return {array} - all anchor points sorted by angle, ASC
    */
  ;

  _proto.getLinkPoints = function getLinkPoints(point) {
    var anchorPoints = this.getAnchorPoints();

    if (Util.isNumber(point) && anchorPoints[point]) {
      return [anchorPoints[point]];
    }

    var x = point.x,
        y = point.y;
    var bbox = this.getBBox();
    var centerX = bbox.centerX,
        centerY = bbox.centerY;
    var x1 = x - centerX;
    var y1 = y - centerY;
    var shapeObj = this.shapeObj;
    var anchor = shapeObj.anchor || {};
    var defaultIntersectBox = this.defaultIntersectBox;
    var points = [];

    if (Util.isEmpty(anchorPoints)) {
      // get link point if there are no default anchors
      var intersectBox = shapeObj.intersectBox || anchor.intersectBox || anchor.type || defaultIntersectBox;

      switch (intersectBox) {
        case 'rect':
          points = [Util.getIntersectPointRect(bbox, point)];
          break;

        case 'path':
          if (this.keyShape && this.keyShape.get('type') === 'path') {
            var linePath = Util.parsePathArray(['M', x, y, 'L', centerX, centerY]);
            points = [Util.intersection(linePath, this.keyShape.get('path'))];
          }

          break;

        default:
          // default circle
          points = [Util.getIntersectPointCircle(x, y, bbox.centerX, bbox.centerY, Math.max(bbox.width, bbox.height) / 2)];
          break;
      } // if no link points return center


      if (Util.isEmpty(points[0])) {
        points = [{
          x: centerX,
          y: centerY
        }];
      }
    } else {
      // get sorted points by arc if there are default points
      points = anchorPoints.map(function (p) {
        var x2 = p.x - centerX;
        var y2 = p.y - centerY;
        var arc = Util.getArcOfVectors({
          x: x1,
          y: y1
        }, {
          x: x2,
          y: y2
        });
        return Util.mix({}, p, {
          arc: arc
        });
      }).sort(function (a, b) {
        return a.arc - b.arc;
      });
    }

    return points;
  }
  /**
   * get position of anchor points
   * @param {number} index the index of points
   * @return {array} anchorPoints
   */
  ;

  _proto.getAnchorPoints = function getAnchorPoints(index) {
    var shapeObj = this.shapeObj;
    var bbox = this.getBBox();
    var anchorPoints = [];
    var anchor = shapeObj.anchor || {};
    var points;

    if (Util.isArray(anchor)) {
      points = anchor;
    } else if (Util.isFunction(anchor)) {
      points = anchor(this);
    } else {
      if (Util.isFunction(anchor.points)) {
        points = anchor.points(this);
      } else {
        points = anchor.points;
      }
    }

    Util.each(points, function (pointArr, index) {
      var anchorPoint = Util.mix({
        x: bbox.minX + pointArr[0] * bbox.width,
        y: bbox.minY + pointArr[1] * bbox.height
      }, pointArr[2], {
        index: index
      });
      anchorPoints.push(anchorPoint);
    });
    this._anchorPoints = anchorPoints;

    if (Util.isNumber(index)) {
      return this._anchorPoints[index];
    }

    return this._anchorPoints;
  };

  return Node;
}(Item);

module.exports = Node;