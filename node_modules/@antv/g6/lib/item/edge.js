function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview edge item
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Item = require('./item');

var Edge =
/*#__PURE__*/
function (_Item) {
  _inheritsLoose(Edge, _Item);

  function Edge(cfg) {
    var defaultCfg = {
      type: 'edge',
      isEdge: true,
      zIndex: 2
    };
    Util.mix(defaultCfg, cfg);
    return _Item.call(this, defaultCfg) || this;
  }

  var _proto = Edge.prototype;

  _proto._init = function _init() {
    // this.cacheEdges();
    _Item.prototype._init.call(this);
  } // cache edge into node
  // cacheEdges() {
  //   const itemMap = this.itemMap;
  //   const model = this.model;
  //   const source = itemMap[model.source];
  //   const target = itemMap[model.target];
  //   if (source && source.isItem) {
  //     source.edges.push(this);
  //     source.edges = Util.uniq(source.edges);
  //   }
  //   if (target && target.isItem) {
  //     target.edges.push(this);
  //     target.edges = Util.uniq(target.edges);
  //   }
  // }
  ;

  _proto._beforeDraw = function _beforeDraw() {
    var model = this.model;
    var itemMap = this.itemMap;

    if (!Util.isObject(model.source)) {
      this.source = itemMap[model.source];
    } else {
      this.source = model.source;
    }

    if (!Util.isObject(model.target)) {
      this.target = itemMap[model.target];
    } else {
      this.target = model.target;
    }

    _Item.prototype._beforeDraw.call(this);
  };

  _proto._afterDraw = function _afterDraw() {
    if (!this.linkedItemVisible()) {
      this.hide();
    }

    this._addArrow();

    _Item.prototype._afterDraw.call(this);
  };

  _proto._addArrow = function _addArrow() {
    var model = this.model;
    var keyShape = this.keyShape;

    if (keyShape.get('type') === 'path') {
      var shapeObj = this.shapeObj;
      var styleEndArrow = keyShape.attr('endArrow');
      var styleStartArrow = keyShape.attr('startArrow');
      var endArrow = model.endArrow || styleEndArrow;
      var startArrow = model.startArrow || styleStartArrow;
      styleStartArrow && keyShape.attr('startArrow', false);
      styleEndArrow && keyShape.attr('endArrow', false);
      endArrow && this._drawArrow(shapeObj.endArrow, 'end');
      startArrow && this._drawArrow(shapeObj.startArrow, 'start');
    }
  };

  _proto._drawArrow = function _drawArrow(_ref, type) {
    var path = _ref.path,
        shorten = _ref.shorten,
        tangent = _ref.tangent,
        ratio = _ref.ratio,
        style = _ref.style;
    tangent = tangent(this);
    shorten = shorten(this);
    path = path(this);
    style = style(this);
    ratio = ratio();
    var group = this.group;
    var keyShape = this.keyShape;
    var keyShapePath = Util.parsePathString(keyShape.attr('path'));
    var lastSegment = keyShapePath[keyShapePath.length - 1];
    var startSegment = keyShapePath[0];
    var point = keyShape.getPoint(ratio);

    if (!point || isNaN(point.x)) {
      return;
    }

    var marker = group.addShape('path', {
      attrs: _objectSpread({
        path: path
      }, style)
    });
    var x = tangent[1][0] - tangent[0][0];
    var y = tangent[1][1] - tangent[0][1];
    var tangentLength = Math.sqrt(x * x + y * y);
    var shortenRatio = shorten / tangentLength;
    var vShorten = [-x * shortenRatio, -y * shortenRatio];
    var deg = 0;
    var tan = Math.atan(x / y);

    if (y === 0 && x < 0) {
      deg = Math.PI;
    } else if (x > 0 && y > 0) {
      deg = Math.PI / 2 - tan;
    } else if (x < 0 && y < 0) {
      deg = -Math.PI / 2 - tan;
    } else if (x >= 0 && y < 0) {
      deg = -tan - Math.PI / 2;
    } else if (x <= 0 && y > 0) {
      deg = Math.PI / 2 - tan;
    }

    marker.rotate(deg);
    marker.translate(point.x, point.y);

    if (type === 'end') {
      lastSegment[lastSegment.length - 1] = vShorten[1] + point.y;
      lastSegment[lastSegment.length - 2] = vShorten[0] + point.x;
    } else {
      startSegment[startSegment.length - 1] = vShorten[1] + point.y;
      startSegment[startSegment.length - 2] = vShorten[0] + point.x;
    }

    keyShape.attr('path', keyShapePath);
    this[type + 'Arrow'] = marker;
  };

  _proto._getControlPoints = function _getControlPoints() {
    var controlPoints = this.model.controlPoints;

    if (Util.isArray(controlPoints)) {
      return controlPoints;
    }

    return [];
  };

  _proto._shouldDraw = function _shouldDraw() {
    return _Item.prototype._shouldDraw.call(this) && this.linkedItemVisible();
  };

  _proto._getPoint = function _getPoint(point) {
    if (point.isItem) {
      var box = point.getBBox();
      return {
        x: box.centerX,
        y: box.centerY
      };
    }

    return {
      x: point.x,
      y: point.y
    };
  };

  _proto.linkedItemVisible = function linkedItemVisible() {
    var source = this.source;
    var target = this.target;
    return Util.isPlainObject(source) || Util.isPlainObject(target) || source.isVisible() || target.isVisible() || source.collapsedParent !== target.collapsedParent;
  };

  _proto.getSource = function getSource() {
    var source = this.source;
    var collapsedParent = source.collapsedParent;
    var itemMap = this.itemMap;

    if (collapsedParent) {
      return itemMap[collapsedParent.id];
    }

    return source;
  };

  _proto.getTarget = function getTarget() {
    var target = this.target;
    var collapsedParent = target.collapsedParent;
    var itemMap = this.itemMap;

    if (collapsedParent) {
      return itemMap[collapsedParent.id];
    }

    return target;
  };

  _proto.getPoints = function getPoints() {
    var source = this.getSource();
    var target = this.getTarget();
    var model = this.model;

    var controlPoints = this._getControlPoints();

    var sourcePoint = this._getPoint(source);

    var targetPoint = this._getPoint(target);

    var points = [sourcePoint].concat(controlPoints).concat([targetPoint]);
    var psl = points.length;

    if (source.isItem) {
      var point = Util.isNumber(this.model.sourceAnchor) && source.id === model.source ? this.model.sourceAnchor : points[1];
      var interPoint = source.getLinkPoints(point);
      points[0] = interPoint[0];
    }

    if (target.isItem) {
      var _point = Util.isNumber(this.model.targetAnchor) && target.id === model.target ? this.model.targetAnchor : points[psl - 2];

      var _interPoint = target.getLinkPoints(_point);

      points[psl - 1] = _interPoint[0];
    }

    return points;
  };

  _proto.destroy = function destroy() {
    var itemMap = this.itemMap;
    var model = this.model;
    var source = itemMap[model.source];
    var target = itemMap[model.target];
    source && source.isItem && Util.Array.remove(source.edges, this);
    target && target.isItem && Util.Array.remove(target.edges, this);

    _Item.prototype.destroy.call(this);
  };

  return Edge;
}(Item);

module.exports = Edge;