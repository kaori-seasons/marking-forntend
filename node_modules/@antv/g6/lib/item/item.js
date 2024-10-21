/**
 * @fileOverview item
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

function getCollapsedParent(node, dataMap) {
  var parent = dataMap[node.parent];

  if (!parent) {
    return false;
  }

  if (parent) {
    var rst = getCollapsedParent(parent, dataMap);

    if (rst) {
      return rst;
    }
  }

  if (parent.collapsed) {
    return parent;
  }
}

var Item =
/*#__PURE__*/
function () {
  function Item(cfg) {
    var defaultCfg = {
      /**
       * id
       * @type {string}
       */
      id: '',

      /**
       * 类型
       * @type {string}
       */
      type: null,

      /**
       * data model
       * @type {object}
       */
      model: {},

      /**
       * g group
       * @type {G.Group}
       */
      group: null,

      /**
       * is open animate
       * @type {boolean}
       */
      animate: false,

      /**
       * cache model for diff
       * @type {object}
       */
      modelCache: {},

      /**
       * is item
       * @type {boolean}
       */
      isItem: true,

      /**
       * visible - not group visible
       * @type {boolean}
       */
      visible: true
    };
    Util.mix(this, defaultCfg, cfg);

    this._init();
  }

  var _proto = Item.prototype;

  _proto._init = function _init() {
    this._initGroup();

    this.draw();
  };

  _proto._mapping = function _mapping() {
    var mapper = this.mapper;
    var model = this.model;
    mapper.mapping(model);
  };

  _proto._initGroup = function _initGroup() {
    var group = this.group;
    var model = this.model;
    var type = this.type;
    group.isItemContainer = true;
    group.id = model.id;
    group.itemType = type;
    group.model = model;
    group.item = this;
  };

  _proto._calculateBBox = function _calculateBBox() {
    var keyShape = this.keyShape;
    var group = this.group;
    var bbox = Util.getBBox(keyShape, group);
    bbox.width = bbox.maxX - bbox.minX;
    bbox.height = bbox.maxY - bbox.minY;
    bbox.centerX = (bbox.minX + bbox.maxX) / 2;
    bbox.centerY = (bbox.minY + bbox.maxY) / 2;
    return bbox;
  };

  _proto.getLabel = function getLabel() {
    var group = this.group;
    return group.findByClass('label')[0];
  };

  _proto.getGraph = function getGraph() {
    return this.graph;
  };

  _proto._setShapeObj = function _setShapeObj() {
    var graph = this.graph;
    var type = this.type;
    var model = this.getModel();
    this.shapeObj = graph.getShapeObj(type, model);
  };

  _proto._afterDraw = function _afterDraw() {
    var graph = this.graph;

    this._setGId();

    this._cacheModel();

    graph.emit('afteritemdraw', {
      item: this
    });
  };

  _proto._cacheModel = function _cacheModel() {
    this.modelCache = Util.mix({}, this.model);
  };

  _proto._setGId = function _setGId() {
    var group = this.group;
    var id = this.id;
    var type = this.type;
    group.gid = id;
    group.deepEach(function (child, parent, index) {
      var parentGid = parent.gid;
      child.id = id;
      child.eventPreFix = type;
      child.gid = parentGid + '-' + index;

      if (child.isShape) {
        var shapeType = child.get('type');
        child.gid += '-' + shapeType;
      }
    });
  };

  _proto._beforeDraw = function _beforeDraw() {
    var graph = this.graph;
    var group = this.group;
    graph.emit('beforeitemdraw', {
      item: this
    });
    group.resetMatrix();
    this.updateCollapsedParent();
  };

  _proto._shouldDraw = function _shouldDraw() {
    return true;
  };

  _proto._getDiff = function _getDiff() {
    var diff = [];
    var model = this.model;
    var modelCache = this.modelCache;
    Util.each(model, function (v, k) {
      if (!Util.isEqual(v, modelCache[k])) {
        diff.push(k);
      }
    });

    if (diff.length === 0) {
      return false;
    }

    return diff;
  };

  _proto._drawInner = function _drawInner() {
    var animate = this.animate;
    var group = this.group;
    group.clear(!animate);

    this._mapping();

    this._setShapeObj();

    var shapeObj = this.shapeObj;
    var keyShape = shapeObj.draw(this);

    if (keyShape) {
      keyShape.isKeyShape = true;
      this.keyShape = keyShape;
    }

    shapeObj.afterDraw && shapeObj.afterDraw(this);
  };

  _proto.deepEach = function deepEach(callback, getParent) {
    Util.traverseTree(this, callback, getParent ? getParent : function (parent) {
      return parent.getChildren();
    });
  };

  _proto.getShapeObj = function getShapeObj() {
    return this.shapeObj;
  };

  _proto.updateCollapsedParent = function updateCollapsedParent() {
    var dataMap = this.dataMap;
    this.collapsedParent = getCollapsedParent(this.model, dataMap);
  };

  _proto.isVisible = function isVisible() {
    return this.visible;
  };

  _proto.hide = function hide() {
    var group = this.group;
    var graph = this.graph;
    graph.emit('beforeitemhide', {
      item: this
    });
    group.hide();
    this.visible = false;
    graph.emit('afteritemhide', {
      item: this
    });
  };

  _proto.show = function show() {
    var group = this.group;
    var graph = this.graph;
    graph.emit('beforeitemshow', {
      item: this
    });
    group.show();
    this.visible = true;
    graph.emit('afteritemshow', {
      item: this
    });
  };

  _proto.draw = function draw() {
    this._beforeDraw();

    if (this._shouldDraw()) {
      this._drawInner();
    }

    this._afterDraw();
  };

  _proto.forceUpdate = function forceUpdate() {
    this._beforeDraw();

    this._drawInner();

    this._afterDraw();
  };

  _proto.getCenter = function getCenter() {
    var bbox = this.getBBox();
    return {
      x: bbox.centerX,
      y: bbox.centerY
    };
  };

  _proto.getBBox = function getBBox() {
    return this.bbox || this._calculateBBox();
  };

  _proto.layoutUpdate = function layoutUpdate() {
    this.isVisible() && this.draw();
  };

  _proto.update = function update() {
    this.draw();
  };

  _proto.getModel = function getModel() {
    return this.model;
  };

  _proto.getKeyShape = function getKeyShape() {
    return this.keyShape;
  };

  _proto.getGraphicGroup = function getGraphicGroup() {
    return this.group;
  };

  _proto.getHierarchy = function getHierarchy() {
    var graph = this.graph;
    return graph.getHierarchy(this);
  };

  _proto.getParent = function getParent() {
    var model = this.model;
    var itemMap = this.itemMap;
    return itemMap[model.parent];
  };

  _proto.getAllParents = function getAllParents() {
    var model = this.model;
    var itemMap = this.itemMap;
    var parents = [];
    var parent = model.parent;

    while (parent && itemMap[parent]) {
      var parentItem = itemMap[parent];
      var parentModel = parentItem.getModel();
      parents.push(parentItem);
      parent = parentModel.parent;
    }

    return parents;
  } // deep get all children
  ;

  _proto.getAllChildren = function getAllChildren() {
    var rst = [];
    this.deepEach(function (child) {
      rst.push(child);
    });
    return rst;
  } // get children
  ;

  _proto.getChildren = function getChildren() {
    var id = this.id;
    var graph = this.graph;
    var items = graph.getItems();
    return items.filter(function (item) {
      return item.model.parent === id;
    });
  };

  _proto.toFront = function toFront() {
    var group = this.group;
    group.toFront();
  };

  _proto.toBack = function toBack() {
    var group = this.group;
    group.toBack();
  };

  _proto.destroy = function destroy() {
    if (!this.destroyed) {
      var animate = this.animate;
      var graph = this.graph;
      graph.emit('beforeitemdestroy', {
        item: this
      });
      this.group.remove(!animate);
      this.destroyed = true;
      graph.emit('afteritemdestroy', {
        item: this
      });
    }
  };

  return Item;
}();

module.exports = Item;