/**
 * @fileOverview graph util
 * @author huangtonger@aliyun.com
 */
var BaseUtil = require('./base');

module.exports = {
  /**
   * determine whether a node
   * @param  {object}  item item
   * @return {boolean} bool
   */
  isNode: function isNode(item) {
    return item && BaseUtil.isObject(item) && item.type === 'node';
  },

  /**
   * determine whether a edge
   * @param  {object}  item item
   * @return {boolean} bool
   */
  isEdge: function isEdge(item) {
    return item && BaseUtil.isObject(item) && item.type === 'edge';
  },

  /**
   * determine whether a group
   * @param  {object}  item item
   * @return {boolean} bool
   */
  isGroup: function isGroup(item) {
    return item && BaseUtil.isObject(item) && item.type === 'group';
  }
};