/**
 * @fileOverview math util
 * @author huangtonger@aliyun.com
 */
var BaseUtil = require('./base');

var tolerance = 0.001;
var MathUtil = {
  /**
   * 是否在区间内
   * @param   {number}       value  值
   * @param   {number}       min    最小值
   * @param   {number}       max    最大值
   * @return  {boolean}      bool   布尔
   */
  isBetween: function isBetween(value, min, max) {
    return value >= min && value <= max;
  },

  /**
   * 两线段交点
   * @param  {object}  p0 第一条线段起点
   * @param  {object}  p1 第一条线段终点
   * @param  {object}  p2 第二条线段起点
   * @param  {object}  p3 第二条线段终点
   * @return {object}  交点
   */
  getLineIntersect: function getLineIntersect(p0, p1, p2, p3) {
    var E = {
      x: p2.x - p0.x,
      y: p2.y - p0.y
    };
    var D0 = {
      x: p1.x - p0.x,
      y: p1.y - p0.y
    };
    var D1 = {
      x: p3.x - p2.x,
      y: p3.y - p2.y
    };
    var kross = D0.x * D1.y - D0.y * D1.x;
    var sqrKross = kross * kross;
    var sqrLen0 = D0.x * D0.x + D0.y * D0.y;
    var sqrLen1 = D1.x * D1.x + D1.y * D1.y;
    var point = null;

    if (sqrKross > tolerance * sqrLen0 * sqrLen1) {
      var s = (E.x * D1.y - E.y * D1.x) / kross;
      var t = (E.x * D0.y - E.y * D0.x) / kross;

      if (MathUtil.isBetween(s, 0, 1) && MathUtil.isBetween(t, 0, 1)) {
        point = {
          x: p0.x + s * D0.x,
          y: p0.y + s * D0.y
        };
      }
    }

    return point;
  },

  /**
   * point and rectangular intersection point
   * @param  {object} rect  rect
   * @param  {object} point point
   * @return {object} rst;
   */
  getIntersectPointRect: function getIntersectPointRect(rect, point) {
    var x = rect.minX;
    var y = rect.minY;
    var width = rect.maxX - rect.minX;
    var height = rect.maxY - rect.minY;
    var cx = x + width / 2;
    var cy = y + height / 2;
    var points = [];
    var center = {
      x: cx,
      y: cy
    };
    points.push({
      x: x,
      y: y
    });
    points.push({
      x: x + width,
      y: y
    });
    points.push({
      x: x + width,
      y: y + height
    });
    points.push({
      x: x,
      y: y + height
    });
    points.push({
      x: x,
      y: y
    });
    var rst = null;

    for (var i = 1; i < points.length; i++) {
      rst = MathUtil.getLineIntersect(points[i - 1], points[i], center, point);

      if (rst) {
        break;
      }
    }

    return rst;
  },

  /**
   * get point and circle inIntersect
   * @param  {number} x   point x
   * @param  {number} y   point y
   * @param  {number} cx  circle center x
   * @param  {number} cy  circle center y
   * @param  {number} cr  circle radius
   * @return {object} applied point
   */
  getIntersectPointCircle: function getIntersectPointCircle(x, y, cx, cy, cr) {
    var d = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));

    if (d < cr) {
      return null;
    }

    var dx = x - cx;
    var dy = y - cy;
    var signX = Math.sign(dx);
    var signY = Math.sign(dy);
    var angle = Math.atan(dy / dx);
    return {
      x: cx + Math.abs(cr * Math.cos(angle)) * signX,
      y: cy + Math.abs(cr * Math.sin(angle)) * signY
    };
  },

  /**
   * coordinate matrix transformation
   * @param  {number} point   coordinate
   * @param  {number} matrix  matrix
   * @param  {number} tag     could be 0 or 1
   * @return {object} transformed point
   */
  applyMatrix: function applyMatrix(point, matrix, tag) {
    if (tag === void 0) {
      tag = 1;
    }

    var vector = [point.x, point.y, tag];
    BaseUtil.vec3.transformMat3(vector, vector, matrix);
    return {
      x: vector[0],
      y: vector[1]
    };
  },

  /**
   * coordinate matrix invert transformation
   * @param  {number} point   coordinate
   * @param  {number} matrix  matrix
   * @param  {number} tag     could be 0 or 1
   * @return {object} transformed point
   */
  invertMatrix: function invertMatrix(point, matrix, tag) {
    if (tag === void 0) {
      tag = 1;
    }

    var inversedMatrix = BaseUtil.mat3.invert([], matrix);
    var vector = [point.x, point.y, tag];
    BaseUtil.vec3.transformMat3(vector, vector, inversedMatrix);
    return {
      x: vector[0],
      y: vector[1]
    };
  },

  /**
   * radix sort
   * @param  {array} arr unsorted child node set
   * @param  {function} callback callback
   * @return {array} after sorting child node set
   */
  radixSort: function radixSort(arr, callback) {
    var mod = 10;
    var dev = 1;
    var counter = []; // 桶

    var maxDigit = 1; // 最大位数

    var rank;
    var length;
    var i;
    var j;
    var bucket;
    var pos;
    var value;

    for (i = 0; i < arr.length; i++) {
      rank = callback(arr[i]);
      rank = parseInt(rank, 10);
      length = rank.toString().length;

      if (rank.toString().length > maxDigit) {
        maxDigit = length;
      }
    }

    for (i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
      for (j = 0; j < arr.length; j++) {
        bucket = callback(arr[j]);
        bucket = parseInt(bucket % mod / dev, 10);

        if (counter[bucket] === undefined) {
          counter[bucket] = [];
        }

        counter[bucket].push(arr[j]);
      }

      pos = 0;

      for (j = 0; j < counter.length; j++) {
        value = undefined;

        if (counter[j] !== undefined) {
          value = counter[j].shift();

          while (value !== undefined) {
            arr[pos++] = value;
            value = counter[j].shift();
          }
        }
      }
    }

    return arr;
  },

  /**
    * get arc of two vertors
    * @param {object} vector1 - vector1
    * @param {object} vector2 - vector2
    * @return {number} - arc
    */
  getArcOfVectors: function getArcOfVectors(vector1, vector2) {
    var x1 = vector1.x,
        y1 = vector1.y;
    var x2 = vector2.x,
        y2 = vector2.y;
    var v1 = Math.sqrt(x1 * x1 + y1 * y1);
    var v2 = Math.sqrt(x2 * x2 + y2 * y2);
    return Math.acos((x1 * x2 + y1 * y2) / (v1 * v2));
  }
};
module.exports = BaseUtil.mix({}, BaseUtil, MathUtil);