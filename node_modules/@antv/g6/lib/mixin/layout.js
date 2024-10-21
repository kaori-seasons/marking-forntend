/**
 * @fileOverview layout mixin
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Layout = require('../controller/layout');

var Mixin = {};
Mixin.CFG = {
  /**
   * Layout cfg
   * @type {object|function|undefined}
   */
  layout: undefined
};
Mixin.INIT = '_initLayout';
Mixin.AUGMENT = {
  _initLayout: function _initLayout() {
    var controllers = this.get('_controllers');

    var layoutCfg = this._getLayoutCfg();

    if (layoutCfg) {
      controllers.layout = new Layout(Util.mix({
        graph: this
      }, layoutCfg));
    }
  },
  _getLayoutCfg: function _getLayoutCfg() {
    var layout = this.get('layout');

    if (Util.isPlainObject(layout)) {
      return layout;
    } else if (Util.isFunction(layout) || Util.isObject(layout)) {
      return {
        processor: layout
      };
    }

    return null;
  },

  /**
   * @return {Graph} this
   */
  layout: function layout() {
    this._getController('layout').layout();

    return this;
  },

  /**
   * @param  {array} nodes - nodes need update position
   * @return {Graph} this
   */
  updateNodePosition: function updateNodePosition(nodes) {
    var guides = this.getGuides();
    var groups = [];
    var edges = [];
    this.emit('beforeupdatenodeposition');

    if (nodes) {
      nodes.forEach(function (node) {
        node.getEdges().forEach(function (edge) {
          edges.push(edge);
        });
        var parent = node.getParent();
        parent && groups.push(parent);
      });
      edges = Util.uniq(edges);
      groups = Util.uniq(groups);
    } else {
      nodes = this.getNodes();
      groups = this.getGroups();
      edges = this.getEdges();
    }

    nodes.forEach(function (node) {
      node.layoutUpdate();
    });
    groups.forEach(function (group) {
      group.layoutUpdate();
    });
    edges.forEach(function (edge) {
      edge.layoutUpdate();
    });
    guides.forEach(function (guide) {
      guide.layoutUpdate();
    });
    this.emit('afterupdatenodeposition');
    return this;
  },

  /**
   * @param  {object} processor - layout processer
   * @return {Graph} this
   */
  changeLayout: function changeLayout(processor) {
    this._getController('layout').changeLayout(processor);

    return this;
  },
  getLayout: function getLayout() {
    return this._getController('layout').getLayoutProcessor();
  }
};
module.exports = Mixin;