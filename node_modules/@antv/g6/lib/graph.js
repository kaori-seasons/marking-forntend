function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview graph
 * @author huangtonger@aliyun.com
 */
require('./extend/g/group');

require('./extend/g/shape');

require('./extend/g/dom');

var Base = require('./base');

var Item = require('./item/');

var Shape = require('./shape/');

var Util = require('./util/');

var Graph2Canvas = require('./helper/graph2canvas');

var G = require('@antv/g/lib');

var LayoutMixin = require('./mixin/layout');

var MappingMixin = require('./mixin/mapping');

var QueryMixin = require('./mixin/query');

var EventMixin = require('./mixin/event');

var ModeMixin = require('./mixin/mode');

var FilterMixin = require('./mixin/filter');

var AnimateMixin = require('./mixin/animate');

var DrawMixin = require('./mixin/draw');

var FitView = require('./mixin/fit-view');

var ForceFit = require('./mixin/force-fit');

var Mixins = [FilterMixin, MappingMixin, QueryMixin, LayoutMixin, AnimateMixin, DrawMixin, ForceFit, FitView, EventMixin, ModeMixin];
var TAB_INDEX = 20;

var Graph =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Graph, _Base);

  var _proto = Graph.prototype;

  /**
   * Access to the default configuration properties
   * @return {object} default configuration
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * Container could be dom object or dom id
       * @type {object|string|undefined}
       */
      container: undefined,

      /**
       * Canvas width
       * @type {number|undefined}
       * unit pixel if undefined force fit width
       */
      width: undefined,

      /**
       * Canvas height
       * @type {number|undefined}
       * unit pixel if undefined force fit height
       */
      height: undefined,

      /**
       * Plugins
       * @type {array}
       */
      plugins: [],

      /**
       * FontFamily
       * @type {string}
       */
      fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", SimSun, "sans-serif"',

      /**
       * default node shape
       * @type {string|undefined}
       */
      nodeDefaultShape: undefined,

      /**
       * default edge shape
       * @type {string|undefined}
       */
      edgeDefaultShape: undefined,

      /**
       * default group shape
       * @type {string|undefined}
       */
      groupDefaultShape: undefined,

      /**
       * default edge node intersect box
       * @type {string}
       */
      defaultIntersectBox: 'circle',

      /**
       * renderer canvas or svg
       * @type {string}
       */
      renderer: 'canvas',
      _type: 'graph',
      _controllers: {},
      _timers: {},
      _dataMap: {},
      _itemMap: {},
      _freezMap: {},
      _data: {},
      _delayRunObj: {}
    };
  };

  function Graph(inputCfg) {
    var _this;

    var cfg = {};
    Mixins.forEach(function (Mixin) {
      Util.mix(cfg, Util.clone(Mixin.CFG), inputCfg);
    });
    _this = _Base.call(this, cfg) || this; // plugin should init before all

    _this._pluginInit();

    _this.emit('beforeinit');

    _this._init();

    _this.emit('afterinit');

    return _this;
  }

  _proto._init = function _init() {
    var _this2 = this;

    this._initData();

    this._initContainer();

    this._initCanvas();

    Mixins.forEach(function (Mixin) {
      Mixin.INIT && _this2[Mixin.INIT]();
    });
    this.initEvent();
  };

  _proto.initEvent = function initEvent() {};

  _proto._executeLayout = function _executeLayout(processor, nodes, edges, groups) {
    if (Util.isFunction(processor)) {
      processor(nodes, edges, this);
    } else if (Util.isObject(processor)) {
      processor.nodes = nodes;
      processor.edges = edges;
      processor.groups = groups;
      processor.graph = this;
      processor.execute();
    }
  };

  _proto._pluginInit = function _pluginInit() {
    var _this3 = this;

    var plugins = this.get('plugins');
    plugins.forEach(function (plugin) {
      _this3._initPlugin(plugin);
    });
  };

  _proto._initPlugin = function _initPlugin(plugin) {
    plugin.graph = this;
    plugin.init && plugin.init();
  };

  _proto._getTimer = function _getTimer(name) {
    return this.get('_timers')[name];
  };

  _proto._setTimer = function _setTimer(name, value) {
    this.get('_timers')[name] = value;
  };

  _proto._getController = function _getController(name) {
    return this.get('_controllers')[name];
  };

  _proto._initContainer = function _initContainer() {
    var container = this.get('container');

    if (!container) {
      // Compatible with id written
      container = this.get('id');
    }

    container = Util.initDOMContainer(container, 'graph');
    var graphContainer = Util.createDOM('<div class="graph-container"></div>', {
      position: 'relative'
    });
    container.appendChild(graphContainer);
    this.set('_containerDOM', container);
    this.set('_graphContainer', graphContainer);
  };

  _proto._initCanvas = function _initCanvas() {
    var graphContainer = this.get('_graphContainer');
    var width = this.get('width');
    var height = this.get('height');
    var fontFamily = this.get('fontFamily');
    var renderer = this.get('renderer');
    var canvasCfg = {
      width: width,
      height: height,
      fontFamily: fontFamily,
      renderer: renderer,
      eventEnable: false,
      containerDOM: graphContainer
    };

    if (renderer === 'svg') {
      canvasCfg.pixelRatio = 1;
    }

    var Canvas = G.Canvas;
    var canvas = new Canvas(canvasCfg);
    var el = canvas.get('el');
    el.style.top = 0;
    el.style.left = 0;
    el.style.overflow = 'hidden';
    this.set('_canvas', canvas);
    var mouseEventWrapper = this.getMouseEventWrapper();
    mouseEventWrapper.style.outline = 'none';
    mouseEventWrapper.style['user-select'] = 'none';
    mouseEventWrapper.setAttribute('tabindex', TAB_INDEX);
    var rootGroup = canvas.addGroup();
    var itemGroup = rootGroup.addGroup();
    this.set('_itemGroup', itemGroup);
    this.set('_rootGroup', rootGroup);
  };

  _proto._initData = function _initData() {
    this.set('_dataMap', {});
    this.set('_itemMap', {
      _nodes: [],
      _edges: [],
      _groups: [],
      _guides: []
    });
    this.set('_data', {});
  };

  _proto._refresh = function _refresh() {};

  _proto.getKeyboardEventWrapper = function getKeyboardEventWrapper() {
    var keyboardEventWrapper = this.get('keyboardEventWrapper');
    return keyboardEventWrapper ? keyboardEventWrapper : this.getMouseEventWrapper();
  };

  _proto.getMouseEventWrapper = function getMouseEventWrapper() {
    return this.get('_canvas').get('el');
  }
  /**
   * @param  {object} plugin - plugin instance
   */
  ;

  _proto.addPlugin = function addPlugin(plugin) {
    var plugins = this.get('plugins');

    this._initPlugin(plugin);

    plugins.push(plugin);
  }
  /**
   * @return  {domobject} graphcontainer
   */
  ;

  _proto.getGraphContainer = function getGraphContainer() {
    return this.get('_graphContainer');
  } // sort group
  ;

  _proto._sortGroup = function _sortGroup(models) {
    var dataMap = this.get('_dataMap');
    var hierarchyCache = {};
    models.forEach(function (_ref) {
      var id = _ref.id,
          parent = _ref.parent;
      hierarchyCache[id] = 1;

      while (parent && dataMap[parent]) {
        hierarchyCache[id]++;
        parent = dataMap[parent].parent;
      }
    });
    models.sort(function (a, b) {
      return hierarchyCache[b.id] - hierarchyCache[a.id];
    });
  }
  /**
   * @param  {string} type item type
   * @param  {array} models models
   */
  ;

  _proto._addItems = function _addItems(type, models) {
    var _this4 = this;

    this._addDatas(type, models);

    if (type === 'group') this._sortGroup(models);
    var Type = Util.upperFirst(type);
    var Constructor = Item[Type];
    var itemMap = this.get('_itemMap');
    var itemGroup = this.get('_itemGroup');
    var dataMap = this.get('_dataMap');
    var animate = this.get('animate');
    var defaultIntersectBox = this.get('defaultIntersectBox');

    if (!Constructor) {
      throw new Error('please set valid item type!');
    }

    models.forEach(function (model) {
      var item = new Constructor({
        id: model.id,
        type: type,
        model: model,
        group: itemGroup.addGroup(),
        graph: _this4,
        mapper: _this4._getController(type + 'Mapper'),
        itemMap: itemMap,
        animate: animate,
        dataMap: dataMap,
        defaultIntersectBox: defaultIntersectBox
      });
      itemMap[model.id] = item;
      itemMap['_' + type + 's'].push(item);
    });
  }
  /**
   * @param  {array} items remove items
   */
  ;

  _proto._removeItems = function _removeItems(items) {
    var dataMap = this.get('_dataMap');
    var itemMap = this.get('_itemMap');
    items.forEach(function (item) {
      delete dataMap[item.id];
      delete itemMap[item.id];
      Util.Array.remove(itemMap['_' + item.type + 's'], item);
      item.destroy();
    });
  }
  /**
   * @param  {array} items - items
   * @param  {array} models - update models
   */
  ;

  _proto._updateItems = function _updateItems(items, models) {
    items.forEach(function (item, index) {
      var model = models[index];
      model && Util.mix(item.getModel(), model); // if (model) {
      //   // if update edge source or target re cache edges.
      //   if (item.isEdge && model && (model.target || model.source)) {
      //     item.cacheEdges();
      //   }
      // }

      item.update();
    });
  };

  _proto._getShowEdge = function _getShowEdge(edge) {
    var source = edge.getSource();
    var target = edge.getTarget();
    return (source.linkable && source.isVisible() || !source.linkable) && (target.linkable && target.isVisible() || !target.linkable) && edge;
  };

  _proto._addDatas = function _addDatas(type, models) {
    var dataMap = this.get('_dataMap');
    models.forEach(function (model) {
      if (Util.isNil(model.id)) {
        model.id = Util.guid();
      }

      if (dataMap[model.id]) {
        throw new Error('id:' + model.id + ' has already been set, please set new one');
      }

      dataMap[model.id] = model;
    });
  };

  _proto._drawInner = function _drawInner() {
    var data = this.get('_data');
    var itemGroup = this.get('_itemGroup');
    var dataMap = this.get('_dataMap');
    var itemMap = this.get('_itemMap');

    if (data.nodes) {
      this._addItems('node', data.nodes);
    }

    if (data.groups) {
      this._addItems('group', data.groups);
    }

    if (data.edges) {
      this._addItems('edge', data.edges);
    }

    if (data.guides) {
      this._addItems('guide', data.guides);
    }

    itemGroup.sortBy(function (child) {
      var id = child.id;
      var item = itemMap[id];
      var model = dataMap[id];

      if (model && !Util.isNil(model.index)) {
        return model.index;
      }

      if (item && !item.destroyed && !Util.isNil(item.zIndex)) {
        return item.zIndex;
      }
    });
  };

  _proto._clearInner = function _clearInner() {
    var items = this.getItems();
    items.forEach(function (item) {
      item && item.destroy();
    });
  }
  /**
   * @param  {function} callback - callback
   * @return {Graph} this
   */
  ;

  _proto.preventAnimate = function preventAnimate(callback) {
    this.set('_forcePreventAnimate', true);
    callback();
    this.set('_forcePreventAnimate', false);
    return this;
  }
  /**
   * @param  {string} type item type
   * @param  {object} model data model
   * @return {object} shapeObj
   */
  ;

  _proto.getShapeObj = function getShapeObj(type, model) {
    if (!Util.isObject(type)) {
      var Type = Util.upperFirst(type);
      var shapeManager = Shape[Type];
      var defaultShape = this.get(type + 'DefaultShape');
      return shapeManager.getShape(model.shape, defaultShape);
    }

    return type.getShapeObj();
  }
  /**
   * @return {object} source data
   */
  ;

  _proto.getSource = function getSource() {
    return this.get('_sourceData');
  }
  /**
   * @param  {object} data source data
   * @return {object} plain data
   */
  ;

  _proto.parseSource = function parseSource(data) {
    return data;
  }
  /**
   * @return {G.Canvas} canvas
   */
  ;

  _proto.getCanvas = function getCanvas() {
    return this.get('_canvas');
  }
  /**
   * @return {G.Group} rootGroup
   */
  ;

  _proto.getRootGroup = function getRootGroup() {
    return this.get('_rootGroup');
  }
  /**
   * @return {G.Group} itemGroup
   */
  ;

  _proto.getItemGroup = function getItemGroup() {
    return this.get('_itemGroup');
  }
  /**
   * @param  {object} data source data
   * @return {Graph} this
   */
  ;

  _proto.source = function source(data) {
    this.emit('beforesource');
    this.set('_data', data);
    this.set('_sourceData', data);
    this.emit('aftersource');
    return this;
  }
  /**
   * @return {Graph} this
   */
  ;

  _proto.render = function render() {
    this.emit('beforerender');
    this.emit('beforedrawinner');

    this._drawInner();

    this.emit('afterdrawinner');
    this.emit('afterrender');
    return this;
  }
  /**
   * @return {Graph} - this
   */
  ;

  _proto.reRender = function reRender() {
    var data = this.get('_sourceData');
    this.read(data);
    return this;
  }
  /**
   * set canvas captrue
   * @param  {boolean} bool boolean
   */
  ;

  _proto.setCapture = function setCapture(bool) {
    var rootGroup = this.get('_rootGroup');
    rootGroup.set('capture', bool);
  }
  /**
   * @return {Graph} - this
   */
  ;

  _proto.destroy = function destroy() {
    this.emit('beforedestroy');
    var canvas = this.get('_canvas');
    var graphContainer = this.get('_graphContainer');
    var controllers = this.get('_controllers');
    var timers = this.get('_timers');
    var windowForceResizeEvent = this.get('_windowForceResizeEvent');
    var plugins = this.get('plugins');
    Util.each(timers, function (timer) {
      clearTimeout(timer);
    });
    Util.each(controllers, function (controller) {
      controller.destroy();
    });
    plugins.forEach(function (plugin) {
      plugin.destroy && plugin.destroy();
    });
    canvas && canvas.destroy();
    graphContainer.destroy();
    window.removeEventListener('resize', windowForceResizeEvent);
    this.emit('afterdestroy');

    _Base.prototype.destroy.call(this);

    return this;
  }
  /**
   * @return {object} data
   */
  ;

  _proto.save = function save() {
    var itemGroup = this.get('_itemGroup');
    var children = itemGroup.get('children');
    var rst = {
      nodes: [],
      edges: [],
      groups: [],
      guides: []
    };
    children.forEach(function (child, index) {
      var model = child.model;

      if (model) {
        var type = child.itemType;
        var saveModel = Util.clone(model);
        saveModel.index = index;
        rst[type + 's'].push(saveModel);
      }
    });
    rst.nodes.length === 0 && delete rst.nodes;
    rst.edges.length === 0 && delete rst.edges;
    rst.groups.length === 0 && delete rst.groups;
    rst.guides.length === 0 && delete rst.guides;
    return rst;
  }
  /**
   * @param {string} type item type
   * @param {object} model data model
   * @return {Graph} this
   */
  ;

  _proto.add = function add(type, model) {
    var affectedItemIds = [];
    var ev = {
      action: 'add',
      model: model,
      affectedItemIds: affectedItemIds
    };
    this.emit('beforechange', ev);
    var itemMap = this.get('_itemMap');

    this._addItems(type, [model]);

    var item = itemMap[model.id];
    item.getAllParents().forEach(function (parent) {
      parent.update();
    });
    ev.item = item;
    affectedItemIds.push(model.id);
    this.emit('afterchange', ev);
    return item;
  }
  /**
   * @param {string|Item} item - target item
   * @return {Graph} this
   */
  ;

  _proto.remove = function remove(item) {
    item = this.getItem(item);

    if (!item || item.destroyed) {
      return;
    }

    var removeItemCache = [];
    var affectedItemIds = [];
    var ev = {
      action: 'remove',
      item: item,
      affectedItemIds: affectedItemIds
    };

    if (item.isNode) {
      var edges = item.getEdges();
      removeItemCache = removeItemCache.concat(edges);
    }

    if (item.isGroup) {
      var _edges = item.getEdges();

      var children = item.getAllChildren();
      var crossEdges = item.getCrossEdges();
      var innerEdges = item.getInnerEdges();
      removeItemCache = removeItemCache.concat(_edges, children, crossEdges, innerEdges);
      removeItemCache = Util.uniq(removeItemCache);
    }

    removeItemCache.push(item);
    var allParents = item.getAllParents();
    allParents.forEach(function (parent) {
      affectedItemIds.push(parent.id);
    });
    removeItemCache.forEach(function (removeItem) {
      affectedItemIds.push(removeItem.id);
    });
    this.emit('beforechange', ev);

    this._removeItems(removeItemCache);

    allParents.forEach(function (parent) {
      parent.update();
    });
    this.emit('afterchange', ev);
    return this;
  }
  /**
   * @param {string|Item} item target item
   * @param {object} model data model
   * @return {Graph} this
   */
  ;

  _proto.simpleUpdate = function simpleUpdate(item, model) {
    this._updateItems([item], [model]);

    this.draw();
    return this;
  }
  /**
   * @param {string|Item|undefined} item target item
   * @param {object} model data model
   * @return {Graph} this
   */
  ;

  _proto.update = function update(item, model) {
    var itemMap = this.get('_itemMap');
    item = this.getItem(item);

    if (!item || item.destroyed || !model) {
      return;
    }

    var animate = this.get('animate');
    var updateItemCache = [];
    var updateModelCache = [];
    var affectedItemIds = [];
    var itemModel = item.getModel();
    var originModel = Util.mix({}, itemModel);
    var ev = {
      action: 'update',
      item: item,
      originModel: originModel,
      updateModel: model,
      affectedItemIds: affectedItemIds
    };
    var originParent = itemMap[originModel.parent];
    updateItemCache.push(item);
    updateModelCache.push(model);
    affectedItemIds.push(item.id); // If originParent exist update orign parent

    if (originParent && originParent !== parent && Util.isGroup(originParent)) {
      item.getAllParents().forEach(function (parent) {
        updateItemCache.push(parent);
        updateModelCache.push(null);
        affectedItemIds.push(parent.id);
      });
    } // If the update group, update all the group


    if (model.parent) {
      var updateParent = itemMap[model.parent];

      if (!updateParent) {
        throw new Error('there is no ' + model.parent + ' exist, please add a new one!');
      }

      updateItemCache.push(updateParent);
      updateModelCache.push(null);
      affectedItemIds.push(updateParent.id);
      updateParent.getAllParents().forEach(function (parent) {
        updateItemCache.push(parent);
        updateModelCache.push(null);
        affectedItemIds.push(parent.id);
      });
    } // If the update nodes or group, update the connection edge


    if (item.isNode || item.isGroup) {
      var edges = item.getEdges();
      edges.forEach(function (edge) {
        updateItemCache.push(edge);
        updateModelCache.push(null);
        affectedItemIds.push(edge.id);
      });
    } // If group children collapse && expend animate


    if (item.isGroup && !Util.isNil(model.collapsed)) {
      if (animate) {
        item.deepEach(function (subItem) {
          affectedItemIds.push(subItem.id);
        });
      }

      item.getCrossEdges().forEach(function (edge) {
        updateItemCache.push(edge);
        updateModelCache.push(null);
        affectedItemIds.push(edge.id);
      });
    }

    this.emit('beforechange', ev);

    this._updateItems(updateItemCache, updateModelCache);

    this.emit('afterchange', ev);
    return this;
  }
  /**
   * change data
   * @param {object} data - source data
   * @return {Graph} this
   */
  ;

  _proto.read = function read(data) {
    var _this5 = this;

    if (!data) {
      throw new Error('please read valid data!');
    }

    var ev = {
      action: 'changeData',
      data: data
    };
    this.emit('beforechange', ev);
    this.preventAnimate(function () {
      _this5.clear();

      _this5.source(data);

      _this5.render();
    });
    this.emit('afterchange', ev);
    return this;
  }
  /**
   * @return {Graph} this
   */
  ;

  _proto.clear = function clear() {
    this.emit('beforeclear');

    this._clearInner();

    this._initData();

    this.emit('afterclear');
    return this;
  }
  /**
   * hide item
   * @param  {number} item  input item
   * @return {object} this
   */
  ;

  _proto.hide = function hide(item) {
    item = this.getItem(item);
    var hideItemCache = [];
    var affectedItemIds = [];
    var ev = {
      item: item,
      affectedItemIds: affectedItemIds
    };
    hideItemCache.push(item);

    if (item.isNode) {
      item.getEdges().forEach(function (edge) {
        hideItemCache.push(edge);
      });
    }

    if (item.isGroup) {
      item.getEdges().forEach(function (edge) {
        hideItemCache.push(edge);
      });
      item.deepEach(function (child) {
        hideItemCache.push(child);
      });
    }

    hideItemCache = Util.uniq(hideItemCache);
    hideItemCache.forEach(function (item) {
      affectedItemIds.push(item.id);
    });
    this.emit('beforehide', ev);
    hideItemCache.forEach(function (item) {
      item.hide();
    });
    this.emit('afterhide', ev);
    return this;
  }
  /**
   * show item
   * @param  {number} item  input item
   * @return {object} this
   */
  ;

  _proto.show = function show(item) {
    var _this6 = this;

    item = this.getItem(item);
    var showItemCache = [];
    var affectedItemIds = [];
    var ev = {
      item: item,
      affectedItemIds: affectedItemIds
    };
    item.visible = true;

    if (item.isEdge) {
      var edge = this._getShowEdge(item);

      if (edge) showItemCache.push(edge);
    } else {
      showItemCache.push(item);
    }

    if (item.isNode) {
      item.getEdges().forEach(function (edge) {
        edge = _this6._getShowEdge(edge);
        if (edge) showItemCache.push(edge);
      });
    }

    if (item.isGroup) {
      item.getEdges().forEach(function (edge) {
        edge = _this6._getShowEdge(edge);
        if (edge) showItemCache.push(edge);
      });
      item.deepEach(function (child) {
        showItemCache.push(child);
      });
    }

    showItemCache = Util.uniq(showItemCache);
    showItemCache.forEach(function (item) {
      affectedItemIds.push(item.id);
    });
    this.emit('beforeshow', ev);
    showItemCache.forEach(function (item) {
      item.show();
    });
    this.emit('aftershow', ev);
    return this;
  }
  /**
   * @return {Graph} this
   */
  ;

  _proto.getWidth = function getWidth() {
    return this.get('width');
  }
  /**
   * @return {Graph} this
   */
  ;

  _proto.getHeight = function getHeight() {
    return this.get('height');
  }
  /**
   * change canvas size
   * @param  {number} width  input width
   * @param  {number} height input height
   * @return {object} this
   */
  ;

  _proto.changeSize = function changeSize(width, height) {
    if (Math.abs(width) >= Infinity || Math.abs(height) >= Infinity) {
      console.warn('size parameter more than the maximum');
      return;
    }

    var canvas = this.get('_canvas');

    if (width !== this.get('width') || height !== this.get('height')) {
      this.emit('beforechangesize');
      canvas.changeSize(width, height);
      this.set('width', width);
      this.set('height', height);
      this.emit('afterchangesize');
      this.draw();
    }

    return this;
  }
  /**
   * item to front
   * @param  {object} item  item
   */
  ;

  _proto.toFront = function toFront(item) {
    item = this.getItem(item);
    var itemGroup = this.get('_itemGroup');
    var group = item.getGraphicGroup();
    Util.toFront(group, itemGroup);
    this.draw();
  }
  /**
   * item to back
   * @param  {object} item  item
   */
  ;

  _proto.toBack = function toBack(item) {
    item = this.getItem(item);
    var itemGroup = this.get('_itemGroup');
    var group = item.getGraphicGroup();
    Util.toBack(group, itemGroup);
    this.draw();
  }
  /**
   * set cantainer css
   * @param  {object} style container dom css
   */
  ;

  _proto.css = function css(style) {
    var graphContainer = this.getGraphContainer();
    Util.modifyCSS(graphContainer, style);
  }
  /**
   * save graph image
   * @param {object} options - save options
   * @return  {object} canvas dom
   */
  ;

  _proto.saveImage = function saveImage(options) {
    var box = this.getBBox();
    var padding = this.getFitViewPadding();
    var graph2Canvas = new Graph2Canvas(_objectSpread({
      graph: this,
      width: box.width + padding[1] + padding[3],
      height: box.height + padding[0] + padding[2]
    }, options));
    return graph2Canvas.toCanvas();
  };

  return Graph;
}(Base);

Mixins.forEach(function (Mixin) {
  Util.mix(Graph.prototype, Mixin.AUGMENT);
});
module.exports = Graph;