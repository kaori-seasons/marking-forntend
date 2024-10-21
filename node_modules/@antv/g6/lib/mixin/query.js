/**
 * @fileOverview graph query
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Mixin = {};
Mixin.AUGMENT = {
  find: function find(id) {
    var itemMap = this.get('_itemMap');
    return itemMap[id];
  },

  /**
   * get nodes
   * @return {array} rst
   */
  getNodes: function getNodes() {
    var itemMap = this.get('_itemMap');
    return itemMap._nodes;
  },

  /**
   * get edges
   * @return {array} rst
   */
  getEdges: function getEdges() {
    var itemMap = this.get('_itemMap');
    return itemMap._edges;
  },

  /**
   * get groups
   * @return {array} rst
   */
  getGroups: function getGroups() {
    var itemMap = this.get('_itemMap');
    return itemMap._groups;
  },

  /**
   * get guides
   * @return {array} rst
   */
  getGuides: function getGuides() {
    var itemMap = this.get('_itemMap');
    return itemMap._guides;
  },

  /**
   * get items
   * @return {array} rst
   */
  getItems: function getItems() {
    var itemMap = this.get('_itemMap');
    var rst = [];
    Util.each(itemMap, function (item) {
      if (item.type) {
        rst.push(item);
      }
    });
    return rst;
  },

  /**
   * get item by shape
   * @param  {G.Shape} shape - the shape from g
   * @return {string}  item.id - id of the item
   */
  getItemByShape: function getItemByShape(shape) {
    if (!shape) return null;
    return this.getItem(shape.id);
  },

  /**
   * get item item || itemId
   * @param  {object|string} item - the shape from g
   * @return {object}  item
   */
  getItem: function getItem(item) {
    var itemMap = this.get('_itemMap');

    if (Util.isObject(item)) {
      if (item.destroyed) {
        item = itemMap[item.id];
      }
    } else {
      item = itemMap[item];
    }

    return item;
  }
};
module.exports = Mixin;