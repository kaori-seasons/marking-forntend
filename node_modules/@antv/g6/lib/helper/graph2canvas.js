function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileOverview dom to canvas
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var G = require('@antv/g/lib');

var domToImage = require('dom-to-image');

var Graph2Canvas =
/*#__PURE__*/
function () {
  function Graph2Canvas(options) {
    this.options = _objectSpread({
      graph: null,
      width: null,
      height: null,
      canvas: null,
      beforeTransform: function beforeTransform() {},
      afterTransform: function afterTransform() {},
      drawCount: 0
    }, options);
  }

  var _proto = Graph2Canvas.prototype;

  _proto.getCanvas = function getCanvas() {
    var _this$options = this.options,
        width = _this$options.width,
        height = _this$options.height,
        canvas = _this$options.canvas;

    if (!canvas) {
      var containerDOM = Util.createDOM('<canvas></canvas>');
      canvas = new G.Canvas({
        containerDOM: containerDOM,
        width: width,
        height: height
      });
    }

    if (!canvas.drawCount) {
      canvas.drawCount = 0;
    }

    return canvas;
  }
  /**
   * draw canvas
   * @param  {object}  canvas item
   * @param  {function}  callback item
   */
  ;

  _proto.drawInner = function drawInner(canvas, callback) {
    var graph = this.options.graph;
    var graphCanvas = graph.getCanvas();
    var graphRenderer = graph.get('renderer');
    var drawCount = canvas.drawCount;

    if (graphRenderer === 'svg') {
      var domShapes = [];
      graphCanvas.deepEach(function (element) {
        var type = element.get('type');
        type === 'dom' && domShapes.push(element);
      });

      if (domShapes.length > 0) {
        domShapes.forEach(function (domShape) {
          var el = domShape.get('el');

          if (!el) {
            return;
          }

          domShape.domImageOnload = false;
          var width = domShape.attr('width');
          var height = domShape.attr('height');
          domToImage.toPng(el, {
            width: width,
            height: height
          }).then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;

            img.onload = function () {
              if (drawCount === canvas.drawCount - 1) {
                domShape.domImage = img;
                domShape.domImageOnload = true;

                for (var i = 0; i < domShapes.length; i++) {
                  var subShape = domShapes[i];

                  if (!subShape.domImageOnload || subShape.get('destroyed')) {
                    break;
                  }

                  if (subShape.domImageOnload && i === domShapes.length - 1) {
                    callback();
                  }
                }
              }
            };
          });
        });
      } else {
        callback();
      }
    } else {
      callback();
    }

    canvas.drawCount += 1;
  };

  _proto.toCanvas = function toCanvas() {
    var _this$options2 = this.options,
        graph = _this$options2.graph,
        width = _this$options2.width,
        height = _this$options2.height,
        beforeTransform = _this$options2.beforeTransform,
        limitRatio = _this$options2.limitRatio,
        afterTransform = _this$options2.afterTransform;
    var canvas = this.getCanvas();
    var graphBBox = graph.getBBox();
    var matrixCache = Util.clone(graph.getMatrix());
    var padding = graph.getFitViewPadding();
    var graphCanvas = graph.getCanvas();
    var matrix = Util.getAutoZoomMatrix({
      minX: 0,
      minY: 0,
      maxX: width,
      maxY: height
    }, graphBBox, padding, limitRatio);
    this.drawInner(canvas, function () {
      var children = graphCanvas.get('children');
      canvas.set('children', children);
      beforeTransform(matrix, matrixCache);
      graph.setMatrix(matrix);
      canvas.draw();
      graph.setMatrix(matrixCache);
      afterTransform(matrix, matrixCache);
    });
    canvas.matrix = matrix;
    return canvas.get('el');
  };

  return Graph2Canvas;
}();

module.exports = Graph2Canvas;