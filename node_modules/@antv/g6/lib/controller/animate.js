function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview animate controller
 * @author huangtonger@aliyun.com
 */
var Base = require('./base');

var Animation = require('../animation/');

var Util = require('../util/');

var Global = require('../global');

var INVALID_ATTRS = ['matrix', 'fillStyle', 'strokeStyle', 'endArrow', 'startArrow'];

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
       * show animate
       * @type {function|string}
       */
      show: 'scaleIn',

      /**
       * hide animate
       * @type {function|string}
       */
      hide: 'scaleOut',

      /**
       * enter animate
       * @type {function|string}
       */
      enter: 'scaleIn',

      /**
       * leave animate
       * @type {function|string}
       */
      leave: 'scaleOut',

      /**
       * update animate
       * @type {function}
       */
      update: function update(_ref) {
        var element = _ref.element,
            endKeyFrame = _ref.endKeyFrame;
        var props = endKeyFrame.props;
        element.animate(_objectSpread({
          matrix: props.matrix
        }, props.attrs), Global.updateDuration, Global.updateEasing);
      },
      graph: null,
      startCache: {},
      endCache: {},
      keykeyCache: {}
    };
  };

  _proto._init = function _init() {
    var _this = this;

    var graph = this.graph;
    var keykeyCache = this.keykeyCache;
    graph.on('afteritemdraw', function (_ref2) {
      var item = _ref2.item;
      var group = item.getGraphicGroup();
      group.deepEach(function (element) {
        keykeyCache[element.gid] = _this._getCache(element);
      }, true);
    });
  };

  _proto.cacheGraph = function cacheGraph(cacheType, affectedItemIds) {
    var _this2 = this;

    var graph = this.graph;
    var items;

    if (affectedItemIds) {
      items = affectedItemIds.map(function (affectedItemId) {
        return graph.find(affectedItemId);
      });
    } else {
      items = graph.getItems();
    }

    this[cacheType] = {};
    items.forEach(function (item) {
      item && _this2.cache(item, _this2[cacheType], cacheType);
    });
  };

  _proto._getCache = function _getCache(element) {
    var keykeyCache = this.keykeyCache;

    if (!Util.isObject(element)) {
      return keykeyCache[element];
    }

    var cache = {
      props: {
        matrix: Util.clone(element.getMatrix()),
        attrs: {}
      }
    };

    if (element.isShape) {
      var attrs = element.attr();
      attrs = Util.omit(attrs, INVALID_ATTRS);
      cache.props.attrs = Util.clone(attrs);
    }

    return cache;
  }
  /**
   * get animate
   * @param  {object} item - item
   * @param  {string} type - animate type could be `show`, `hide`, `enter`, `leave`, 'update'
   * @return {function} animate function
   */
  ;

  _proto._getAnimation = function _getAnimation(item, type) {
    var graph = this.graph;
    var shapeObj = item.shapeObj;
    var defaultAnimation = this[type];
    var shapeAnimation = shapeObj[type + 'Animation'] || shapeObj[type + 'Animate']; // compatible with Animate

    var graphAnimate = graph.get('_' + type + 'Animation');
    var animation = shapeAnimation || graphAnimate || defaultAnimation;
    return Util.isString(animation) ? Animation[type + Util.upperFirst(animation)] : animation;
  };

  _proto.cache = function cache(item, _cache, type) {
    var _this3 = this;

    var group = item.getGraphicGroup();
    group.deepEach(function (element) {
      var id = element.gid;
      var subCache = type === 'startCache' ? _this3._getCache(element) : _this3._getCache(element.gid);
      subCache.enterAnimate = _this3._getAnimation(item, 'enter');
      subCache.leaveAnimate = _this3._getAnimation(item, 'leave');
      subCache.showAnimate = _this3._getAnimation(item, 'show');
      subCache.hideAnimate = _this3._getAnimation(item, 'hide');
      subCache.updateAnimate = _this3._getAnimation(item, 'update');
      subCache.item = item;
      subCache.element = element;
      subCache.visible = element.get('visible');
      _cache[id] = subCache;
    }, true);
  };

  _proto._compare = function _compare() {
    var startCache = this.startCache;
    var endCache = this.endCache;
    var enterElements = [];
    var leaveElements = [];
    var updateElements = [];
    var hideElements = [];
    var showElements = [];
    Util.each(endCache, function (endKeyFrame, k) {
      var startKeyFrame = startCache[k];

      if (startKeyFrame) {
        if (startKeyFrame.element.get('type') === endKeyFrame.element.get('type')) {
          if (startKeyFrame.visible && endKeyFrame.visible) {
            updateElements.push(k);
          } else if (startKeyFrame.visible && !endKeyFrame.visible) {
            hideElements.push(k);
          } else if (!startKeyFrame.visible && endKeyFrame.visible) {
            showElements.push(k);
          }
        }
      } else {
        enterElements.push(k);
      }
    });
    Util.each(startCache, function (v, k) {
      if (!endCache[k]) {
        leaveElements.push(k);
      }
    });
    this.enterElements = enterElements;
    this.leaveElements = leaveElements;
    this.updateElements = updateElements;
    this.hideElements = hideElements;
    this.showElements = showElements;
  };

  _proto._addTween = function _addTween() {
    var enterElements = this.enterElements;
    var leaveElements = this.leaveElements;
    var updateElements = this.updateElements;
    var hideElements = this.hideElements;
    var showElements = this.showElements;
    var startCache = this.startCache;
    var endCache = this.endCache; // console.log('enterElements ==> ', enterElements);
    // console.log('leaveElements ==> ', leaveElements);
    // console.log('updateElements ==> ', updateElements);
    // console.log('hideElements ==> ', hideElements);
    // console.log('showElements ==> ', showElements);

    enterElements.forEach(function (id) {
      var endKeyFrame = endCache[id];
      var enterAnimate = endKeyFrame.enterAnimate;

      if (enterAnimate) {
        enterAnimate({
          element: endKeyFrame.element,
          item: endKeyFrame.item,
          endKeyFrame: endKeyFrame,
          startKeyFrame: null,
          startCache: startCache,
          endCache: endCache,
          done: function done() {}
        });
      }
    });
    leaveElements.forEach(function (id) {
      var startKeyFrame = startCache[id];
      var leaveAnimate = startKeyFrame.leaveAnimate;

      if (leaveAnimate) {
        var startElement = startCache[id].element;

        if (startElement.isItemContainer) {
          startElement.getParent().add(startElement);
        }

        leaveAnimate({
          element: startElement,
          item: startKeyFrame.item,
          endKeyFrame: null,
          startKeyFrame: startKeyFrame,
          startCache: startCache,
          endCache: endCache,
          done: function done() {
            if (startElement.isItemContainer) {
              startElement.remove();
            }
          }
        });
      }
    });
    updateElements.forEach(function (id) {
      var endKeyFrame = endCache[id];
      var startKeyFrame = startCache[id];
      var endElement = endKeyFrame.element;
      var startElement = startKeyFrame.element;
      var startProps = startKeyFrame.props;
      var endProps = endKeyFrame.props;
      var updateAnimate = endKeyFrame.updateAnimate;

      var done = function done() {};

      if (startProps.attrs) {
        endElement.attr(startProps.attrs);
      }

      if (!Util.isEqual(startProps.matrix, endProps.matrix)) {
        endElement.setMatrix(startProps.matrix);
      }

      updateAnimate({
        element: endElement,
        item: endKeyFrame,
        endKeyFrame: endKeyFrame,
        startKeyFrame: startKeyFrame,
        startCache: startCache,
        endCache: endCache,
        done: done
      });

      if (startElement !== endElement) {
        startElement.remove();
      }
    });
    hideElements.forEach(function (id) {
      var endKeyFrame = endCache[id];
      var startKeyFrame = startCache[id];
      var hideAnimate = endKeyFrame.hideAnimate;

      if (hideAnimate) {
        endKeyFrame.element.show();
        hideAnimate({
          element: endKeyFrame.element,
          item: endKeyFrame.item,
          endKeyFrame: endKeyFrame,
          startKeyFrame: startKeyFrame,
          startCache: startCache,
          endCache: endCache,
          done: function done() {
            var item = endKeyFrame.item;
            var group = item.getGraphicGroup();
            !item.visible && group.hide();
          }
        });
      }
    });
    showElements.forEach(function (id) {
      var endKeyFrame = endCache[id];
      var startKeyFrame = startCache[id];
      var showAnimate = endKeyFrame.showAnimate;

      if (showAnimate) {
        showAnimate({
          element: endKeyFrame.element,
          item: endKeyFrame.item,
          endKeyFrame: endKeyFrame,
          startKeyFrame: startKeyFrame,
          startCache: startCache,
          endCache: endCache,
          done: function done() {}
        });
      }
    });
  };

  _proto.run = function run() {
    if (this.graph.destroyed) {
      return;
    }

    this._compare();

    this._addTween();
  };

  return Controller;
}(Base);

module.exports = Controller;