function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview tree
 * @author huangtonger@aliyun.com
 */
var Util = require('./util/');

var Graph = require('./graph');

var Layouts = require('./layouts/');

var Tree =
/*#__PURE__*/
function (_Graph) {
  _inheritsLoose(Tree, _Graph);

  function Tree(inputCfg) {
    var cfg = Util.mix({
      layout: new Layouts.CompactBoxTree({
        getHGap: function getHGap() {
          return 10;
        },
        getVGap: function getVGap() {
          return 10;
        }
      }),
      _type: 'tree'
    }, inputCfg);
    return _Graph.call(this, cfg) || this;
  }

  var _proto = Tree.prototype;

  _proto.initEvent = function initEvent() {
    var _this = this;

    this.on('afterdrawinner', function () {
      var source = _this.get('_sourceData');

      source.roots.forEach(function (root) {
        var rootItem = _this.find(root.id);

        _this._setVisibleByCollapsed(rootItem);
      });
    });
  };

  _proto._executeLayout = function _executeLayout(processor) {
    var source = this.get('_sourceData');

    if (Util.isFunction(processor)) {
      processor(source.roots, this);
    } else if (Util.isObject(processor)) {
      processor.roots = source.roots;
      processor.graph = this;
      processor.execute();
    }
  };

  _proto.getHierarchy = function getHierarchy(item) {
    item = this.getItem(item);
    var dataMap = this.get('_dataMap');
    var model = item.getModel();
    var parent = model.parent;
    var hierarchy = 1;

    while (parent) {
      parent = dataMap[parent].parent;
      hierarchy++;
    }

    return hierarchy;
  };

  _proto.parseSource = function parseSource(data) {
    var roots = data.roots;
    var dataMap = this.get('_dataMap');
    var nodes = [];
    var edges = [];

    if (!roots) {
      throw new Error('please set data.roots!');
    }

    roots.forEach(function (root) {
      Util.traverseTree(root, function (child, parent) {
        if (!child.id) {
          child.id = Util.guid();
        }

        if (!parent) {
          parent = dataMap[child.parent];
        }

        if (parent) {
          child.parent = parent.id;

          if (!parent.id) {
            parent.id = Util.guid();
          }

          edges.push({
            source: parent.id,
            target: child.id,
            id: parent.id + '-' + child.id
          });
        }

        nodes.push(child);
      }, function (parent) {
        return parent.children;
      }, true);
    });
    return {
      nodes: nodes,
      edges: edges
    };
  } // input an item set it's children visiable
  ;

  _proto._setVisibleByCollapsed = function _setVisibleByCollapsed(item) {
    var model = item.getModel();

    if (item.collapsedParent) {
      // hide all
      item.hide();
      item.getEdges().forEach(function (edge) {
        edge.hide();
      });
      item.deepEach(function (node) {
        node.hide();
        node.getEdges().forEach(function (edge) {
          edge.hide();
        });
      });
    } else if (model.collapsed) {
      // hide all children
      item.deepEach(function (node) {
        node.hide();
        node.getEdges().forEach(function (edge) {
          edge.hide();
        });
      });
    } else {
      // hide a part of children
      item.deepEach(function (node) {
        if (node.collapsedParent) {
          node.hide();
          node.getEdges().forEach(function (edge) {
            edge.hide();
          });
        }
      });
    }
  }
  /**
   * @param {object} data tree data
   */
  ;

  _proto.source = function source(data) {
    var _data = this.parseSource(data);

    this.emit('beforesource');
    this.set('_sourceData', data);
    this.set('_data', _data);
    this.emit('aftersource');
  }
  /**
   * @param {object} node item node
   * @param {object} nth nth
   */
  ;

  _proto._setNodeNth = function _setNodeNth(node, nth) {
    node = this.getItem(node);
    var model = node.getModel();
    var parent = node.getParent();
    var parentModel = parent.getModel();
    var children = parentModel.children;
    Util.Array.remove(children, model);
    children.splice(nth, 0, model);
  }
  /**
   * @param {object} node item node
   * @return {number} nth
   */
  ;

  _proto.getNth = function getNth(node) {
    node = this.getItem(node);
    var model = node.getModel();
    var parent = node.getParent();
    var parentModel = parent.getModel();
    return parentModel.children.indexOf(model);
  }
  /**
   * @param {string} type item type
   * @param {object} model data model
   * @return {Graph} this
   */
  ;

  _proto.add = function add(type, model) {
    var dataMap = this.get('_dataMap');
    var parent = dataMap[model.parent];
    var ev = {
      action: 'add',
      model: model
    };
    var item;

    if (type !== 'node' && type !== 'guide') {
      console.warn('Tree do not support add type ' + type + '!');
      return;
    }

    this.emit('beforechange', ev);

    if (type === 'node') {
      if (!parent) {
        throw new Error('please set available parent Id !');
      }

      if (Util.isArray(parent.children)) {
        parent.children.push(model);
      } else {
        parent.children = [model];
      }

      var data = this.parseSource({
        roots: [model]
      });

      this._addItems('node', data.nodes);

      this._addItems('edge', data.edges);

      item = this.find(model.id);

      this._setVisibleByCollapsed(item); // set node nth


      if (!Util.isNil(model.nth)) {
        this._setNodeNth(item, model.nth);
      }

      this.find(parent.id).forceUpdate();
    } else {
      this._addItems(type, [model]);

      item = this.find(model.id);
    }

    ev.item = item;
    this.emit('afterchange', ev);
    return item;
  }
  /**
   * @param {string|Item} item target item
   * @param {object} model data model
   * @return {Graph} this
   */
  ;

  _proto.update = function update(item, model) {
    var _this2 = this;

    if (!model) {
      return;
    }

    item = this.getItem(item);
    var itemModel = item.getModel();
    var originModel = Util.mix({}, itemModel);
    var ev = {
      action: 'update',
      item: item,
      originModel: originModel,
      updateModel: model
    };
    this.emit('beforechange', ev);

    this._updateItems([item], [model]);

    if (item.isNode) {
      // deal collapsed
      if ('collapsed' in model) {
        if (model.collapsed) {
          item.deepEach(function (child) {
            child.hide();
            child.getEdges().forEach(function (edge) {
              edge.hide();
            });
          });
        } else {
          item.deepEach(function (child) {
            child.show();
            child.getInEdges().forEach(function (edge) {
              edge.show();
            });
          }, function (parent) {
            if (!parent.model.collapsed) {
              return parent.getChildren();
            }

            return null;
          });
        }
      } // exchange parent


      if (model.parent && model.parent !== originModel.parent) {
        var originParent = this.find(originModel.parent);
        var originParentModel = originParent.getModel();
        var newParent = this.find(model.parent);
        var newParentModel = newParent.getModel();
        var oldEdge = this.find(originParentModel.id + '-' + originModel.id);
        var newEdgeModel = {
          id: newParentModel.id + '-' + originModel.id,
          source: newParentModel.id,
          target: originModel.id
        };
        Util.Array.remove(originParentModel.children, itemModel);

        if (newParentModel.children) {
          newParentModel.children.push(itemModel);
        } else {
          newParentModel.children = [itemModel];
        }

        this._removeItems([oldEdge]);

        this._addItems('edge', [newEdgeModel]);

        this.find(newParentModel.id).forceUpdate();
      } // update children


      if (Util.isArray(model.children)) {
        if (originModel.children) {
          Util.each(originModel.children, function (child) {
            var childItem = _this2.find(child.id);

            var _removeItems = [childItem];
            childItem.getEdges().forEach(function (edge) {
              _removeItems.push(edge);
            });

            _this2._removeItems(_removeItems);
          });
        }

        Util.each(model.children, function (child) {
          var data = _this2.parseSource({
            roots: [child]
          });

          var childId = Util.isNil(child.id) ? Util.guid() : child.id;

          _this2._addItems('node', data.nodes);

          _this2._addItems('edge', data.edges);

          !child.parent && _this2._addItems('edge', [{
            id: originModel.id + '-' + childId,
            source: originModel.id,
            target: childId
          }]);
        });
      } // set node nth


      if (!Util.isNil(model.nth)) {
        this._setNodeNth(item, model.nth);
      }

      var parentItem = this.find(itemModel.parent);
      parentItem && parentItem.forceUpdate();
    }

    this.emit('afterchange', ev);
    return this;
  }
  /**
   * @param {string|Item} item target item
   * @return {Graph} this
   */
  ;

  _proto.remove = function remove(item) {
    var dataMap = this.get('_dataMap');
    var items = [];
    item = this.getItem(item);

    if (!item || item.destroyed) {
      return;
    }

    var ev = {
      action: 'remove',
      item: item
    };
    this.emit('beforechange', ev);
    items.push(item);

    if (item.type === 'node') {
      item.getEdges().forEach(function (edge) {
        items.push(edge);
      });
      var model = item.getModel();
      var parent = dataMap[model.parent];
      item.deepEach(function (child) {
        items.push(child);
        child.getEdges().forEach(function (edge) {
          items.push(edge);
        });
      });
      Util.Array.remove(parent.children, model);
      this.find(parent.id).forceUpdate();
    }

    this._removeItems(Util.uniq(items));

    this.emit('afterchange', ev);
    return this;
  };

  _proto.getRoots = function getRoots() {
    var _this3 = this;

    var source = this.getSource();
    return source.roots.map(function (root) {
      return _this3.find(root.id);
    });
  };

  _proto.save = function save() {
    var rst = {
      roots: Util.clone(this.getSource().roots),
      guides: this.getGuides().map(function (guide) {
        return guide.getModel();
      })
    };
    rst.roots.length === 0 && delete rst.roots;
    rst.guides.length === 0 && delete rst.guides;
    return rst;
  };

  return Tree;
}(Graph);

module.exports = Tree;