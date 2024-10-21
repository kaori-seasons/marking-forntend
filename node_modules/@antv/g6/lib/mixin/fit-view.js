/**
 * @fileOverview graph fit canvas
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Mixin = {};
Mixin.CFG = {
  /**
   * Adaptive viewport
   * @type {string|undefined}
   * could be 'tl', 'lc', 'bl', 'cc', 'tc', 'tr', 'rc', 'br', 'bc', 'autoZoom'
   */
  fitView: undefined,

  /**
   * Fit view padding (client scale)
   * @type {number|array}
   */
  fitViewPadding: 10,

  /**
   * Minimum scale size
   * @type {number}
   */
  minZoom: 0.2,

  /**
   * Maxmum scale size
   * @type {number}
   */
  maxZoom: 10
};
Mixin.AUGMENT = {
  getBBox: function getBBox() {
    var itemGroup = this.get('_itemGroup');
    var itemMap = this.get('_itemMap');
    var children = itemGroup.get('children');

    if (children.length > 0) {
      children = children.filter(function (child) {
        var item = itemMap[child.id];

        if (item) {
          var shapeObj = item.getShapeObj();
          return shapeObj.bboxCalculation !== false;
        }

        return false;
      });
      return Util.getChildrenBBox(children);
    }

    var width = this.get('width');
    var height = this.get('height');
    return {
      minX: 0,
      minY: 0,
      maxX: width,
      maxY: height
    };
  },
  getFitViewPadding: function getFitViewPadding() {
    return Util.toAllPadding(this.get('fitViewPadding'));
  },
  setFitView: function setFitView(type) {
    if (!type) {
      return this;
    }

    if (type === 'autoZoom') {
      this.autoZoom();
      return this;
    }

    var padding = this.getFitViewPadding();
    var width = this.get('width');
    var height = this.get('height');
    var box = this.getBBox();
    var bWidth = box.maxX - box.minX;
    var bHeight = box.maxY - box.minY;
    var containerBox = {
      x: 0,
      y: 0,
      width: width,
      height: height
    };
    var position = Util.getNineBoxPosition(type, containerBox, bWidth, bHeight, padding);
    var matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    Util.mat3.translate(matrix, matrix, [-box.minX + position.x, -box.minY + position.y]);
    this.updateMatrix(matrix);
  },
  _getZoomRatio: function _getZoomRatio(ratio) {
    var maxZoom = this.get('maxZoom');
    var minZoom = this.get('minZoom');

    if (ratio < minZoom) {
      ratio = minZoom;
    }

    if (ratio > maxZoom) {
      ratio = maxZoom;
    }

    return ratio;
  },

  /**
   * @param {number|array} padding padding
   */
  autoZoom: function autoZoom(padding) {
    var _this = this;

    if (!padding) {
      padding = this.getFitViewPadding();
    }

    var width = this.get('width');
    var height = this.get('height');
    var box = this.getBBox();
    var matrix = Util.getAutoZoomMatrix({
      minX: 0,
      minY: 0,
      maxX: width,
      maxY: height
    }, box, padding, function (ratio) {
      return _this._getZoomRatio(ratio);
    });
    this.updateMatrix(matrix);
  },

  /**
   * @return {number} zoom
   */
  getZoom: function getZoom() {
    var matrix = this.getMatrix();
    return matrix[0];
  },

  /**
   * @param {object} matrix update matrix
   * @return {Graph} this
   */
  updateMatrix: function updateMatrix(matrix) {
    var originMatrix = this.getMatrix();
    var ev = {
      updateMatrix: matrix,
      originMatrix: originMatrix
    };
    var zoomBool = originMatrix[0] !== matrix[0];
    this.emit('beforeviewportchange', ev);
    zoomBool && this.emit('beforezoom', ev);
    this.setMatrix(matrix);
    zoomBool && this.emit('afterzoom', ev);
    this.emit('afterviewportchange', ev);
    this.draw();
    return this;
  },

  /**
   * @param {Object|Number} point scale center point
   * @param {Number|undefined} ratio scale ratio
   * @return {Graph} this
   */
  zoom: function zoom(point, ratio) {
    if (Util.isNumber(point)) {
      var width = this.get('width');
      var height = this.get('height');
      this.zoomByDom({
        x: width / 2,
        y: height / 2
      }, point);
      return;
    }

    ratio = this._getZoomRatio(ratio);
    var rootGroup = this.get('_rootGroup');
    var matrix = Util.clone(rootGroup.getMatrix());
    var dx = matrix[6] + matrix[0] * point.x - ratio * point.x;
    var dy = matrix[7] + matrix[0] * point.y - ratio * point.y;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[0] = ratio;
    matrix[4] = ratio;
    Util.mat3.translate(matrix, matrix, [dx, dy]);
    this.updateMatrix(matrix);
    return this;
  },

  /**
   * @param {object} domPoint scale center dom point
   * @param {number} ratio scale ratio
   * @return {Graph} this
   */
  zoomByDom: function zoomByDom(domPoint, ratio) {
    var point = this.getPoint(domPoint);
    this.zoom(point, ratio);
    return this;
  },

  /**
   * @param {number} dx x offset
   * @param {number} dy y offset
   * @return {Graph} this
   */
  translate: function translate(dx, dy) {
    var rootGroup = this.get('_rootGroup');
    var matrix = rootGroup.getMatrix();
    Util.mat3.translate(matrix, matrix, [dx, dy]);
    this.updateMatrix(matrix);
    return this;
  },

  /**
   * @param {number} dx dom x offset
   * @param {number} dy dom y offset
   * @return {Graph} this
   */
  translateByDom: function translateByDom(dx, dy) {
    var rootGroup = this.get('_rootGroup');
    var matrix = rootGroup.getMatrix();
    var scale = matrix[0];
    this.translate(dx / scale, dy / scale);
    return this;
  },

  /**
   * @return {Graph} this
   */
  getMatrix: function getMatrix() {
    var rootGroup = this.get('_rootGroup');
    return rootGroup.getMatrix();
  },

  /**
   * @param {object} matrix - matrix
   */
  setMatrix: function setMatrix(matrix) {
    var rootGroup = this.get('_rootGroup');
    rootGroup.setMatrix(matrix);
  },

  /**
   * @param {object} domPoint domPoint
   * @return {object} graph point
   */
  getPoint: function getPoint(domPoint) {
    return this.getPointByDom(domPoint);
  },

  /**
   * @param {object} domPoint domPoint
   * @return {object} graph point
   */
  getPointByDom: function getPointByDom(domPoint) {
    var rootGroup = this.get('_rootGroup');
    var matrix = rootGroup.getMatrix();
    return Util.invertMatrix(domPoint, matrix);
  },

  /**
   * @param {object} canvasPoint - canvas point
   * @return {object} graph point
   */
  getPointByCanvas: function getPointByCanvas(canvasPoint) {
    var canvas = this.get('_canvas');
    var pixelRatio = canvas.get('pixelRatio');
    return this.getPoint({
      x: canvasPoint.x / pixelRatio,
      y: canvasPoint.y / pixelRatio
    });
  },

  /**
   * @param {object} clientPoint - client point
   * @return {object} graph point
   */
  getPointByClient: function getPointByClient(clientPoint) {
    var canvas = this.get('_canvas');
    var canvasPoint = canvas.getPointByClient(clientPoint.x, clientPoint.y);
    return this.getPointByCanvas(canvasPoint);
  },

  /**
   * @param {object} point graph point
   * @return {object} dom point
   */
  getDomPoint: function getDomPoint(point) {
    var rootGroup = this.get('_rootGroup');
    var matrix = rootGroup.getMatrix();
    return Util.applyMatrix(point, matrix);
  },

  /**
   * @param {object} point graph point
   * @return {object} canvas point
   */
  getCanvasPoint: function getCanvasPoint(point) {
    var canvas = this.get('_canvas');
    var pixelRatio = canvas.get('pixelRatio');
    var domPoint = this.getDomPoint(point);
    return {
      x: domPoint.x * pixelRatio,
      y: domPoint.y * pixelRatio
    };
  },

  /**
   * @param {object} point graph point
   * @return {object} client point
   */
  getClientPoint: function getClientPoint(point) {
    var canvasPoint = this.getCanvasPoint(point);
    var canvas = this.get('_canvas');
    var clientPoint = canvas.getClientByPoint(canvasPoint.x, canvasPoint.y);
    return {
      x: clientPoint.clientX,
      y: clientPoint.clientY
    };
  },

  /**
   * @param {object} item item or itemId
   * @return {Graph} this
   */
  focus: function focus(item) {
    if (Util.isString(item)) {
      item = this.find(item);
    }

    if (item) {
      var point = item.getCenter();
      this.focusPoint(point);
    }

    return this;
  },

  /**
   * @param {object} point graph point
   * @return {Graph} this
   */
  focusPoint: function focusPoint(point) {
    var rootGroup = this.get('_rootGroup');
    var matrix = rootGroup.getMatrix();
    var width = this.get('width');
    var height = this.get('height');
    var dx = -matrix[6] + width / 2 - matrix[0] * point.x;
    var dy = -matrix[7] + height / 2 - matrix[0] * point.y;
    this.translate(dx, dy);
    return this;
  },

  /**
   * @param {object} domPoint dom point
   * @return {Graph} this
   */
  focusPointByDom: function focusPointByDom(domPoint) {
    var point = this.getPoint(domPoint);
    this.focusPoint(point);
    return this;
  }
};
module.exports = Mixin;