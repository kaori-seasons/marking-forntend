function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview layout controller
 * @author huangtonger@aliyun.com
 */
var Base = require('./base');

var Controller =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Controller, _Base);

  function Controller() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Controller.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * graph object
       * @type {object}
       */
      graph: null,

      /**
       * if auto layout afterchange
       * @type {boolean|string}
       * could be true false 'once'
       */
      auto: true,

      /**
       * layout processor
       * @type {object}
       */
      processor: null
    };
  };

  _proto._init = function _init() {
    var _this = this;

    var graph = this.graph;
    graph.on('afteritemdraw', function (ev) {
      var item = ev.item;
      var keyShape = item.getKeyShape();
      var model = item.getModel();

      if (item.isEdge) {
        model.lineWidth = keyShape.attr('lineWidth');
      } else if (item.isNode || item.isGroup) {
        var bbox = item.getBBox();
        model.width = bbox.width;
        model.height = bbox.height;
      }
    });
    graph.on('afterchange', function (_ref) {
      var action = _ref.action;
      var auto = _this.auto;

      if (auto === 'once') {
        if (action === 'changeData') {
          if (!graph.destroyed) {
            graph.preventAnimate(function () {
              _this.layout();
            });
          }
        }
      } else {
        if (_this.auto && !graph.destroyed) {
          graph.preventAnimate(function () {
            _this.layout();
          });
        }
      }
    });
  }
  /**
   * @param  {object} processor - layout processer
   */
  ;

  _proto.changeLayout = function changeLayout(processor) {
    this.processor = processor;
    this.layout();
  }
  /**
   */
  ;

  _proto.layout = function layout() {
    var graph = this.graph;
    var processor = this.getLayoutProcessor();
    graph.emit('beforelayout');
    var nodes = graph.getNodes().filter(function (node) {
      return node.isVisible();
    }).map(function (edge) {
      return edge.getModel();
    });
    var edges = graph.getEdges().filter(function (edge) {
      return edge.isVisible();
    }).map(function (edge) {
      return edge.getModel();
    });
    var groups = graph.getGroups().filter(function (group) {
      return group.isVisible();
    }).map(function (group) {
      return group.getModel();
    });

    graph._executeLayout(processor, nodes, edges, groups);

    graph.updateNodePosition();
    graph.emit('afterlayout');
  };

  _proto.getLayoutProcessor = function getLayoutProcessor() {
    return this.processor ? this.processor : this.processer;
  };

  return Controller;
}(Base);

module.exports = Controller;